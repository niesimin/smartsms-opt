export default {
  props: {
    titleIcon: {
      //标题icon
      type: String,
      default: ""
    },
    titleIconSize: {
      //标题icon大小
      type: Number,
      default: 27
    },
    titleIconColor: {
      //标题icon颜色
      type: String,
      default: "#44a1f2"
    },
    titleText: {
      //标题
      type: String,
      default: ""
    },
    currentData: {
      //当前操作数据
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showModal: false //默认弹窗不显示
    };
  },
  computed: {
    /**
     * @description headTitle样式设置
     */
    styles() {
      return {
        fontSize: `${this.titleIconSize}px`,
        color: this.titleIconColor,
        marginRight: "12px",
        fontWeight: 400
      };
    }
  },
  methods: {
    /**
     * @description 打开模态窗
     */
    openModal() {
      this.showModal = true;
    },
    /**
     * 关闭模态窗
     */
    colseModal() {
      this.showModal = false;
    }
  }
};
