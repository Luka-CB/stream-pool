import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const state = {
  userInfo: userInfoFromStorage,
  profileInfo: null,
  users: [],
  userPagination: {},

  loading: false,
  deleteUserLoading: false,
  editUserLoading: false,
  error: null,
  success: false,
};

const getters = {
  getUserInfo: (state) => state.userInfo,
  getProfileInfo: (state) => state.profileInfo,
  getAllUsers: (state) => state.users,
  getUserPagination: (state) => state.userPagination,

  getLoading: (state) => state.loading,
  getDeleteUserLoading: (state) => state.deleteUserLoading,
  getEditUserLoading: (state) => state.editUserLoading,
  getError: (state) => state.error,
  getSuccess: (state) => state.success,
};

const mutations = {
  SIGN_UP(state, data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
    state.userInfo = data;
  },

  SIGN_IN(state, data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
    state.userInfo = data;
  },

  GET_USERS(state, data) {
    state.users = data.docs;
    state.userPagination = {
      nextPage: data.nextPage,
      prevPage: data.prevPage,
      page: data.page,
      totalPages: data.totalPages,
      totalDocs: data.totalDocs,
    };
  },
};

const actions = {
  async signup({ commit, state }, user) {
    state.loading = true;
    state.error = null;

    try {
      const { data } = await axios.post("/api/users/register", user, config);

      if (data) {
        (state.loading = false), (state.error = null);
        state.success = true;
      }

      commit("SIGN_UP", data);
    } catch (error) {
      state.loading = false;
      state.error = error.response.data.message;
    }
  },

  async signin({ commit, state }, user) {
    state.loading = true;
    state.error = null;

    try {
      const { data } = await axios.post("/api/users/login", user, config);

      if (data) {
        state.loading = false;
        state.error = null;
        state.success = true;
      }

      commit("SIGN_IN", data);
    } catch (error) {
      state.loading = false;
      state.error = error.response.data.message;
    }
  },

  async userProfile({ state }) {
    state.loading = true;

    try {
      const { data } = await axios.get("/api/users/profile");

      if (data) {
        state.loading = false;
        state.profileInfo = data;
      }
    } catch (error) {
      state.loading = false;
      state.error = error.response.data.message;
    }
  },

  async logout({ state }) {
    try {
      await axios.get("/api/users/logout");
      localStorage.removeItem("userInfo");
      state.success = true;
    } catch (error) {
      console.log(error.message);
    }
  },

  async updateUser({ state }, userData) {
    state.loading = true;
    state.success = false;

    try {
      await axios.put(`/api/users/update`, userData, config);
      state.loading = false;
      state.success = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },

  async deleteUser({ state }) {
    state.loading = true;
    state.success = false;

    try {
      await axios.delete("/api/users/delete");
      state.loading = false;
      state.success = true;
      localStorage.removeItem("userInfo");
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },

  async getUsers({ commit, state }, queries) {
    state.loading = true;

    try {
      const { data } = await axios.get(
        `/api/users?sort=${queries.sort}&search=${queries.search}&page=${queries.page}`
      );
      if (data) {
        state.loading = false;
        commit("GET_USERS", data);
      }
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },

  async adminEditUser({ state }, user) {
    state.editUserLoading = true;
    state.success = false;

    try {
      await axios.put(`/api/users/edit`, user, config);
      state.editUserLoading = false;
      state.success = true;
    } catch (error) {
      state.editUserLoading = false;
      console.log(error.message);
    }
  },

  async adminDeleteUser({ state }, id) {
    state.deleteUserLoading = true;
    state.success = false;

    try {
      await axios.delete(`/api/users/admin/delete/${id}`);
      state.deleteUserLoading = false;
      state.success = true;
    } catch (error) {
      state.deleteUserLoading = false;
      console.log(error.message);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
