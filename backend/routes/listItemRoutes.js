const express = require("express");
const {
  createListItem,
  getListItems,
  deleteListItems,
} = require("../controllers/listItem");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.route("/create").post(auth, createListItem);
router.route("/:listId").get(auth, getListItems);
router.route("/delete").delete(auth, deleteListItems);

module.exports = router;
