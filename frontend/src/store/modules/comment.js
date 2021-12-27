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

  comments: [],
  comment: {},
  count: 0,
};

const getters = {
  getCommentLoading: (state) => state.loading,
  getCommentSuccess: (state) => state.success,

  getAllComments: (state) => state.comments,
  getSingleComment: (state) => state.comment,
  getCount: (state) => state.count,
};

const mutations = {
  GET_COMMENTS(state, data) {
    state.comments = data.comments;
    state.count = data.count;
  },
  GET_COMMENT(state, data) {
    state.comment = data;
  },
};

const actions = {
  async createComment({ state }, data) {
    state.loading = true;

    try {
      await axios.post(
        `/api/comment/create?contentId=${data.contentId}`,
        { text: data.text },
        config
      );
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getComments({ commit, state }, id) {
    state.loading = true;

    try {
      const { data } = await axios.get(`/api/comment?contentId=${id}`);
      state.loading = false;
      commit("GET_COMMENTS", data);
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getComment({ commit, state }, id) {
    try {
      const { data } = await axios.get(`/api/comment/${id}`);
      commit("GET_COMMENT", data);
    } catch (error) {
      console.log(error.message);
    }
  },
  async updateComment({ state }, data) {
    state.loading = true;

    try {
      await axios.put(`/api/comment/${data.id}`, { text: data.text }, config);
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async deleteComment({ state }, id) {
    state.loading = true;

    try {
      await axios.delete(`/api/comment/${id}`);
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
