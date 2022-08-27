require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const router = express.Router();
app.use(express.json());

const Account = require("../models/account.models");

router.get("/", (req, res) => {
  try {
    res.json("Login");
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  Account.findOne({ password: password, email: email }, (err, user) => {
    if (err) {
      // return handleError(err);
      return res.status(500).send(err);
    }
    if (!user) {
      return res
        .status(404)
        .send("Invalid Credentials...Please check your email or password!");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.json({
      token,
      // account: {
      //   id: user._id,
      //   first_name: user.first_name,
      //   surname: user.surname,
      //   gender: user.gender,
      //   dob: user.dob,
      //   phone_no: user.phone_no,
      //   email: user.email,
      // },
    });
  });
});
module.exports = router;
