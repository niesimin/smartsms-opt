<template>
  <div class="singleForm">
    <Row>
      <Col :xs="24" :sm="14" class="left-form">
        <Collapse v-model="collapseTemplate">
          <Panel name="collapseTemplate">
            公众号
            <Form
              slot="content"
              ref="formTemplate"
              :model="formTemplate"
              :rules="ruleTemplate"
              :label-width="120"
            >
              <FormItem label="模板类型" prop="templateType">
                <Select
                  v-model="formTemplate.templateType"
                  @on-change="templateTypeChange"
                  :disabled="type ? true : false"
                >
                  <Option
                    v-for="item in SearTemplateType"
                    :key="item.dv"
                    :value="item.did"
                    >{{ item.dv }}</Option
                  >
                </Select>
              </FormItem>

              <FormItem label="公众号名称" prop="cmpTeddyId">
                <Select
                  v-model="formTemplate.cmpTeddyId"
                  label-in-value
                  @on-change="cmpTeddyChange"
                  :disabled="type == 2 ? true : false"
                >
                  <Option
                    v-for="item in allCompanyData"
                    :key="item.dv"
                    :value="item.did"
                    >{{ item.dv }}</Option
                  >
                </Select>
              </FormItem>
            </Form>
          </Panel>
        </Collapse>

        <SinglePicture
          v-if="formTemplate.templateType == 1"
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></SinglePicture>

        <MultiPicture
          v-else-if="formTemplate.templateType == 2"
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></MultiPicture>

        <VideoTemplate
          v-else-if="formTemplate.templateType == 3"
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></VideoTemplate>

        <ShowcaseTemplate
          v-else-if="formTemplate.templateType == 4"
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></ShowcaseTemplate>

        <NoticeTemplate
          v-else-if="formTemplate.templateType == 5"
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></NoticeTemplate>

        <Application
          v-else-if="formTemplate.templateType == 6"
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></Application>

        <CouponTemplate
          v-else
          :ref="getRefName"
          :templateData="templateData"
          :type="type"
          @getFormValidate="getFormValidate"
        ></CouponTemplate>

        <div class="btnList">
          <Button @click="closeCurrentTag" type="default">关闭</Button>
          <template v-if="type != 3">
            <Button
              @click="handleSubmit(1)"
              type="primary"
              :loading="formTemplate.type == 1 && submitLoading"
              >保存草稿</Button
            >

            <Button
              @click="handleSubmit(2)"
              type="primary"
              :loading="formTemplate.type == 2 && submitLoading"
              >提交审核</Button
            >
          </template>
        </div>
      </Col>

      <Col :xs="24" :sm="10">
        <SinglePicturePhone
          :vendor="vendor"
          v-if="formTemplate.templateType == 1"
        >
        </SinglePicturePhone>

        <MultiPicturePhone
          v-else-if="formTemplate.templateType == 2"
          :vendor="vendor"
        ></MultiPicturePhone>

        <VideoPhone
          v-else-if="formTemplate.templateType == 3"
          :vendor="vendor"
        ></VideoPhone>

        <ShowcasePhone
          v-else-if="formTemplate.templateType == 4"
          :vendor="vendor"
        ></ShowcasePhone>

        <NotifyPhone
          v-else-if="formTemplate.templateType == 5"
          :vendor="vendor"
        ></NotifyPhone>

        <ApplicationPhone
          :vendor="vendor"
          v-else-if="formTemplate.templateType == 6"
        ></ApplicationPhone>

        <CouponPhone :vendor="vendor" v-else></CouponPhone>

        <div class="vendorBtn">
          <RadioGroup v-model="vendor" type="button" button-style="solid">
            <Radio
              v-for="item in vendorBtnData"
              :label="item.did"
              :key="item.dv"
              >{{ item.dv }}</Radio
            >
          </RadioGroup>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import SinglePicturePhone from "./phone/singlePicturePhone.vue";
import MultiPicturePhone from "./phone/multiPicturePhone.vue";
import ShowcasePhone from "./phone/showcasePhone.vue";
import VideoPhone from "./phone/videoPhone.vue";
import NotifyPhone from "./phone/notifyPhone.vue";
import ApplicationPhone from "./phone/applicationsPhone.vue";
import CouponPhone from "./phone/couponPhone.vue";

import { remoteKeyFactory } from "@/libs/util";
import { keyFactory } from "@/libs/tools.js";
import SinglePicture from "./templateType/singlePicture.vue";
import MultiPicture from "./templateType/multiPicture.vue";
import Application from "./templateType/application.vue";
import NoticeTemplate from "./templateType/noticeTemplate.vue";
import CouponTemplate from "./templateType/couponTemplate.vue";
import VideoTemplate from "./templateType/videoTemplates.vue";
import ShowcaseTemplate from "./templateType/showcaseTemplate.vue";

