<template>
  <FormModal
    ref="subjectModal"
    @handleSubmit="handleSubjectSubmit"
    :width="1000"
    :formTitleText="paperName"
    formTitleIcon="md-brush"
    okBtn="提交"
    :showOkBtn="action == 'add' ? true : false"
  >
    <!-- 左边表单 -->
    <Row class="leftSign">
      <Col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :style="{
          borderRight: '1px solid #009688'
        }"
      >
        <Form ref="subjectValidate" :model="subjectValidate" :label-width="80">
          <h3 class="align-center">
            {{ action == "add" ? "新增题目" : "编辑第" + (subidx + 1) + "题" }}
          </h3>

          <FormItem
            :label="'题目' + (action == 'add' ? sublen + 1 : subidx + 1)"
            prop="title"
            :rules="{
              required: true,
              message: '请输入题目',
              trigger: 'change'
            }"
          >
            <Input
              type="textarea"
              v-model="subjectValidate.title"
              placeholder="请输入题目"
            ></Input>
          </FormItem>

          <FormItem label="类型" prop="subjectType">
            <RadioGroup
              v-model="subjectValidate.subjectType"
              @on-change="changeSubjectType"
            >
              <Radio
                v-for="item in subjectType"
                :key="item.did"
                :label="item.did"
              >
                <span>{{ item.dv }}</span>
              </Radio>
            </RadioGroup>
          </FormItem>

          <div class="optionsTil">
            <b>选项</b>
            <Button type="dashed" @click="handleAddOptions" icon="md-add">
              添加选项
            </Button>
          </div>

          <FormItem
            class="subjectModal"
            v-for="(opt, optidx) in subjectValidate.options"
            :key="optidx"
            :label="String.fromCharCode(65 + optidx)"
            :prop="'options.' + optidx + '.detail'"
            :rules="{
              required: true,
              message: '请输入该选项',
              trigger: 'change'
            }"
          >
            <Row>
              <Col span="21">
                <Input
                  type="textarea"
                  v-model="opt.detail"
                  placeholder="请输入该选项"
                >
                  ></Input
                >
              </Col>
              <Col span="2" class="delTitle">
                <i
                  class="text-danger ivu-icon iconfont icon-del"
                  @click="handleRemoveOptions(optidx)"
                ></i>
              </Col>
            </Row>
          </FormItem>

          <!-- 单选 -->
          <FormItem
            v-if="subjectValidate.subjectType == 1"
            label="正确答案"
            prop="radioCollectAnswer"
            :rules="{
              required: true,
              message: '请选择一个选项',
              trigger: 'change'
            }"
          >
            <RadioGroup
              v-model="subjectValidate.radioCollectAnswer"
              @on-change="RadioAnswerSelect"
            >
              <Radio
                v-for="(rcan, rcanidx) in subjectValidate.options"
                :key="'ranswer' + rcanidx"
                :label="String.fromCharCode(65 + rcanidx)"
              >
                <span>{{ String.fromCharCode(65 + rcanidx) }}</span>
              </Radio>
            </RadioGroup>
          </FormItem>

          <!-- 多选 -->
          <FormItem
            v-else
            label="正确答案"
            prop="checkboxCollectAnswer"
            :rules="{
              required: true,
              type: 'array',
              min: 1,
              message: '请选择一个选项',
              trigger: 'change'
            }"
          >
            <CheckboxGroup
              v-model="subjectValidate.checkboxCollectAnswer"
              @on-change="CheckboxAnswerSelect"
            >
              <Checkbox
                v-for="(ccan, ccanidx) in subjectValidate.options"
                :key="'canswer' + ccanidx"
                :label="String.fromCharCode(65 + ccanidx)"
              ></Checkbox>
            </CheckboxGroup>
          </FormItem>

          <div class="align-center" style="margin-bottom:20px">
            <Button type="dashed" @click="signalSubjectSubmit()">
              {{ action == "add" ? "添加到预览" : "提交" }}
            </Button>
          </div>
        </Form>
      </Col>

      <!-- 右边试题预览 -->
      <Col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        class="rightSign"
        :style="{
          borderLeft: '1px solid #009688',
          marginLeft: '-1px'
        }"
      >
        <h3 class="align-center">试题预览</h3>

        <Sheet
          id="previewExamination"
          style="min-height:450px;max-height:550px;overflow-y:auto"
          ref="previewExamination"
          :hasActionButtons="true"
          :subject="subjectList"
          @editQuestion="editQuestion($event)"
          @delQuestion="delQuestion($event)"
        ></Sheet>
      </Col>
    </Row>
  </FormModal>
</template>

<script>
import FormModal from "@/components/modal/formModal.vue";
import Sheet from "./sheet.vue";
import { keyFactory } from "@/libs/tools";

