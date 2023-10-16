const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Types.ObjectId,
      ref: "MainUser",
      required: [true, "Please provide user"],
    },

    userScore: {
      type: String,
      default: "0",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
