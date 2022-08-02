import { String } from "core-js";

/**
 * @ param {Array} target 目标数组
 * @ param {Array} arr 需要查询的数组
 * @ description 判断查询数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

export const hasNameOneOf = (name, arr) => {
  let flags = arr.find(item => {
    return name == item.name;
  });
  return flags;
};

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return;
  let i = -1;
  let len = arr.length;
  while (++i < len) {
    let item = arr[i];
    fn(item, i, arr);
  }
};

export const toThousandsAccount = num => {
  if (!num && num != 0) {
    return;
  }
  let val = Number(num);
  return (val + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
};

/**
 * @ param {Array} arr1
 * @ param {Array} arr2
 * @ description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

export const toThousands = num => {
  let val = Number(num);
  return (val.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
};

export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */ else
    return !keysArr1.some(key => obj1[key] != obj2[key]);
};

export const validates = {
  noChinese: (rule, value, callback) => {
    if (value === "") {
      callback(new Error("输入不能为空"));
    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error("不能输入中文"));
    } else {
      callback();
    }
  },
  integer: (rule, value, callback) => {
    if (!/^\d+$/.test(value)) {
      callback(new Error("请输入正整数"));
    } else {
      callback();
    }
  },
  isphones: (rule, value, callback) => {
    if (
      !/^(\d{3,4}-\d{7,8}(-\d{3,4})?)$|(^0?[1][3456789][0-9]{9}$)/.test(value)
    ) {
      callback(new Error("请输入正确手机号码或者固定电话(如020-00000000)"));
    } else {
      callback();
    }
  },
  isDiscount: (rule, value, callback) => {
    if (!/^(?:([1-9]|[1-9][0-9]|[1][0][0]))$/.test(value)) {
      callback(new Error("请输入1—100之间的正整数"));
    } else {
      callback();
    }
  },
  isRealmName: (rule, value, callback) => {
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
        value
      ) &&
      !/^(http:\/\/|^https:\/\/|^\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(value)
    ) {
      callback(new Error("请输入正确格式域名"));
    } else {
      callback();
    }
  },
  // isDiscount: (rule, value, callback) => {
  //   if (
  //     !/^(?:([0-9]|[1-9][0-9]|[1][0][0])(?:\.([0-9]{1}|[0-9]{2}))?|[1][0][0]|100.0|100.00)$/.test(
  //       value
  //     )
  //   ) {
  //     callback(new Error("折扣比例在0.00—100.00之间"));
  //   } else {
  //     callback();
  //   }
  // },
  isLink: (rule, value, callback) => {
    if (!/^(http:\/\/|^https:\/\/|^\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(value)) {
      callback(new Error("请输入'http:// 或 https://'开头的合法地址"));
    } else {
      callback();
    }
  },
  isPrice: (rule, value, callback) => {
    if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/.test(value)) {
      callback(new Error("请输入价格必须为合法数字(正数，最多两位小数)"));
    } else {
      callback();
    }
  }
};

//时间戳转为日期(年-月-日 时:分:秒)
export const getFormatTimesTamp = tamp => {
  if (!tamp) {
    return "-";
  }
  let val = Number(tamp);
  if (val > 2554431132000 || val == 0 || val == undefined) return "-";

  let date = new Date(val);

  return zeroPadd(date);
};

//日期转为时间戳
export const getDateTimesTamp = date => {
  if (date && typeof date == String) {
    date = date.substring(0, 19);
    date = date.replace(/-/g, "/");
  }
  let ndate;
  if (date) {
    ndate = new Date(date);
  } else {
    ndate = new Date();
  }

  return ndate.getTime();
};

export const zeroPadd = date => {
  let seperator1 = "-";
  let seperator2 = ":";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let hours = date.getHours();
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }

  let min = date.getMinutes();
  if (min >= 0 && min <= 9) {
    min = "0" + min;
  }
  let seconds = date.getSeconds();
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  let currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    hours +
    seperator2 +
    min +
    seperator2 +
    seconds;
  return currentdate;
};

export const nHourLater = (n = 1) => {
  let date = new Date();
  let date1 = new Date().getTime(); //获取当前时间戳
  date.setTime(date1 + n * 60 * 60 * 1000); //当前时间戳+n*60*60
  return zeroPadd(date);
};

//时间戳转为日期(年-月-日)
export const getFormatDateTamp = tamp => {
  let val = null;
  if (tamp) {
    val = Number(tamp);
  } else {
    val = new Date().getTime();
  }
  if (val > 2554431132000 || val == 0) return "-";

  var date = new Date(val);
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  var currentdate =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
};

//时间戳转为日期(年-月-日 星期 时-分)
export const getFormatWeekTamp = tamp => {
  let val = null;
  if (tamp) {
    val = Number(tamp);
  } else {
    val = new Date().getTime();
  }

  if (val > 2554431132000 || val == 0 || val == undefined) return "-";

  let date = new Date(val);

  let Week = getWeek(date);
  let dateTime = zeroPadd(date);
  let year = dateTime.split(" ")[0];
  let hm =
    dateTime.split(" ")[1].split(":")[0] +
    ":" +
    dateTime.split(" ")[1].split(":")[1];

  return year + " " + Week + " " + hm;
};

