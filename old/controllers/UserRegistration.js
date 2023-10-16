const asyncWrapper = require("../middleware/async");

const jwt = require("jsonwebtoken");

const LoginUser = asyncWrapper(async (req, res) => {
  //   const userdata = await Task.find({});

  const { username, password } = req.body;

  const id = new Date().getDate();

  console.log(id);

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  if (!username || !password) {
    return res
      .status(500)
      .json({ status: "please provide email and password" });
  }

  res.status(200).json({ msg: "User Created", token });
});

const dashboard = asyncWrapper(async (req, res) => {
  //   const { authorization } = req.headers;
  res.status(200).json(req.user);
});

module.exports = {
  LoginUser,
  dashboard,
};
