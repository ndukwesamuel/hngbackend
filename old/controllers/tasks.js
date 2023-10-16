const dummyDataArray = require("../data/data");
const asyncWrapper = require("../middleware/async");
const Task = require("../models/Task");
const User = require("../models/User");

const getAllTasks = asyncWrapper(async (req, res) => {
  const userdata = await Task.find({});
  res.status(200).json(userdata);
});

const getAllcomplete = asyncWrapper(async (req, res) => {
  const completedTasks = await Task.find({ completed: false }).exec();
  res.status(200).json(completedTasks);
});

const createTask = asyncWrapper(async (req, res) => {
  const data = req.body;
  const task = await Task.create(data);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });

  if (!task) {
    return res.status(404).json({ msg: `No task with id : ${taskID}` });
  }
  res.status(200).json(task);
});

const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const data = req.body;
  const task = await Task.findOneAndUpdate({ _id: taskID }, data);

  if (!task) {
    return res.status(404).json({ msg: `No task with id : ${taskID}` });
  }
  res.status(200).json(task);
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndRemove({ _id: taskID });
  if (!task) {
    return res.status(404).json({ msg: `No task with id : ${taskID}` });
  }
  res.status(200).json(task);
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getAllcomplete,
};
