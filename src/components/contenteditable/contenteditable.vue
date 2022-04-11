<template>
  <div class="wrapEdit">
    <div
      :contenteditable="canEdit"
      :placeholder="placeholder"
      class="contentEdit"
      v-html="innerHtml"
      @focus="isLocked = true"
      @blur="isLocked = false"
      @input="changeText"
      @mouseup="getEvent()"
    ></div>
    <div class="suffix">
      <span v-if="showWordLimit">{{ textSize }}/{{ maxlength }}</span>
      <span class="text-primary" @click="getParma"
        ><Icon type="ios-link" size="16" />设置变量</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Contentedit",
  props: {
    canEdit: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    maxlength: {
      type: String,
      default: "10"
    },
    showWordLimit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerHtml: "",
      innerText: "",
      innerHtmlary: [],
      isLocked: false,
      textSize: 0,
      maxtext: "",
      params: [],
      currentParma: ""
    };
  },
  watch: {
    value() {
      if (!this.isLocked || !this.innerHtml) {
        this.innerHtml = this.value;
      }
    }
  },
  mounted() {},
  methods: {
    changeText(e) {
      if (this.showWordLimit) {
        this.textSize = e.target.innerText.length;

        if (this.textSize >= this.maxlength) {
          if (this.textSize == this.maxlength) {
            this.maxtext = e.target.innerHTML;
          }
          if (this.textSize > this.maxlength) {
            e.target.innerHTML = this.maxtext;
          }

          this.textSize = this.maxlength;
        }
      }
      this.innerHtml = e.target.innerHTML;
      this.innerText = e.target.innerText;
      this.$emit("input", this.innerHtml);
      setTimeout(() => {
        this.keepLastIndex(e.target);
      }, 1);
    },

    keepLastIndex: obj => {
      if (window.getSelection) {
        //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        let range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        let range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
      }
    },

    getEvent() {
      this.currentParma = window.getSelection().toString();
    },
    hasNameOneOf(val, arr) {
      let flags = arr.find(item => {
        return val == item;
      });
      return flags;
    },
    getParma() {
      if (!this.currentParma) {
        this.$Message.warning("请先选择变量！");
        return;
      }

      if (this.hasNameOneOf(this.currentParma, this.params)) {
        this.$Message.warning("该变量已存在。请重新选择！");
        return;
      }

      this.params.push(this.currentParma);

      let innerHtml = this.innerHtml;
      innerHtml = innerHtml.replace(
        this.currentParma,
        "<span class='variable' contenteditable='false'>" +
          this.currentParma +
          "<i class='ivu-icon iconfont icon-del'></i></span>"
      );

      this.innerHtml = innerHtml;
    }
  }
};
</script>

<style lang="less" scoped>
.wrapEdit {
  position: relative;
  cursor: text;
  .contentEdit {
    outline: none;
    border: 1px solid #dcdee2 !important;
    border-radius: 4px;
    width: 100%;
    min-height: 36px;
    padding: 8px 7px 20px;
    word-break: break-all;
    user-select: text;
    line-height: 25px;
    box-sizing: border-box;
    white-space: pre-wrap;
    text-align: left;
  }
  [contenteditable]:focus {
    outline: none;
    border: 1px solid #69b4f5;

    box-shadow: 0, 0, 0, 2px, rgba(68, 161, 242, 0.2);
  }
  .contentEdit:empty::before {
    content: attr(placeholder);
    color: #c5c8ce;
  }
  // .contentEdit:focus::before {
  //   content: none;
  // }
  .suffix {
    position: absolute;
    right: 7px;
    color: rgb(144, 147, 153);
    bottom: -6px;
    font-size: 12px;
  }
  span {
    margin-right: 10px;
  }
  .text-primary {
    cursor: pointer;
  }
}

//
</style>
