const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();
const Post = require("../models/post.models");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.send("Error : " + error);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  const post = new Post({
    user_id: body.user_id,
    date: body.date,
    time: body.time,
    title: body.title,
    body: body.body,
  });

  try {
    const response = await post.save();
    res.json(response);
  } catch (error) {
    res.send("Error : " + error);
  }
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  try {
    const post = await Post.findById(req.params.id);
    post.user_id = body.user_id;
    post.date = body.date;
    post.time = body.time;
    post.title = body.title;
    post.body = body.body;

    const response = await post.save();
    res.json(response);
  } catch (error) {
    res.send("Error : " + error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const response = await post.remove();
    res.json(response);
  } catch (error) {
    res.send("Error : " + error);
  }
});

module.exports = router;
