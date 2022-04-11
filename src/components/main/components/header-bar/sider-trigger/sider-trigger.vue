<template>
  <Icon
    :class="['menu-icon', collapsed ? 'rotate-icon' : '']"
    :style="{ margin: '0 20px', verticalAlign: 'middle' }"
    type="md-menu"
    size="24"
    @click="handelChange"
  >
    sider-trigger
  </Icon>
</template>

<script>
export default {
  name: "SideTrigger",
  props: {
    collapsed: {
      type: Boolean
    }
  },
  methods: {
    handelChange() {
      this.$emit("on-change", !this.collapsed);
    }
  }
};
</script>

<style lang="less" scoped>
.menu-icon {
  transition: all 0.5s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
</style>
