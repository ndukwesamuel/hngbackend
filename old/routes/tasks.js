const express = require("express");
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getAllcomplete,
} = require("../controllers/tasks");
const router = express.Router();

router.route("/").get(getAllTasks).post(createTask);
router.route("/complete").get(getAllcomplete);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router;
