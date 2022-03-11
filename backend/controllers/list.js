const asyncHandler = require("express-async-handler");
const List = require("../models/List");
const ListItem = require("../models/ListItem");

// CREATE NEW LIST
// ROUTE - POST - /api/list/create
// PRIVATE - USER
const createList = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const newList = await List.create({
    title,
    userId: req.user._id,
  });

  if (!newList) throw new Error("Create New List Request has Failed!");

  res.json(newList);
});

// GET LISTS
// ROUTE - GET - /api/list/lists
// PRIVATE - USER
const getLists = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const lists = await List.find({ userId }).populate("listItems", "contentId");

  if (!lists) throw new Error("Get Lists Request has Failed!");
  res.status(200).json(lists);
});

// GET LIST BY ID
// ROUTE - GET - /api/list/:id
// PRIVATE - USER
const getList = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const list = await List.findById(id).populate("userId", "username");
  if (!list) throw new Error("Get List Request has Failed!");
  res.status(200).json(list);
});

// UPDATE LIST
// ROUTE - PUT - /api/list/:id
// PRIVATE - USER
const updateList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedList = await List.updateOne({ _id: id }, { title });
  if (!updatedList) throw new Error("Update List Request has Failed!");
  res.status(200).send("success");
});

// DELETE LIST
// ROUTE - DELETE - /api/list/:id
// PRIVATE - USER
const deleteList = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const list = await List.findById(id);

  await ListItem.deleteMany({ _id: { $in: list.listItems } });

  const deletedList = await List.deleteOne({ _id: id });
  if (!deletedList) throw new Error("Delete List Request has Failed!");
  res.status(200).send("success");
});

module.exports = {
  createList,
  getLists,
  getList,
  updateList,
  deleteList,
};
