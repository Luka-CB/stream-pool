import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const states = {
  crLoading: false,
  delLoading: false,
  success: false,
  error: null,

  listItems: [],
  listPaginationData: {},
  listCount: 0,
};

const getters = {
  getListItemCrLoading: (state) => state.crLoading,
  getListItemDelLoading: (state) => state.delLoading,
  getListItemSuccess: (state) => state.success,
  getListItemError: (state) => state.error,

  getListitems: (state) => state.listItems,
  getListPaginationData: (state) => state.listPaginationData,
  getListCount: (state) => state.listCount,
};

const mutations = {
  HIDE_MSG(state) {
    state.success = false;
    state.error = false;
  },
  GET_LIST_ITEMS(state, data) {
    state.listItems = data.docs;
    state.listCount = data.totalDocs;
    state.listPaginationData = {
      page: data.page,
      totalPages: data.totalPages,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      totalDocs: data.totalDocs,
    };
  },
};

const actions = {
  async createListItem({ state }, data) {
    state.crLoading = true;
    state.error = false;

    try {
      await axios.post(
        `/api/listitem/create?contentId=${data.contentId}&listId=${data.listId}`,
        config
      );
      state.crLoading = false;
      state.error = false;
      state.success = true;
    } catch (error) {
      console.log(error.message);
      state.crLoading = false;
      state.error = error.response.data.message;
    }
  },
  async getListItems({ commit }, values) {
    try {
      const { data } = await axios.get(
        `/api/listitem/${values.id}?page=${values.page}&sort=${values.sort}`
      );
      if (data) {
        commit("GET_LIST_ITEMS", data);
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  async deleteListItems({ state }, data) {
    state.delLoading = true;

    try {
      await axios.delete(
        `/api/listitem/delete?listId=${data.listId}`,
        { data },
        config
      );
      state.delLoading = false;
      state.success = true;
    } catch (error) {
      state.delLoading = false;
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
