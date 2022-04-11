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
