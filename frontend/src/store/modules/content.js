import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const state = {
  loading: false,
  success: false,
  error: null,

  movies: [],
  tvs: [],

  movieCount: 0,
  tvCount: 0,

  moviePaginationData: {},
  tvPaginationData: {},

  latestMovies: [],
  latestTvs: [],

  singleContent: {},
  searchResult: [],
  listSearchResult: [],
  fullSearchResult: [],
  searchResultCount: 0,

  ratedContentForDisplay: [],
  ratedContentForDisplaySm: [],
  ratedContentForDisplayXs: [],
  ratedContent: [],
  ratedContentCount: 0,
  ratedContentPagination: {},
};

const getters = {
  getContentLoading: (state) => state.loading,
  getContentSuccess: (state) => state.success,
  getContentError: (state) => state.error,

  getAllMovies: (state) => state.movies,
  getAllTvs: (state) => state.tvs,

  getMovieCount: (state) => state.movieCount,
  getTvCount: (state) => state.tvCount,

  getMoviePaginationData: (state) => state.moviePaginationData,
  getTvPaginationData: (state) => state.tvPaginationData,

  getLatestMovies: (state) => state.latestMovies,
  getLatestTvs: (state) => state.latestTvs,

  getContent: (state) => state.singleContent,
  getSearchResult: (state) => state.searchResult,
  getListSearchResult: (state) => state.listSearchResult,
  getFullSearchResult: (state) => state.fullSearchResult,
  getSearchResultCount: (state) => state.searchResultCount,

  getRatedContentForDisplay: (state) => state.ratedContentForDisplay,
  getRatedContentForDisplaySm: (state) => state.ratedContentForDisplaySm,
  getRatedContentForDisplayXs: (state) => state.ratedContentForDisplayXs,
  getAllRatedContent: (state) => state.ratedContent,
  getRatedContentCount: (state) => state.ratedContentCount,
  getRatedContentPagination: (state) => state.ratedContentPagination,
};

const mutations = {
  GET_MOVIES(state, data) {
    state.latestMovies = data.movies.docs.slice(0, 4);
    state.movies = data.movies.docs;
    state.movieCount = data.count;
    state.moviePaginationData = {
      page: data.movies.page,
      totalPages: data.movies.totalPages,
      hasPrevPage: data.movies.hasPrevPage,
      hasNextPage: data.movies.hasNextPage,
      prevPage: data.movies.prevPage,
      nextPage: data.movies.nextPage,
    };
  },
  GET_TVS(state, data) {
    state.latestTvs = data.tvs.docs.slice(0, 4);
    state.tvs = data.tvs.docs;
    state.tvCount = data.count;
    state.tvPaginationData = {
      page: data.tvs.page,
      totalPages: data.tvs.totalPages,
      hasPrevPage: data.tvs.hasPrevPage,
      hasNextPage: data.tvs.hasNextPage,
      prevPage: data.tvs.prevPage,
      nextPage: data.tvs.nextPage,
    };
  },
  GET_SINGLE_CONTENT(state, data) {
    state.singleContent = data;
  },
  GET_SEARCHED_CONTENT(state, data) {
    state.searchResult = data.content.slice(0, 3);
    state.listSearchResult = data.content.slice(0, 8);
    state.fullSearchResult = data;
    state.searchResultCount = data.count;
  },
  GET_RATED_CONTENT(state, data) {
    state.ratedContentForDisplay = data.userRatings.docs.slice(0, 5);
    state.ratedContentForDisplaySm = data.userRatings.docs.slice(0, 3);
    state.ratedContentForDisplayXs = data.userRatings.docs.slice(0, 2);
    state.ratedContent = data.userRatings.docs;
    state.ratedContentCount = data.count;
    state.ratedContentPagination = {
      totalDocs: data.userRatings.totalDocs,
      totalPages: data.userRatings.totalPages,
      page: data.userRatings.page,
      prevPage: data.userRatings.prevPage,
      nextPage: data.userRatings.nextPage,
    };
  },
};

const actions = {
  async createContent({ state }, content) {
    state.loading = true;
    state.error = null;

    try {
      await axios.post("/api/content", content, config);

      state.loading = false;
      state.success = true;
      state.error = null;
    } catch (error) {
      state.loading = false;
      state.error = error.response.data.message;
    }
  },
  async getMovies({ commit, state }, queries) {
    state.loading = true;

    try {
      const { data } = await axios.get(
        `/api/content/movies?genre=${queries.genre}&year=${queries.year}&sort=${queries.sort}&page=${queries.page}`
      );

      if (data) {
        state.loading = false;
        commit("GET_MOVIES", data);
      }
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getTvs({ commit, state }, queries) {
    state.loading = true;

    try {
      const { data } = await axios.get(
        `/api/content/tvs?genre=${queries.genre}&year=${queries.year}&sort=${queries.sort}&page=${queries.page}`
      );
      if (data) {
        state.loading = false;
        commit("GET_TVS", data);
      }
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getSingleContent({ commit, state }, options) {
    state.loading = true;

    try {
      const { data } = await axios.get(
        `/api/content/${options.contentId}?userId=${options.userId}`
      );
      if (data) {
        state.loading = false;
        commit("GET_SINGLE_CONTENT", data);
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  async getSearchedContent({ commit, state }, query) {
    state.loading = true;

    try {
      const { data } = await axios.get(`/api/content?search=${query}`);
      if (data) {
        state.loading = false;
        commit("GET_SEARCHED_CONTENT", data);
      }
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getRatedContent({ commit, state }, queries) {
    state.loading = true;

    try {
      const { data } = await axios.get(
        `/api/content/rated?rating=${queries.rating}&sort=${queries.sort}&page=${queries.page}`
      );
      if (data) {
        state.loading = false;
        commit("GET_RATED_CONTENT", data);
      }
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async updateContent({ state }, content) {
    state.loading = true;

    try {
      await axios.put(`/api/content/${content.id}`, content, config);
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async deleteContent({ state }, id) {
    state.loading = true;

    try {
      await axios.delete(`/api/content/${id}`);
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
};

export default { state, getters, mutations, actions };
