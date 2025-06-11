import express from "express";
import User from "../models/User.js";
import League from "../models/League.js";
import protectRoute from "../middleware/auth.middleware.js";
import { isAdmin } from "../utils/isAdmin.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const {
      name,
      startDate,
      endDate,
      registrationDeadline,
      allowedRatings,
      format,
      adminFirstName,
    } = req.body;
    if (
      !name ||
      !startDate ||
      !endDate ||
      !registrationDeadline ||
      !allowedRatings ||
      !format ||
      !adminFirstName
    ) {
      return res.status(400).json({ message: "Please provide all fields!" });
    }
    console.log("Received league data:", req.body);

    const newLeague = new League({
      name,
      startDate,
      endDate,
      registrationDeadline,
      allowedRatings,
      format,
      adminFirstName,
      signedUpUsers: [],
      matches: [],
    });
    await newLeague.save();
    res
      .status(201)
      .json({ message: "League created successfully", league: newLeague });
  } catch (error) {
    console.log("Error creating league:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const leagues = await League.find().sort({ createdAt: -1 });
    res.send(leagues);
  } catch (error) {
    console.log("Error in getting all leagues", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-leagues", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    const leagues = await League.find({ signedUpUsers: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(leagues);
  } catch (error) {
    console.error("Error fetching user-signed leagues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/leagues/:leagueId/register
router.put("/:leagueId/register", protectRoute, async (req, res) => {
  const { leagueId } = req.params;
  const userId = req.user._id;

  try {
    const league = await League.findById(leagueId);
    if (!league) return res.status(404).json({ message: "League not found" });

    if (league.signedUpUsers.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    league.signedUpUsers.push(userId);
    await league.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: "League not found" });

    await league.deleteOne();

    res.json({ message: "League deleted successfully" });
  } catch (error) {
    console.log("Error deleting league", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
