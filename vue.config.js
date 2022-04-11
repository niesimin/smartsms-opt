const title = "智能短信管理系统";
module.exports = {
  /**
   * @param {*} name public=>index.html页面注⼊标题 <title><%= webpackConfig.name %></title>
   */
  configureWebpack: {
    name: title
  },
  /**
   * @param {*} publicPath
   * production:生产环境 线上
   * 生产环境默认“/”
   * 开发环境 "/best-practice"
   * 因此当前开发环境url: http://192.168.1.54:8083/mgp-api/api/
   */
  //publicPath: "/sub-opt/opt", // 部署应用包时的基本 URL"/aisms-opt/opt"
  publicPath:
    process.env.NODE_ENV === "development"
      ? "/aisms-opt/opt"
      : "/aisms-opt/admin", // 部署应用包时的基本 URL; /sub-opt/admin要跟应用包发布的基本url一致
  /**
   * @param {*} port 指定端口号
   */
  devServer: {
    port: 8072,
    //public: "192.168.201.80:8072",
    proxy: {
      "/": {
        target: "http://121.14.38.14:40001/", //对应请求到的接口"http://121.14.38.14:18501/mgp-opt/opt", //
        //target: "http://192.168.1.152:8480/", //勇叔
        // target: "http://192.168.201.205:8080/", //林青
        changeOrigin: process.env.NODE_ENV === "development" ? true : false,
        ws: true,
        pathRewrite: {
          "^/": "/"
        }
      }
    }
  },
  productionSourceMap: false //在构建生产环境版本时是否开启source map。
};
