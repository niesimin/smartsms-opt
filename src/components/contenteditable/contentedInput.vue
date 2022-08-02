<template>
  <div class="divInputAble">
    <div
      ref="editable"
      :contenteditable="editAble"
      :placeholder="placeholder"
      v-html="innerText"
      @focus="editableFocus"
      @blur="blurFunc"
      @input="changeText"
      @keydown="stopEnter"
      class="divInput"
    ></div>
    <div class="suffix">
      <span>{{ templateTextCount(templateText) }}/{{ maxlength }}</span>
      <Button
        type="primary"
        ghost
        icon="ios-link"
        @click="getFieldSelection"
        v-if="!choice"
        >设置变量</Button
      >
      <Button
        type="primary"
        ghost
        icon="ios-link"
        @click="choseVariable"
        v-if="choice"
        >选择变量</Button
      >
    </div>

    <FormModal
      formTitleText="选择变量"
      ref="selectVarible"
      @handleSubmit="radioChoiceClice"
    >
      <RadioGroup v-model="radioChoice" @on-change="radioChoiceChange">
        <Radio
          v-for="(item, idx) in variableGroupChose"
          :label="item.text"
          :key="item.text + idx"
          border
          style="margin-bottom:10px"
        ></Radio>
      </RadioGroup>
    </FormModal>
  </div>
</template>

