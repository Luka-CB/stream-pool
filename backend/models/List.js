const mongoose = require("mongoose");

const listSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    listItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "ListItem" }],
    image: String,
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);

module.exports = List;