export const getWeek = date => {
  let week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  let day = date.getDay();
  return week[day];
};

export const keyFactory = {
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
    var d = [];
    switch (code) {
      case 1:
        d = [
          { did: 1, dv: "男", cr: "red" },
          { did: 2, dv: "女", cr: "green" }
        ];
        break;
      case 2:
        d = [
          { did: "false", dv: "停用", cr: "red" },
          { did: "true", dv: "启用", cr: "green" }
        ];
        break;
      case 3:
        d = [{ did: 1, dv: "小沃视频包月" }];
        break;
      case 4:
        d = [
          { did: 0, dv: "失败", cr: "red" },
          { did: 1, dv: "成功", cr: "green" }
        ];
        break;
      case 5:
        d = [
          { did: "true", dv: "是", cr: "green" },
          { did: "false", dv: "否", cr: "red" }
        ];
        break;
      case 6:
        d = [
          { did: 0, dv: "待审核", cr: "blue" },
          { did: 1, dv: "已通过", cr: "green" },
          { did: 2, dv: "未通过", cr: "magenta" },
          { did: 3, dv: "已过期", cr: "default" }
        ];
        break;
      case 7:
        d = [
          { did: 1, dv: "银行" },
          { did: 2, dv: "金融" },
          { did: 3, dv: "互联网" },
          { did: 4, dv: "电商" },
          { did: 5, dv: "运营商" },
          { did: 6, dv: "快递" },
          { did: 7, dv: "保险" },
          { did: 8, dv: "教育" },
          { did: 9, dv: "其他" }
        ];
        break;
      case 8:
        d = [
          { did: 0, dv: "URL" },
          { did: 1, dv: "特征值" }
        ];
        break;
      case 9:
        d = [
          { did: 0, dv: "待审核", cr: "blue" },
          { did: 1, dv: "已通过", cr: "green" },
          { did: 2, dv: "未通过", cr: "magenta" },
          { did: 12, dv: "已过期", cr: "default" }
        ];
        break;
      case 10:
        d = [
          { did: 0, dv: "完全匹配" },
          { did: 1, dv: "前缀匹配" }
        ];
        break;
      case 11:
        d = [
          {
            did: 1,
            dv: "单图",
            cn: [
              {
                did: 1,
                dv: "OPPO"
              },
              {
                did: 2,
                dv: "VIVO"
              },
              {
                did: 3,
                dv: "小米"
              }
            ]
          },
          {
            did: 2,
            dv: "多图",
            cn: [
              {
                did: 2,
                dv: "VIVO"
              },
              {
                did: 3,
                dv: "小米"
              }
            ]
          },
          {
            did: 3,
            dv: "视频",
            cn: [
              {
                did: 1,
                dv: "OPPO"
              }
            ]
          },
          {
            did: 4,
            dv: "橱窗",
            cn: [
              {
                did: 1,
                dv: "OPPO"
              }
            ]
          },
          {
            did: 5,
            dv: "通知",
            cn: [
              {
                did: 3,
                dv: "小米"
              }
            ]
          },
          {
            did: 6,
            dv: "应用下载",
            cn: [
              {
                did: 2,
                dv: "VIVO"
              }
            ]
          },
          {
            did: 7,
            dv: "优惠券",
            cn: [
              {
                did: 2,
                dv: "VIVO"
              }
            ]
          }
        ];
        break;
      case 12:
        d = [
          { did: "0", dv: "打开H5" },
          { did: "1", dv: "打开APP" },
          { did: "2", dv: "快应用" }
        ];
        break;
      case 13:
        d = [
          { did: 0, dv: "完全匹配" },
          { did: 1, dv: "前缀匹配" }
        ];
        break;
      case 14:
        d = [
          { did: 0, dv: "手动输入" },
          { did: 1, dv: "上传文件" }
        ];
        break;
      case 15:
        d = [
          { did: "1", dv: "是", cr: "green" },
          { did: "0", dv: "否", cr: "red" }
        ];
        break;
      case 16:
        d = [
          { did: 1, dv: "泰迪熊短链" },
          { did: 2, dv: "域名报备" }
        ];
        break;
      default:
        break;
    }
    if (type) d.unshift({ did: "null", dv: "全部" });
    return d;
  }
};

export const image2Base64 = img => {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL;
};

export const setTemplateText = (txt, ary, allReplace = false) => {
  let thml = txt;
  if (ary && ary.length > 0 && ary instanceof Array) {
    ary.filter((item, idx) => {
      let num = idx + 1;
      let itemName = "ted_group" + num;
      let itemVal = item[itemName];
      let regx = "{" + itemVal + "}";
      let selectHtml = '<span contenteditable="false">&#xFEFF<span class="variable" contenteditable="false">'.concat(
        item[itemName],
        '<i class="ivu-icon ivu-icon-md-close"></i></span>&#xFEFF</span>'
      );

      if (thml.indexOf(regx) != -1) {
        regx = !allReplace ? regx : new RegExp("\\" + regx, "g");
        allReplace && console.log(regx);
        thml = thml.replace(regx, selectHtml);
      }
    });
  }

  return thml;
};
