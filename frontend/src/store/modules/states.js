const states = {
  showCreateModal: false,
  showContentConfig: false,
  showRating: false,
  showList: false,
  showCommentConfig: false,
  showResult: false,
  showUpdateAccount: false,
  showDeleteAccount: false,
  showAdminUserEdit: false,
};

const getters = {
  showModal: (state) => state.showCreateModal,
  showContentConfigModal: (state) => state.showContentConfig,
  showRatingModal: (state) => state.showRating,
  showListModal: (state) => state.showList,
  showCommentConfigModal: (state) => state.showCommentConfig,
  showResultBar: (state) => state.showResult,
  showUpdateAccountModal: (state) => state.showUpdateAccount,
  showDeleteAccountModal: (state) => state.showDeleteAccount,
  showAdminUserEditModal: (state) => state.showAdminUserEdit,
};

const mutations = {
  SHOW_CREATE(state) {
    state.showCreateModal = true;
  },
  HIDE_CREATE(state) {
    state.showCreateModal = false;
  },

  SHOW_CONTENT_CONFIG(state, val) {
    state.showContentConfig = val;
  },

  SHOW_RATING(state) {
    state.showRating = true;
  },
  HIDE_RATING(state) {
    state.showRating = false;
  },

  SHOW_LIST(state) {
    state.showList = true;
  },
  HIDE_LIST(state) {
    state.showList = false;
  },

  SHOW_COMMENT_CONFIG(state) {
    state.showCommentConfig = true;
  },
  HIDE_COMMENT_CONFIG(state) {
    state.showCommentConfig = false;
  },

  SHOW_RESULT_BAR(state) {
    state.showResult = true;
  },
  HIDE_RESULT_BAR(state) {
    state.showResult = false;
  },

  SHOW_UPDATE_ACCOUNT(state, val) {
    state.showUpdateAccount = val;
  },

  SHOW_DELETE_ACCOUNT(state, val) {
    state.showDeleteAccount = val;
  },

  SHOW_ADMIN_USER_EDIT(state, val) {
    state.showAdminUserEdit = val;
  },
};

const actions = {};

export default {
  states,
  getters,
  mutations,
  actions,
};
