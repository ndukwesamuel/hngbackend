const connectDB = require("./db/connect");
const express = require("express");
const app = express();
const port = 4000;
const morgan = require("morgan");
var cors = require("cors");
require("dotenv").config();
require("express-async-errors");

// const tasks = require("./routes/tasks");
const product = require("./routes/product");
const UserRegistration = require("./routes/Userroute");

const dummyDataArray = require("./data/data");
const logger = require("./middleware/logger");
const authorize = require("./middleware/authorize");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Middleware to parse JSON data
app.use(morgan("tiny"));
app.use(express.json());

// app.use([logger, authorize]);
app.use(cors());

// app.use("/api", tasks); this is for the task api still working not deleted
// app.use("/api", product); this is for the product
app.use("/api", UserRegistration);
app.use(notFound);
app.use(errorHandlerMiddleware);

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
