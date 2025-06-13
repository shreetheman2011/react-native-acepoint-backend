import express from "express";
import Match from "../models/Match.js";
import League from "../models/League.js";
import protectRoute from "../middleware/auth.middleware.js";
import mongoose from "mongoose";
import { updateMatch } from "../controllers/matchesController.js";

const router = express.Router();

// POST: Admin creates a match for a specific league
router.post("/:leagueId", protectRoute, async (req, res) => {
  try {
    const { format, score, status, side1, side2, allowedRatings } = req.body;

    const league = await League.findById(req.params.leagueId);
    if (!league) {
      return res
        .status(404)
        .json({
          message:
            "  League not found. This league may have been deleted. Please close out the app, reopen and see if the league is still there. If so, please contact help services by texting HELPACEPOINT to +19253419183",
        });
    }

    const match = new Match({
      league: league._id,
      format,
      score,
      status,
      side1,
      side2,
      rating: allowedRatings,
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

router.get("/:leagueId", protectRoute, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.leagueId)) {
      return res.status(400).json({ message: "Invalid league ID" });
    }

    const matches = await Match.find({ league: req.params.leagueId }).lean();

    res.status(200).json(matches || []);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/update/:matchId", protectRoute, updateMatch);
export default router;
