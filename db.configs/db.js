require("dotenv").config();
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const url = process.env.URL;

// Create MongoDB Connection
const establishConnection = mongoose.connect(url, {
  useNewUrlParser: true,
});

const conn = mongoose.connection;

// runs everytime when connected to mongodb
conn.on("open", () => {
  console.log("MongoDB connected!");
});

module.exports = {
  connection: establishConnection,
  //   gridfsBucket: gridfsBucket,
  //   gfs: gfs,
  conn: conn,
};
