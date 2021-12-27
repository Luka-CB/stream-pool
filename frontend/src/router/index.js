import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Movies from "../views/Movies";
import Tvs from "../views/Tvs";
import Details from "../views/Details";
import Signin from "../views/Signin";
import Signup from "../views/Signup";
import Profile from "../views/Profile";
import ResultPage from "../views/SearchResultPage";
import ListDetails from "../views/ListDetails";
import RegisteredUsers from "../views/RegisteredUsers";
import UserRatedContent from "../views/UserRatedContent";
import NotFound from "../views/404";

// // Auth Guard
const user = JSON.parse(localStorage.getItem("userInfo"));

const isAuth = (to, from, next) => {
  if (user) {
    next({ name: "Home" });
  } else {
    next();
  }
};

const noAuth = (to, from, next) => {
  if (!user) {
    next({ name: "NotFound" });
  }
  next();
};

const isAdmin = (to, from, next) => {
  if (user && user.isAdmin) {
    next();
  } else {
    next({ name: "NotFound" });
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/movies",
    name: "Movies",
    component: Movies,
  },
  {
    path: "/tvs",
    name: "Tvs",
    component: Tvs,
  },
  {
    path: "/:type/:id",
    name: "Details",
    component: Details,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
    beforeEnter: isAuth,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    beforeEnter: isAuth,
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: Profile,
    beforeEnter: noAuth,
  },
  {
    path: "/profile/:id/ratings",
    name: "UserRatedContent",
    component: UserRatedContent,
    beforeEnter: noAuth,
  },
  {
    path: "/list/:id",
    name: "ListDetails",
    component: ListDetails,
  },
  {
    path: "/result/:query?",
    name: "SearchResult",
    component: ResultPage,
  },
  {
    path: "/admin/users",
    name: "RegisteredUsers",
    component: RegisteredUsers,
    beforeEnter: isAdmin,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
