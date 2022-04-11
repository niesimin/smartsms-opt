export const TOKEN_KEY = "token";
import { hasOneOf, forEach, objEqual } from "./tools.js";
import config from "./config.js";
import { Message } from "view-design";

/**
 * @ description 获取submitLoading
 */
export const getSubmitLoading = () => {
  const submitLoading = localStorage.getItem("submitLoading");
  let str = "true";
  if (submitLoading && submitLoading == str) {
    return true;
  } else {
    return false;
  }
};

/**
 * @ description 保存submitLoading
 */
export const setSubmitLoading = submitLoading => {
  localStorage.setItem("submitLoading", submitLoading);
};
/**
 * @ description 获取token
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    return token;
  } else {
    return null;
  }
};

/**
 * @ description 保存token
 */
export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getTemplateType = () => {
  const templateType = localStorage.getItem("templateType");
  if (templateType) {
    return templateType;
  } else {
    return null;
  }
};

export const setTemplateType = templateType => {
  localStorage.setItem("templateType", templateType);
};

/**
 * @ description 保存setAccess
 */
export const setAccess = access => {
  localStorage.setItem("access", JSON.stringify(access));
};

/**
 * @ description 获取Access
 */
export const getAccess = () => {
  const access = JSON.parse(localStorage.getItem("access"));
  if (access) {
    return access;
  } else {
    return "";
  }
};

/**
 * @ description 保存constStore code = null, type = null
 */
export const getConstStore = () => {
  const constStore = JSON.parse(localStorage.getItem("constStore"));
  return constStore;
};

/**
 * @ description 保存constStore
 */
export const setConstStore = constStore => {
  let sconstStore = constStore instanceof Object ? constStore : null;
  localStorage.setItem("constStore", JSON.stringify(sconstStore));
};

export const remoteKeyFactory = {
  getValue(data, did, vbool) {
    if (!data) return;
    for (var i = 0; i < data.length; i++) {
      if (data[i].did == did) {
        if (vbool)
          return (
            '<i style="font-style:normal; color:' +
            data[i].cr +
            '">' +
            data[i].dv +
            "</i>"
          );
        else return data[i].dv;
      }
    }

    return null;
  },

  getColor(data, did) {
    if (!data) return;
    for (var i = 0; i < data.length; i++) {
      if (data[i].did == did && data[i].cr) {
        return data[i].cr;
      }
    }
  },

  getConstStore(code, type) {
    const constStore = getConstStore();
    let typeData = [];
    if (constStore && constStore[code]) {
      constStore[code].filter(item => {
        let typeParma = {};
        typeParma.did = item.value;
        typeParma.dv = item.name;
        if (item.color) {
          typeParma.cr = item.color;
        }
        typeData.push(typeParma);
      });
    }

    if (type) typeData.unshift({ did: "null", dv: "全部" });
    return typeData;
  }
};

export const getKeyConstStore = (code, type) => {
  const constStore = getConstStore();

  let typeData = [];
  constStore[code].filter(item => {
    let typeParma = {};
    typeParma.did = item.value;
    typeParma.dv = item.name;
    typeData.push(typeParma);
  });
  if (type) typeData.unshift({ did: "null", dv: "全部" });
  return typeData;
};

export const getKeyValue = (data, did, vbool) => {
  if (!data) return;

  for (var i = 0; i < data.length; i++) {
    if (data[i].did == did) {
      if (vbool)
        return (
          '<i style="font-style:normal; color:' +
          data[i].cr +
          '">' +
          data[i].dv +
          "</i>"
        );
      else return data[i].dv;
    }
  }

  return null;
};

/**
 * 权限
 * @ param {*} name 即将跳转的路由name
 * @ param {*} access 用户权限数组
 * @ param {*} routes 路由列表
 * @ description 用户是否可以跳转到该页
 */
export const canTurnTo = (name, access) => {
  const routePermissionJudge = list => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children);
      } else if (item.name === name) {
        return true;
      }
    });
  };

  return routePermissionJudge(access);
};
// export const canTurnTo = (name, access, routes) => {
//   const routePermissionJudge = list => {
//     return list.some(item => {
//       if (item.children && item.children.length) {
//         return routePermissionJudge(item.children);
//       } else if (item.name === name) {
//         return hasAccess(access, item);
//       }
//     });
//   };

//   return routePermissionJudge(routes);
// };

/**
 * @ param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @ param {*} route 路由列表
 */
// const hasAccess = (access, route) => {
//   if (route.meta && route.meta.access) {
//     //判断当前路由meta中access（权限数组）是否至少有一个元素包含在权限数组中
//     return hasOneOf(access, route.meta.access);
//   } else {
//     return true;
//   }
// };

