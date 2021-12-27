const asyncHandler = require("express-async-handler");
const ListItem = require("../models/ListItem");
const List = require("../models/List");

// CREATE NEW LIST ITEM
// ROUTE - POST - /api/listitem/create
// PRIVATE - USER
const createListItem = asyncHandler(async (req, res) => {
  const { contentId, listId } = req.query;

  const listItems = await ListItem.find();
  const exists = listItems.find(
    (li) =>
      li.contentId.toString() === contentId && li.listId.toString() === listId
  );
  if (exists) throw new Error("The item is already in this list!");

  const newListItem = await ListItem.create({ contentId, listId });

  if (!newListItem) throw new Error("Create New List Item Request has Failed!");

  await List.updateMany(
    { _id: newListItem.listId },
    { $push: { listItems: newListItem._id } }
  );

  const poster = await ListItem.findById(newListItem._id).populate(
    "contentId",
    "posterUrl"
  );
  await List.updateOne(
    { _id: poster.listId },
    { image: poster.contentId.posterUrl }
  );

  res.status(200).json(newListItem);
});

// GET LIST ITEM BY ID
// ROUTE - GET - /api/listitem/:listId
// PRIVATE - USER
const getListItems = asyncHandler(async (req, res) => {
  const { listId } = req.params;
  const { page, sort } = req.query;

  let sortVal;
  if (sort === "asc") {
    sortVal = { createdAt: "asc" };
  } else if (sort === "desc") {
    sortVal = { createdAt: "desc" };
  } else {
    sortVal = { createdAt: "desc" };
  }

  const query = { listId };
  const options = {
    populate: "contentId",
    sort: sortVal,
    page: page || 1,
    limit: 30,
  };

  const listItems = await ListItem.paginate(query, options);
  if (!listItems) throw new Error("Get List Item Request has Failed!");

  res.status(200).json(listItems);
});

// DELETE LIST ITEM/ITEMS
// ROUTE - DELETE - /api/listitem/delete
// PRIVATE - USER
const deleteListItems = asyncHandler(async (req, res) => {
  const { listId } = req.query;
  const { itemIds } = req.body;

  await List.updateMany(
    { _id: listId },
    { $pull: { listItems: { $in: itemIds } } }
  );

  const deletedItems = await ListItem.deleteMany({ _id: { $in: itemIds } });
  if (!deletedItems) throw new Error("Delete List Items Request has Failed!");

  res.status(200).send("success");
});

module.exports = {
  createListItem,
  getListItems,
  deleteListItems,
};
