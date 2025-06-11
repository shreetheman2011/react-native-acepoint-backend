import Match from "../models/Match.js";

export const updateMatch = async (req, res) => {
  const { matchId } = req.params;
  const { score, status } = req.body;

  try {
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    match.score = score || match.score;
    match.status = status || match.status;

    await match.save();

    res.status(200).json({ message: "Match updated successfully", match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
