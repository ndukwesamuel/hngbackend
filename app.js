const express = require("express");
const app = express();
require("dotenv").config();
require("express-async-errors");
const cloudinary = require("cloudinary").v2;

// extra security packages
// const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");

cloudinary.config({
  cloud_name: process.env.cloudinary_Name,
  api_key: process.env.cloudinary_API_Key,
  api_secret: process.env.cloudinary_API_Secret,
});
const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const jobroute = require("./routes/jobroute");

app.set("trust proxy", 1);

// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// app.use(helmet());
app.use(cors());

app.use("/api", jobroute);

// this main route should be above

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 6000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start(); /**/

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
