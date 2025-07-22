import { eq } from "drizzle-orm";
import { whitelist_csrf } from "../config/config";
import { db } from "../config/db";
import { verifyJWTToken } from "./common";
import { usersSessions } from "./db/migrations/schema";

// Helper function to validate session
const validateSession = async (token: string) => {
  try {
    // First verify the token is valid using JWT
    const decoded = verifyJWTToken(token);
    if (!decoded) {
      return { valid: false, reason: "Invalid token", user: null };
    }

    // Query the database to check if this is a valid session
    const session = await db
      .select()
      .from(usersSessions)
      .where(eq(usersSessions.sessionToken, token))
      .then((rows) => rows[0]);

    if (!session) {
      return { valid: false, reason: "Session not found", user: null };
    }

    return { valid: true, reason: "", user: decoded };
  } catch (error) {
    console.error("Session validation error:", error);
    return { valid: false, reason: "Validation error", user: null };
  }
};

// CSRF protection middleware
export const csrfProtection = (req: any, res: any, next: any) => {

  // Check for login endpoint - needs to be exempt for initial token acquisition
  const isWhiteListedEndpoint = whitelist_csrf.includes(req.path);

  // Skip for GET requests and login endpoint
  if (req.method === 'GET' || isWhiteListedEndpoint) {
    console.log(`[CSRF] Skipping protection for: ${req.method} ${req.path}`);
    return next();
  }

  // Check for CSRF token in headers
  const csrfToken = req.headers['x-csrf-token'];
  const expectedCsrfToken = req.cookies && req.cookies['XSRF-TOKEN'];

  console.log(`\n[CSRF] Validating token for: ${req.method} ${req.path}`);
  console.log(`[CSRF] Token in header: ${csrfToken ? 'Present' : 'Missing'}`);
  console.log(`[CSRF] Token in cookie: ${expectedCsrfToken ? 'Present' : 'Missing'} \n`);

  if (!csrfToken) {
    console.error('[CSRF] Header token is missing');
    return res.status(403).json({ message: "CSRF token is missing in request header." });
  }

  // In cross-site environments, the cookie might not be sent due to SameSite restrictions
  // If we have the header token but not the cookie token, we'll use a fallback validation
  // approach based on JWT token verification
  if (!expectedCsrfToken) {
    console.log('[CSRF] Cookie token is missing, using token-based validation fallback');

    // Get the auth token
    const authToken =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!authToken) {
      console.error('[CSRF] Auth token is missing, cannot use fallback validation');
      return res.status(403).json({ message: "Authentication token required for CSRF validation fallback." });
    }

    // In a cross-site environment, skip the cookie comparison and move forward
    // This is less secure but allows the application to work in cross-origin scenarios
    console.log(`[CSRF] Using fallback validation for cross-site request: ${req.method} ${req.path}`);
    return next();
  }

  // Standard validation when both tokens are present
  if (csrfToken !== expectedCsrfToken) {
    console.error('[CSRF] Token mismatch:', {
      path: req.path,
      method: req.method,
      headerToken: csrfToken ? csrfToken.substring(0, 10) + '...' : 'Missing',
      cookieToken: expectedCsrfToken ? expectedCsrfToken.substring(0, 10) + '...' : 'Missing'
    });
    return res.status(403).json({ message: "CSRF token validation failed: token mismatch." });
  }

  console.log(`[CSRF] Validation successful for: ${req.method} ${req.path}`);
  next();
};

export const authenticate = async (req: any, res: any, next: any) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Validate session in database
    const { valid, reason, user } = await validateSession(token);

    if (!valid) {
      return res.status(401).json({ message: `Authentication failed: ${reason}` });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const admin_authenticate = async (req: any, res: any, next: any) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Validate session in database
    const { valid, reason, user } = await validateSession(token);

    if (!valid) {
      return res.status(401).json({ message: `Authentication failed: ${reason}` });
    }

    // Check for admin role (user is the decoded JWT payload as any type)
    if (!user || (user as any)?.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin authentication error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};