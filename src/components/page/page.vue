<template>
  <Page
    :total="total"
    show-total
    show-elevator
    show-sizer
    transfer
    :current="currentPage"
    :page-size-opts="pageSizeOpts"
    :page-size="recPerPage"
    @on-change="handlePageChange($event)"
    @on-page-size-change="onPageSizeChange($event)"
  />
</template>

<script>
export default {
  name: "Pagination",
  props: {
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number
    },
    pageSizeOpts: {
      type: Array,
      default() {
        return [8, 10, 15, 20, 30, 40];
      }
    },
    recPerPage: {
      type: Number
    }
  },
  methods: {
    /**
     * @description 页码改变的回调，返回改变后的页码
     * @description 页码改变后要重新请求table
     */
    handlePageChange(page) {
      this.$emit("pageChange", { page: page });
    },

    /**
     * @description 切换每页条数时的回调，返回切换后的每页条数
     * @description 切换每页条数时要重新请求table
     */
    onPageSizeChange(recPerPage) {
      this.$emit("sizeChange", {
        recPerPage: recPerPage
      });
    }
  }
};
</script>

<style lang="less">
.ivu-page {
  text-align: center;
  padding: 10px;
}
.ivu-page .ivu-page-item-jump-next:after,
.ivu-page .ivu-page-item-jump-prev:after {
  content: "\2022\2022\2022" !important;
}
</style>
