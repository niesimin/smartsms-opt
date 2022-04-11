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
          </div>
        </Panel>

        <Panel
          v-for="(item, idx) in formValidate.window"
          :key="idx + 'smallPictures'"
          :name="'position' + (idx + 1) + 'Collapse'"
          class="addPannel"
        >
          <span class="addPannelIcon">
            <span
              class="text-gray"
              v-if="idx == formValidate.window.length - 1"
            >
              (<Icon
                type="ios-information-circle-outline"
              />展示位可以增加2-12个。)
            </span>

            <Button
              type="primary"
              ghost
              icon="md-add"
              @click.stop="addPosition"
              v-if="
                idx == formValidate.window.length - 1 &&
                  formValidate.window.length < 12
              "
              >添加展位</Button
            >

            <Button
              class="delPannelIcon"
              icon="ios-trash"
              v-if="idx > 1"
              @click.stop="delPosition(idx)"
              >删除展位</Button
            >
          </span>
          展位{{ idx + 1 }}
          <div slot="content">
            <FormItem
              label="上传图片"
              :prop="'window.' + idx + '.url'"
              :rules="{ required: true, message: '请上传图片' }"
            >
              <UploadFile
                :ref="'uploadWindowPic' + idx"
                aspectRatio="1 / 1"
                :maxSize="300"
                :url="item.url"
                :crop="true"
                :idx="idx"
                @cropSuccess="getWindowUrl"
              >
                <img :src="item.url" v-if="item.url" />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon type="ios-information-circle-outline" />
                    图片支持JPG、JPEG、PNG格式，大小限制300kb，比例1:1，尺寸建议736*736px
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <!-- urlClickAction -->
            <FormItem
              label="图片跳转类型"
              :prop="'window.' + idx + '.urlClickAction.type'"
              :rules="{ required: true, message: '请选择图片跳转类型' }"
            >
              <Select v-model="item.urlClickAction.type">
                <Option
                  v-for="item in SearJudgeType"
                  :key="item.dv"
                  :value="item.did"
                  >{{ item.dv }}
                </Option>
              </Select>
            </FormItem>

            <FormItem
              :label="item.urlClickAction.type == 0 ? 'H5链接' : '直达链接'"
              :prop="'window.' + idx + '.urlClickAction.url'"
              :rules="{ required: true, message: '请输入链接' }"
            >
              <Input
                type="textarea"
                v-model="item.urlClickAction.url"
                :placeholder="
                  item.urlClickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="item.urlClickAction.type == 1"
              label="备用链接"
              :prop="'window.' + idx + '.urlClickAction.backupUrl'"
              :rules="{ required: true, message: '请输入链接' }"
            >
              <Input
                type="textarea"
                v-model="item.urlClickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              :prop="'window.' + idx + '.urlClickAction.pkgName'"
              :rules="{ required: true, message: '请输入安装包名' }"
              v-if="item.urlClickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="item.urlClickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="跳转名称"
              :prop="'window.' + idx + '.urlClickAction.appName'"
            >
              <Input
                v-model="item.urlClickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="标题"
              :prop="'window.' + idx + '.title'"
              :rules="{ required: true, message: '请输入标题' }"
            >
              <Input
                type="textarea"
                v-model="item.title"
                placeholder="请输入标题，超出文字客户端将省略...展示"
                maxlength="11"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="摘要"
              :prop="'window.' + idx + '.introduction'"
              :rules="{ required: true, message: '请输入摘要' }"
            >
              <Input
                type="textarea"
                v-model="item.introduction"
                placeholder="请输入图片摘要，超出文字客户端将省略...展示"
                maxlength="26"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="按钮文案"
              :prop="'window.' + idx + '.button.title'"
              :rules="{ required: true, message: '请输入按钮文案' }"
            >
              <Input
                v-model="item.button.title"
                placeholder="请输入按钮文案，超出文字客户端将省略...展示"
                maxlength="5"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="按钮点击跳转"
              :prop="'window.' + idx + '.button.clickAction.type'"
              :rules="{ required: true, message: '请选择按钮跳转类型' }"
            >
              <Select v-model="item.button.clickAction.type">
                <Option
                  v-for="item in SearJudgeType"
                  :key="item.dv"
                  :value="item.did"
                  >{{ item.dv }}</Option
                >
              </Select>
            </FormItem>

            <FormItem
              :label="item.button.clickAction.type == 0 ? 'H5链接' : '直达链接'"
              :prop="'window.' + idx + '.button.clickAction.url'"
              :rules="{ required: true, message: '请输入链接' }"
            >
              <Input
                type="textarea"
                v-model="item.button.clickAction.url"
                :placeholder="
                  item.button.clickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="item.button.clickAction.type == 1"
              label="备用链接"
              :prop="'window.' + idx + '.button.clickAction.backupUrl'"
              :rules="{ required: true, message: '请输入备用链接' }"
            >
              <Input
                type="textarea"
                v-model="item.button.clickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              :prop="'window.' + idx + '.button.clickAction.pkgName'"
              :rules="{ required: true, message: '请输入安装包名' }"
              v-if="item.button.clickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="item.button.clickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="跳转名称"
              :prop="'window.' + idx + '.button.clickAction.appName'"
              :rules="{ required: true, message: '请输入跳转名称' }"
            >
              <Input
                v-model="item.button.clickAction.appName"
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
import uploadpng1 from "@/assets/images/upload.png";
import uploadpng2 from "@/assets/images/upload2.png";
import { keyFactory } from "@/libs/tools.js";
import UploadFile from "@/components/upload/upload.vue";
import createTemplateMixin from "./createTemplate-mixin";

