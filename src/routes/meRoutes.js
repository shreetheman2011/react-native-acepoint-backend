// /api/users/me
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import express from "express";
const router = express.Router();

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});
router.get("/find-by-name", async (req, res) => {
  const { firstName, lastName } = req.query;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "Missing name parameters" });
  }

  const user = await User.findOne({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ _id: user._id });
});

export default router;
