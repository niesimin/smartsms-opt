// import Home from "../views/Home.vue";
import Main from "@/components/main/main.vue";

/**
 * iview-admin中meta除了原生参数外壳配置的参数
 * meta:{
 *  title:{String|Number|Function}
 *          显示在侧边栏、面包屑和标签栏文字
 *          可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread:(false) 设为true以后此级路由将不会出现在面包屑中
 *  hideInMenu:(false) 设置为true后在左侧菜单不会显示该页面选项
 *  notCache:(false)设为true后面在切换标签后不会缓存，如果需要缓存，无需设置该字段，而且需要设置页面组件name属性和路由配置name一样
 *  access:(null)可访问该页面的权限数组，当前路由设置的权限会影响子路由
 * icon:(-)该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: "/",
    name: "main",
    redirect: "/home",
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          hideInMenu: true,
          title: "首页",
          notCache: true,
          icon: "md-home"
        },
        component: () => import("@/views/single-page/home/home.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true
    },
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/company",
    name: "company",
    meta: {
      icon: "_weixin",
      title: "公众号管理"
    },
    component: Main,
    children: [
      {
        path: "getCompanyList",
        name: "getCompanyList",
        meta: {
          icon: "_weixin",
          title: "公众号中心" //
        },
        component: () =>
          import("../views/components/company/getCompanyList.vue")
      }
    ]
  },
  {
    path: "/template",
    name: "template",
    meta: {
      icon: "_rule",
      title: "模板管理"
    },
    component: Main,
    children: [
      {
        path: "getTemplateList",
        name: "getTemplateList",
        meta: {
          icon: "md-grid",
          title: "模版列表", //
          notCache: true
        },
        component: () =>
          import("../views/components/template/getTemplateList.vue")
      },
      {
        path: "createTemplate",
        name: "createTemplate",
        meta: {
          hideInMenu: true,
          icon: "md-flower",
          title: route =>
            route.query.type == 2
              ? "编辑模版"
              : route.query.type == 3
              ? "模板详情"
              : route.query.type == 1
              ? "复制模板"
              : "添加模版",
          notCache: true
        },
        component: () =>
          import("../views/components/template/createTemplate.vue")
      }
    ]
  },

  {
    path: "/rule",
    name: "rule",
    meta: {
      icon: "md-jet",
      title: "投放管理",
      notCache: true
    },
    component: Main,
    children: [
      {
        path: "getRuleList",
        name: "getRuleList",
        meta: {
          icon: "md-jet",
          title: "投放管理" //
        },
        component: () => import("../views/components/rule/getRuleList.vue")
      },
      {
        path: "editRule",
        name: "editRule",
        meta: {
          hideInMenu: true,
          icon: "md-jet",
          title: route =>
            route.query.action == "add"
              ? "添加投放规则"
              : route.query.action == "detail"
              ? "规则详情"
              : "编辑投放规则",
          notCache: true
        },
        component: () => import("../views/components/rule/editRule.vue")
      }
    ]
  },
  {
    path: "/statistics",
    name: "statistics",
    meta: {
      icon: "md-podium",
      title: "数据管理"
    },
    component: Main,
    children: [
      {
        path: "getStatistics",
        name: "getStatistics",
        meta: {
          icon: "md-podium",
          title: "数据统计" //
        },
        component: () =>
          import("../views/components/statistics/getStatistics.vue")
      }
    ]
  },
  {
    path: "/url",
    name: "url",
    meta: {
      icon: "md-planet",
      title: "域名管理"
    },
    component: Main,
    children: [
      {
        path: "getUrlList",
        name: "getUrlList",
        meta: {
          icon: "md-checkbox-outline",
          title: "域名报备" //
        },
        component: () => import("../views/components/domain/getUrlList.vue")
      },
      {
        path: "getShortUrlList",
        name: "getShortUrlList",
        meta: {
          icon: "md-link",
          title: "短链列表" //
        },
        component: () =>
          import("../views/components/domain/getShortUrlList.vue")
      }
    ]
  },

  // {
  //   path: "/com",
  //   name: "com",
  //   meta: {
  //     icon: "md-git-branch",
  //     title: "渠道类别管理"
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: "subscribeCategoryList",
  //       name: "subscribeCategoryList",
  //       meta: {
  //         icon: "md-git-branch",
  //         title: "订购类别" //
  //       },
  //       component: () =>
  //         import("../views/components/com/subscribeCategoryList.vue")
  //     },
  //     {
  //       path: "subscribeCategoryChannelList",
  //       name: "subscribeCategoryChannelList",
  //       meta: {
  //         hideInMenu: true,
  //         icon: "md-flower",
  //         title: route => `${route.query.serviceName}-添加渠道`,
  //         notCache: true
  //       },
  //       component: () =>
  //         import("../views/components/com/subscribeCategoryChannelList.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/woo",
  //   name: "woo",
  //   meta: {
  //     icon: "md-cart",
  //     title: "小沃学堂"
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: "subscribeList",
  //       name: "subscribeList",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "订购列表" //
  //       },
  //       component: () => import("../views/components/woo/subscribeList.vue")
  //     },
  //     {
  //       path: "wooSubscribeRightList",
  //       name: "wooSubscribeRightList",
  //       meta: {
  //         icon: "md-medal",
  //         title: "权益发放" //wooSubscribeRightList
  //       },
  //       component: () =>
  //         import("../views/components/woo/wooSubscribeRightList.vue")
  //     },
  //     {
  //       path: "userList",
  //       name: "userList",
  //       meta: {
  //         icon: "md-people",
  //         title: "小沃用户列表" //
  //       },
  //       component: () => import("../views/components/woo/userList.vue")
  //     },
  //     {
  //       path: "userOrderList",
  //       name: "userOrderList",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "小沃订单列表" //
  //       },
  //       component: () => import("../views/components/woo/userOrderList.vue")
  //     },
  //     {
  //       path: "phoneFetchList",
  //       name: "phoneFetchList",
  //       meta: {
  //         icon: "ios-pie",
  //         title: "取号打点" //
  //       },
  //       component: () => import("../views/components/woo/phoneFetchList.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/data",
  //   name: "data",
  //   meta: {
  //     icon: "md-analytics",
  //     title: "报表管理"
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: "pageStatistics",
  //       name: "pageStatistics",
  //       meta: {
  //         icon: "ios-pie",
  //         title: "小沃页面统计" //
  //       },
  //       component: () => import("../views/components/report/pageStatistics.vue")
  //     },
  //     {
  //       path: "pageStatisticsCommon",
  //       name: "pageStatisticsCommon",
  //       meta: {
  //         icon: "md-map",
  //         title: "公共页面统计" //
  //       },
  //       component: () =>
  //         import("../views/components/report/pageStatisticsCommon.vue")
  //     },
  //     {
  //       path: "andOrderStatistics",
  //       name: "andOrderStatistics",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "和教育统计列表" //
  //       },
  //       component: () =>
  //         import("../views/components/report/andOrderStatistics.vue")
  //     }
  //   ]
  // },

  // {
  //   path: "/andUser",
  //   name: "andUser",
  //   meta: {
  //     icon: "md-person",
  //     title: "和教育"
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: "andUserList",
  //       name: "andUserList",
  //       meta: {
  //         icon: "md-people",
  //         title: "和教育用户列表" //
  //       },
  //       component: () => import("../views/components/andUser/andUserList.vue")
  //     },
  //     {
  //       path: "andUserOrderList",
  //       name: "andUserOrderList",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "和教育订单列表" //
  //       },
  //       component: () =>
  //         import("../views/components/andUser/andUserOrderList.vue")
  //     },
  //     {
  //       path: "andSubscribeList",
  //       name: "andSubscribeList",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "和教育订购列表" //
  //       },
  //       component: () =>
  //         import("../views/components/andUser/andSubscribeList.vue")
  //     },
  //     {
  //       path: "andSyncChannelList",
  //       name: "andSyncChannelList",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "和教育同步列表" //
  //       },
  //       component: () =>
  //         import("../views/components/andUser/andSyncChannelList.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/client",
  //   name: "client",
  //   meta: {
  //     icon: "md-cart",
  //     title: "客服查询"
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: "getRightList",
  //       name: "getRightList",
  //       meta: {
  //         icon: "md-medal",
  //         title: "权益发放" //wooSubscribeRightList
  //       },
  //       component: () => import("../views/components/client/getRightList.vue")
  //     },

  //     {
  //       path: "getOrderList",
  //       name: "getOrderList",
  //       meta: {
  //         icon: "md-reorder",
  //         title: "订单列表" //
  //       },
  //       component: () => import("../views/components/client/getOrderList.vue")
  //     }
  //   ]
  // },
  {
    path: "/system",
    name: "system",
    meta: {
      icon: "md-settings",
      title: "系统管理"
    },
    component: Main,
    children: [
      {
        path: "adminLists",
        name: "adminLists",
        meta: {
          icon: "md-person-add",
          title: "管理员信息" //
        },
        component: () => import("../views/components/system/user.vue")
      },
      {
        path: "passwdModify",
        name: "passwdModify",
        meta: {
          icon: "_editPassword",
          title: "修改密码" //
        },
        component: () => import("../views/components/system/editPassword.vue")
      }
    ]
  }
];
