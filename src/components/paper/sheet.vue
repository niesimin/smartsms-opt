<template>
  <div class="rightSign">
    <Row v-if="applicantAnswer" class="summary">
      <Col :xs="24"
        ><b
          >题目总数：<i class="text-danger">{{ counts.subjectCounts }}</i></b
        ></Col
      >
      <Col :xs="24" :sm="12"
        ><b
          ><Icon custom="iconfont icon-true" class="text-success" size="20" />
          全对题目数：<i class="text-danger">{{ counts.allRightCounts }}</i></b
        ></Col
      >
      <Col :xs="24" :sm="12"
        ><b
          ><Icon type="md-warning" class="text-warnimg" size="20" />
          部分对题目数：<i class="text-danger">{{
            counts.partRightCounts
          }}</i></b
        ></Col
      >
      <Col :xs="24" :sm="12"
        ><b
          ><Icon custom="iconfont icon-del" class="text-danger" size="16" />
          全错题目数：<i class="text-danger">{{ counts.allWrongCounts }}</i></b
        ></Col
      >
      <Col :xs="24" :sm="12"
        ><b
          ><Icon type="md-help" class="text-info" size="20" /> 未答题目数：<i
            class="text-danger"
            >{{ counts.notAnswerCounts }}</i
          ></b
        ></Col
      >
    </Row>
    <div v-for="(item, index) in subject" :key="index" class="question">
      <div>
        <b
          >( {{ index + 1 }} )、{{ item.title }}【{{
            item.subjectType == 1 ? "单选题" : "多选题"
          }}】</b
        >
      </div>

      <div class="sheetAnswer">
        <b
          >正确答案【
          <i v-for="(an, anidx) in item.options" :key="'an' + index + anidx">
            {{ an.right ? an.serialNo : "" }} </i
          >】
        </b>
        <b v-if="applicantAnswer">
          当前选择【<i
            :class="[
              item.answerType == 1
                ? 'text-success'
                : item.answerType == 2
                ? 'text-warnimg'
                : item.answerType == 3
                ? 'text-danger'
                : 'text-info'
            ]"
            >{{ item.answerOption }}</i
          >】

          <Icon
            v-if="item.answerType == 1"
            custom="iconfont icon-true"
            class="text-success"
            size="20"
          />

          <Icon
            v-if="item.answerType == 2"
            type="md-warning"
            class="text-warnimg"
            size="20"
          />

          <Icon
            v-if="item.answerType == 3"
            custom="iconfont icon-del"
            class="text-danger"
            size="16"
          />

          <Icon
            v-if="item.answerType == 0"
            type="md-help"
            class="text-info"
            size="20"
          />
        </b>
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
  name: "Sheet",
  props: {
    counts: {
      type: Object,
      default() {
        return {};
      }
    },
    subject: {
      type: Array,
      default() {
        return [];
      }
    },
    hasActionButtons: {
      type: Boolean,
      default: false
    },
    applicantAnswer: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    //编辑某一题
    editThisQuestion(index) {
      this.$emit("editQuestion", { item: this.subject[index], subidx: index });
    },
    //删除某一题
    delThisQuestion(index) {
      this.$emit("delQuestion", index);
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
  .sheetAnswer {
    padding: 10px 0 10px 20px;
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
  .summary {
    padding-bottom: 10px;
    div {
      padding-bottom: 10px;
    }
  }
}
</style>
