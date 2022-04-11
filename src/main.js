import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/iview.js";
import "../my-theme/index.less";
import axios from "axios";
import { api } from "@/api";
import { post } from "@/libs/api.request";
import VueParticles from "vue-particles";
import "@/assets/icons/iconfont.css";

import config from "@/libs/config";
Vue.use(VueParticles);

axios.defaults.withCredentials = true; //让ajax携带cookie

/**
 * @ description 全局注册应用配置
 */
Vue.prototype.$axios = axios;
Vue.prototype.$api = api;
Vue.prototype.$post = post;
Vue.prototype.$config = config;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
