<template>
  <!-- <Icon :type="type" :style="styles"></Icon> -->
  <i :class="`iconfont icon-${type}`" :style="styles"></i>
</template>

<script>
export default {
  name: "Icons",
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "#000000"
    },
    size: {
      type: Number,
      default: 16
    }
  },
  computed: {
    styles() {
      return {
        fontSize: `${this.size}px`,
        color: this.color
      };
    }
  }
};
</script>

<style></style>
