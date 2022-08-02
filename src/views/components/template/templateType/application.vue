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

            <FormItem label="短信原文" prop="templateTextHtml">
              <!-- <Input
                type="textarea"
                v-model="formValidate.templateText"
                placeholder="请输入内容"
                maxlength="300"
                show-word-limit
              >
              </Input> -->
              <ContentedInput
                ref="templateTextHtml"
                :maxlength="300"
                v-model="formValidate.templateTextHtml"
                placeholder="请输入内容"
                @valueChange="contentedChange"
              >
              </ContentedInput>
            </FormItem>

            <FormItem label="应用图标" prop="app.url">
              <UploadFile
                ref="uploadTemplate"
                aspectRatio="1 / 1"
                :maxSize="500"
                :url="formValidate.app.url"
                :crop="true"
                @cropSuccess="getappUrl"
              >
                <img :src="formValidate.app.url" v-if="formValidate.app.url" />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon
                      type="ios-information-circle-outline"
                    />图片支持JPG、JPEG、PNG格式，大小限制500kb，比例1:1，尺寸建议48*48px
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem label="应用名称" prop="app.appName">
              <Input
                v-model="formValidate.app.appName"
                placeholder="请输入应用名称，超出文字客户端将省略...显示"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="应用介绍" prop="app.introduction">
              <Input
                type="textarea"
                v-model="formValidate.app.introduction"
                placeholder="请输入应用介绍，超出文字客户端将省略...展示"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="按钮跳转类型" prop="app.urlClickAction.type">
              <Select v-model="formValidate.app.urlClickAction.type" disabled>
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
                formValidate.app.urlClickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="app.urlClickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.app.urlClickAction.url"
                :placeholder="
                  formValidate.app.urlClickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.app.urlClickAction.type == 1"
              label="备用链接"
              prop="app.urlClickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.app.urlClickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="app.urlClickAction.pkgName"
              v-if="formValidate.app.urlClickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.app.urlClickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="跳转名称" prop="app.urlClickAction.appName">
              <Input
                v-model="formValidate.app.urlClickAction.appName"
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
import ContentedInput from "@/components/contenteditable/contentedInput.vue";
import createTemplateMixin from "./createTemplate-mixin";
export default {
  name: "Application",
  components: {
    UploadFile,
    ContentedInput
  },
  mixins: [createTemplateMixin],
  data() {
    return {
      collapseVal: ["infoCollapse"],
      SearJudgeType: keyFactory.getConstStore(12),
      formValidate: {
        templateName: "",
        templateText: "",
        templateTextHtml: "",
        params: [],
        app: {
          introduction: "",
          url: "",
          appName: "",

          urlClickAction: {
            type: "1",
            url: "",
            backupUrl: "",
            pkgName: "",
            appName: ""
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
        templateText: [
          {
            required: true,
            message: "请输入短信原文"
          }
        ],
        smsText: [
          {
            required: true,
            max: 20,
            message: "请输入短信正文"
          }
        ],
        "app.url": [
          {
            required: true,
            message: "请上传图片"
          }
        ],
        "app.appName": [
          {
            required: true,
            message: "请输应用名称"
          }
        ],
        "app.introduction": [
          {
            required: true,
            message: "请输入应用介绍"
          }
        ],
        "app.type": [
          {
            required: true
          }
        ],
        "app.urlClickAction.type": [
          {
            required: true
          }
        ],
        "app.urlClickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "app.urlClickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ],
        "app.urlClickAction.backupUrl": [
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
    getappUrl({ cropperedUrl, file }) {
      let params = {
        type: 5,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.app.url = res.imgPath;
          this.$refs.uploadTemplate.onUploadSuccess();
        } else {
          this.$refs.uploadTemplate.onUploadError(res);
        }
      });
    },

    //添加/编辑提交
    validTemplateForm() {
      let parma = {};
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          parma.templateName = this.formValidate.templateName;
          parma.templateText = this.formValidate.templateText;
          parma.params = this.formValidate.params;
          parma.app = this.formValidate.app;
          parma.app = JSON.stringify(parma.app);
        }
      });
      return parma;
    },
    contentedChange({ variableGroup, variableParams, templateSubmitText }) {
      this.formValidate.params = JSON.stringify(variableParams);
      this.variableGroup = variableGroup;
      this.formValidate.templateText = templateSubmitText;
    }
  }
};
</script>
