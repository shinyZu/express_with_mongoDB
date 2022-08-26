const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();
const Account = require("../models/account.models");

router.get("/", async (req, res) => {
  try {
    res.json("Login");
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  //   const account = await Account.findOne(body.email);
  //   console.log(account);

  const account = new Account({
    first_name: "",
    surname: "",
    gender: "",
    dob: "",
    password: body.password,
    phone_no: "",
    email: body.email,
  });

  try {
    const response = await account.save();
    console.log("11111111");
    res.json(response);

    // if (account) {
    //   res.send("account verified successfully");
    // } else {
    //   res.send("account verification failed");
    // }
  } catch (error) {
    res.send("Error : " + error);
  }
});
module.exports = router;
