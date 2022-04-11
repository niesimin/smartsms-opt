<template>
  <div>
    <div v-for="(item, index) in subject" :key="index" class="question">
      <div>
        <b
          >第{{ index + 1 }}题 {{ item.title }}【{{
            item.subjectTypeValue == 1 ? "单选题:" : "多选题:"
          }}
          <i v-for="(an, anidx) in item.options" :key="'an' + index + anidx">
            {{ an.answer ? an.serialNo : "" }}
          </i>
          】</b
        >
      </div>

      <ButtonGroup class="buttonGroup" v-if="hasActionButtons">
        <Button
          size="small"
          type="primary"
          ghost
          @click="editThisQuestion(index)"
        >
          <Icon custom="iconfont icon-editor" size="18"></Icon>
          编辑该题
        </Button>
        <Button
          size="small"
          type="primary"
          ghost
          @click="delThisQuestion(index)"
        >
          <Icon type="md-backspace" size="18"></Icon>
          删除该题
        </Button>
      </ButtonGroup>

      <ul>
        <li
          v-for="(opt, opidx) in item.options"
          :key="'options' + index + opidx"
        >
          <b>{{ String.fromCharCode(65 + opidx) }}、</b>{{ opt.detail }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PreviewPaper",
  props: {
    hasActionButtons: {
      type: Boolean,
      default: false
    },
    applicantAnswer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //右边试题预览
      subject: [
        {
          id: 1,
          options: [
            {
              detail: "十分可爱",
              id: null,
              paperId: 1,
              serialNo: "A",
              subjectId: 1,
              answer: true
            },
            {
              detail: "较为可爱",
              id: null,
              paperId: 1,
              serialNo: "B",
              subjectId: 1,
              answer: false
            },
            {
              detail: "一般可爱",
              id: null,
              paperId: 1,
              serialNo: "C",
              subjectId: 1,
              answer: false
            },
            {
              detail: "我不可爱",
              id: null,
              paperId: 1,
              serialNo: "D",
              subjectId: 1,
              answer: false
            }
          ],
          serialNo: 1,
          sheetId: 25,
          subjectTypeText: "单选题",
          subjectTypeValue: 1,
          title: "你可爱吗？"
        },
        {
          id: 2,
          options: [
            {
              detail: "还行吧",
              id: null,
              paperId: 1,
              serialNo: "A",
              subjectId: 1,
              answer: true
            },
            {
              detail: "一般般",
              id: null,
              paperId: 1,
              serialNo: "B",
              subjectId: 1,
              answer: false
            },
            {
              detail: "过得去",
              id: null,
              paperId: 1,
              serialNo: "C",
              subjectId: 1,
              answer: false
            },
            {
              detail: "都大叔了",
              id: null,
              paperId: 1,
              serialNo: "D",
              subjectId: 1,
              answer: true
            },
            {
              detail: "帅呆了",
              id: null,
              paperId: 1,
              serialNo: "E",
              subjectId: 1,
              answer: true
            }
          ],
          serialNo: 2,
          sheetId: 26,
          subjectTypeText: "多选题",
          subjectTypeValue: 2,
          title: "勇叔帅吗？"
        }
      ],
      sublen: 0
    };
  },
  mounted() {
    this.sublen = this.subject.length;
  },
  methods: {
    //编辑某一题
    editThisQuestion(index) {
      this.$emit("editQuestion", { item: this.subject[index], subidx: index });
    },
    //删除某一题
    delThisQuestion(index) {
      // this.$emit("editQuestion", item);
      let subject = this.subject.filter((item, idx) => {
        if (idx > index) {
          item.serialNo = item.serialNo - 1;
        }
        return idx != index;
      });
      this.subject = subject;

      this.$emit("delQuestion", this.subject.length);
    }
  }
};
</script>

<style lang="less">
.rightSign {
  padding: 0 0 0 10px;
  h3 {
    padding-bottom: 10px;
  }
  .question {
    margin-bottom: 15px;
    ul {
      padding-left: 20px;
      li {
        line-height: 2em;
        word-break: break-all;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }
    .buttonGroup {
      margin: 6px 0 6px 20px;
    }
  }
}
</style>
