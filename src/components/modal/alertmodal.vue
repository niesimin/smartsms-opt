<template>
  <Modal
    v-model="showModal"
    :width="width"
    class="comfirmModal"
    @on-visible-change="onvisiblechange"
  >
    <p slot="header">
      <Icon :type="titleIcon ? titleIcon : 'md-help-circle'" :style="styles" />
      <span style="font-weight:400">{{ titleText ? titleText : "提示" }}</span>
    </p>
    <p v-if="modalContent" v-html="modalContent"></p>
    <slot v-else></slot>
    <div slot="footer">
      <Button
        :type="okBtn == '关闭' ? 'default' : 'primary'"
        @click="handleOk"
        >{{ okBtn }}</Button
      >
    </div>
  </Modal>
</template>

<script>
import modalMixin from "./modal-mixin";

export default {
  name: "Alertmodal",
  mixins: [modalMixin],
  props: {
    modalContent: {
      //内容显示
      type: String,
      default: ""
    },
    okBtn: {
      type: String,
      default: "删除"
    },
    canBtn: {
      type: String
    },
    width: {
      type: Number,
      default: 416
    }
  },
  data() {
    return {};
  },

  methods: {
    /**
     * 确定按钮回调事件
     */
    handleOk() {
      this.$emit("handleDelete", this.currentData);
    },
    onvisiblechange(event) {
      this.$emit("onvisiblechange", event);
    }
  }
};
</script>
<style lang="less">
@import "./modal.less";
//alertModal
.comfirmModal {
  .ivu-modal-content {
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;
  }
  .ivu-modal-header,
  .ivu-modal-footer {
    border: 0 none;
  }
  .ivu-modal-body {
    padding: 6px 40px 8px;
  }
}
</style>