export default {
  name: "ShowcaseTemplate",
  components: { UploadFile },
  mixins: [createTemplateMixin],
  data() {
    return {
      collapseVal: [
        "infoCollapse",
        "position1Collapse",
        "position2Collapse",
        "position3Collapse",
        "position4Collapse",
        "position5Collapse",
        "position6Collapse",
        "position7Collapse",
        "position8Collapse",
        "position9Collapse",
        "position10Collapse",
        "position11Collapse",
        "position12Collapse"
      ],
      SearJudgeType: keyFactory.getConstStore(12),
      showWindowUrl: false,
      currentPosition: null,
      currentPositionUrl: "",
      uploadpng1,
      uploadpng2,
      formValidate: {
        templateName: "",
        templateText: "",

        window: [
          {
            url: "",
            title: "",
            introduction: "",

            urlClickAction: {
              type: 0,
              url: "",
              backupUrl: "",
              pkgName: "",
              appName: ""
            },

            titleClickAction: {},

            button: {
              title: "",
              clickAction: {
                type: 0,
                url: "",
                backupUrl: "",
                pkgName: "",
                appName: ""
              }
            }
          },
          {
            url: "",
            title: "",
            introduction: "",

            urlClickAction: {
              type: 0,
              url: "",
              backupUrl: "",
              pkgName: "",
              appName: ""
            },

            titleClickAction: {},

            button: {
              title: "",
              clickAction: {
                type: 0,
                url: "",
                backupUrl: "",
                pkgName: "",
                appName: ""
              }
            }
          }
        ]
      },
      ruleValidate: {
        templateName: [{ required: true, message: "请输入模板名称" }]
      }
    };
  },
  computed: {},
  methods: {
    //添加/编辑提交
    validTemplateForm() {
      let param = {};

      let window = this.formValidate.window.map(item => {
        item.titleClickAction = item.urlClickAction;
        return item;
      });
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          param.templateName = this.formValidate.templateName;
          param.templateText = this.formValidate.templateText;
          param.window = JSON.stringify(window);
        }
      });
      return param;
    },

    addPosition() {
      let defaultWindow = {
        url: "",
        title: "",
        introduction: "",

        urlClickAction: {
          type: 0,
          url: "",
          backupUrl: "",
          pkgName: "",
          appName: ""
        },

        titleClickAction: {},

        button: {
          title: "",
          clickAction: {
            type: 0,
            url: "",
            backupUrl: "",
            pkgName: "",
            appName: ""
          }
        }
      };
      this.formValidate.window.push(defaultWindow);
    },

    delPosition(idx) {
      this.formValidate.window.splice(idx, 1);
    },
    //上传图片
    getWindowUrl({ cropperedUrl, file, idx }) {
      let ct = "uploadWindowPic" + idx;
      let params = {
        type: 3,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.window[idx].url = res.imgPath;
          this.$refs[ct].onUploadSuccess();
        } else {
          this.$refs[ct].onUploadError(res);
        }
      });
    }
  }
};
</script>
