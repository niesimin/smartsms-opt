<template>
  <i-switch
    :value="switchValue"
    :disabled="switchDisabled"
    :size="switchSize"
    :true-color="trueColor"
    :false-color="falseColor"
    :before-change="handleBeforeChange"
    @on-change="handleSwitchChange"
  >
    <span slot="open">{{ openText }}</span>
    <span slot="close">{{ closeText }}</span>
  </i-switch>
</template>

<script>
export default {
  name: "Ivswitch",
  props: {
    switchSize: {
      type: String,
      default: "large"
    },
    rowData: {
      type: Object,
      default() {
        return {};
      }
    },
    column: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Boolean,
      default: true
    },
    switchDisabled: {
      type: Boolean,
      default: false
    },
    trueColor: {
      type: String,
      default: "#19be6b"
    },
    falseColor: {
      type: String,
      default: "#ea644a"
    },
    openText: {
      type: String,
      default: "启用"
    },
    closeText: {
      type: String,
      default: "停用"
    },
    switchTitle: {
      //状态切换
      type: String,
      default: "状态切换"
    },
    changeBeforeAlert: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      switchValue: this.value
    };
  },
  watch: {
    value() {
      this.switchValue = this.value;
    }
  },
  methods: {
    /**
     * @description 切换开关状态之前
     */
    handleBeforeChange() {
      if (this.changeBeforeAlert) {
        let title =
          this.column && this.column.title
            ? this.column.title
            : this.switchTitle;
        let content = "您确认要切换状态吗？";
        if (
          this.column &&
          this.column.switchTrueContent &&
          this.column.switchFalseContent
        ) {
          if (this.rowData[this.column["key"]]) {
            content = this.column.switchTrueContent;
          } else {
            content = this.column.switchFalseContent;
          }
        }
        return new Promise(resolve => {
          this.$Modal.confirm({
            title: title,
            content: content,
            onOk: () => {
              resolve();
            }
          });
        });
      }
    },
    /**
     * @description 切换开关状态
     */
    handleSwitchChange(status) {
      console.log({ status, rowData: this.rowData });
      this.switchValue = status;
      this.$emit("handleSwitchChange", {
        status,
        rowData: this.rowData,
        column: this.column
      });
    },
    /**
     * @description 获取值
     */
    getSwitchValue() {
      return this.switchValue;
    },
    /**
     * @description 赋值
     */
    setSwitchValue(val) {
      this.switchValue = val;
    }
  }
};
</script>
