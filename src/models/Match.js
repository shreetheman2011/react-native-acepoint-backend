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
      enum: ["singles", "doubles", "team"],
      required: true,
    },
    score: {
      type: String,
      default: "0-0, 0-0, 0-0",
    },
    status: {
      type: String,
      enum: ["not started", "in progress", "finished", "cancelled"],
      default: "not started",
    },
    rating: {
      type: String,
      enum: ["3.0", "3.5", "4.0", "4.5"],
    },
    side1: [
      {
        type: String,
        required: true,
      },
    ],
    side2: [
      {
        type: String,
        required: true,
      },
    ],
    scheduledDate: {
      type: Date,
      required: true,
    },
    court: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
