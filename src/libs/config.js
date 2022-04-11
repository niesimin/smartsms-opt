export default {
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: "home",
  /**
   * @description 默认（登录后打开的homeName页面或手动刷新homeName页面）跳转的路由name值，默认为paperList
   */
  defaultShowPage: "getCompanyList",
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: "智能短信管理系统",
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: process.env.BASE_URL, //'', //
    pro: "http://121.14.38.14:40001/aisms-opt/opt/"
  }
};
