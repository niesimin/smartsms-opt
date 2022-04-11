import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routers";
import store from "@/store";
import { LoadingBar } from "view-design";
import { getToken, setTitle, canTurnTo } from "@/libs/util";
import config from "@/libs/config";
const { homeName, defaultShowPage } = config;
Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

const LOGIN_PAGE_NAME = "login";

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

router.beforeEach((to, from, next) => {
  LoadingBar.start();
  const token = getToken();

  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页 则跳转到登录页
    next({
      name: LOGIN_PAGE_NAME
    });
  } else if (!token && to.name == LOGIN_PAGE_NAME) {
    //未登录且跳转的页面是登录页 //则直接跳转
    next();
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    //已登录且要跳转的页面是登录页 //则直接跳转至首页
    next({
      name: homeName
    });
  } else {
    if (to.name === homeName && from.path === "/") {
      if (canTurnTo(defaultShowPage, store.getters["app/menuList"])) {
        next({
          name: defaultShowPage
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

router.afterEach(to => {
  setTitle(to, router.app);
  LoadingBar.finish();
});

export default router;
