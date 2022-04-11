import avatar from "@/assets/images/avater.png";
import { api } from "@/api";
import { post } from "@/libs/api.request";

import {
  getToken,
  setToken,
  setAccess,
  getAccess,
  getConstStore,
  setConstStore,
  getSubmitLoading,
  setSubmitLoading
} from "@/libs/util";

export default {
  namespaced: true,
  state: {
    access: getAccess(),
    avatarImgPath: avatar,
    token: getToken(), //接口没有返回token，本项目将用户名默认为token保存
    constStore: getConstStore(),
    submitLoading: getSubmitLoading()
  },

  mutations: {
    //   头像
    setAvatar(state, avatarPath) {
      state.avatarImgPath = avatarPath;
    },

    // 设置token并写入缓存
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },

    // 设置constStore并写入缓存
    setConstStore(state, constStore) {
      state.constStore = constStore;
      setConstStore(constStore);
    },

    /**
     * 权限
     */
    setAccess(state, access) {
      state.access = access;
      setAccess(access);
    },
    // 设置submitLoading并写入缓存
    setSubmitLoading(state, submitLoading) {
      state.submitLoading = submitLoading;
      setSubmitLoading(submitLoading);
    }
  },

  actions: {
    // 登录
    handleLogin({ commit }, { userName, userPasswd }) {
      userName = userName.trim();
      return new Promise(resolve => {
        post(api.login, { userName, userPasswd }).then(res => {
          if (res.error == 0) {
            commit("setToken", userName);
            let privileges =
              process.env.NODE_ENV === "development" ? "" : res.privileges;
            commit(
              "setAccess",
              res.privileges && res.privileges instanceof Array
                ? privileges
                : ""
            );
            post(api.getTypeList, {}).then(res => {
              if (res.error == 0) {
                commit("setConstStore", res.data);
              }
            });
            resolve();
          }
        });
      });
    },

    // 退出登录
    handleLoginOut({ state, commit }) {
      return new Promise(resolve => {
        state.token = "";
        commit("setToken", "");
        commit("setAccess", []);
        commit("setSubmitLoading", false);
        localStorage.clear();
        resolve();
      });
    }
  }
};
