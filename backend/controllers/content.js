const asyncHandler = require("express-async-handler");
const Content = require("../models/Content");
const Rating = require("../models/Rating");

// ADD NEW CONTENT
// ROUTE - POST - /api/content
// PRIVATE - ADMIN
const addNewContent = asyncHandler(async (req, res) => {
  const { title, year, description, genres, posterUrl, videoUrl, type } =
    req.body;

  const newContent = await Content.create({
    title,
    year,
    description,
    genres,
    posterUrl,
    videoUrl,
    type,
  });

  if (!newContent) throw new Error("Create New Content Request has Failed!");

  res.json(newContent);
});

// GET MOVIES
// ROUTE - GET - /api/content/movies
// PUBLIC
const getMovies = asyncHandler(async (req, res) => {
  const { genre, year, sort, page } = req.query;

  const keyword =
    genre && year
      ? {
          genres: {
            $in: genre || "",
          },
          year: year || "",
        }
      : genre
      ? {
          genres: {
            $in: genre || "",
          },
        }
      : year
      ? { year: year || "" }
      : {};

  let sortVal;

  if (sort === "asc") {
    sortVal = { year: "asc" };
  } else if (sort === "desc") {
    sortVal = { year: "desc" };
  } else {
    sortVal = { createdAt: "desc" };
  }

  const query = { type: "movie", ...keyword };
  const options = {
    sort: sortVal,
    page: page || 1,
    limit: 12,
  };

  const count = await Content.countDocuments({ type: "movie", ...keyword });

  const movies = await Content.paginate(query, options);

  if (!movies) throw new Error("Get Movies Request has Failed!");

  res.status(200).json({ movies, count });
});

// GET TV SHOWS
// ROUTER - GET - /api/content/tvs
// PUBLIC
const getTvs = asyncHandler(async (req, res) => {
  const { genre, year, sort, page } = req.query;

  const keyword =
    genre && year
      ? {
          genres: {
            $in: genre || "",
          },
          year: { $regex: year || "" },
        }
      : genre
      ? {
          genres: {
            $in: genre || "",
          },
        }
      : year
      ? { year: { $regex: year } }
      : {};

  let sortVal;

  if (sort === "asc") {
    sortVal = { year: "asc" };
  } else if (sort === "desc") {
    sortVal = { year: "desc" };
  } else {
    sortVal = { createdAt: "desc" };
  }

  const query = { type: "tv", ...keyword };
  const options = {
    sort: sortVal,
    page: page || 1,
    limit: 12,
  };

  const count = await Content.countDocuments({ type: "tv", ...keyword });

  const tvs = await Content.paginate(query, options);

  if (!tvs) throw new Error("Get Tvs Request has Failed!");

  res.status(200).json({ tvs, count });
});

// GET CONTENT BY ID
// ROUTE - GET - /api/content/:id
// PUBLIC
const getSingleContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  const content = await Content.findById(id);

  let rating;
  if (userId) {
    rating = await Rating.findOne({
      content: id,
      user: userId,
    });
  }

  if (!content) throw new Error("Get Single Content Request has Failed!");

  const data = {
    ...content._doc,
    isRated: rating ? true : false,
  };

  res.status(200).json(data);
});

// GET CONTENT BY SEARCH QUERY
// ROUTE - GET - /api/content
// PUBLIC
const getContentBySearch = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        title: {
          $regex: req.query.search,
          $options: "i",
        },
      }
    : { title: "" };

  const count = await Content.countDocuments({ ...keyword });

  const content = await Content.find({ ...keyword });
  if (!content) throw new Error("Get Searched Content Request has Failed!");
  res.status(200).json({ content, count });
});

// UPDATE CONTENT BY ID
// ROUTE - PUT - /api/content/:id
// PRIVATE - ADMIN
const updateContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, year, description, posterUrl, videoUrl, type, genres } =
    req.body;

  const query = { _id: id };
  const options = {
    title,
    year,
    description,
    posterUrl,
    videoUrl,
    type,
    genres,
  };

  const updatedContent = await Content.updateOne(query, options);
  if (!updatedContent) throw new Error("Update Content Request has Failed!");
  res.status(200).send("success");
});

// DELETE CONTENT BY ID
// ROUTE - DELETE - /api/content/:id
// PRIVATE - ADMIN
const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedContent = await Content.deleteOne({ _id: id });
  if (!deletedContent) throw new Error("Delete Content Request has Failed!");
  res.status(200).send("success");
});

// GET USER'S RATED CONTENT
// ROUTE - GET - /api/content/rated
// PRIVATE - USER
const getRatedContent = asyncHandler(async (req, res) => {
  const { rating, sort, page } = req.query;

  const count = await Rating.countDocuments({ user: req.user._id });

  const rateNum = rating ? { value: rating } : {};

  let sortVal;
  if (sort === "asc") {
    sortVal = { createdAt: "asc" };
  } else if (sort === "desc") {
    sortVal = { createdAt: "desc" };
  } else {
    sortVal = { createdAt: "desc" };
  }

  const query = { user: req.user._id, ...rateNum };
  const options = {
    populate: "content",
    sort: sortVal,
    page: page || 1,
    limit: 30,
  };

  const userRatings = await Rating.paginate(query, options);

  if (!userRatings)
    throw new Error("Get User's Rated Content Request has Failed!");

  res.status(200).json({ userRatings, count });
});

module.exports = {
  addNewContent,
  getMovies,
  getTvs,
  getSingleContent,
  getContentBySearch,
  updateContent,
  deleteContent,
  getRatedContent,
};
