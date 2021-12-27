const express = require("express");
const {
  createList,
  getLists,
  updateList,
  deleteList,
  getList,
} = require("../controllers/list");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.route("/lists").get(auth, getLists);
router.route("/create").post(auth, createList);
router
  .route("/:id")
  .put(auth, updateList)
  .delete(auth, deleteList)
  .get(auth, getList);

module.exports = router;
