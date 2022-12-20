import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import { store } from "@/store/store";

import Login from "@/components/LoginView";
import Main from "@/components/MainView";
import User from "@/components/UserView";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      meta: { unauthorized: true },
    },
    {
      path: "/#/main",
      name: "Main",
      component: Main,
    },
    {
      path: "/#/user",
      name: "User",
      component: User,
    },
  ],
});

// router의 NavigationDuplicated에러 무시
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    if (err.name !== "NavigationDuplicated") throw err;
  });
};

export default router;

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.unauthorized)) {
    return next();
  }

  // url 변경이 있을 때마다 쿠키를 refresh
  if (
    VueCookies.get("loginMarker") !== null &&
    VueCookies.get("userId") !== null &&
    VueCookies.get("url") !== null &&
    VueCookies.get("clientCode") !== null
  ) {
    store.commit("refreshMarker");
    return next();
  }

  if (VueCookies.get("loginMarker") === null) {
    alert("로그인마커 정보가 없어요.");
  } else if (VueCookies.get("userId") === null) {
    alert("유저아이디 정보가 없어요.");
  } else if (VueCookies.get("url") === null) {
    alert("유저아이디 정보가 없어요.");
  } else if (VueCookies.get("clientCode") === null) {
    alert("ClientCode 정보가 없어요.");
  }
  await store.commit("removeMarker");
  return next("/");
});
