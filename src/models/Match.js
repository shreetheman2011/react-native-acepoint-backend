import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    format: {
      type: String,
      enum: ["singles", "doubles"],
      required: true,
    },
    score: {
      type: String,
      default: "0-0, 0-0, 0-0",
    },
    status: {
      type: String,
      enum: ["not started", "in progress", "finished"],
      default: "not started",
    },
    side1: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    side2: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
