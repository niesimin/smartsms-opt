import { getFormatTimesTamp } from "@/libs/tools.js";
export default {
  props: {
    templateData: {
      type: Object,
      default() {
        return {};
      }
    },
    type: {
      type: Number,
      default: NaN
    }
  },
  data() {
    return {};
  },
  watch: {
    templateData(newValue) {
      if (JSON.stringify(newValue) != "{}") {
        this.setTemplate(newValue);
      }
    },
    formValidate: {
      handler(newVal) {
        this.$emit("getFormValidate", newVal);
      },
      deep: true
    }
  },
  mounted() {
    //加载时提交一次formValidate，父组件mouted时获取并写进store
    this.$emit("getFormValidate", this.formValidate);
  },

  methods: {
    setTemplate(data) {
      this.formValidate.templateName = data.templateName; //模板名称
      if (this.type == 1) {
        this.formValidate.templateName =
          this.formValidate.templateName + "-副本";
      }
      this.formValidate.templateText = data.templateText; //模板(短信)原文

      if (data.templateType == 1) {
        this.formValidate.singlePicture = data.singlePicture;
      } else if (data.templateType == 2) {
        this.formValidate.multiPicture = data.multiPicture;
      } else if (data.templateType == 3) {
        this.formValidate.video = data.video;
      } else if (data.templateType == 4) {
        this.formValidate.window = data.window;
      } else if (data.templateType == 5) {
        this.formValidate.notice = data.notice;
      } else if (data.templateType == 6) {
        this.formValidate.app = data.app;
      } else {
        let coupon = data.coupon;
        coupon.expirationTime = getFormatTimesTamp(coupon.expirationTime);
        this.formValidate.coupon = data.coupon;
      }
    }
  }
};
