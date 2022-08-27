require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { connection } = require("./db.configs/db");

const app = express();
app.use(express.json());

// let gfs;
connection.establishConnection;

const login = require("./routes/login");
const account = require("./routes/account");
const post = require("./routes/post");

app.use("/auth", login);
app.use("/account", account);
app.use("/posts", post);

// const conn = mongoose.connection;
// conn.once("open", () => {
//   //Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("assets");
//   // return gfs;
// });

app.get("/", (req, res) => {
  res.send("<h1>Facebook Clone App</h1>");
});

// app.get("/posts/:filename", async (req, res) => {
//   console.log(gfs.files);
//   console.log(req.params.filename);
//   try {
//     const file = await gfs.files.findOne({ filename: req.params.filename });
//     const readStream = gfs.createReadStream(file.filename);
//     readStream.pipe(res);
//   } catch (error) {
//     res.send("File Not Found");
//   }
// });

app.listen(process.env.PORT, (req, res) => {
  console.log(`express app is listening on port ${process.env.PORT}`);
});

//------------------------------------------------------------
// const url = process.env.URL;

// // Create MongoDB Connection
// mongoose.connect(url, {
//   useNewUrlParser: true,
// });
// const conn = mongoose.connection;

// // runs everytime when connected to mongodb
// conn.on("open", () => {
//   console.log("MongoDB connected!");
// });

// // Init gfs
// let gfs;
// conn.once("open", () => {
//   // console.log("Once Open!");
//   //Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("assets");
//   // process.env.GF_STORAGE = gfs;
//   // console.log(process.env.GF_STORAGE);
// });
//------------------------------------------------------------
