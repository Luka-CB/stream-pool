const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ratingSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
  },
  { timestamps: true }
);

ratingSchema.plugin(mongoosePaginate);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