<script>
import FormModal from "@/components/modal/formModal.vue";
export default {
  name: "ContentedInput",
  components: {
    FormModal
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    editAble: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: "短信正文无需输入签名，如正文存在变量，请选中文本，点击设置变量"
    },
    maxlength: {
      type: Number,
      default: 300
    },
    choice: {
      type: Boolean,
      default: false
    },
    variableGroupChose: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      innerText: this.value,
      isChange: !0,
      templateText: "",
      templateSubmitText: "",
      templateHtml: "",
      variableGroup: [],
      variableParams: [],
      count: 0,
      radioChoice: "",
      isChose: {}
    };
  },
  computed: {
    //计算字数
    templateTextCount: function() {
      return function(e) {
        var t = e
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&");
        // console.log(t);

        return t.length;
      };
    }
  },
  mounted() {
    this.$refs.editable.addEventListener("paste", this.textPaste);
    this.value && this.init();
  },
  watch: {
    value: function() {
      console.log(this.isChange);
      0 === this.count ? this.init(1) : this.setGrounp(2);
      this.isChange && (this.innerText = this.value);
    },
    variableGroupChose: {
      deep: !0,
      handler: function(e) {
        e;
      }
    }
  },
  methods: {
    init(idx) {
      console.log(idx);
      this.$nextTick(() => {
        this.value && (this.setClickEvent(), this.setGrounp(idx)), this.count++;
      });
    },

    changeText() {
      this.emitInput();
      this.setGrounp();
    },

    getFieldSelection() {
      this.editableFocus(); //输入框获取焦点
      this.setColor(); //设置变量页面显示
      this.setClickEvent(); //设置好的变量赋予点击删除事件
      this.emitInput(); //向父组件传递数据
      this.$nextTick(() => {
        this.setGrounp(); //将变量放进数组
      });
    },

    emitInput: function() {
      this.$emit("input", this.$refs.editable.innerHTML);
    },
    //设置变量页面显示
    setColor() {
      if (this.variableGroup.length >= 10) {
        this.$Message.error("变量设置不能超过10个!");
      } else {
        if (window.getSelection && window.getSelection().getRangeAt) {
          //将 window.getSelection用户选择的文本范围,返回一个Selection对象 selection 转换为字符串
          let selectText = window.getSelection().toString();
          console.log(selectText);
          //判断是否选中内容
          if (!selectText) {
            this.$Message.error("请先选中内容!");
            return;
          }
          //判断选中内容是否已存在
          let exist = this.variableGroup.some(function(e) {
            return e.text === selectText;
          });
          if (exist) {
            this.$Message.error("变量不可重复设置!");
            return;
          }
          //标志选中的变量，将选中变量组装成统一html
          let selectHtml = '<span contenteditable="false">&#xFEFF<span class="variable" contenteditable="false">'.concat(
            selectText,
            '<i class="ivu-icon ivu-icon-md-close"></i></span>&#xFEFF</span>'
          );
          //获取当前变量选中的范围对象并删除
          let rangeAt = window.getSelection().getRangeAt(0);
          console.log(rangeAt);
          rangeAt.deleteContents();
          console.log(rangeAt);
          //创建div放置selectHtml
          let createDiv = document.createElement("div");
          createDiv.innerHTML = selectHtml;
          let cele,
            cdFragment = document.createDocumentFragment();
          while ((cele = createDiv.firstChild)) {
            cdFragment.appendChild(cele);
          }
          rangeAt.insertNode(cdFragment);
        } else if (document.selection && document.selection.createRange) {
          console.log(document.selection && document.selection.createRange);
        }
      }
    },

    //将设置的变量添加到数组
    setGrounp(idx) {
      idx;
      // console.log(idx, this.innerText);
      let reg = /(<span contenteditable="false">)(.{0,10})(<span class="variable" contenteditable="false">)(.*?)(<i class="ivu-icon ivu-icon-md-close"><\/i><\/span>)(.{0,10})(<\/span>)/g;
      let valuateReg = this.$refs.editable.innerHTML.match(reg);
      let childParams = [];
      let group = [];
      if (valuateReg && valuateReg.length) {
        childParams = valuateReg.map((item, idx) => {
          let num = idx + 1;
          let ted = "ted_group" + num;
          let param = {};
          param[ted] = item.replace(reg, "$4");

          group.push({
            value: item,
            type: 0,
            text: item.replace(reg, "$4"),
            key: ""
          });
          return param;
        });
        this.variableParams = childParams;
        this.variableGroup = group;
        this.templateText = this.$refs.editable.innerHTML
          .replace(reg, "$4")
          .trim();
        this.templateSubmitText = this.$refs.editable.innerHTML
          .replace(reg, "{$4}")
          .trim();
      } else {
        this.variableGroup = [];
        this.variableParams = [];
        this.templateText = this.$refs.editable.innerHTML.trim();
        this.templateSubmitText = this.$refs.editable.innerHTML.trim();
      }
      this.$emit("valueChange", {
        templateText: this.templateText.trim(),
        variableGroup: this.variableGroup,
        variableParams: this.variableParams,
        templateSubmitText: this.templateSubmitText,
        templateHtml: this.$refs.editable.innerHTML
      });
      // console.log(
      //   this.templateHtml,
      //   this.templateSubmitText,
      //   this.variableParams
      // );
    },

    stopEnter: function(e) {
      (13 == e.keyCode ||
        (this.templateTextCount(this.templateText) >= this.maxlength &&
          38 != e.keyCode &&
          37 != e.keyCode &&
          40 != e.keyCode &&
          39 != e.keyCode &&
          8 != e.keyCode)) &&
        e.preventDefault();
    },
    //blur
    blurFunc() {
      this.isChange = !0;
    },

    //focus获取焦点回调事件
    editableFocus() {
      this.isChange = !1;
      this.setFocus();
      this.setClickEvent();
    },

    //设置光标到最后
    setFocus() {
      // if (window.getSelection) {
      //   obj.focus(); //解决ff不获取焦点无法定位问题
      //   let range = window.getSelection(); //创建range
      //   range.selectAllChildren(obj); //range 选择obj下所有子内容
      //   range.collapseToEnd(); //光标移至最后
      // } else if (document.selection) {
      //   let range = document.selection.createRange(); //创建选择对象
      //   range.moveToElementText(obj); //range定位到obj
      //   range.collapse(false); //光标移至最后
      //   range.select();
      // }
      let editable = this.$refs.editable;
      editable.focus();
      let range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(!1);
      let selection = window.getSelection();
      0 == selection.anchorOffset &&
        (selection.removeAllRanges(), selection.addRange(range));
    },

    setClickEvent() {
      let edable = this.$refs.editable;
      for (let t = 0; t < edable.children.length; t++) {
        let item = edable.children[t];
        let itemchidd = item.children[0].children[0];
        item &&
          itemchidd &&
          (itemchidd.removeEventListener("click", this.delHtml),
          itemchidd.addEventListener("click", this.delHtml, !0));
      }
    },

    delHtml(e) {
      let delEle = e.currentTarget;
      let delTxt = document.createTextNode(delEle.parentNode.innerText);
      delEle.parentNode.parentNode.parentNode.replaceChild(
        delTxt,
        delEle.parentNode.parentNode
      );
      this.emitInput();
      this.setGrounp();
    },

    textPaste(e) {
      var t;
      e.preventDefault();
      var n = (e.originalEvent || e).clipboardData,
        i = this.maxlength - this.templateTextCount(this.templateText);
      if (void 0 === n || null === n) {
        if (
          ((t = window.clipboardData.getData("text") || ""),
          (t = t.slice(0, i)),
          "" !== t)
        )
          if (window.getSelection) {
            var s = document.createElement("span");
            (s.innerHTML = t),
              window
                .getSelection()
                .getRangeAt(0)
                .insertNode(s);
          } else document.selection.createRange().pasteHTML(t);
      } else
        (t = n.getData("text/plain") || ""),
          (t = t.slice(0, i)),
          "" !== t && document.execCommand("insertText", !0, t);
    },

    //选择变量
    choseVariable() {
      if (
        this.choice &&
        this.variableGroupChose &&
        this.variableGroupChose.length > 0
      ) {
        this.$refs.selectVarible.openModal();
      } else {
        this.$Message.error("请先在短信原文中设置变量!");
      }
    },

    radioChoiceChange(e) {
      if (e) {
        let val = this.variableGroupChose.filter(item => {
          return item.text === e;
        });
        val.length && (this.isChose = val[0]);
      } else {
        this.isChose = {};
      }
    },

    radioChoiceClice() {
      if (this.isChose["value"]) {
        let newHml = this.$refs.editable.innerHTML + this.isChose["value"];
        let newTxt;
        let reg = /(<span contenteditable="false">)(.{0,10})(<span class="variable" contenteditable="false">)(.*?)(<i class="ivu-icon ivu-icon-md-close"><\/i><\/span>)(.{0,10})(<\/span>)/g;

        let valuateReg = newHml.match(reg);

        if (valuateReg && valuateReg.length > 0) {
          newTxt = newHml.replace(reg, "$4");
        } else {
          newTxt = newHml;
        }
        if (this.templateTextCount(newTxt) > this.maxlength) {
          this.$Message.error("超出字数限制!");
        } else {
          this.$refs.editable.innerHTML =
            this.$refs.editable.innerHTML + this.isChose["value"];
          this.emitInput();
          this.setGrounp();
          this.$refs.selectVarible.colseModal();
        }
      }
    }
  },
  beforeDestroy: function() {
    this.$refs.editable.removeEventListener("paste", this.textPaste);
  }
};
</script>

<style lang="less">
.divInputAble {
  cursor: text;
  .divInput {
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
    outline: none !important;
    border: 1px solid #69b4f5 !important;
    box-shadow: 0, 0, 0, 2px, rgba(68, 161, 242, 0.2);
  }
  .contentEdit:empty::before {
    content: attr(placeholder);
    color: #c5c8ce;
  }
  .divInput:empty::before {
    content: attr(placeholder);
    color: #c5c8ce;
  }
  .ivu-icon-md-close {
    cursor: pointer;
  }
  .suffix {
    position: absolute;
    right: 7px;
    color: rgb(144, 147, 153);
    bottom: -4px;
    font-size: 12px;
    z-index: 9;
    .ivu-btn {
      border: 0 none;
      outline: 0 none;
      height: auto;
    }
    span {
      margin-right: 10px;
    }
  }

  .text-primary {
    cursor: pointer;
  }
}
</style>
