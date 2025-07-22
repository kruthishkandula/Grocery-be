// const { ENV } = require("../../config/env");
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { _sendResponse, generateJWTToken, verifyJWTToken } from "../../common/common";
import { users, usersSessions } from "../../common/db/migrations/schema";
import { MESSAGE_TYPES, STATUS_CODE, STATUS_TYPES } from "../../common/enums";
import { db } from "../../config/db";
import { ENV } from "../../config/env";

// Constants for security settings
const SESSION_EXPIRY = 8 * 60 * 60 * 1000; // 8 hours in milliseconds for admin portal

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Get client IP for security logging
    const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .then((rows) => rows[0]);

    if (!user) {
      // Log failed attempt but don't reveal if username exists
      console.log(`Failed login attempt for username: ${username} from IP: ${clientIP}`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Failed login attempt for user: ${user.username} from IP: ${clientIP}`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const { password: _, ...userWithoutPassword } = user;

    // // Only allow admin users for the admin portal
    // if (user.role !== 'admin') {
    //   console.log(`Non-admin user attempted to login to admin portal: ${user.username} from IP: ${clientIP}`);
    //   return res.status(403).json({ message: "Access denied. Admin privileges required." });
    // }

    if (!ENV.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    // Create a session with expiry time
    const sessionExpiry = new Date(Date.now() + SESSION_EXPIRY);
    
    // Generate unique session ID
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    // Include essential data in token payload, but limit sensitive info
    const token = generateJWTToken({ 
      ...userWithoutPassword,
      sessionId,
      // JWT expiry is handled by the JWT library via ENV.JWT_EXPIRATION
    });

    // Store session information in database
    const updateSession = await db.insert(usersSessions).values({
      userId: user.userId,
      sessionToken: token,
      lastActive: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: usersSessions.userId,
      set: {
        sessionToken: token,
        lastActive: new Date().toISOString(),
      }
    });

    // Set token as cookie with enhanced security options
    res.cookie("token", token, {
      httpOnly: true, // Not accessible via JavaScript
      secure: ENV.NODE_ENV === "prod", // HTTPS only in production
      maxAge: SESSION_EXPIRY,
      sameSite: 'strict', // Prevent CSRF
      path: '/', // Restrict to your app
    });

    // Add CSRF protection - send a different token to the client
    const csrfToken = crypto.randomBytes(64).toString('hex');
    res.cookie("XSRF-TOKEN", csrfToken, {
      httpOnly: false, // Must be accessible to JavaScript
      secure: ENV.NODE_ENV === "prod",
      maxAge: SESSION_EXPIRY,
      sameSite: ENV.NODE_ENV === "prod" ? 'none' : 'lax', // Use 'none' for cross-site requests in production
      path: '/',
      domain: ENV.NODE_ENV === "prod" ? undefined : undefined, // In prod, this could be set to a specific domain
    });

    console.log(`Admin user ${user.username} logged in successfully from ${clientIP}`);
    
    return res.status(200).json({
      token,
      user: userWithoutPassword,
      csrfToken,
      expiresAt: sessionExpiry.toISOString()
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Add a session validation function
export const validateSession = async (token: string) => {
  try {
    // First verify the token is valid
    const decoded = verifyJWTToken(token);
    if (!decoded) {
      return { valid: false, reason: "Invalid token" };
    }
    
    // Query the database to check if this is a valid session
    const session = await db
      .select()
      .from(usersSessions)
      .where(eq(usersSessions.sessionToken, token))
      .then((rows) => rows[0]);
    
    if (!session) {
      return { valid: false, reason: "Session not found" };
    }
    
    return { valid: true, userId: session.userId };
  } catch (error) {
    console.error("Session validation error:", error);
    return { valid: false, reason: "Validation error" };
  }
};

// Add a logout function to invalidate sessions
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({ message: "No session token provided" });
    }
    
    // Invalidate the session in the database
    await db.update(usersSessions)
      .set({
        sessionToken: "", // Empty string instead of null to avoid type issues
      })
      .where(eq(usersSessions.sessionToken, token));
    
    // Clear cookies
    res.clearCookie("token");
    res.clearCookie("XSRF-TOKEN");
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error during logout" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, phonenumber, password, role } = req.body;

    if (!email || !username || !phonenumber || !password) {
      return _sendResponse({
        req,
        res,
        statusCode: STATUS_CODE["400"],
        message: 'FAILED_TO_FETCH_COUNT',
        title: 'FAILURE',
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const usersRegisterResponse = await db
      .insert(users)
      .values({
        userId: crypto.randomUUID(),
        email,
        username,
        phonenumber,
        password: hashedPassword, // Store hashed password
        role: role || "user",
      })
      .returning();

    return res.status(201).json({
      status: STATUS_TYPES.SUCCESS,
      message: MESSAGE_TYPES.USER_REGISTERED_SUCCESSFULLY,
    });
  } catch (error: Error | any) {
    console.log("Registration error", error);

    // Check for Drizzle/Neon unique constraint error in error.cause
    if (
      error.cause &&
      error.cause.code === "23505" &&
      typeof error.cause.detail === "string"
    ) {
      if (error.cause.detail.includes("users_email_unique")) {
        return res.status(409).json({
          status: STATUS_TYPES.FAILURE,
          message: MESSAGE_TYPES.USER_EMAIL_ALREADY_EXISTS,
        });
      }
      if (error.cause.detail.includes("users_username_unique")) {
        return res.status(409).json({
          status: STATUS_TYPES.FAILURE,
          message: MESSAGE_TYPES.USER_USERNAME_ALREADY_EXISTS,
        });
      }
      // fallback for any other unique constraint
      return res.status(409).json({
        status: STATUS_TYPES.FAILURE,
        message: MESSAGE_TYPES.USER_ALREADY_EXISTS,
      });
    }

    res.status(500).json({
      status: STATUS_TYPES.FAILURE,
      message: MESSAGE_TYPES.SOMETHING_WENT_WRONG,
      error: error.message,
    });
  }
};
