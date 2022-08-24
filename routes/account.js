const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();
const Account = require("../models/account.models");

router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    res.json(account);
  } catch (error) {
    res.send("Error : " + error);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  //   console.log(body.dob.split("T"));
  //   console.log(body.dob.split("T")[0]);

  const account = new Account({
    first_name: body.first_name,
    surname: body.surname,
    gender: body.gender,
    dob: body.dob,
    password: body.password,
    phone_no: body.phone_no,
    email: body.email,
  });

  try {
    // console.log(account);
    const response = await account.save();
    res.json(response);
  } catch (error) {
    res.send("Error : " + error);
  }
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  try {
    const account = await Account.findById(req.params.id);
    account.first_name = body.first_name;
    account.surname = body.surname;
    account.gender = body.gender;
    account.dob = body.dob;
    account.password = body.password;
    account.phone_no = body.phone_no;
    account.email = body.email;

    const response = await account.save();
    res.json(response);
  } catch (error) {
    res.send("Error : " + error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    const response = await account.remove();
    res.json(response);
  } catch (error) {
    res.send("Error : " + error);
  }
});

module.exports = router;
