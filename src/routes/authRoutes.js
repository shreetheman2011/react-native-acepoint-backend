import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(404).json({ message: "All fields are required!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters!" });
    }
    //check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message:
          "User with this email already exists. Forgot your password? Text FORGOTPASSWORD to +19253419183. Calls will not be answered!",
      });
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: "user",
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    //check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    //generate token
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
