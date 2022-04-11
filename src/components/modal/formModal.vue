<template>
  <Modal
    v-model="showModal"
    :title="action == 'edit' ? '编辑' : '添加'"
    class="addModal"
    :width="width"
    @on-visible-change="onvisiblechange"
  >
    <p slot="header">
      <Icon
        :type="
          formTitleIcon
            ? formTitleIcon
            : action == 'edit'
            ? 'md-create'
            : 'md-add-circle'
        "
        :style="styles"
      ></Icon>
      <span style="font-weight: 700;">{{
        formTitleText ? formTitleText : action == "add" ? "添加" : "编辑"
      }}</span>
    </p>
    <slot></slot>

    <div slot="footer">
      <Button type="default" @click="colseModal">{{ cancelBtn }}</Button>
      <!-- <Button type="primary" @click="handleSubmit" v-if="showOkBtn">{{
        okBtn
      }}</Button> -->
      <Button type="primary" :loading="submitLoading" @click="handleSubmit">
        <span v-if="!submitLoading">确定</span>
        <span v-else>确定</span>
      </Button>
    </div>
  </Modal>
</template>

<script>
import modalMixin from "./modal-mixin";
export default {
  name: "FormModal",
  mixins: [modalMixin],
  props: {
    showOkBtn: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 520
    },
    action: {
      type: String,
      default: "add"
    },
    formTitleText: {
      type: String,
      default: ""
    },
    formTitleIcon: {
      type: String,
      default: ""
    },
    okBtn: {
      type: String,
      default: "确定"
    },
    cancelBtn: {
      type: String,
      default: "取消"
    }
  },
  computed: {
    submitLoading() {
      return this.$store.state.user.submitLoading;
    }
  },
  watch: {
    submitLoading() {
      return this.$store.state.user.submitLoading;
    }
  },
  methods: {
    /**
     * 确定按钮回调事件
     */
    handleSubmit() {
      this.$emit("handleSubmit");
    },
    onvisiblechange(event) {
      this.$emit("onvisiblechange", event);
    }
  }
};
</script>

<style lang="less">
@import "./modal.less";
// addmodal
.addModal {
  .ivu-modal-body {
    padding-top: 30px;
  }
  .ivu-modal-header .ivu-icon {
    color: #0280bd;
    margin-right: 4px;
    font-size: 22px;
  }
  .ivu-input-wrapper,
  .ivu-select-selection,
  .ivu-select-dropdown {
    width: 90%;
  }
  .ivu-select-dropdown {
    min-width: 90% !important;
  }
}
</style>
