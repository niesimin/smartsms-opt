<template>
  <div>
    <!-- 菜单显示隐藏按钮 -->
    <SideTrigger
      :collapsed="collapsed"
      @on-change="handleCollpasedChange"
    ></SideTrigger>

    <!-- 面包屑 -->
    <CustomBreadCrumb
      v-if="!collapsed"
      class="custom-bread-crumb"
      :list="breadCrumbList"
    ></CustomBreadCrumb>

    <!-- 匿名插槽 放置用户下拉 全屏 -->
    <div class="pull-right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SideTrigger from "./sider-trigger/sider-trigger.vue";
import CustomBreadCrumb from "./custom-bread-crumb.vue";
export default {
  name: "HeaderBar",
  components: {
    SideTrigger,
    CustomBreadCrumb
  },
  props: {
    collapsed: {
      type: Boolean
    }
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList;
    }
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit("on-coll-change", state);
    }
  }
};
</script>
