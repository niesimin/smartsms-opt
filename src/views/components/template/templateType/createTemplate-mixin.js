import { getFormatTimesTamp, setTemplateText } from "@/libs/tools.js";
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
    return { templateText: "", variableGroup: [] };
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
  computed: {
    showCardImg() {
      return function(url) {
        let picurl = url;
        if (url.indexOf("&") != -1) {
          picurl = url.split("&")[0];
        }
        return picurl;
      };
    }
  },
  methods: {
    setTemplate(data) {
      this.formValidate.templateName = data.templateName; //模板名称

      if (this.type == 1) {
        this.formValidate.templateName =
          this.formValidate.templateName + "-副本";
      }

      this.formValidate.params = data.params;
      this.formValidate.templateText = data.templateText;

      this.formValidate.templateTextHtml = setTemplateText(
        data.templateText,
        data.params
      );

      //this.formValidate.templateText = data.templateText; //模板(短信)原文
      if (data.templateType == 1) {
        this.formValidate.singlePicture = data.singlePicture;
        this.formValidate.singlePicture.titleHtml = setTemplateText(
          data.singlePicture.title,
          data.params,
          true
        );
        this.formValidate.singlePicture.introductionHtml = setTemplateText(
          data.singlePicture.introduction,
          data.params,
          true
        );
        this.formValidate.singlePicture.clickAction.urlHtml = setTemplateText(
          data.singlePicture.clickAction.url,
          data.params,
          true
        );
        this.formValidate.singlePicture.clickAction.backupUrlHtml = setTemplateText(
          data.singlePicture.clickAction.backupUrl,
          data.params,
          true
        );

        this.formValidate.singlePicture.button.clickAction.urlHtml = setTemplateText(
          data.singlePicture.button.clickAction.url,
          data.params,
          true
        );

        this.formValidate.singlePicture.button.clickAction.backupUrlHtml = setTemplateText(
          data.singlePicture.button.clickAction.backupUrl,
          data.params,
          true
        );
      } else if (data.templateType == 2) {
        this.formValidate.multiPicture = data.multiPicture;
      } else if (data.templateType == 3) {
        this.formValidate.video = data.video;
        this.formValidate.video.titleHtml = setTemplateText(
          data.video.title,
          data.params,
          true
        );
        this.formValidate.video.clickAction.urlHtml = setTemplateText(
          data.video.clickAction.url,
          data.params,
          true
        );
        this.formValidate.video.introductionHtml = setTemplateText(
          data.video.introduction,
          data.params,
          true
        );
        this.formValidate.video.clickAction.backupUrlHtml = setTemplateText(
          data.video.clickAction.backupUrl,
          data.params,
          true
        );

        this.formValidate.video.button.clickAction.urlHtml = setTemplateText(
          data.video.button.clickAction.url,
          data.params,
          true
        );

        this.formValidate.video.button.clickAction.backupUrlHtml = setTemplateText(
          data.video.button.clickAction.backupUrl,
          data.params,
          true
        );
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
