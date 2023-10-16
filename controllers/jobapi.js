const { BadRequestError, UnauthenticatedError } = require("../errors");
const MainUser = require("../models/MainUser");
const { StatusCodes } = require("http-status-codes");

const Job = require("../models/Job");

const mongoose = require("mongoose");
const moment = require("moment");
const Leaderboard = require("../models/Leaderboard");

const register = async (req, res) => {
  console.log(req.body);
  const user = await MainUser.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const User = await MainUser.findOne({ email });

  if (!User) {
    throw new BadRequestError("Invalid Credentials Please Register");
  }

  const isPasswordCorrect = await User.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = User.createJWT();

  res.status(StatusCodes.OK).json({ msg: User, token });
};

const LearderBoard = async (req, res) => {
  const { email, password } = req.body;

  const leaderboard = await Leaderboard.find().populate({
    path: "User",
    model: "MainUser",
    select: "name email",
  });
  res.status(StatusCodes.OK).json({ data: leaderboard });
};

const CreateLearderBoard = async (req, res) => {
  try {
    const { userScore } = req.body; // Assuming the request body contains user and userScore data
    let userid = req.user.userId;

    const leaderboardEntry = await Leaderboard.create({
      User: userid,
      userScore,
    });

    res.status(201).json(leaderboardEntry);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating a leaderboard entry" });
  }
};

const updateprofile = async (req, res) => {
  const { userId } = req.user;
  const { email, name, lastName, location } = req.body;

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError(
      "Please provide email, name, lastName and location"
    );
  }

  const user = await MainUser.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  // user.email = email;
  // user.name = name;
  // user.lastName = lastName;
  // user.location = location;

  // await user.save();

  // const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      // token,
    },
  });
};

const GetAllJobs = async (req, res) => {
  const { userId } = req.user;
  console.log(req.query);
  const { search, status, jobType, sort } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  const User = await MainUser.findById(userId);
  if (!User) {
    throw new UnauthenticatedError("User not found");
  }

  let result = Job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, jobs });
};

const GetJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const User = await MainUser.findById(userId);

  if (!User) {
    throw new UnauthenticatedError("User not found");
  }

  console.log(id);

  // const singleJob = await Job.find({});
  const singleJob = await Job.findById(id);

  res.status(200).json({ msg: singleJob, userId });
};

const CreateJob = async (req, res) => {
  const { userId } = req.user;
  const User = await MainUser.findById(userId);
  if (!User) {
    throw new UnauthenticatedError("User not found");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const UpdateJob = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { company, position } = req.body;
  // createdBy
  const User = await MainUser.findById(userId);
  if (!User) {
    throw new UnauthenticatedError("User not found");
  }

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  // if

  // console.log(singleJob);

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

const showStats = async (req, res) => {
  // let stats = await Job.aggregate([
  //   { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
  //   { $group: { _id: "$status", count: { $sum: 1 } } },
  // ]);

  // stats = stats.reduce((acc, curr) => {
  //   const { _id: title, count } = curr;
  //   acc[title] = count;
  //   return acc;
  // }, {});

  // const defaultStats = {
  //   pending: stats.pending || 0,
  //   interview: stats.interview || 0,
  //   declined: stats.declined || 0,
  // };

  // let monthlyApplications = await Job.aggregate([
  //   { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
  //   {
  //     $group: {
  //       _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
  //       count: { $sum: 1 },
  //     },
  //   },
  //   { $sort: { "_id.year": -1, "_id.month": -1 } },
  //   { $limit: 6 },
  // ]);

  // monthlyApplications = monthlyApplications
  //   .map((item) => {
  //     const {
  //       _id: { year, month },
  //       count,
  //     } = item;
  //     const date = moment()
  //       .month(month - 1)
  //       .year(year)
  //       .format("MMM Y");
  //     return { date, count };
  //   })
  //   .reverse();

  // res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  res.status(StatusCodes.OK).json({});
};
module.exports = {
  register,
  login,
  GetAllJobs,
  CreateJob,
  GetJob,
  UpdateJob,
  deleteJob,
  updateprofile,
  showStats,
  LearderBoard,
  CreateLearderBoard,
};
