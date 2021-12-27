const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");

// CREATE NEW COMMENT
// ROUTE - POST - /api/comment/create
// PRIVATE - USER
const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { contentId } = req.query;

  const newComment = await Comment.create({
    text,
    user: req.user._id,
    contentId,
  });

  if (!newComment) throw new Error("Create Comment Request has Failed!");

  res.status(200).json(newComment);
});

// GET COMMENTS
// ROUTE - GET - /api/comment
// PUBLIC
const getComments = asyncHandler(async (req, res) => {
  const { contentId } = req.query;

  const count = await Comment.countDocuments({ contentId });
  const comments = await Comment.find({ contentId })
    .populate("user", "username")
    .sort({ createdAt: "desc" })
    .exec();

  if (!comments) throw new Error("Get Comments Request has Failed!");

  res.status(200).json({ comments, count });
});

// GET COMMENT BY ID
// ROUTE - GET - /api/comment/:id
// PRIVATE - USER
const getComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id).select("text");
  if (!comment) throw new Error("Get Comment Request has Failed!");
  res.status(200).json(comment);
});

// UPDATE COMMENT
// ROUTER - PUT - /api/comment/:id
// PRIVATE - USER
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const updatedComment = await Comment.updateOne({ _id: id }, { text });
  if (!updatedComment) throw new Error("Update Comment Request has Failed!");
  res.status(200).send("success");
});

// DELETE COMMENT
// ROUTE - DELETE - /api/comment/:id
// PRIVATE - USER
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedComment = await Comment.deleteOne({ _id: id });
  if (!deletedComment) throw new Error("Delete Comment Request has Failed!");
  res.status(200).send("success");
});

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
