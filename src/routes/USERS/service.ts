import { eq } from "drizzle-orm";
import { users } from "../../common/db/migrations/schema";
import { db } from "../../config/db";

export const getProfile = async (req: any, res: any) => {
  try {
    const userId = String(req.user?.userId); // Assuming user ID is stored in the token

    if (!userId) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required.",
        result: "",
      });
    }

    const userDetails = await db.select().from(users).where(eq(users.userId, userId));


    // Fetch user profile from the database
    const userProfile = {
      ...(userDetails && userDetails[0] || {}),
      password: undefined,
    };

    return res.status(200).json({
      status: "success",
      message: "User profile fetched successfully.",
      result: userProfile,
    });
  } catch (error: any) {
    console.log('getProfile error', error)
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user profile.",
      result: error.message,
    });
  }
};
