require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

//------------------------------------------------------------
const mongoose = require("mongoose");
const url = process.env.URL;
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

// runs everytime when connected to mongodb
con.on("open", () => {
  console.log("MongoDB connected!");
});
//------------------------------------------------------------

const login = require("./routes/login");
const account = require("./routes/account");
const post = require("./routes/post");

app.use("/auth", login);
app.use("/account", account);
app.use("/posts", post);

app.get("/", (req, res) => {
  res.send("<h1>Facebook Clone App</h1>");
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`express app is listening on port ${process.env.PORT}`);
});
