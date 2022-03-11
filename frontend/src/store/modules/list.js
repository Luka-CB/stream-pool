import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const states = {
  loading: false,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  error: null,

  lists: [],
  list: {},
};

const getters = {
  getListLoading: (state) => state.loading,
  getCreateListSuccess: (state) => state.createSuccess,
  getUpdateListSuccess: (state) => state.updateSuccess,
  getDeleteListSuccess: (state) => state.deleteSuccess,

  getAllLists: (state) => state.lists,
  getSingleList: (state) => state.list,
};

const mutations = {
  GET_LISTS(state, data) {
    const newLists = data.lists.map((list) => {
      const contentIds = list.listItems.map((li) => li.contentId);

      let isInList;
      if (contentIds.includes(data.contentId)) {
        isInList = true;
      } else {
        isInList = false;
      }

      return { ...list, isInList };
    });
    state.lists = newLists;
  },
  GET_LIST(state, data) {
    state.list = data;
  },
  HIDE_LIST_MSG(state) {
    state.updateSuccess = false;
  },
};

const actions = {
  async createList({ state }, title) {
    state.loading = true;

    try {
      await axios.post("/api/list/create", { title }, config);
      state.loading = false;
      state.createSuccess = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getLists({ commit, state }, options) {
    state.loading = true;
    console.log(options.contentId);

    try {
      const { data } = await axios.get(
        `/api/list/lists?userId=${options.userId}`
      );
      if (data) {
        state.loading = false;
        commit("GET_LISTS", { lists: data, contentId: options.contentId });
      }
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async getList({ commit }, id) {
    try {
      const { data } = await axios.get(`/api/list/${id}`);
      if (data) {
        commit("GET_LIST", data);
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  async updateList({ state }, data) {
    state.loading = true;

    try {
      await axios.put(`/api/list/${data.id}`, { title: data.title }, config);
      state.loading = false;
      state.updateSuccess = true;
    } catch (error) {
      state.loading = false;
      console.log(error.message);
    }
  },
  async deleteList({ state }, id) {
    state.loading = true;

    try {
      await axios.delete(`/api/list/${id}`);
      state.loading = false;
      state.deleteSuccess = true;
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
