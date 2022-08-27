require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { connection } = require("./db.configs/db");

const app = express();
app.use(express.json());

connection.establishConnection;

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
