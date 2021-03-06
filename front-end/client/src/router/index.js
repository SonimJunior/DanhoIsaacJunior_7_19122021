import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignUp.vue"),
  },
  {
    path: "/main",
    name: "Main",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Main.vue"),
  },
  {
    path: "/userInfos",
    name: "UserInfos",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserInfos.vue"),
  },
  {
    path: "/team",
    name: "Team",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Team.vue"),
  },
  {
    path: "/profil/:userId",
    name: "ProfileUser",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProfileUser.vue"),
  },
  {
    path: "/modification/:postId",
    name: "Modification",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Modification.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
