const express = require("express");
const { LoginUser, dashboard } = require("../controllers/UserRegistration");
const { authenticationMiddleware } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(authenticationMiddleware, dashboard).post(LoginUser);

module.exports = router;
