const express = require("express");
const {
  addNewContent,
  getMovies,
  getTvs,
  getSingleContent,
  getContentBySearch,
  updateContent,
  deleteContent,
  getRatedContent,
} = require("../controllers/content");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(auth, admin, addNewContent).get(getContentBySearch);
router.route("/movies").get(getMovies);
router.route("/tvs").get(getTvs);
router.route("/rated").get(auth, getRatedContent);
router
  .route("/:id")
  .get(getSingleContent)
  .put(auth, admin, updateContent)
  .delete(auth, admin, deleteContent);

module.exports = router;
