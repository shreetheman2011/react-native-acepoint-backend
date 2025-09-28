import express from "express";
import Match from "../models/Match.js";
import League from "../models/League.js";
import protectRoute from "../middleware/auth.middleware.js";
import mongoose from "mongoose";
import { updateMatch } from "../controllers/matchesController.js";

const router = express.Router();

// ✅ POST: Admin creates a match for a specific league
router.post("/:leagueId", protectRoute, async (req, res) => {
  try {
    const { 
      format, 
      score, 
      status, 
      side1, 
      side2, 
      rating, 
      scheduledDate,
      court,
      notes 
    } = req.body;

    // Validate league
    const league = await League.findById(req.params.leagueId);
    if (!league) {
      return res.status(404).json({
        message:
          "League not found. This league may have been deleted. Please close out the app, reopen and see if the league is still there. If so, please contact help services by texting HELPACEPOINT to +19253419183",
      });
    }

    // Validate required fields
    if (!scheduledDate) {
      return res.status(400).json({ message: "Scheduled date is required" });
    }
    if (!side1?.length || !side2?.length) {
      return res.status(400).json({ message: "Both sides must have at least one player" });
    }

    const match = new Match({
      league: league._id,
      format,
      score,
      status,
      side1,
      side2,
      rating,
      scheduledDate: new Date(scheduledDate),
      court,
      notes,
    });

    await match.save();

    // Save match to league
    league.matches.push(match._id);
    await league.save();

    res.status(201).json({ message: "Match created", match });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET: Fetch all matches for a specific league
router.get("/:leagueId", protectRoute, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.leagueId)) {
      return res.status(400).json({ message: "Invalid league ID" });
    }

    const matches = await Match.find({ league: req.params.leagueId })
      .sort({ scheduledDate: 1 })
      .lean();

    res.status(200).json(matches || []);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET: Fetch all matches across leagues (for calendar view)
router.get("/", protectRoute, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const matches = await Match.find(dateFilter)
      .populate("league", "name")
      .sort({ scheduledDate: 1 })
      .lean();

    const matchesWithLeagueNames = matches.map(match => ({
      ...match,
      leagueName: match.league?.name || "Unknown League"
    }));

    res.status(200).json(matchesWithLeagueNames);
  } catch (error) {
    console.error("Error fetching all matches:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT: Update match
router.put("/update/:matchId", protectRoute, updateMatch);

// ✅ GET: Matches by date range
router.get("/date-range/:startDate/:endDate", protectRoute, async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    
    const matches = await Match.find({
      scheduledDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate("league", "name")
    .sort({ scheduledDate: 1 })
    .lean();

    const matchesWithLeagueNames = matches.map(match => ({
      ...match,
      leagueName: match.league?.name || "Unknown League"
    }));

    res.status(200).json(matchesWithLeagueNames);
  } catch (error) {
    console.error("Error fetching matches by date range:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
