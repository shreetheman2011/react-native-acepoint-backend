import Match from "../models/Match.js";

export const updateMatch = async (req, res) => {
  const { matchId } = req.params;
  const { score, status, court, notes } = req.body; // Added court and notes

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Update all fields that are provided
    match.score = score || match.score;
    match.status = status || match.status;
    match.court = court !== undefined ? court : match.court; // Handle empty strings
    match.notes = notes !== undefined ? notes : match.notes; // Handle empty strings
    
    await match.save();
    
    res.status(200).json({ message: "Match updated successfully", match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
