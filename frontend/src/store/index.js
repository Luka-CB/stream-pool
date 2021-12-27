import { createStore } from "vuex";
import contents from "./modules/content";
import auth from "./modules/auth";
import states from "./modules/states";
import rating from "./modules/rating";
import list from "./modules/list";
import listItem from "./modules/listItem";
import comment from "./modules/comment";

export default createStore({
  modules: {
    auth,
    contents,
    states,
    rating,
    list,
    listItem,
    comment,
  },
});
