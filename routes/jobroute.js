const express = require("express");
const {
  register,
  login,
  CreateJob,
  GetJob,
  GetAllJobs,
  UpdateJob,
  deleteJob,
  updateprofile,
  showStats,
  LearderBoard,
  CreateLearderBoard,
  Global_leaderboard,
} = require("../controllers/GameAPI");
const authenticationMiddleware = require("../middleware/auth");
const rateLimiter = require("express-rate-limit");
const {
  uploadProductImageLocal,
  getAllProducts,
  createProduct,
  uploadProductImage,
} = require("../controllers/Product");
const { sendEmailEthereal } = require("../controllers/SendEmail");

const router = express.Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes",
  },
});

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);

router.route("/product").post(createProduct).get(getAllProducts);
router.route("/uploads").post(uploadProductImage);
router.route("/send").get(sendEmailEthereal);
router
  .route("/LearderBoard")
  .get(LearderBoard)
  .post(authenticationMiddleware, CreateLearderBoard);

router
  .route("/LearderBoard")
  .get(Global_leaderboard)
  .post(authenticationMiddleware, CreateLearderBoard);

module.exports = router;
