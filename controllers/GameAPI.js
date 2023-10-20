const { BadRequestError, UnauthenticatedError } = require("../errors");
const MainUser = require("../models/MainUser");
const { StatusCodes } = require("http-status-codes");

const Leaderboard = require("../models/Leaderboard");

const register = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  try {
    // Check if the email or username (name) is already in use
    const existingUser = await MainUser.findOne({ $or: [{ email }, { name }] });

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email or username already in use." });
    }

    // Create a new user
    const newUser = new MainUser({ name, email, password });
    await newUser.save();

    const token = newUser.createJWT();

    res.status(StatusCodes.CREATED).json({ user: newUser, token });
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Registration failed", error });
  }
};

const login = async (req, res) => {
  const { loginIdentifier, password } = req.body;

  try {
    if (!loginIdentifier || !password) {
      throw new BadRequestError("Please provide login identifier and password");
    }

    // Determine whether the login identifier is an email or a name
    const isEmail = validateEmail(loginIdentifier);

    const User = await MainUser.findOne(
      isEmail ? { email: loginIdentifier } : { name: loginIdentifier }
    );

    if (!User) {
      throw new BadRequestError("Invalid Credentials. Please Register.");
    }

    const isPasswordCorrect = await User.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = User.createJWT();

    res.status(StatusCodes.OK).json({ msg: User, token });
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Login failed", error });
  }
};

// Helper function to validate if the input is an email
function validateEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

const Global_leaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate("User", "name") // Populate the user's name
      .sort({ totalScore: -1 })
      .limit(10); // Retrieve the top 10 players

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error getting the leaderboard" });
  }
};

const LearderBoard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate("User", "name") // Populate the user's name
      .sort({ totalScore: -1 })
      .limit(10); // Retrieve the top 10 players

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error getting the leaderboard" });
  }
};

const CreateLearderBoard = async (req, res) => {
  const { totalScore, level } = req.body;

  let userId = req.user.userId;
  console.log({ userId, totalScore, level });
  try {
    let leaderboardEntry = new Leaderboard({ User: userId, totalScore, level });
    await leaderboardEntry.save();

    await leaderboardEntry.save();

    res.status(200).json({ message: "Score and level updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating score and level" });
  }
};

module.exports = {
  register,
  login,
  LearderBoard,
  Global_leaderboard,
  CreateLearderBoard,
};
