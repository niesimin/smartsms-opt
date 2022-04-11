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

            <!-- <FormItem label="短信原文" prop="templateText">
              <Contentedit
                placeholder="请输入短信原文"
                maxlength="10"
                show-word-limit
              >
              </Contentedit>
            </FormItem> -->
            <FormItem label="短信原文" prop="templateText">
              <Input
                type="textarea"
                v-model="formValidate.templateText"
                placeholder="请输入内容"
                maxlength="300"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="上传图片" prop="singlePicture.url">
              <UploadFile
                ref="uploadTemplate"
                :maxSize="500"
                :url="formValidate.singlePicture.url"
                :crop="true"
                @cropSuccess="getUploadUrl"
              >
                <img
                  :src="formValidate.singlePicture.url"
                  v-if="formValidate.singlePicture.url"
                />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon
                      type="ios-information-circle-outline"
                    />图片支持JPG、JPEG、PNG格式，大小限制500kb，比例16:9，尺寸建议1248*702px
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem
              label="图片跳转类型"
              prop="singlePicture.clickAction.type"
            >
              <Select v-model="formValidate.singlePicture.clickAction.type">
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
                formValidate.singlePicture.clickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="singlePicture.clickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.clickAction.url"
                :placeholder="
                  formValidate.singlePicture.clickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.singlePicture.clickAction.type == 1"
              label="备用链接"
              prop="singlePicture.clickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.clickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="singlePicture.clickAction.pkgName"
              v-if="formValidate.singlePicture.clickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.clickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="跳转名称" prop="singlePicture.clickAction.appName">
              <Input
                v-model="formValidate.singlePicture.clickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="标题" prop="singlePicture.title">
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.title"
                placeholder="请输入标题，超出文字客户端将省略...展示"
                maxlength="17"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="图片摘要" prop="singlePicture.introduction">
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.introduction"
                placeholder="请输入图片摘要，超出文字客户端将省略...展示"
                maxlength="38"
                show-word-limit
              ></Input>
            </FormItem>
          </div>
        </Panel>

        <Panel name="btnCollapse">
          消息按钮
          <div slot="content">
            <FormItem label="按钮文案" prop="singlePicture.button.title">
              <Input
                v-model="formValidate.singlePicture.button.title"
                placeholder="请输入按钮文案，超出文字客户端将省略...展示"
                maxlength="5"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="按钮跳转类型"
              prop="singlePicture.button.clickAction.type"
            >
              <Select
                v-model="formValidate.singlePicture.button.clickAction.type"
              >
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
                formValidate.singlePicture.button.clickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="singlePicture.button.clickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.button.clickAction.url"
                :placeholder="
                  formValidate.singlePicture.button.clickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.singlePicture.button.clickAction.type == 1"
              label="备用链接"
              prop="singlePicture.button.clickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="
                  formValidate.singlePicture.button.clickAction.backupUrl
                "
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="singlePicture.button.clickAction.pkgName"
              v-if="formValidate.singlePicture.button.clickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.singlePicture.button.clickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="跳转名称"
              prop="singlePicture.button.clickAction.appName"
            >
              <Input
                v-model="formValidate.singlePicture.button.clickAction.appName"
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
//import Contentedit from "@/components/contenteditable/contenteditable.vue";
import createTemplateMixin from "./createTemplate-mixin";
export default {
  name: "SinglePicture",
  components: {
    UploadFile
    //  Contentedit
  },
  mixins: [createTemplateMixin],
  data() {
    return {
      collapseVal: ["infoCollapse", "btnCollapse"],
      SearJudgeType: keyFactory.getConstStore(12),
      formValidate: {
        templateName: "",
        templateText: "",

        singlePicture: {
          title: "",
          introduction: "",
          url: "",

          clickAction: {
            type: "0",
            url: "",
            backupUrl: "",
            pkgName: "",
            appName: ""
          },

          button: {
            title: "",
            clickAction: {
              type: "0",
              url: "",
              backupUrl: "",
              pkgName: "",
              appName: ""
            }
          }
        }
      },
      ruleValidate: {
        templateName: [
          {
            required: true,
            message: "请输入模板名称"
          }
        ],

        "singlePicture.url": [
          {
            required: true,
            message: "请上传图片"
          }
        ],
        "singlePicture.title": [
          {
            required: true,
            message: "请输入标题"
          }
        ],
        "singlePicture.introduction": [
          {
            required: true,
            message: "请输入图片摘要"
          }
        ],
        "singlePicture.type": [
          {
            required: true
          }
        ],
        "singlePicture.clickAction.type": [
          {
            required: true
          }
        ],
        "singlePicture.clickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "singlePicture.clickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ],
        "singlePicture.clickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ],
        "singlePicture.button.title": [
          {
            required: true,
            message: "请输入按钮文字"
          }
        ],
        "singlePicture.button.clickAction.type": [
          {
            required: true
          }
        ],
        "singlePicture.button.clickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "singlePicture.button.clickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ],
        "singlePicture.button.clickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ]
      }
    };
  },

  methods: {
    //获取上传图片链接
    getUploadUrl({ cropperedUrl, file }) {
      let params = {
        type: 0,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.singlePicture.url = res.imgPath;
          this.$refs.uploadTemplate.onUploadSuccess();
        } else {
          this.$refs.uploadTemplate.onUploadError(res);
        }
      });
    },
    //获取表单数据
    validTemplateForm() {
      let parma = {};
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          parma.templateName = this.formValidate.templateName;
          parma.templateText = this.formValidate.templateText;
          parma.singlePicture = JSON.stringify(this.formValidate.singlePicture);
        }
      });
      return parma;
    }
  }
};
</script>
<style lang="less">
// .addPannel {
//   .ivu-collapse-header {
//     .addPannelIcon {
//       position: absolute;
//       right: 40px;
//       z-index: 1;
//       button {
//         margin-right: 10px;
//       }
//       span {
//         margin-left: 0;
//         margin-top: -10px;
//       }
//       .ivu-icon {
//         vertical-align: sub;
//         font-size: 20px;
//       }
//       .delPannelIcon {
//         color: #ed4014;
//         border-color: #ed4014;
//       }
//     }
//   }
// }
</style>
