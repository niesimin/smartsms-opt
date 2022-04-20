<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="120"
    >
      <Collapse v-model="collapseVal">
        <Panel name="infoCollapse">
          消息内容
          <div slot="content">
            <FormItem label="模板名称" prop="templateName">
              <Input
                v-model="formValidate.templateName"
                placeholder="请输入投模板名称，用于区分不同模板"
                maxlength="20"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="短信原文" prop="templateText">
              <Input
                type="textarea"
                v-model="formValidate.templateText"
                placeholder="请输入内容"
                maxlength="300"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="上传顶部图片" prop="notice.url">
              <UploadFile
                v-model="formValidate.notice.url"
                ref="uploadNotice"
                aspectRatio="3 / 1"
                :maxSize="500"
                :url="formValidate.notice.url"
                :crop="true"
                @cropSuccess="getNoticeUrl"
              >
                <img
                  :src="formValidate.notice.url"
                  v-if="formValidate.notice.url"
                />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon
                      type="ios-information-circle-outline"
                    />图片支持JPG、JPEG、PNG格式，大小限制500kb，比例3:1
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem label="图片跳转类型" prop="notice.urlClickAction.type">
              <Select v-model="formValidate.notice.urlClickAction.type">
                <Option
                  v-for="item in SearJudgeType"
                  :key="item.dv"
                  :value="item.did"
                  >{{ item.dv }}</Option
                >
              </Select>
            </FormItem>

            <FormItem
              :label="
                formValidate.notice.urlClickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="notice.urlClickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.notice.urlClickAction.url"
                :placeholder="
                  formValidate.notice.urlClickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.notice.urlClickAction.type == 1"
              label="备用链接"
              prop="notice.urlClickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.notice.urlClickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="notice.urlClickAction.pkgName"
              v-if="formValidate.notice.urlClickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.notice.urlClickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="跳转名称" prop="notice.urlClickAction.appName">
              <Input
                v-model="formValidate.notice.urlClickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="标题" prop="notice.title">
              <Input
                type="textarea"
                v-model="formValidate.notice.title"
                placeholder="请输入通知模板标题，超出文字客户端将省略...展示"
                maxlength="15"
                show-word-limit
              ></Input>
            </FormItem>

            <div class="message">
              <FormItem
                v-for="(item, idx) in formValidate.notice.messageList"
                :key="idx + 'msg'"
                :label="'通知' + (idx + 1)"
                :prop="'notice.messageList.' + idx + '.name'"
                :rules="{ required: true, message: '请输入通知描述' }"
              >
                <Row>
                  <Col span="10">
                    <Input
                      type="textarea"
                      v-model="item.name"
                      placeholder="请输入通知描述"
                      maxlength="20"
                      show-word-limit
                    ></Input
                  ></Col>
                  <Col span="2" class="connectInput">——</Col>
                  <Col span="10"
                    ><FormItem
                      :prop="'notice.messageList.' + idx + '.content'"
                      :rules="{ required: true, message: '请输入通知正文' }"
                    >
                      <Input
                        type="textarea"
                        v-model="item.content"
                        placeholder="请输入通知正文"
                        maxlength="20"
                        show-word-limit
                      ></Input></FormItem
                  ></Col>
                  <Col span="2" class="connectInput" v-if="idx != 0">
                    <Icon
                      type="ios-trash"
                      size="30"
                      class="text-danger"
                      @click="delMessage(idx)"
                  /></Col>
                </Row>
              </FormItem>
              <div style="padding-left:120px">
                <div class="text-gray">
                  <Icon
                    type="ios-information-circle-outline"
                  />如通知正文中涉及金额，请输入金额单位，如“人民币”，“美元”，勿使用“圆”、“元”。
                </div>
                <div
                  v-if="formValidate.notice.messageList.length < 4"
                  style="margin-top:10px;text-align:right;padding-right:35px"
                >
                  <span class="text-gray" style="margin-left:10px">
                    <Icon
                      type="ios-information-circle-outline"
                    />通知可以添加1-4个。
                  </span>
                  <Button icon="md-add" type="primary" ghost @click="addMessage"
                    >添加通知</Button
                  >
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          class="addPannel"
          v-for="(item, idx) in formValidate.notice.buttonList"
          :name="'btnCollapse' + idx"
          :key="idx + 'btn'"
        >
          <span class="addPannelIcon">
            <span
              class="text-gray"
              style="text-align:right;margin-bottom:10px"
              v-if="idx == formValidate.notice.buttonList.length - 1"
            >
              (<Icon
                type="ios-information-circle-outline"
              />按钮可以添加1-2个。)
            </span>
            <Button
              v-if="formValidate.notice.buttonList.length == 1"
              type="primary"
              ghost
              icon="md-add"
              @click.stop="addMessageBtn"
              >添加消息按钮</Button
            >

            <Button
              v-if="idx != 0"
              class="delPannelIcon"
              icon="ios-trash"
              @click.stop="delMessageBtn(idx)"
              >删除消息按钮</Button
            >
          </span>
          消息按钮{{ idx + 1 }}
          <div slot="content">
            <FormItem
              :label="'按钮' + (idx + 1) + '文案'"
              :prop="'notice.buttonList.' + idx + '.title'"
              :rules="{ required: true, message: '请输入按钮文案' }"
            >
              <Input
                v-model="item.title"
                placeholder="请输入按钮文案，超出文字客户端将省略...展示"
                maxlength="5"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="按钮跳转类型"
              :prop="'notice.buttonList.' + idx + '.clickAction.type'"
              :rules="{ required: true, message: '请选择按钮跳转类型' }"
            >
              <Select v-model="item.clickAction.type">
                <Option
                  v-for="item in SearJudgeType"
                  :key="item.dv"
                  :value="item.did"
                  >{{ item.dv }}</Option
                >
              </Select>
            </FormItem>

            <FormItem
              :label="item.clickAction.type == 0 ? 'H5链接' : '直达链接'"
              :prop="'notice.buttonList.' + idx + '.clickAction.url'"
              :rules="{ required: true, message: '请输入链接' }"
            >
              <Input
                type="textarea"
                v-model="item.clickAction.url"
                :placeholder="
                  item.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="item.type == 1"
              label="备用链接"
              :prop="'notice.buttonList.' + idx + '.clickAction.backupUrl'"
              :rules="{ required: true, message: '请输入备用链接' }"
            >
              <Input
                type="textarea"
                v-model="item.clickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              :prop="'notice.buttonList.' + idx + '.clickAction.pkgName'"
              :rules="{ required: true, message: '请输入安装包名' }"
              v-if="item.type == 1"
            >
              <Input
                type="textarea"
                v-model="item.clickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="跳转名称"
              :prop="'notice.buttonList.' + idx + '.clickAction.appName'"
            >
              <Input
                v-model="item.clickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>
          </div>
        </Panel>
      </Collapse>
    </Form>
  </div>
