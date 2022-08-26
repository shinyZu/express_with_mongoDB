const mongoose = require("mongoose");

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
      message: (val) => "Invalid Phone No!",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// export accountSchema as a model
module.exports = mongoose.model("Account", accountSchema);
