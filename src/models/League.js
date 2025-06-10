import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: String,
      required: true,
    },
    allowedRatings: {
      type: [String],
      enum: ["3.0", "3.5", "4.0", "4.5"],
      required: true,
    },
    format: {
      type: String,
      enum: ["singles", "doubles", "team"],
      required: true,
    },
    adminFirstName: {
      type: String,
      required: true,
    },
    signedUpUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
  },
  { timestamps: true }
);

const League = mongoose.model("League", leagueSchema);
export default League;
