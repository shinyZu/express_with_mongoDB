const express = require("express");
const app = express();
const port = 4000;

app.get("/", (req, res) => {
  console.log("Hi Shiny.......");
  res.send("<h1>Hello Shiny!!!!!!!!!</h1>");
});

app.listen(port, (req, res) => {
  console.log(`express app is listening on port ${port}`);
});
