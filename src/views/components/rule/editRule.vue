<template>
  <div class="singleForm">
    <Row>
      <Col :xs="24" :sm="14" class="left-form">
        <Form
          ref="formTemplate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="120"
        >
          <Collapse v-model="collapseVal">
            <Panel name="infoCollapse">
              投放规则
              <div slot="content">
                <FormItem label="投放名称" prop="putName">
                  <Input
                    :disabled="action == 'add' ? false : true"
                    v-model="formValidate.putName"
                    placeholder="请输入投放规则名称，用于区分不同场景投放"
                    maxlength="20"
                    show-word-limit
                  ></Input>
                </FormItem>

                <FormItem label="投放方式" prop="putType">
                  <RadioGroup v-model="formValidate.putType">
                    <Radio
                      :disabled="action == 'add' ? false : true"
                      v-for="item in SearchPutType"
                      :key="item.dv"
                      :label="item.did"
                      >{{ item.dv }}</Radio
                    >
                  </RadioGroup>
                </FormItem>

                <Row>
                  <Col span="12">
                    <FormItem label="关联公众号" prop="cmpTeddyId">
                      <Select
                        :disabled="action == 'add' ? false : true"
                        v-model="formValidate.cmpTeddyId"
                        transfer
                        label-in-value
                        @on-change="companyChange"
                      >
                        <Option
                          v-for="item in allCompanyData"
                          :key="item.did"
                          :value="item.did"
                          >{{ item.dv }}</Option
                        >
                      </Select>
                    </FormItem></Col
                  >
                  <Col span="12" v-if="formValidate.cmpTeddyId">
                    <FormItem label="模板" prop="templateId">
                      <Select
                        :disabled="action == 'add' ? false : true"
                        v-model="formValidate.templateId"
                        transfer
                        label-in-value
                        @on-change="templateChange"
                      >
                        <Option
                          v-for="item in allTemplateData"
                          :key="item.did"
                          :value="item.did"
                          >{{ item.dv
                          }}<i style="display:none">{{
                            "_" + item.id
                          }}</i></Option
                        >
                      </Select>
                    </FormItem></Col
                  >
                </Row>

                <FormItem label="签名" prop="signature">
                  <Input
                    :disabled="action == 'add' ? false : true"
                    v-model="formValidate.signature"
                    placeholder="请输入短信签名，无需填写【】,用于投放识别模板"
                    maxlength="10"
                    show-word-limit
                  ></Input>
                </FormItem>

                <FormItem label="短信正文" prop="smsText">
                  <Input
                    :disabled="action == 'add' ? false : true"
                    type="textarea"
                    v-model="formValidate.smsText"
                    placeholder="短信正文无需输入签名，如正文存在变量，请选中文本，点击设置变量"
                    maxlength="300"
                    show-word-limit
                    :rows="4"
                  ></Input>
                </FormItem>

                <FormItem
                  label="通道号"
                  prop="channelNum"
                  v-show="formValidate.putType == 1"
                >
                  <Input
                    :disabled="action == 'add' ? false : true"
                    type="textarea"
                    v-model="formValidate.channelNum"
                    placeholder="请输入通道号，支持数字，多个通道号以英文逗号隔开，如是号段，以%结尾"
                    maxlength="60"
                    show-word-limit
                    :rows="2"
                  ></Input>
                </FormItem>

                <template v-if="formValidate.putType == 0">
                  <FormItem
                    label="URL匹配模式"
                    prop="matchType"
                    v-if="formValidate.putType == 0"
                  >
                    <RadioGroup v-model="formValidate.matchType">
                      <Radio
                        :disabled="action == 'add' ? false : true"
                        v-for="item in SearchMatchType"
                        :key="item.dv"
                        :label="item.did"
                        >{{ item.dv }}
                        <Tooltip
                          v-if="item.did == 0"
                          max-width="400"
                          :transfer="true"
                          placement="top"
                          style="margin:0 10px 0 -2px"
                        >
                          <Icon size="18" type="md-help-circle" />
                          <div slot="content">
                            <p>
                              URL完全一致才会被识别。
                            </p>
                            <p>
                              例如：投放URL为ted.top/abc，则短信URL也为ted.top/abc
                              会被识别解析。
                            </p>
                          </div>
                        </Tooltip>

                        <Tooltip
                          v-else
                          max-width="600"
                          :transfer="true"
                          placement="top"
                          style="margin:0 10px 0 -2px"
                        >
                          <Icon size="18" type="md-help-circle" />
                          <div slot="content">
                            <p>
                              只要短信中URL与投放中所填URL前缀一致即可识别；
                            </p>
                            <p>
                              例如：投放URL为td6.cn/abc，短信中URL为ted.top/abc/123、ted.top/abc/456都会被识别。
                            </p>
                            <p>
                              且当前仅支持用/拼接用户标识
                            </p>
                          </div>
                        </Tooltip>
                      </Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem
                    label="URL"
                    prop="url"
                    v-if="formValidate.putType == 0"
                  >
                    <Input
                      :disabled="action == 'add' ? false : true"
                      type="textarea"
                      :rows="4"
                      v-model="formValidate.url"
                      placeholder="1、URL无需加http/https;2、不可仅输入域名，例如：td6.cn，正确实例：td6.cn/abcd、td6.cn/abcd/123"
                      maxlength="500"
                      show-word-limit
                    ></Input>

                    <span class="insertShortUrl" v-if="action == 'add'"
                      ><span class="text-primary" @click="insertShortUrl"
                        ><Icon type="ios-link" size="16" />插入短链</span
                      >
                      <span class="text-primary" @click="openAddShortUrlModal"
                        ><Icon type="ios-link" size="16" />创建短链</span
                      ></span
                    >
                  </FormItem>
                  <div
                    class="text-gray"
                    style="text-align:right;margin-top:-20px;font-size:12px"
                  >
                    <Icon
                      type="md-alert"
                    />提示：1、如使用非泰迪熊短链，请确保输入的短链域名已经提前报备，否则无法提交。
                  </div>
                </template>
              </div>
            </Panel>

            <Panel name="btnCollapse">
              投放配置
              <div slot="content">
                <FormItem label="投放厂商">
                  <Select transfer v-model="vendorValue" disabled multiple>
                    <Option
                      v-for="item in vendorBtnData"
                      :key="item.did"
                      :value="item.did"
                      >{{ item.dv }}</Option
                    >
                  </Select>
                </FormItem>
              </div>
            </Panel>
          </Collapse>
        </Form>
        <div class="btnList">
          <!-- <h2>ID: {{ $route.query.action }}</h2> -->
          <Button @click="closeTemplate" type="default">关闭</Button>
          <Button v-if="action == 'add'" @click="handleAddSubmit" type="primary"
            >确定</Button
          >
        </div>
      </Col>

      <Col :xs="24" :sm="10">
        <SinglePicturePhone
          :vendor="vendor"
          v-if="formValidate.templateType == 1"
        >
        </SinglePicturePhone>

        <MultiPicturePhone
          v-else-if="formValidate.templateType == 2"
          :vendor="vendor"
        ></MultiPicturePhone>

        <VideoPhone
          v-else-if="formValidate.templateType == 3"
          :vendor="vendor"
        ></VideoPhone>

        <ShowcasePhone
          v-else-if="formValidate.templateType == 4"
          :vendor="vendor"
        ></ShowcasePhone>

        <NotifyPhone
          v-else-if="formValidate.templateType == 5"
          :vendor="vendor"
        ></NotifyPhone>

        <ApplicationPhone
          :vendor="vendor"
          v-else-if="formValidate.templateType == 6"
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

    <!-- 插入短链 -->
    <FormModal
      formTitleIcon="md-list-box"
      formTitleText="选择短链"
      :width="1100"
      @onvisiblechange="onvisiblechange"
      ref="selectShortUrl"
      class="insertUrl"
      @handleSubmit="handleUrlSubmit"
    >
      <div class="vendorBtn">
        <RadioGroup
          v-model="shortUrlType"
          type="button"
          button-style="solid"
          @on-change="shortUrlChange"
        >
          <Radio
            v-for="item in shortUrlTypeData"
            :label="item.did"
            :key="item.dv"
            >{{ item.dv }}</Radio
          >
        </RadioGroup>
      </div>

      <div class="searchInput">
        <Input
          v-if="shortUrlType == 1"
          v-model="shortUrlParams.shortUrlName"
          search
          placeholder="请输入短链名称"
          @on-enter="searShortchUrl"
        />

        <Input
          v-else
          v-model="realmParams.shortChain"
          search
          placeholder="请输入域名"
          @on-enter="searShortchUrl"
        />
      </div>

      <ReadOnlyTable
        @on-checked="onchecked"
        v-if="shortUrlType == 1"
        :tableParma="shortUrlParams"
        :axiosUrl="$api.url.getShortUrlList"
        :columns="shortUrlColumns"
        key="泰迪熊短链"
        ref="shortUrlTable"
      ></ReadOnlyTable>

      <ReadOnlyTable
        ref="realmTable"
        @on-checked="onchecked"
        key="域名报备"
        v-else
        :tableParma="realmParams"
        :axiosUrl="$api.url.getUrlList"
        :columns="realmColumns"
      ></ReadOnlyTable>
    </FormModal>

    <!-- 新增短链 -->
    <FormModal ref="addShortUrlModal" @handleSubmit="handleAddShortUrlSubmit">
      <Form
        ref="formAddShortUrlValidate"
        :model="formAddShortUrlValidate"
        :rules="shortUrlValidate"
        :label-width="120"
      >
        <Alert show-icon style="width:85%;margin:0 auto 20px">
          提示：支持将长链接一键生成短链,短链具备数据统计功能；
          <div>
            新建短链默认有效时长365天。
          </div>
        </Alert>
        <FormItem label="短链名称" prop="shortUrlName">
          <Input
            v-model="formAddShortUrlValidate.shortUrlName"
            placeholder="请输入短链名称,用于区分域名，限制20字"
            maxlength="20"
            show-word-limit
          ></Input>
        </FormItem>

        <FormItem label="原链" prop="landingUrl">
          <Input
            v-model="formAddShortUrlValidate.landingUrl"
            placeholder="请输入http://或https://开头的原链接网址"
            maxlength="500"
            show-word-limit
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
    </FormModal>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import SinglePicturePhone from "@/views/components/template/phone/singlePicturePhone.vue";
