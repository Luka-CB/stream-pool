const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const contentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    genres: [String],
    posterUrl: {
      type: String,
      require: true,
    },
    videoUrl: String,
    type: {
      type: String,
      require: true,
    },
    rating: {
      avgRating: { type: Number, default: null },
      count: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

contentSchema.plugin(mongoosePaginate);

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
