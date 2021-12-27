import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const states = {
  loading: false,
  success: false,
  error: null,

  rateNum: {},
  ratings: [],
};

const getters = {
  getRatingLoading: (state) => state.loading,
  getRatingSuccess: (state) => state.success,

  getRateNum: (state) => state.rateNum,
  getRatings: (state) => state.ratings,
};

const mutations = {
  GET_RATING(state, data) {
    state.rateNum = data;
  },
  GET_RATINGS(state, data) {
    state.ratings = data;
  },
};

const actions = {
  async createRating({ state }, data) {
    state.loading = true;

    try {
      await axios.post("/api/rating/create", data, config);
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getRating({ commit, state }, id) {
    try {
      const { data } = await axios.get(`/api/rating/${id}`);
      commit("GET_RATING", data);
    } catch (error) {
      console.log(error.message);
    }
  },
  async getRatings({ commit }) {
    try {
      const { data } = await axios.get("/api/rating");
      commit("GET_RATINGS", data);
    } catch (error) {
      console.log(error.message);
    }
  },
  async deleteRating({ state }, id) {
    state.loading = true;

    try {
      await axios.delete(`/api/rating/${id}`);
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
};

export default {
  states,
  getters,
  mutations,
  actions,
};