export const hasChild = item => {
  return item.children && item.children.length !== 0;
};

const hasSame = (name, access) => {
  let results = access.find(item => {
    if (item.moduleName == name) {
      if (item.moduleShow) {
        return item;
      }
    } else {
      if (item.moduleSub && item.moduleSub.length != 0) {
        return item.moduleSub.find(subitem => {
          return subitem.moduleName == name && subitem.moduleShow;
        });
      }
    }
  });
  return results;
};

const showThisMenuEle = (item, access) => {
  if (access instanceof Array) {
    return accessshowThisMenuEle(item, access);
  } else {
    return noAccessshowThisMenuEle(item, access);
  }
};

const accessshowThisMenuEle = (item, access) => {
  if (item.name && hasSame(item.name, access)) {
    return true;
  } else {
    return false;
  }
};

const noAccessshowThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true;
    else return false;
  } else return true;
};

/**
 *@ param {Array} list 通过路由列表得到的菜单列表
 *@ returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = [];
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: item.meta
      };

      if (
        (hasChild(item) || (item.meta && item.meta.showAlways)) &&
        showThisMenuEle(item, access)
      ) {
        obj.children = getMenuByRouter(item.children, access);
      }

      if (item.meta && item.meta.href) {
        obj.href = item.meta.href;
      }

      if (showThisMenuEle(item, access)) {
        res.push(obj);
      }
    }
  });
  return res;
};

export const getRouteTitleHandled = route => {
  let router = { ...route };
  let meta = { ...route.meta };
  let title = "";
  if (meta.title) {
    if (typeof meta.title === "function") {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

export const showTitle = item => {
  let { title } = item.meta;
  if (!title) {
    return;
  } else {
    title = (item.meta && item.meta.title) || item.name;
    return title;
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode;
  if (parentNode) {
    let classList = parentNode.classList;
    if (
      classList &&
      classes.every(className => classList.contains(className))
    ) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

/**
 * @ param {*} list 现有标签导航列表
 * @ param {*} newRoute 新添加的路由原信息对象
 * @ description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute;
  let newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else newList.push({ name, path, meta });
  return newList;
};

/**
 * @ param {Array} route 当前路由列表
 * @ returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon };
  let routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name)) {
    return [homeItem];
  }

  let res = routeMetched
    .filter(item => {
      return item.meta === undefined || !item.meta.hideInBread;
    })
    .map(item => {
      let meta = { ...item.meta };
      if (meta.title && typeof meta.title === "function") {
        meta.__titleIsFunction__ = true;
        meta.title = meta.title(route);
      }
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: meta
      };
      return obj;
    });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  return [{ ...homeItem, to: homeRoute.path }, ...res];
};

/**
 * @ parma {Array} routers 路由列表数组
 * @ description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = "home") => {
  let i = -1;
  let len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    let item = routers[i];
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName);
      if (res.name) return res;
    } else {
      if (item.name === homeName) homeRoute = item;
    }
  }
  return homeRoute;
};

/**
 * @ description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list);
};

/**
 * @ returns {Array} 其中的每个元素质保函路由原信息中的name,path,meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};

/**
 * @ parma {*} tagNavList 标签列表
 * @ parma {*} routeItem 当前路由对象
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length;
  let res = false;
  doCustomTimes(len, index => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

/**
 * @param {*} times 回调函数需要执行的次数
 * @param {*} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @ description 根据name/params/query判断两个路由对象是否相等
 * @ param {*} route1 路由对象
 * @ param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (
    route1.name === route2.name &&
    objEqual(params1, params2) &&
    objEqual(query1, query2)
  );
};

/**
 * @ param {*} list 标签列表
 * @ param {*} route 当前关闭的标签的
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list);
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @ description 根据当前跳转的路由设置显示在浏览器标签的title
 * @ param {Object} routeItem 路由对象
 * @ param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem);
  const pageTitle = showTitle(handledRoute, vm);
  const resTitle = pageTitle ? `${pageTitle}-${config.title}` : config.title;
  window.document.title = resTitle;
};

/**
 *
 * @ param {*} downdata 需要下载的数据
 * @ param {*} downurl 下载的路径
 * @ param {*} downparma 参数
 */
export const downLoadData = (downdata, downurl, downparma) => {
  if (downdata == null || downdata.length == 0) {
    Message.warning("暂无导出数据!");
    return;
  }
  var phtml = "";
  var parma = null;
  parma = downparma;
  for (var i in parma) {
    if (parma[i] && i != "ajax" && i != "page" && i != "recPerPage") {
      phtml += i + "=" + parma[i] + "&";
    }
  }
  phtml = "?" + phtml.substring(0, phtml.length - 1);
  window.location.href = downurl + phtml;
};
