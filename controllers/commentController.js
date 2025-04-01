//add comment

const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  //find the post;
  const post = await Post.findById(postId);
  //validation
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  if (!content) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Comment cannot be empty",
      success: "",
    });
  }
  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });
  await comment.save();
  //push comment
  post.comments.push(comment._id);
  await post.save();
  console.log(post);
  //redirect
  res.redirect(`/posts/${postId}`);
});
