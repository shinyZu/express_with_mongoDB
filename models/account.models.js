const mongoose = require("mongoose");
const validator = require("validator");

// to create a schema in express database in Mongodb
const accountSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (val) {
        return /[a-z0-9]{8}/.test(val);
      },
      message: (val) => "Invalid Password!",
    },
    // minLength: [8, "Password should be at least 8 characters"],
    // pattern: "^[a-z0-9]{8}$",
  },
  phone_no: {
    type: Number,
    required: true,
    unique: true,
    // validate: [(val) => val.length === 10, "Invalid Phone No"],
    validate: {
      validator: function (val) {
        return val.toString().length === 9;
      },
      // message: (val) => `${val.value} has to be 9 digits`,
      message: "Invalid Phone No!",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: [validator.isEmail, "Please enter a valid email address."],
    validate: {
      validator: function (val) {
        return /[A-z|0-9]{4,}@(gmail)(.com|.lk)/.test(val);
      },
      message: (val) => "Invalid Email!",
    },
  },
});

// export accountSchema as a model
module.exports = mongoose.model("Account", accountSchema);
