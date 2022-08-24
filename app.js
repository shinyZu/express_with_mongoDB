const express = require("express");
const port = 4000;
const app = express();
app.use(express.json());

//------------------------------------------------------------
const mongoose = require("mongoose");
const url = "mongodb://localhost/express_mongoDB";
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

// runs everytime when connected to mongodb
con.on("open", () => {
  console.log("MongoDB connected!");
});
//------------------------------------------------------------

app.get("/", (req, res) => {
  console.log("Hi Shiny.......");
  res.send("<h1>Hello Shiny!!!!!!!!!</h1>");
});

app.listen(port, (req, res) => {
  console.log(`express app is listening on port ${port}`);
});