export default {
  name: "PaperForm",
  components: {
    FormModal,
    Sheet
  },
  props: {
    paperId: {
      type: Number,
      default: 0
    },
    paperName: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      action: "add",
      subjectType: keyFactory.getConstStore(8),
      subidx: null,
      sublen: 0,
      //左边表单
      subjectValidate: {
        title: "",
        subjectType: 1,
        serialNo: 1,
        radioCollectAnswer: "",
        checkboxCollectAnswer: [],
        options: [
          {
            detail: "",
            right: false
          },
          {
            detail: "",
            right: false
          }
        ]
      },
      //右边试题
      subjectList: [
        // {
        //   id: 1,
        //   paperId: 1,
        //   serialNo: 1,
        //   title: "你可爱吗？",
        //   subjectType: 1,
        //   options: [
        //     {
        //       id: null,
        //       serialNo: "A",
        //       detail: "十分可爱",
        //       right: true,
        //       paperId: 1,
        //       subjectId: 1
        //     },
        //     {
        //       detail: "较为可爱",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "B",
        //       subjectId: 1,
        //       right: false
        //     },
        //     {
        //       detail: "一般可爱",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "C",
        //       subjectId: 1,
        //       right: false
        //     },
        //     {
        //       detail: "我不可爱",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "D",
        //       subjectId: 1,
        //       right: false
        //     }
        //   ]
        // },
        // {
        //   id: 2,
        //   options: [
        //     {
        //       detail: "还行吧",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "A",
        //       subjectId: 1,
        //       right: true
        //     },
        //     {
        //       detail: "一般般",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "B",
        //       subjectId: 1,
        //       right: false
        //     },
        //     {
        //       detail: "过得去",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "C",
        //       subjectId: 1,
        //       right: false
        //     },
        //     {
        //       detail: "都大叔了",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "D",
        //       subjectId: 1,
        //       right: true
        //     },
        //     {
        //       detail: "帅呆了",
        //       id: null,
        //       paperId: 1,
        //       serialNo: "E",
        //       subjectId: 1,
        //       right: true
        //     }
        //   ],
        //   answerOption: "AB",
        //   serialNo: 2,
        //   paperId: 26,
        //   subjectType: 2,
        //   title: "勇叔帅吗？"
        // }
      ]
    };
  },

  mounted() {
    this.sublen = 2;
  },
  methods: {
    originalQuestion() {
      this.subjectValidate = {
        title: "",
        subjectType: 1,
        serialNo: 1,
        radioCollectAnswer: "",
        checkboxCollectAnswer: [],
        options: [
          {
            detail: "",
            right: false
          },
          {
            detail: "",
            right: false
          }
        ]
      };
    },

    //打开模态窗
    openModal() {
      // this.$refs.subjectValidate.resetFields();
      this.$refs.subjectModal.openModal();
      this.subjectList = [];
      //this.originalQuestion();
      //this.action = "add";
      let that = this;
      setTimeout(function() {
        that.paperSubjectList(); //请求所有题目
      }, 500);
    },

    //请求当前所有题目
    paperSubjectList() {
      this.$refs.subjectValidate.resetFields();
      this.originalQuestion();
      this.action = "add";
      this.$post(this.$api.paper.paperSubjectList, {
        paperId: this.paperId
      }).then(res => {
        if (res.error == 0) {
          this.subjectList = res.subject;
          this.sublen = res.subject.length;
        }
      });
    },

    //单选、多选切换
    changeSubjectType() {
      this.subjectValidate.radioCollectAnswer = "";
      this.subjectValidate.checkboxCollectAnswer = [];
      //切换时将答案设为false
      let options = this.subjectValidate.options.filter(item => {
        item.right = false;
        return item;
      });

      this.subjectValidate.options = options;
    },

    //勾选单选的正确答案--并把响应的options
    RadioAnswerSelect(type) {
      this.subjectValidate.radioCollectAnswer = type;
      let options = this.subjectValidate.options.filter((item, index) => {
        if (String.fromCharCode(65 + index) == type) {
          item.right = true;
        } else {
          item.right = false;
        }
        return item;
      });

      this.subjectValidate.options = options;
    },

    //勾选多选的正确答案--并把响应的options
    CheckboxAnswerSelect(type) {
      this.subjectValidate.checkboxCollectAnswer = type; //更新正确选项
      let ntype = [];
      type.sort().filter(item => {
        ntype.push(item.charCodeAt() - 65);
      });

      let options = this.subjectValidate.options.filter(item => {
        item.right = false;
        return item;
      });
      this.subjectValidate.options = options;

      //更新option选项
      ntype.filter(nitem => {
        this.subjectValidate.options[nitem].right = true;
      });
    },

    //添加options选项
    handleAddOptions() {
      this.subjectValidate.options.push({
        detail: "",
        right: false
      });
    },

    //删除options选项
    handleRemoveOptions(idx) {
      if (this.subjectValidate.options.length == 2) {
        this.$Message.warning("至少添加2条选项，不能继续删除了哦!");
        return;
      }

      let items = this.subjectValidate.options.filter((item, index) => {
        return idx != index;
      });

      this.subjectValidate.options = items; //删除后的新选项

      let collectAnswer = [];
      items.filter((its, idx) => {
        if (its.right) {
          collectAnswer.push(String.fromCharCode(65 + idx));
        }
      });
      //获取新选项的已有正确答案
      this.subjectValidate.subjectType == 1
        ? (this.subjectValidate.radioCollectAnswer = collectAnswer[0])
        : (this.subjectValidate.checkboxCollectAnswer = collectAnswer);
    },

    //编辑某一题
    editQuestion({ item, subidx }) {
      this.action = "edit";
      this.$refs.subjectValidate.resetFields();
      this.subidx = subidx;

      this.subjectValidate.paperId = item.paperId; //
      this.subjectValidate.id = item.id; //
      this.subjectValidate.title = item.title; //
      this.subjectValidate.subjectType = item.subjectType; //
      this.subjectValidate.serialNo = item.serialNo; //

      let collectAnswer = [];
      let options = [];
      item.options.filter(optitem => {
        let opt = {};
        opt.id = optitem.id;
        opt.paperId = optitem.id;
        opt.subjectId = optitem.subjectId;

        opt.detail = optitem.detail; //
        opt.right = optitem.right; //
        options.push(opt);
        if (optitem.right) {
          collectAnswer.push(optitem.serialNo);
        }
        return optitem;
      });

      this.subjectValidate.options = options;

      item.subjectType == 1
        ? (this.subjectValidate.radioCollectAnswer = collectAnswer[0])
        : (this.subjectValidate.checkboxCollectAnswer = collectAnswer);
    },

    //获取当前所有题目
    getAllSubject(data) {
      return data;
    },

    //试题编辑or新增添加到预览区
    signalSubjectSubmit() {
      let addsubject = {};
      addsubject.title = this.subjectValidate.title; //题目
      addsubject.subjectType = this.subjectValidate.subjectType; //选择类型
      addsubject.paperId = this.paperId;
      addsubject.options = [];
      this.subjectValidate.options.filter((item, idx) => {
        let opt = {
          right: item.right, //是否选项答案
          detail: item.detail, //选项标题
          serialNo: String.fromCharCode(65 + idx) //选项序号
        };
        if (this.action == "add") {
          opt.paperId = this.paperId;
        } else {
          opt.id = item.id;
          opt.paperId = this.paperId;
          opt.subjectId = this.subjectValidate.options[0].subjectId;
        }
        addsubject.options.push(opt);
      });

      if (this.action == "add") {
        addsubject.serialNo = this.subjectList.length + 1;
      } else {
        addsubject.paperId = this.subjectValidate.paperId;
        addsubject.serialNo = this.subjectValidate.serialNo;
        addsubject.id = this.subjectValidate.id;
        // this.$refs.previewExamination.subject.splice(
        //   this.subidx,
        //   1,
        //   addsubject
        // );
      }

      this.$refs.subjectValidate.validate(valid => {
        if (valid) {
          if (this.action == "add") {
            this.subjectList.push(addsubject);
            setTimeout(() => {
              var pet = this.$el.querySelector("#previewExamination");
              pet.scrollTop = pet.scrollHeight;
            }, 500);

            this.handleSubjectSubmit(1);
          } else {
            this.$post(this.$api.paper.paperSubjectUpdate, {
              subject: JSON.stringify(addsubject)
            }).then(res => {
              if (res.error == 0) {
                //this.$refs.subjectValidate.resetFields();
                //this.originalQuestion();
                //this.action = "add";
                this.paperSubjectList();
              }
            });
          }
        }
      });
    },
    //试题提交
    handleSubjectSubmit(type) {
      let parma = {
        subject: JSON.stringify(this.subjectList),
        paperId: this.paperId
      };
      this.$post(this.$api.paper.paperSubjectAdd, parma).then(res => {
        if (res.error == 0) {
          if (type != 1) {
            this.$Message.success("操作成功!");
            this.$refs.subjectModal.colseModal();
            this.remoteTable();
          } else {
            //this.$refs.subjectValidate.resetFields();
            //this.originalQuestion();
            //this.action = "add";
            this.paperSubjectList();
          }
        }
      });
    },
    //删除某一题回调
    delQuestion(index) {
      this.remoteTable();
      let subjectId = this.subjectList[index].id;
      if (subjectId) {
        this.$post(this.$api.paper.paperSubjectDelete, {
          subjectId: subjectId
        }).then(res => {
          if (res.error == 0) {
            // let subject = this.subjectList.filter((item, idx) => {
            //   if (idx > index) {
            //     item.serialNo = item.serialNo - 1;
            //   }
            //   return idx != index;
            // });
            // this.subjectList = subject;
            // this.sublen = this.subjectList.length;
            //this.$refs.subjectValidate.resetFields();
            //this.originalQuestion();
            //this.action = "add";
            this.paperSubjectList();
          }
        });
      }
    },

    remoteTable() {
      this.$emit("refreshTable", 1);
    }
  }
};
</script>

<style lang="less">
.leftSign {
  h3 {
    padding-bottom: 10px;
  }
  .subjectModal {
    .delTitle,
    .ivu-form-item-label {
      margin-top: 10px;
    }

    .delTitle {
      cursor: pointer;
    }
  }
  .ivu-btn-dashed {
    border-color: #009688;
    color: #009688;
  }
  .optionsTil {
    padding: 10px 0;
    overflow: hidden;
    b {
      display: inline-block;
      width: 80px;
      text-align: right;
      padding-right: 12px;
    }
  }
}
</style>