export default {
  name: "createTemplate",
  components: {
    SinglePicturePhone,
    MultiPicturePhone,
    VideoPhone,
    ShowcasePhone,
    NotifyPhone,
    ApplicationPhone,
    CouponPhone,

    SinglePicture,
    MultiPicture,
    Application,
    NoticeTemplate,
    CouponTemplate,
    VideoTemplate,
    ShowcaseTemplate
  },

  data() {
    return {
      refName: [
        "SinglePicture",
        "MultiPicture",
        "VideoTemplate",
        "ShowcaseTemplate",
        "NoticeTemplate",
        "Application",
        "CouponTemplate"
      ],
      collapseTemplate: "collapseTemplate",
      SearTemplateType: remoteKeyFactory.getConstStore("templateType"),
      formTemplate: {
        templateType: null,
        cmpTeddyId: null,
        companyName: null,
        type: 2
      },
      ruleTemplate: {
        cmpTeddyId: [
          {
            required: true,
            message: "请选择公众号"
          }
        ]
      },
      templateData: {},
      temPlateId: "", // 模板id 编辑或复制时根据id获取模板
      allCompanyData: [],
      templatePannelData: {},
      type: null, //1复制，2编辑,
      btnListData: keyFactory.getConstStore(11),
      vendorBtnData: [],
      vendor: null
    };
  },
  mounted() {
    //获取路由参数
    let query = this.$route.query;
    this.temPlateId = query.temPlateId;
    this.type = Number(query.type);
    this.formTemplate.templateType = Number(query.templateType);
    this.setTemplatePannelData(this.templateType);
    if (this.temPlateId) {
      //编辑
      this.getTemplate();
      this.getCompanyAll();
    } else {
      //新增
      this.getCompanyAll();
    }

    this.vendorBtnData = this.btnListData[
      this.formTemplate.templateType - 1
    ].cn; //各厂商模板支持情况
    this.vendor = this.vendorBtnData[0].did; //默认显示的厂商
  },

  computed: {
    //获取组件名称
    getRefName() {
      return this.refName[this.formTemplate.templateType - 1];
    },
    //获取是否提交中
    submitLoading() {
      return this.$store.state.user.submitLoading;
    }
  },
  watch: {
    //监听是否正在提交
    submitLoading() {
      return this.$store.state.user.submitLoading;
    },
    //监听templatePannelData并写进store
    templatePannelData: {
      handler(newVal) {
        this.setTemplatePannelData(newVal);
      },
      deep: true
    },
    formTemplate: {
      handler(newVal) {
        this.setTemplatePannelData(
          Object.assign(this.templatePannelData, newVal)
        );
      },
      deep: true
    }
  },

  methods: {
    ...mapMutations({
      closeTag: "app/closeTag",
      setTemplateType: "app/setTemplateType",
      setTemplatePannelData: "app/setTemplatePannelData"
    }),

    //获取模板参数
    getFormValidate(data) {
      this.templatePannelData = Object.assign(data, this.formTemplate);
    },

    //关闭当前页
    closeCurrentTag() {
      this.closeTag(this.$route);
    },

    //选择模板类型
    templateTypeChange(val) {
      this.setTemplateType(val);
      this.setTemplatePannelData(this.formTemplate);
      this.vendorBtnData = this.btnListData[val - 1].cn;
      this.vendor = this.vendorBtnData[0].did;
    },

    //选择公众号
    cmpTeddyChange({ label }) {
      this.formTemplate.companyName = label;
      this.setTemplatePannelData(this.formTemplate);
      this.templatePannelData = Object.assign(
        this.templatePannelData,
        this.formTemplate
      );
      this.setTemplatePannelData(this.templatePannelData);
    },

    //根据id获取模板，编辑or复制时调用
    getTemplate() {
      this.$post(this.$api.template.getTemplate, { id: this.temPlateId }).then(
        res => {
          if (res.error == 0) {
            let templateData = res.data;
            this.formTemplate.templateType = templateData.templateType;
            this.formTemplate.cmpTeddyId = templateData.cmpTeddyId;
            this.formTemplate.companyName = templateData.companyName;
            this.templateData = templateData;
          }
        }
      );
    },

    //获取全部公众号
    getCompanyAll() {
      this.$post(this.$api.company.getCompanyAll, {}).then(res => {
        let allCompanyData = [];
        if (res.error == 0 && res.data && res.data.length > 0) {
          res.data.filter(item => {
            allCompanyData.push({
              did: item.teddyId,
              dv: item.companyaNme
            });
          });
          this.allCompanyData = allCompanyData;
        }
      });
    },

    handleSubmit(idx) {
      this.formTemplate.type = idx;
      this.$refs.formTemplate.validate(valid => {
        if (valid) {
          this.valiChildTemplate(
            this.refName[this.formTemplate.templateType - 1]
          );
        }
      });
    },

    valiChildTemplate(tp) {
      let formValidate = this.$refs[tp].validTemplateForm();
      if (JSON.stringify(formValidate) == "{}") {
        return;
      }
      let axioxUrl = "";
      if (this.type == 2) {
        //编辑
        this.formTemplate.id = this.temPlateId;
        axioxUrl = this.$api.template.updateTemplate;
      } else {
        if (this.type == 1) {
          this.formTemplate.id = this.temPlateId;
        }
        axioxUrl = this.$api.template.saveTemplate;
      }

      this.$post(axioxUrl, Object.assign(formValidate, this.formTemplate)).then(
        res => {
          if (res.error == 0) {
            this.$Message.success(
              this.action == "add" ? "模板添加成功!" : "模板编辑成功！"
            );
            this.$nextTick(() => {
              this.closeCurrentTag();
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="less">
@import "./singleForm.less";
@import "./phone/phone.less";
.ivu-radio-group-button .ivu-radio-wrapper-checked {
  color: #ffffff;
  background: #44a1f2;
}
.vendorBtn {
  .ivu-radio-group-button .ivu-radio-wrapper-checked {
    color: #ffffff;
    background: #44a1f2;
  }
  margin-top: 20px;
  width: 292px;
  transform: translate(30%);
  text-align: center;
}
</style>
