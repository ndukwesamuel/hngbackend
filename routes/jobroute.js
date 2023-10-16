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
} = require("../controllers/jobapi");
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

router
  .route("/")
  .get(authenticationMiddleware, GetAllJobs)
  .post(authenticationMiddleware, CreateJob);

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.route("/profile").patch(authenticationMiddleware, updateprofile);
router.route("/stats").get(showStats);

router.route("/product").post(createProduct).get(getAllProducts);
router.route("/uploads").post(uploadProductImage);
router.route("/send").get(sendEmailEthereal);

router
  .route("/:id")
  .get(authenticationMiddleware, GetJob)
  .patch(authenticationMiddleware, UpdateJob)
  .delete(deleteJob);

module.exports = router;
