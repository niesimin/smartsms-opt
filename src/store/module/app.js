import {
  getMenuByRouter,
  getBreadCrumbList,
  getHomeRoute,
  getTagNavListFromLocalstorage,
  setTagNavListInLocalstorage,
  getRouteTitleHandled,
  routeHasExist,
  routeEqual,
  getNextRoute,
  getTemplateType,
  setTemplateType
} from "@/libs/util";
import router from "@/router";
import routes from "@/router/routers";

const homeName = "home";

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route);
  });

  router.push(nextRoute);
};

export default {
  namespaced: true,
  state: {
    breadCrumbList: [], //面包屑
    homeRoute: {}, //首页路由
    tagNavList: [],
    templateType: getTemplateType(),
    templatePannelData: {}
  },

  getters: {
    menuList: (state, getters, rootState) => {
      return getMenuByRouter(routes, rootState.user.access);
    }
  },

  mutations: {
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTemplateType(state, templateType) {
      state.templateType = templateType;
      setTemplateType(templateType);
    },
    setTagNavList(state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else {
        tagList = getTagNavListFromLocalstorage() || [];
      }
      if (tagList[0] && tagList[0].name != homeName) {
        tagList.shift(); //如果数组第一个元素不是homeName,把数组的第一个元素从其中删除(返回第一个元素的值)，数组改变。
      }
      let homeTagIndex = tagList.findIndex(item => item.name === homeName); //找到第一个homeName的下标，并返回下标
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]; //删除数组下标为homeTagIndex的元素,返回删除元素的数组，[0]取得删除元素
        tagList.unshift(homeTag); //将删除的元素添加到数组起始位置（返回新的数组长度），数组改变
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    addTag(state, { route, type = "unshift" }) {
      let router = getRouteTitleHandled(route);
      //判断打开的标签列表里是否已存在这个新添加的路由对象
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === "push") {
          state.tagNavList.push(router);
        } else {
          if (router.name === homeName) {
            state.tagNavList.unshift(router);
          } else {
            state.tagNavList.splice(1, 0, router);
          }
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      closePage(state, route);
    },
    setTemplatePannelData(state, data) {
      state.templatePannelData = data;
    }
  },

  actions: {}
};
