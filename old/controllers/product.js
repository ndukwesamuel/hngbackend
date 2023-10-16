const asyncWrapper = require("../middleware/async");
const storeProduct = require("../models/storeProduct");

const getAllProducts = async (req, res) => {
  const product_data = await storeProduct.find({}).sort("-name price");

  res.status(200).json({ product_data, nbHits: product_data.length });
};

const getAllProductsStatic = asyncWrapper(async (req, res) => {
  const { name, price, featured, company, sort, fields } = req.query;
  console.log(req.query);

  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // const product_data = await storeProduct.find(queryObject);

  let result = storeProduct.find(queryObject);
  if (sort) {
    console.log(sort);
    const sortObject = sort.split(",").join(" ");
    logger(sortObject);
  } else {
    result = result.sort(" createdAt ");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;
  let skip = (page - 1) * limit;

  const product_data = await result;
  res.status(200).json({ product_data, nbHits: product_data.length });
});

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
