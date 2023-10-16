const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// for uploading image you will use formdata

const createProduct = async (req, res) => {
  // const product = await Product.create(req.body);

  res.status(StatusCodes.OK).json({
    msg: "Image uploaded successfully",
  });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};

module.exports = {
  createProduct,
  getAllProducts,
};

const uploadProductImageLocal = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Please upload image smaller 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.CREATED).json({ d: productImage.name });
  res.json({
    msg: "Image uploaded successfully",
  });
};

const uploadProductImage = async (req, res) => {
  let image = req.files.image.tempFilePath;

  const result = await cloudinary.uploader.upload(image, {
    use_filename: true,
    folder: "file-upload",
  });

  fs.unlinkSync(image); // this helps remove tempory file

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImageLocal,
  createProduct,
  getAllProducts,
  uploadProductImage,
};
