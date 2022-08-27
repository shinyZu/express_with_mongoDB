require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const app = express();
app.use(express.json());

//------------------------------------------------------------
const url = process.env.URL;

// Create MongoDB Connection
mongoose.connect(url, {
  useNewUrlParser: true,
});
const conn = mongoose.connection;

// runs everytime when connected to mongodb
conn.on("open", () => {
  console.log("MongoDB connected!");
});

// Init gfs
let gfs;
conn.once("open", () => {
  // console.log("Once Open!");
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("assets");
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
