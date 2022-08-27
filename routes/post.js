require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const router = express.Router();
const app = express();
app.use(express.json());

const Post = require("../models/post.models");
const Account = require("../models/account.models");
const upload = require("../middleware/upload");
const { conn } = require("../db.configs/db");

let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "assets",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("assets");
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
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

router.get("/file/:filename", async (req, res) => {
  // console.log(gfs.files);
  // console.log(req.params.filename);

  gfs.files.findOne({ filename: req.params.filename }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).send("File Not Found");
    }
    // const readStream = gfs.createReadStream(result.filename);
    // const readStream = gfs.openDownloadStream(result.filename);
    const readStream = gridfsBucket.openDownloadStreamByName(result.filename);
    readStream.pipe(res);
  });
});

router.post("/", upload.single("body"), async (req, res) => {
  const body = req.body;

  let post;
  // if (req.file === undefined) return res.send("No Image have been selected!");

  if (req.file) {
    const imgUrl = `http://localhost:4080/file/${req.file.filename}`;
    post = new Post({
      user_id: body.user_id,
      date: body.date,
      time: body.time,
      title: body.title,
      body: imgUrl,
    });
  } else {
    post = new Post({
      user_id: body.user_id,
      date: body.date,
      time: body.time,
      title: body.title,
      body: body.body,
    });
  }

  Account.findById(body.user_id, (err, account) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!account) {
      return res.status(404).send("User doesn't exist!");
    }
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

  Account.findById(body.user_id, (err1, account) => {
    if (err1) {
      return res.status(500).send(err1);
    }
    if (!account) {
      return res.status(404).send("User doesn't exist!");
    }
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

router.delete("/file/:filename", (req, res) => {
  gfs.files.deleteOne({ filename: req.params.filename }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.deletedCount === 0) {
      return res.status(404).send("File Not Found");
    }
    return res.status(200).send("Image Deleted Successfully!");
  });
});

module.exports = router;

/* // setup multer for storing uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "./public/assets/images");
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file.fieldname); // body
    // console.log(file.originalname); // car.png
    // cb(null, file.originalname + "-" + Date.now());
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  // limits: {
  //   fieldSize: 1024 * 1024 * 3,
  // },
});
 */

/* router.post("/", multer(upload).single("body"), async (req, res) => {
  const body = req.body;
  console.log(body.body);

  let post;
  if (req.file === undefined) return res.send("No Image have been selected!");
  if (req.file) {
    // console.log(req.file);
    // {
    //   fieldname: 'body',
    //   originalname: 'female_profile2.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: './public/assets/images',
    //   filename: 'female_profile2.jpg-1661551716681',
    //   path: 'public/assets/images/female_profile2.jpg-1661551716681',
    //   size: 33194
    // }

    // console.log(req.file.filename); //female_profile2.jpg-1661551716681
    // console.log(req.file.filename.toString("base64")); // female_profile2.jpg-1661551716681
    // console.log(req.file.mimetype); // image/jpeg

    // console.log(__dirname); // /home/shinyT480/IJSE/13_Express_Assignment-02/express-with-mongoDB/routes
    // console.log(process.env.HOME); // /home/shinyT480

    var img = fs.readFileSync(req.file.path);

    // var imgx = fs.readFileSync(
    //   path.join(process.env.HOME_PATH + req.file.path)
    // );
    // console.log(imgx);

    // console.log(typeof img); // object
    // console.log(img); // <Buffer ff d8 ff e0 00 10 4a 46 49 .....

    var encode_img = img.toString("base64");
    // var encode_img_X = imgx.toString("base64");

    // var encode_img = Buffer.from(img, "base64");
    // console.log(typeof encode_img); //string
    // console.log(encode_img);
    // console.log(Buffer.from(encode_img, "base64"));
    // console.log(Buffer(encode_img));

    // const finalImg = "http://localhost:4000/" + req.file.path;
    const finalImg = process.env.HOME_PATH + req.file.path;

    post = new Post({
      user_id: body.user_id,
      date: body.date,
      time: body.time,
      title: body.title,
      // body: req.file.filename,
      body: finalImg,
    });
  } else {
    post = new Post({
      user_id: body.user_id,
      date: body.date,
      time: body.time,
      title: body.title,
      body: body.body,
    });
  }

  // res.json(post);

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
}); */