</template>

<script>
import { keyFactory } from "@/libs/tools.js";
import UploadFile from "@/components/upload/upload.vue";
import createTemplateMixin from "./createTemplate-mixin";
export default {
  name: "NoticeTemplate",
  components: { UploadFile },
  mixins: [createTemplateMixin],
  data() {
    return {
      collapseVal: ["infoCollapse", "btnCollapse0", "btnCollapse1"],
      SearJudgeType: keyFactory.getConstStore(12),
      showUploadUrl: false,
      formValidate: {
        templateName: "",
        templateText: "",

        notice: {
          title: "",
          url: "",

          urlClickAction: {
            type: "0",
            url: "",
            backupUrl: "",
            pkgName: "",
            appName: ""
          },

          messageList: [
            {
              name: "",
              content: ""
            }
          ],

          buttonList: [
            {
              title: "",
              clickAction: {
                type: "0",
                url: "",
                backupUrl: "",
                pkgName: "",
                appName: ""
              }
            }
          ]
        }
      },
      ruleValidate: {
        templateName: [
          {
            required: true,
            message: "请输入模板名称"
          }
        ],

        "notice.url": [
          {
            required: true,
            message: "请上传图片"
          }
        ],
        "notice.title": [
          {
            required: true,
            message: "请输入标题"
          }
        ],
        "notice.type": [
          {
            required: true
          }
        ],
        "notice.urlClickAction.type": [
          {
            required: true
          }
        ],
        "notice.urlClickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "notice.urlClickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ],
        "notice.urlClickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ]
      }
    };
  },
  methods: {
    //获取上传图片链接
    getNoticeUrl({ cropperedUrl, file }) {
      let params = {
        type: 4,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.notice.url = res.imgPath;
          this.$refs.uploadNotice.onUploadSuccess();
        } else {
          this.$refs.uploadNotice.onUploadError(res);
        }
      });
    },
    //获取表单数据
    validTemplateForm() {
      let param = {};
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          param.templateName = this.formValidate.templateName;
          param.templateText = this.formValidate.templateText;
          param.notice = JSON.stringify(this.formValidate.notice);
        }
      });
      return param;
    },

    addMessage() {
      let msg = {
        name: "",
        content: ""
      };
      this.formValidate.notice.messageList.push(msg);
    },

    delMessage(idx) {
      this.formValidate.notice.messageList.splice(idx, 1);
    },

    addMessageBtn() {
      let buttonList = {
        title: "",
        clickAction: {
          type: "0",
          url: "",
          backupUrl: "",
          pkgName: "",
          appName: ""
        }
      };
      this.formValidate.notice.buttonList.push(buttonList);
    },

    delMessageBtn(idx) {
      this.formValidate.notice.buttonList.splice(idx, 1);
    }
  }
};
</script>
