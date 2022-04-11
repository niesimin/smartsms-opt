export const api = {
  getTypeList: "type/getTypeList",
  login: "login", //登录,
  upload: "files/upload",
  uploadFile: "files/uploadFile",
  company: {
    getCompanyList: "company/getCompanyList", //公众号列表
    saveCompany: "company/saveCompany", //添加公众号列表
    updateCompany: "company/updateCompany", //编辑公众号列表
    deleteCompany: "company/deleteCompany", //删除公众号列表
    getCompanyAll: "company/getCompanyAll" //获取全部公众号
  },
  url: {
    getUrlList: "url/getUrlList", //获取域名列表
    saveUrl: "url/saveUrl", //添加域名
    updateUrl: "url/updateUrl", //编辑域名
    deleteUrl: "url/deleteUrl", //删除域名
    getShortUrlList: "url/getShortUrlList", //短链列表
    getShortUrlAll: "url/getShortUrlAll", //获取全部短链
    saveShortUrl: "url/saveShortUrl", //添加短链
    deleteShortUrl: "url/deleteShortUrl", //删除短链
    getUrlTemplate: "url/getUrlTemplate" //获取关联模板
  },
  template: {
    getTemplateAll: "template/getTemplateAll", //获取全部模板
    saveTemplate: "template/saveTemplate", //新增模板
    getTemplateList: "template/getTemplateList", //模板列表
    getTemplate: "template/getTemplate", //根据id获取模板
    updateTemplate: "template/updateTemplate", //编辑模板
    deleteTemplate: "template/deleteTemplate" //删除模板
  },
  rule: {
    getRuleList: "rule/getRuleList", //获取规则列表
    saveRule: "rule/saveRule", //添加规则
    updateRule: "rule/updateRule", //编辑规则
    deleteRule: "rule/deleteRule", //删除规则
    updateAuditStatusRule: "rule/updateAuditStatusRule", //上线/下线规则
    getRule: "rule/getRule" //根据id查找规则
  },
  statistics: {
    getStatistics: "statistics/getStatistics" //获取规则列表
  },
  system: {
    adminLists: "system/adminLists", // 管理员列表
    adminDelete: "system/adminDelete", // 管理员删除
    adminAdd: "system/adminAdd", // 添加管理员
    passwdSet: "system/passwdSet", // 修改管理员密码
    adminStatus: "system/adminStatus", // 状态切换
    permission: "system/permission", // 权限列表
    permissionSet: "system/permissionSet", // 权限设置
    adminType: "system/adminType", //查找管理员角色
    passwdModify: "system/passwdModify",
    getAdminAllLists: "system/getAdminAllLists" //获取管理员无分页
  },
  data: {
    pageStatistics: "data/pageStatistics",
    downloadPageStatistics: "data/downloadPageStatistics",
    pageStatisticsCommon: "data/pageStatisticsCommon",
    downloadPageStatisticsCommon: "data/downloadPageStatisticsCommon",
    andOrderStatistics: "data/andOrderStatistics", //和教育统计列表
    downloadAndOrderStatistics: "data/downloadAndOrderStatistics" //和教育统计列表导出
  },
  client: {
    getOrderList: "client/getOrderList",
    getRightList: "client/getRightList",
    downloadGetOrder: "client/downloadGetOrder"
  }
};
