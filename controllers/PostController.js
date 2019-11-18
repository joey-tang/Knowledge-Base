let postModel = require("../models/post");

exports.getPostsByContent = (req, res) => {
  const { msg } = req.params;

  postModel
    .getPostsByContent(msg)
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch(error => console.log("get posts by content error: " + error));
};

exports.getPostsByTopic = (req, res) => {
  const { topic } = req.params;
  postModel
    .getPostsByTopic(topic)
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch(error => console.log("get post by topic error: " + error));
};

exports.getPostDetail = (req, res) => {
  const { postId } = req.params;

  postModel
    .getPost(postId)
    .then(([rows, fields]) => {
      if (error)
        if (rows) {
          res.json(rows);
        }
    })
    .catch(error => console.log("get a post by id error: " + error));
};

exports.getPostsByUserId = (req, res) => {
  const { userId } = req.params;

  postModel
    .getPostsByUserId(userId)
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch(error => console.log("get posts by user id error: " + error));
};

exports.addPost = (req, res) => {
  const { topic, subject, message, created_at, user_id } = req.body;
  let post = { topic, subject, message, created_at, user_id };

  postModel
    .addPost(post)
    .then(results => res.status(200).json(results))
    .catch(err => res.json({ "add error:": err }));
};

exports.getLatestPosts = (req, res) => {
  postModel
    .getLatestPosts()
    .then(([rows, fields]) => {
      // res.json(rows);
      res.render("partials/posts", { postCSS: true, posts: rows });
    })
    .catch(err => console.log("get latest posts error: " + err));
};