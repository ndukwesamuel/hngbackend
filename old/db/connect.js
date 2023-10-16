const mongoose = require("mongoose");

const liveurl =
  "mongodb+srv://techstudioacademy:techstudioacademy@techstudio.anryi.mongodb.net/";

// const localUrl = "mongodb://localhost:27017/techstudio";

// mongoose
//   .connect(liveurl)
//   .then(() => console.log("Connected To The DB"))
//   .catch((err) => console.log(err));

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
