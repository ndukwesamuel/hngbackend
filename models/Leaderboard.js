const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "MainUser",
    required: [true, "Please provide user"],
  },

  totalScore: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
