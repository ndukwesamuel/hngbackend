const { BadRequestError, UnauthenticatedError } = require("../errors");
const MainUser = require("../models/MainUser");
const { StatusCodes } = require("http-status-codes");

const nodemailer = require("nodemailer");

const sendEmailEthereal = async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "deja.balistreri@ethereal.email",
      pass: "wtNmDrMj2X55PRfyUC",
    },
  });
  // send email

  let info = await transporter.sendMail({
    from: '"Coding Addict" <ndukwesamuel23@gmail.com>',
    to: "ndukwesamuel23@yahoo.com",
    subject: "Hello",
    html: "<h2>Sending Emails with Node.js</h2>",
  });
  res.status(StatusCodes.OK).json({ info });
};

module.exports = {
  sendEmailEthereal,
};
