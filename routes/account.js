const express = require("express");
const app = express();
const router = express.Router();
app.use(express.json());

const Account = require("../models/account.models");

router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  Account.findById(req.params.id, (err, account) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!account) {
      return res.status(404).send("Account doesn't exist!");
    }
    res.json(account);
  });
});

router.post("/", async (req, res) => {
  const body = req.body;
  const account = new Account({
    first_name: body.first_name,
    surname: body.surname,
    gender: body.gender,
    dob: body.dob,
    password: body.password,
    phone_no: body.phone_no,
    email: body.email,
  });

  account.save((err, result) => {
    if (err) {
      if (err.errors) {
        return res.status(500).send(err.message.split(":")[2]);
      }

      if (err.keyPattern.phone_no == 1) {
        return res.status(404).send("Duplicate Phone No!");
      } else if (err.keyPattern != null) {
        return res
          .status(404)
          .send("An Account with this Email already exist!");
      } else if (!result) {
        return res
          .status(404)
          .send("Couldn't create Account. Please Try Again!");
      } else if (result) {
        res.send(result);
      }
    }
    res.status(201).send("Account Created Succesfully!!!");
  });
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  Account.findById(req.params.id, (err, account) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!account) {
      return res.status(404).send("No such Account!");
    }
    account.first_name = body.first_name;
    account.surname = body.surname;
    account.gender = body.gender;
    account.dob = body.dob;
    account.password = body.password;
    account.phone_no = body.phone_no;
    account.email = body.email;

    account.save((err2, result) => {
      if (err2) {
        return res.status(500).send(err2.message.split(":")[2]);
      }
      if (!result) {
        return res.status(404).send("No such Account!");
      }
      res.status(200).send("Account Updated Successfully!!!");
    });
  });
});

router.delete("/:id", async (req, res) => {
  Account.findById(req.params.id, (err, account) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!account) {
      return res.status(404).send("Account doesn't exist!");
    }
    account.remove((err2, result) => {
      if (err2) {
        return res.status(500).send(err2);
      }
      if (!result) {
        return res.status(404).send("Error while deleting Account!");
      }
    });
    res.status(200).send("Account Deleted Succesfully!!!");
  });
});

module.exports = router;
