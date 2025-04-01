const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  updatePost,
} = require("../controllers/postControllers");
const postRoutes = express.Router();
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/auth");
//get post form
postRoutes.get("/add", getPostForm);

//post logic
postRoutes.post(
  "/add",
  ensureAuthenticated,
  upload.array("images", 5),
  createPost
);

//Get all posts
postRoutes.get("/", getPosts);

//get post by id
postRoutes.get("/:id", getPostById);
postRoutes.get("/:id/edit", getEditPostForm);
postRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.array("images", 5),
  updatePost
);

module.exports = postRoutes;
