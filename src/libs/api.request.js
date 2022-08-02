import store from "@/store/index";
import router from "@/router";
import HttpRequest from "@/libs/axios";
import qs from "qs";
import { Message, Modal } from "view-design";
import config from "@/libs/config";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
const axios = new HttpRequest(baseUrl);

export const get = (url, param) => {
  return axios.request({
    method: "get",
    url: baseUrl + url,
    params: qs.stringify(param)
  });
};

export const post = (url, parma) => {
  Modal.remove();
  parma.ajax = 1;
  store.commit("user/setSubmitLoading", true);
  return new Promise((resolve, reject) => {
    axios
      .request({
        method: "post",
        url: baseUrl + url,
        data: qs.stringify(parma)
      })
      .then(res => {
        store.commit("user/setSubmitLoading", false);

        if (
          JSON.stringify(res.data) == "{}" ||
          res.data == undefined ||
          res.data.error == 330
        ) {
          store.dispatch("user/handleLoginOut").then(() => {
            router.push({
              name: "login"
            });
          });
        } else {
          if (res.data.error && res.data.error !== 0) {
            Message.warning({
              background: true,
              duration: 4,
              content: res.data.errorMsg,
              onClose() {}
            });
          }
          resolve(res.data);
        }
      })
      .catch(err => {
        store.commit("user/setSubmitLoading", false);
        if (err.response) {
          Message.warning({
            background: true,
            duration: 4,
            content:
              err.response.status && err.response.statusText
                ? err.response.status + ":" + err.response.statusText
                : "请求错误!",
            onClose() {}
          });
          reject(err.response);
        } else {
          if (err == "Error: Network Error" || JSON.stringify(err) == "{}") {
            Message.warning({
              background: true,
              duration: 4,
              content: "登录过期，请重新登录!",
              onClose() {}
            });
            store.dispatch("user/handleLoginOut").then(() => {
              router.push({
                name: "login"
              });
            });
          } else {
            Message.warning({
              background: true,
              duration: 4,
              content: "请求超时!",
              onClose() {}
            });
          }
          console.log("err", err);
          reject();
        }
      });
  });
};
