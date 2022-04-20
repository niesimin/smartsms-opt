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

            <FormItem label="上传视频" prop="video.url">
              <UploadFile
                ref="uploadVideo"
                :format="['MP4']"
                :maxSize="10240"
                :url="formValidate.video.url"
                @UploadSuccess="getVideoUrl"
                :action="actionUrl"
                :uploadParam="uploadParam"
              >
                <template v-if="formValidate.video.url">
                  <video
                    preload="auto"
                    autoplay="autoplay"
                    type="video/mp4"
                    :src="formValidate.video.url"
                    controls
                  />
                </template>
                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon type="ios-information-circle-outline" />
                    视频支持格式MP4，比例16:9，大小限制10M，建议时长15s以内<i
                      style="display:none"
                    ></i
                    >。
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem label="上传视频封面" prop="video.coverUrl">
              <UploadFile
                ref="uploadVideoCover"
                :maxSize="500"
                :url="formValidate.video.coverUrl"
                :crop="true"
                @cropSuccess="getVideoCoverUrl"
              >
                <img
                  :src="formValidate.video.coverUrl"
                  v-if="formValidate.video.coverUrl"
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

            <FormItem label="标题" prop="video.title">
              <Input
                type="textarea"
                v-model="formValidate.video.title"
                placeholder="请输入标题，超出文字客户端将省略...展示"
                maxlength="17"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="图片跳转类型" prop="video.clickAction.type">
              <Select v-model="formValidate.video.clickAction.type">
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
                formValidate.video.clickAction.type == 0 ? 'H5链接' : '直达链接'
              "
              prop="video.clickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.video.clickAction.url"
                :placeholder="
                  formValidate.video.clickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.video.clickAction.type == 1"
              label="备用链接"
              prop="video.clickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.video.clickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="video.clickAction.pkgName"
              v-if="formValidate.video.clickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.video.clickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="跳转名称" prop="video.clickAction.appName">
              <Input
                v-model="formValidate.video.clickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="视频摘要" prop="video.introduction">
              <Input
                type="textarea"
                v-model="formValidate.video.introduction"
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
            <FormItem label="按钮文案" prop="video.button.title">
              <Input
                v-model="formValidate.video.button.title"
                placeholder="请输入按钮文案，超出文字客户端将省略...展示"
                maxlength="5"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="按钮跳转类型" prop="video.button.clickAction.type">
              <Select v-model="formValidate.video.button.clickAction.type">
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
                formValidate.video.button.clickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="video.button.clickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.video.button.clickAction.url"
                :placeholder="
                  formValidate.video.button.clickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.video.button.clickAction.type == 1"
              label="备用链接"
              prop="video.button.clickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.video.button.clickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="video.button.clickAction.pkgName"
              v-if="formValidate.video.button.clickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.video.button.clickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="跳转名称" prop="video.button.clickAction.appName">
              <Input
                v-model="formValidate.video.button.clickAction.appName"
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
  name: "VideoTemplate",
  components: {
    UploadFile
  },
  mixins: [createTemplateMixin],
  data() {
    return {
      actionUrl: "",
      collapseVal: ["infoCollapse", "btnCollapse"],
      SearJudgeType: keyFactory.getConstStore(12),
      showUploadUrl: false,
      formValidate: {
        templateName: "",
        templateText: "",

        video: {
          title: "",
          introduction: "",
          coverUrl: "",
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
        "video.url": [
          {
            required: true,
            message: "请上传视频"
          }
        ],
        "video.coverUrl": [
          {
            required: true,
            message: "请上传视频封面"
          }
        ],
        "video.title": [
          {
            required: true,
            message: "请输入标题"
          }
        ],
        "video.introduction": [
          {
            required: true,
            message: "请输入视频摘要"
          }
        ],
        "video.type": [
          {
            required: true
          }
        ],
        "video.clickAction.type": [
          {
            required: true
          }
        ],
        "video.clickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "video.clickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ],
        "video.clickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ],
        "video.button.clickAction.title": [
          {
            required: true,
            message: "请输入按钮文字"
          }
        ],
        "video.button.clickAction.type": [
          {
            required: true
          }
        ],
        "video.button.clickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "video.button.clickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ],
        "video.button.clickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ]
      },
      uploadParam: {
        type: 1,
        ajax: 1
      }
    };
  },
  mounted() {
    this.actionUrl =
      process.env.NODE_ENV === "development"
        ? this.$config.baseUrl.dev + this.$api.uploadFile
        : this.$config.baseUrl.pro + this.$api.uploadFile;
  },
  methods: {
    //获取上传视频链接
    getVideoUrl(url) {
      this.formValidate.video.url = url;
    },

    //获取上传视频主图链接
    getVideoCoverUrl({ cropperedUrl, file }) {
      let params = {
        type: 0,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.video.coverUrl = res.imgPath;
          this.$refs.uploadVideoCover.onUploadSuccess();
        } else {
          this.$refs.uploadVideoCover.onUploadError(res);
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
          parma.video = JSON.stringify(this.formValidate.video);
        }
      });
      return parma;
    }
  }
};
</script>