import MultiPicturePhone from "@/views/components/template/phone/multiPicturePhone.vue";
import ShowcasePhone from "@/views/components/template/phone/showcasePhone.vue";
import VideoPhone from "@/views/components/template/phone/videoPhone.vue";
import NotifyPhone from "@/views/components/template/phone/notifyPhone.vue";
import ApplicationPhone from "@/views/components/template/phone/applicationsPhone.vue";
import CouponPhone from "@/views/components/template/phone/couponPhone.vue";
import { keyFactory } from "@/libs/tools.js";

import FormModal from "@/components/modal/formModal.vue";
import ReadOnlyTable from "@/components/tables/readOnlyTable.vue";
import { getFormatTimesTamp } from "@/libs/tools";

export default {
  name: "EditRule",
  components: {
    SinglePicturePhone,
    MultiPicturePhone,
    VideoPhone,
    ShowcasePhone,
    NotifyPhone,
    ApplicationPhone,
    CouponPhone,
    FormModal,
    ReadOnlyTable
  },
  data() {
    return {
      action: "",
      id: null,
      allCompanyData: [], //所有公众号
      allTemplateData: [], //所有模板
      collapseVal: ["infoCollapse", "btnCollapse"],
      SearchPutType: keyFactory.getConstStore(8),
      SearchCmpTeddy: keyFactory.getConstStore(10),
      SearchMatchType: keyFactory.getConstStore(13),
      SearchUrlType: keyFactory.getConstStore(14),

      urlType: 0,
      formValidate: {
        putName: "",
        putType: 0,
        cmpTeddyId: null,
        companyName: "",
        templateId: null,
        templateName: "",
        templateType: null,
        signature: "",
        smsText: "",
        channelNum: "",
        matchType: 0,
        url: ""
      },
      ruleValidate: {
        putName: [
          {
            required: true,
            message: "请输入投放名称"
          }
        ],
        cmpTeddyId: [
          {
            required: true,
            message: "请选择关联公众号"
          }
        ],
        templateId: [
          {
            required: true,
            message: "请选择关联公众号模板"
          }
        ],
        signature: [
          {
            required: true,
            message: "请输签名"
          }
        ],
        smsText: [
          {
            required: true,
            message: "请输入短信正文"
          }
        ],
        putType: [
          {
            required: true,
            message: "请选择投放方式"
          }
        ],
        url: [
          {
            required: true,
            message: "URL不能为空"
          }
        ],
        matchType: [
          {
            required: true,
            message: "请选择匹配模式"
          }
        ],
        channelNum: [{ required: false }]
      },
      templateId: null,
      vendorBtnData: [],
      vendorValue: [],
      btnListData: keyFactory.getConstStore(11),
      vendor: null,

      shortUrlTypeData: keyFactory.getConstStore(16),
      connectTemplateType: keyFactory.getConstStore(15),
      shortUrlType: null,
      checkedUrl: "",
      shortUrlParams: {
        shortUrlName: "",
        page: 1,
        recPerPage: 8,
        accurate: false
      },
      shortUrlColumns: [
        {
          title: "单选",
          key: "",
          width: 80,
          align: "center",
          slot: "radio"
        },
        {
          title: "短链Id",
          key: "id",
          minWidth: 80
        },
        {
          title: "短链名称",
          key: "shortUrlName",
          minWidth: 150
        },
        {
          title: "短链",
          key: "shortUrl",
          minWidth: 140
        },
        {
          title: "原链",
          key: "landingUrl",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "剩余时长",
          key: "remainTime",
          width: 100,
          render: (h, { row }) => {
            return h("div", [h("div", row.remainTime + "天")]);
          }
        },
        {
          title: "创建时间",
          key: "createDate",
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.createDate));
          },
          minWidth: 170
        },
        {
          title: "是否关联模版",
          key: "associatedTemplate",
          className: "overInherit",
          keyFactoryCode: 15,
          render: (h, { row }) => {
            return h(
              "Tag",
              {
                props: {
                  color: keyFactory.getColor(
                    this.connectTemplateType,
                    row.associatedTemplate
                  )
                }
              },
              keyFactory.getValue(
                this.connectTemplateType,
                row.associatedTemplate
              )
            );
          },
          minWidth: 120
        }
      ],
      realmParams: {
        shortChain: "",
        page: 1,
        recPerPage: 8,
        accurate: false
      },
      realmColumns: [
        {
          title: "单选",
          key: "",
          width: 80,
          align: "center",
          slot: "radio"
        },
        {
          title: "域名名称",
          key: "shortChainName",
          minWidth: 130
        },
        {
          title: "域名",
          key: "shortChain",
          minWidth: 120
        },
        {
          title: "描述",
          key: "description",
          minWidth: 170
        },
        {
          title: "创建时间",
          key: "createDate",
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.createDate));
          },
          minWidth: 170
        },
        {
          title: "更新时间",
          key: "updateDate",
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.updateDate));
          },
          minWidth: 170
        }
      ],
      formAddShortUrlValidate: {
        shortUrlName: "",
        landingUrl: ""
      },
      shortUrlValidate: {
        shortUrlName: [
          {
            required: true,
            max: 20,
            message: "域名名称不能为空"
          }
        ],
        landingUrl: [
          {
            required: true,
            type: "url",
            message: "请填写原链"
          }
        ]
      }
    };
  },

  mounted() {
    this.action = this.$route.query.action;
    if (this.$route.query.action == "add") {
      this.getCompanyAll();
    } else {
      this.getRule(this.$route.query.id);
    }
  },

  methods: {
    ...mapMutations({
      closeTag: "app/closeTag",
      setTemplatePannelData: "app/setTemplatePannelData"
    }),

    closeTemplate() {
      this.closeTag(this.$route);
    },

    //根据id获取投放内容
    getRule(id) {
      this.$post(this.$api.rule.getRule, { id: id }).then(res => {
        if (res.error == 0) {
          this.formValidate = res.data;
          this.getCompanyAll();
        }
      });
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
          if (this.action != "add") {
            this.getTemplateAll();
          }
        }
      });
    },

    //获取全部模板
    getTemplateAll() {
      this.$post(this.$api.template.getTemplateAll, {
        teddyId: this.formValidate.cmpTeddyId
      }).then(res => {
        let allTemplateData = [];
        if (res.error == 0 && res.data && res.data.length > 0) {
          res.data.filter(item => {
            allTemplateData.push({
              did: item.templateId,
              dv: item.templateName,
              id: item.id
            });
            //templateId
            if (
              this.action != "add" &&
              this.formValidate.templateId &&
              this.formValidate.templateId == item.templateId
            ) {
              this.templateId = item.id;
            }
          });
          this.allTemplateData = allTemplateData;
          if (this.action != "add") {
            this.getTemplate();
          }
        }
      });
    },

    //根据模板id获取完整模板
    getTemplate() {
      this.$post(this.$api.template.getTemplate, {
        id: this.templateId
      }).then(res => {
        if (res.error == 0) {
          if (this.action == "add") {
            this.formValidate.signature = res.data.signature;
            this.formValidate.smsText = res.data.templateText;
          }
          this.formValidate.templateType = res.data.templateType;
          this.vendorBtnData = this.btnListData[
            this.formValidate.templateType - 1
          ]["cn"]; //各厂商模板支持情况
          this.vendor = this.vendorBtnData[0].did; //默认显示的厂商

          this.vendorValue = [];
          this.vendorBtnData.filter(item => {
            this.vendorValue.push(item.did);
          });

          this.setTemplatePannelData(res.data);
        }
      });
    },

    //监听公众号选中
    companyChange({ label }) {
      this.formValidate.companyName = label;
      this.getTemplateAll();
    },

    //监听模板选中
    templateChange({ label }) {
      this.formValidate.templateName = label.split("_")[0];
      this.templateId = label.split("_")[1];
      this.getTemplate();
    },

    handleAddSubmit() {
      this.$refs.formTemplate.validate(valid => {
        if (valid) {
          let url =
            this.action == "add"
              ? this.$api.rule.saveRule
              : this.$api.rule.updateRule;
          this.$post(url, this.formValidate).then(res => {
            if (res.error == 0) {
              this.$Message.success("操作成功!");
              this.closeTemplate();
            }
          });
        } else {
          this.$Message.error("输入有误,请检查!");
        }
      });
    },

    //点击插入短链
    insertShortUrl() {
      this.$refs.selectShortUrl.openModal();
    },

    shortUrlChange() {
      this.checkedUrl = "";
      this.shortUrlParams.shortUrlName = "";
      this.shortUrlParams.shortChain = "";
    },

    //监听短链弹窗显示
    onvisiblechange(event) {
      this.shortUrlParams.shortUrlName = "";
      this.shortUrlParams.shortChain = "";
      if (event) {
        this.shortUrlType = 1;
      } else {
        this.shortUrlType = null;
      }
    },

    //选择短链
    onchecked(row) {
      if (this.shortUrlType == 1) {
        this.checkedUrl = row.shortUrl;
      } else {
        this.checkedUrl = row.shortChain;
      }
    },

    //提交选中短链
    handleUrlSubmit() {
      if (this.checkedUrl) {
        this.formValidate.url = this.checkedUrl;
        this.$refs.selectShortUrl.colseModal();
      } else {
        this.$Message.warning("请选择要插入的短链!");
      }
    },

    //搜索短链
    searShortchUrl(e) {
      console.log(e.target.value);
      let val = e.target.value;
      if (!val) {
        this.$Message.warning("请输入搜索内容!");
        return;
      }
      if (this.shortUrlType == 1) {
        this.shortUrlParams.shortUrlName = val;
        //shortUrlTable realmTable
        this.$refs.shortUrlTable.remoteTable();
      } else {
        this.shortUrlParams.shortChain = val;
        this.$refs.realmTable.remoteTable();
      }
    },

    openAddShortUrlModal() {
      this.$refs.addShortUrlModal.openModal();
      this.$refs.formAddShortUrlValidate.resetFields();
    },

    //添加短链
    handleAddShortUrlSubmit() {
      this.$refs.formAddShortUrlValidate.validate(valid => {
        if (valid) {
          this.$post(
            this.$api.url.saveShortUrl,
            this.formAddShortUrlValidate
          ).then(res => {
            if (res.error == 0) {
              this.$Message.success("操作成功!");
              this.$refs.addShortUrlModal.colseModal();
            }
          });
        } else {
          this.$Message.error("输入有误,请检查!");
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "../template/singleForm.less";
@import "../template/phone/phone.less";
.urlItem {
  .ivu-form-item-label {
    margin-top: -30px;
  }
}
.searchInput {
  overflow: hidden;
  margin-bottom: 20px;
  .ivu-input-wrapper {
    width: 40%;
    float: right;
  }
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
.insertShortUrl {
  cursor: pointer;
  float: right;
  span {
    margin-left: 10px;
  }
}
.insertUrl {
  .vendorBtn {
    width: 100%;
    transform: translate(0%);
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
  }
}
</style>
