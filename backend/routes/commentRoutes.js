const express = require("express");
const {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(getComments);
router.route("/create").post(auth, createComment);
router
  .route("/:id")
  .get(auth, getComment)
  .put(auth, updateComment)
  .delete(auth, deleteComment);

module.exports = router;
