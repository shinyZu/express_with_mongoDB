const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();
const Post = require("../models/post.models");
const Account = require("../models/account.models");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  // try {
  //   const post = await Post.findById(req.params.id);
  //   res.json(post);
  // } catch (error) {
  //   res.send("Error : " + error);
  // }

  Post.findById(req.params.id, (err, resultPost) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!resultPost) {
      return res.status(404).send("Post doesn't exist!");
    }
    res.json(resultPost);
  });
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

  // try {
  //   const response = await post.save();
  //   res.json(response);
  // } catch (error) {
  //   res.send("Error : " + error);
  // }

  Account.findById(body.user_id, (err, account) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!account) {
      return res.status(404).send("User doesn't exist!");
    }
    // res.json(account);
    post.save((err, result) => {
      if (err) {
        if (err.errors) {
          return res.status(500).send(err.message.split(":")[2]);
        }
      }
      res.status(201).send("Post Created Succesfully!!!");
    });
  });
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  // try {
  //   const post = await Post.findById(req.params.id);
  //   post.user_id = body.user_id;
  //   post.date = body.date;
  //   post.time = body.time;
  //   post.title = body.title;
  //   post.body = body.body;

  //   const response = await post.save();
  //   res.json(response);
  // } catch (error) {
  //   res.send("Error : " + error);
  // }

  Account.findById(body.user_id, (err1, account) => {
    if (err1) {
      return res.status(500).send(err1);
    }
    if (!account) {
      return res.status(404).send("User doesn't exist!");
    }
    // res.json(account);
    Post.findById(req.params.id, (err2, resultPost) => {
      if (err2) {
        return res.status(500).send(err2);
      }
      if (!resultPost) {
        return res.status(404).send("No such Post!");
      }
      resultPost.user_id = body.user_id;
      resultPost.date = body.date;
      resultPost.time = body.time;
      resultPost.title = body.title;
      resultPost.body = body.body;

      resultPost.save((err3, result) => {
        if (err3) {
          // return res.status(500).send(err2.message);
          return res.status(500).send(err3.message.split(":")[2]);
        }
        if (!result) {
          return res.status(404).send("No such Post!");
        }
        res.status(200).send("Post Updated Successfully!!!");
      });
    });
  });
});

router.delete("/:id", async (req, res) => {
  // try {
  //   const post = await Post.findById(req.params.id);
  //   const response = await post.remove();
  //   res.json(response);
  // } catch (error) {
  //   res.send("Error : " + error);
  // }

  Post.findById(req.params.id, (err, resultPost) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!resultPost) {
      return res.status(404).send("Post doesn't exist!");
    }
    resultPost.remove((err2, result) => {
      if (err2) {
        return res.status(500).send(err2);
      }
      if (!result) {
        return res.status(404).send("Error while deleting Post!");
      }
    });
    res.status(200).send("Post Deleted Succesfully!!!");
  });
});

module.exports = router;
