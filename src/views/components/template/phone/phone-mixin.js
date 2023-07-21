import { getFormatWeekTamp } from "@/libs/tools.js";
import banner from "@/assets/images/banner.png";
export default {
  props: {
    vendor: {
      type: Number,
      default: NaN
    },
    showOriginal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      getFormatWeekTamp,
      banner,
      showOriginalText: true
    };
  },

  computed: {
    //从store中获取templatePannelData
    phoneData() {
      return this.$store.state.app.templatePannelData;
    },
    matchBrace() {
      return txt => {
        let newtxt = txt;
        return newtxt.replace(/{|}/g, "");
      };
    },
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

  watch: {
    vendor() {
      this.showOriginalText = true;
    }
  },

  methods: {
    toLink(url) {
      if (url) {
        window.open(url);
      }
    }
  }
};
