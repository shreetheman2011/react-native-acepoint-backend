import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Async function that takes the request and returns true if admin
export const isAdmin = async (req) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return false;

    return user.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};
