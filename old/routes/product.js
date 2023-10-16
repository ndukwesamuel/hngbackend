const express = require("express");
const {
  getAllProductsStatic,
  getAllProducts,
} = require("../controllers/product");
const router = express.Router();

// const {
//   getAllProducts,
//   getAllProductsStatic,
// } = require("../controllers/products");

router.route("/").get(getAllProducts);
router.route("/static").get(getAllProductsStatic);

module.exports = router;
