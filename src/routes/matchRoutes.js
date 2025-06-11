import express from "express";
import Match from "../models/Match.js";
import League from "../models/League.js";
import protectRoute from "../middleware/auth.middleware.js";
import { isAdmin } from "../utils/isAdmin.js";

const router = express.Router();

// POST: Admin creates a match for a specific league
router.post("/:leagueId", protectRoute, async (req, res) => {
  const admin = await isAdmin(req);
  if (!admin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const { format, score, status, side1, side2 } = req.body;

    const league = await League.findById(req.params.leagueId);
    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    const match = new Match({
      league: league._id,
      format,
      score,
      status,
      side1,
      side2,
    });

    await match.save();

    // Save the match to the league
    league.matches.push(match._id);
    await league.save();

    res.status(201).json({ message: "Match created", match });
  } catch (error) {
    console.log("Error creating match:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Fetch all matches for a specific league
router.get("/:leagueId", protectRoute, async (req, res) => {
  try {
    const matches = await Match.find({ league: req.params.leagueId })
      .populate("side1", "firstName lastName")
      .populate("side2", "firstName lastName");

    res.status(200).json(matches);
  } catch (error) {
    console.log("Error fetching matches:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:leagueId/players", protectRoute, async (req, res) => {
  try {
    const matches = await Match.find({ league: req.params.leagueId })
      .populate("side1", "firstName lastName _id")
      .populate("side2", "firstName lastName _id");

    const playersMap = new Map();

    matches.forEach((match) => {
      match.side1.forEach((player) =>
        playersMap.set(player._id.toString(), player)
      );
      match.side2.forEach((player) =>
        playersMap.set(player._id.toString(), player)
      );
    });

    const uniquePlayers = Array.from(playersMap.values());
    res.status(200).json(uniquePlayers);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
