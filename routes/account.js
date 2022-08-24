const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();
const Account = require("../models/account.models");

router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();
    // res.send(accounts);
    res.json(accounts);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
