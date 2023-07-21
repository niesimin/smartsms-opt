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
            <!-- multiPicture -->
            <FormItem label="上传图片" prop="multiPicture.url">
              <UploadFile
                ref="uploadTemplate"
                aspectRatio="16 / 9"
                :maxSize="500"
                :url="formValidate.multiPicture.url"
                :crop="true"
                @cropSuccess="getUploadUrl"
              >
                <img
                  :src="formValidate.multiPicture.url"
                  v-if="formValidate.multiPicture.url"
                />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon type="ios-information-circle-outline" />
                    图片支持JPG、JPEG、PNG格式，大小限制500kb，比例16:9，尺寸建议1248*702px
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem label="主图摘要" prop="multiPicture.introduction">
              <Input
                type="textarea"
                v-model="formValidate.multiPicture.introduction"
                placeholder="请输入主图摘要，超出文字客户端将省略...展示"
                maxlength="30"
                show-word-limit
              ></Input>
            </FormItem>

            <!-- urlClickAction -->
            <FormItem
              label="主图跳转类型"
              prop="multiPicture.urlClickAction.type"
            >
              <Select v-model="formValidate.multiPicture.urlClickAction.type">
                <Option
                  v-for="item in SearJudgeType"
                  :key="item.dv"
                  :value="item.did"
                  >{{ item.dv }}
                </Option>
              </Select>
            </FormItem>

            <FormItem
              :label="
                formValidate.multiPicture.urlClickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="multiPicture.urlClickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.multiPicture.urlClickAction.url"
                :placeholder="
                  formValidate.multiPicture.urlClickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.multiPicture.urlClickAction.type == 1"
              label="备用链接"
              prop="multiPicture.urlClickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.multiPicture.urlClickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="multiPicture.urlClickAction.pkgName"
              v-if="formValidate.multiPicture.urlClickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.multiPicture.urlClickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="跳转名称"
              prop="multiPicture.urlClickAction.appName"
            >
              <Input
                v-model="formValidate.multiPicture.urlClickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>
          </div>
        </Panel>

        <Panel
          v-for="(item, idx) in formValidate.multiPicture.smallPictures"
          :key="idx + 'smallPictures'"
          :name="'deputy' + (idx + 1) + 'Collapse'"
          class="addPannel"
        >
          <span class="addPannelIcon">
            <Button
              type="primary"
              ghost
              v-if="deputyPic < 3 && idx == deputyPic - 1"
              icon="md-add"
              @click.stop="addSmallPictures"
              >添加副图文</Button
            >

            <Button
              class="delPannelIcon"
              v-if="idx != 0"
              icon="ios-trash"
              @click.stop="delSmallPictures(idx)"
              >删除副图文</Button
            >
          </span>
          副图文{{ idx + 1 }}
          <div slot="content">
            <FormItem
              :label="'副图' + (idx + 1) + '标题'"
              :prop="'multiPicture.smallPictures.' + idx + '.title'"
              :rules="{
                required: true,
                message: '请输入副图文标题'
              }"
            >
              <Input
                type="textarea"
                v-model="item.title"
                placeholder="请输入副图标题，超出文字客户端将省略...展示"
                maxlength="30"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              :label="'上传副图' + (idx + 1)"
              :prop="'multiPicture.smallPictures.' + idx + '.url'"
              :rules="{ required: true, message: '请上传副图' }"
            >
              <UploadFile
                :ref="'uploadDeputyTemplate' + idx"
                aspectRatio="1 / 1"
                :maxSize="500"
                :url="item.url"
                :crop="true"
                :idx="idx"
                @cropSuccess="getDepudyUrl"
              >
                <img :src="item.url" v-if="item.url" />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon type="ios-information-circle-outline" />
                    图片支持JPG、JPEG、PNG格式，大小限制200kb，比例1:1，尺寸建议192*192px。
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem
              :label="'副图' + (idx + 1) + '跳转类型'"
              :prop="'multiPicture.smallPictures.' + idx + '.clickAction.type'"
              :rules="{
                required: true,
                message: '请选择跳转类型'
              }"
            >
              <Select v-model="item.clickAction.type">
                <Option
                  v-for="item in SearJudgeType"
                  :key="item.dv"
                  :value="item.did"
                  >{{ item.dv }}
                </Option>
              </Select>
            </FormItem>

            <FormItem
              label="直达链接"
              :prop="'multiPicture.smallPictures.' + idx + '.clickAction.url'"
              :rules="{
                required: true,
                message: '请输入跳转链接'
              }"
            >
              <Input
                type="textarea"
                v-model="item.clickAction.url"
                placeholder="请输入链接,用户点击幅图1会跳转到该链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="item.clickAction.type == 1"
              label="备用链接"
              :prop="
                'multiPicture.smallPictures.' + idx + '.clickAction.backupUrl'
              "
              :rules="{
                required: true,
                message: '请输入备用链接'
              }"
            >
              <Input
                type="textarea"
                v-model="item.clickAction.backupUrl"
                placeholder="请输入链接，直达链接无法访问且手机卸载了应用市场时，会跳转到备用链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              :prop="
                'multiPicture.smallPictures.' + idx + '.clickAction.pkgName'
              "
              :rules="{
                required: true,
                message: '请输入安装包名'
              }"
              v-if="item.clickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="item.clickAction.pkgName"
                placeholder="请输入应用包名，手机已安装app则按包名唤起app,未安装则进应用市场按包名搜索app"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="跳转名称"
              :prop="
                'multiPicture.smallPictures.' + idx + '.clickAction.appName'
              "
            >
              <Input
                v-model="item.clickAction.appName"
                placeholder="请输入链接页面的名称"
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
  name: "MultiPicture",
  components: {
    UploadFile
  },
  mixins: [createTemplateMixin],
  data() {
    return {
      collapseVal: [
        "infoCollapse",
        "deputy1Collapse",
        "deputy2Collapse",
        "deputy3Collapse"
      ],
      SearJudgeType: keyFactory.getConstStore(12),

      formValidate: {
        templateName: "",
        templateText: "",

        multiPicture: {
          introduction: "",
          url: "",

          urlClickAction: {
            type: "0",
            url: "",
            backupUrl: "",
            pkgName: "",
            appName: ""
          },

          smallPictures: [
            {
              title: "",
              url: "",
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
        templateName: [{ required: true, message: "请输入模板名称" }],

        "multiPicture.url": [
          {
            required: true,
            message: "请上传图片"
          }
        ],

        "multiPicture.introduction": [
          {
            required: true,
            message: "请输入图片摘要"
          }
        ],
        "multiPicture.type": [
          {
            required: true
          }
        ],
        "multiPicture.urlClickAction.type": [
          {
            required: true
          }
        ],
        "multiPicture.urlClickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "multiPicture.urlClickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ],
        "multiPicture.urlClickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ]
      }
    };
  },
  computed: {
    deputyPic() {
      return this.formValidate.multiPicture.smallPictures.length;
    }
  },
  methods: {
    //获取主图url
    getUploadUrl({ cropperedUrl, file }) {
      let params = {
        type: 0,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.multiPicture.url = res.imgPath;
          this.$refs.uploadTemplate.onUploadSuccess();
        } else {
          this.$refs.uploadTemplate.onUploadError(res);
        }
      });
    },

    //获取副图url
    getDepudyUrl({ cropperedUrl, file, idx }) {
      let ct = "uploadDeputyTemplate" + idx;
      let params = {
        type: 2,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.multiPicture.smallPictures[idx].url = res.imgPath;
          this.$refs[ct][0].onUploadSuccess();
        } else {
          this.$refs[ct][0].onUploadError(res);
        }
      });
    },

    //添加/编辑提交
    validTemplateForm() {
      let param = {};
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          param.templateName = this.formValidate.templateName;
          param.templateText = this.formValidate.templateText;
          param.multiPicture = JSON.stringify(this.formValidate.multiPicture);
        }
      });
      return param;
    },

    addSmallPictures() {
      let defaultPicture = {
        title: "",
        url: "",
        clickAction: {
          type: "0",
          url: "",
          backupUrl: "",
          pkgName: "",
          appName: ""
        }
      };
      this.formValidate.multiPicture.smallPictures.push(defaultPicture);
    },

    delSmallPictures(idx) {
      this.formValidate.multiPicture.smallPictures.splice(idx, 1);
    }
  }
};
</script>
