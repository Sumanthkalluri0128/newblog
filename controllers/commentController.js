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

//get comment form
exports.getCommentForm = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  res.render("editComment", {
    title: "Comment",
    comment,
    user: req.user,
    error: "",
    success: "",
  });
});

//update comment
exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Your are not authorized to update this comment",
      success: "",
    });
  }
  comment.content = content || comment.content;
  await comment.save();
  res.redirect(`/posts/${comment.post}`);
});

//delete comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Your are not authorized to update this comment",
      success: "",
    });
  }
  await Comment.findByIdAndDelete(req.params.id);
  res.redirect(`/posts/${comment.post}`);
});
