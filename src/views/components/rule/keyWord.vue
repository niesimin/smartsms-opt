<template>
  <div class="keyWord">
    <template v-if="keyword.length > 0">
      <Tag
        v-for="(item, idx) in keyword"
        :key="idx + item"
        :closable="!disabled ? true : false"
        @on-close="handleClose"
        :name="item"
        >{{ item }}</Tag
      >
    </template>

    <Button
      type="primary"
      ghost
      @click="addKeyWord"
      v-show="!showAddInput && !disabled"
      >新增关键词</Button
    >
    <Input
      v-show="showAddInput"
      v-model="addValue"
      placeholder=""
      maxlength="20"
      show-word-limit
      style="width: 190px"
      ref="input"
      @on-enter="handelAdd()"
      @on-blur="handelAdd()"
    />
    <div class="text-gray" style="font-size:12px">
      <Icon
        type="md-alert"
      />至少填写3个，所选关键词必须源于短信文本，能定位到唯一短信文本
    </div>
  </div>
</template>

<script>
import { hasOneOf } from "@/libs/tools.js";
export default {
  name: "KeyWord",
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: [],
      showAddInput: false,
      addValue: ""
    };
  },
  mounted() {
    if (this.value) {
      if (this.value.indexOf(",") != -1) {
        this.keyword = this.value.split(",");
      } else {
        this.keyword.push(this.value);
      }
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        if (!hasOneOf(this.keyword, [newValue])) {
          if (newValue.indexOf(",") != -1) {
            this.keyword = newValue.split(",");
          } else {
            this.keyword.push(newValue);
          }
        }
      }
    }
  },
  methods: {
    handleClose(event, name) {
      const index = this.keyword.indexOf(name);
      this.keyword.splice(index, 1);
      // debugger;
      let ley = this.keyword.join(",");
      this.$emit("input", ley);
    },
    addKeyWord() {
      this.showAddInput = true;
      this.$nextTick(() => {
        this.$refs.input.focus({
          cursor: "start"
        });
      });
    },
    handelAdd() {
      if (this.addValue) {
        this.keyword.push(this.addValue);
        let ley = this.keyword.join(",");
        this.$emit("input", ley);
      }
      this.addValue = "";
      this.showAddInput = false;
    }
  }
};
</script>

<style lang="less">
.keyWord {
  .ivu-tag {
    height: 32px;
    line-height: 32px;
  }
}
</style>
