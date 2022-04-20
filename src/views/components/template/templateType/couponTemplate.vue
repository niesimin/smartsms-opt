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

            <FormItem label="领取提示" prop="coupon.tips">
              <Input
                v-model="formValidate.coupon.tips"
                placeholder="请输入优惠券/红包提示文案，超出文字客户端将省略...展示"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="商家图标" prop="coupon.url">
              <UploadFile
                ref="uploadCoupon"
                aspectRatio="1 / 1"
                :maxSize="500"
                :url="formValidate.coupon.url"
                :crop="true"
                @cropSuccess="getCouponUrl"
              >
                <img
                  :src="formValidate.coupon.url"
                  v-if="formValidate.coupon.url"
                />

                <template v-slot:tips>
                  <div class="text-gray">
                    <Icon
                      type="ios-information-circle-outline"
                    />图片支持JPG、JPEG、PNG格式，大小限制500kb，比例1:1，尺寸建议48*48px
                  </div>
                </template>
              </UploadFile>
            </FormItem>

            <FormItem label="标题" prop="coupon.title">
              <Input
                v-model="formValidate.coupon.title"
                placeholder="请输入标题，建议7个字以内，超出文字客户端将省略...展示"
                maxlength="20"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="描述" prop="coupon.introduction">
              <Input
                v-model="formValidate.coupon.introduction"
                placeholder="请输入描述，建议11个字以内，为空客户端默认展示“点击查看详情"
                maxlength="20"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="过期时间" prop="coupon.expirationTime">
              <DatePicker
                style="width:100%"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="formValidate.coupon.expirationTime"
                :editable="false"
                placeholder="Select date and time"
                :options="startTimeOptions"
              ></DatePicker>
            </FormItem>

            <FormItem label="按钮跳转类型" prop="coupon.urlClickAction.type">
              <Select v-model="formValidate.coupon.urlClickAction.type">
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
                formValidate.coupon.urlClickAction.type == 0
                  ? 'H5链接'
                  : '直达链接'
              "
              prop="coupon.urlClickAction.url"
            >
              <Input
                type="textarea"
                v-model="formValidate.coupon.urlClickAction.url"
                :placeholder="
                  formValidate.coupon.urlClickAction.type == 0
                    ? '请输入链接,用户点击图片会跳转到该链接'
                    : '请输入APP直达链接（Deeplink），用户点击后跳转到APP的指定页面'
                "
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              v-if="formValidate.coupon.urlClickAction.type == 1"
              label="备用链接"
              prop="coupon.urlClickAction.backupUrl"
            >
              <Input
                type="textarea"
                v-model="formValidate.coupon.urlClickAction.backupUrl"
                placeholder="请输入H5备用链接，用户未安装APP或直达链接无效时，跳转到备用的H5链接"
                maxlength="500"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem
              label="安装包名"
              prop="coupon.urlClickAction.pkgName"
              v-if="formValidate.coupon.urlClickAction.type == 1"
            >
              <Input
                type="textarea"
                v-model="formValidate.coupon.urlClickAction.pkgName"
                placeholder="请输入应用包名，未安装且无备用链接时则进入应用市场"
                maxlength="50"
                show-word-limit
              ></Input>
            </FormItem>

            <FormItem label="跳转名称" prop="coupon.urlClickAction.appName">
              <Input
                v-model="formValidate.coupon.urlClickAction.appName"
                placeholder="请输入跳转页面的名称"
                maxlength="10"
                show-word-limit
              ></Input>
            </FormItem>
          </div>
        </Panel>
      </Collapse>
    </Form>

    <Modal v-model="showUploadUrl" title="上传图片" footerHide>
      <div class="Cropper" v-if="showUploadUrl">
        <CropperUpload
          :aspectRatio="1 / 1"
          :src="formValidate.coupon.url"
          :maxSize="500"
          @on-crop="getappUrl"
        ></CropperUpload>
      </div>
    </Modal>
  </div>
</template>

<script>
import uploadpng1 from "@/assets/images/upload.png";
import { keyFactory, nHourLater, getDateTimesTamp } from "@/libs/tools.js";
import UploadFile from "@/components/upload/upload.vue";
import createTemplateMixin from "./createTemplate-mixin";
export default {
  name: "CouponTemplate",
  mixins: [createTemplateMixin],
  components: {
    UploadFile
  },
  data() {
    const validExpirationTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择过期时间"));
      } else if (getDateTimesTamp(value) <= getDateTimesTamp()) {
        // console.log(value, getDateTimesTamp(value), getDateTimesTamp());

        callback(new Error("过期时间要大于当前时间"));
      } else {
        callback();
      }
    };
    return {
      startTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      collapseVal: ["infoCollapse", "btnCollapse"],
      SearJudgeType: keyFactory.getConstStore(12),
      showUploadUrl: false,
      uploadpng1,
      formValidate: {
        templateName: "",
        templateText: "",

        coupon: {
          tips: "",
          url: "",
          title: "",
          introduction: "",
          expirationTime: "",

          urlClickAction: {
            type: "0",
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
        "coupon.tips": [
          {
            required: true,
            message: "请输入领取提示"
          }
        ],
        "coupon.title": [
          {
            required: true,
            message: "请输入标题"
          }
        ],
        "coupon.url": [
          {
            required: true,
            message: "请上传图片"
          }
        ],
        "coupon.expirationTime": [
          {
            required: true,
            validator: validExpirationTime
          }
        ],
        "coupon.urlClickAction.type": [
          {
            required: true
          }
        ],
        "coupon.urlClickAction.url": [
          {
            required: true,
            type: "url",
            message: "请输入跳转链接"
          }
        ],
        "coupon.urlClickAction.pkgName": [
          {
            required: true,
            message: "请输入安装包名"
          }
        ],
        "coupon.urlClickAction.backupUrl": [
          {
            required: true,
            type: "url",
            message: "请输入备用链接"
          }
        ]
      }
    };
  },
  mounted() {
    this.formValidate.coupon.expirationTime = nHourLater();
  },
  methods: {
    //获取上传图片链接
    getCouponUrl({ cropperedUrl, file }) {
      let params = {
        type: 5,
        imgFile: cropperedUrl.split("base64,")[1],
        fileName: file.name
      };
      this.$post(this.$api.upload, params).then(res => {
        if (res.error == 0) {
          this.formValidate.coupon.url = res.imgPath;
          this.$refs.uploadCoupon.onUploadSuccess();
        } else {
          this.$refs.uploadCoupon.onUploadError(res);
        }
      });
    },

    //添加/编辑提交
    validTemplateForm() {
      console.log();
      let parma = {};

      let coupon = {};
      coupon.tips = this.formValidate.coupon.tips;
      coupon.url = this.formValidate.coupon.url;
      coupon.title = this.formValidate.coupon.title;
      coupon.introduction = this.formValidate.coupon.introduction;
      coupon.expirationTime = this.formValidate.coupon.expirationTime;
      coupon.urlClickAction = this.formValidate.coupon.urlClickAction;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          parma.templateName = this.formValidate.templateName;
          parma.templateText = this.formValidate.templateText;
          parma.coupon = coupon;
          parma.coupon.expirationTime = getDateTimesTamp(coupon.expirationTime);
          parma.coupon = JSON.stringify(parma.coupon);
        }
      });
      return parma;
    }
  }
};
</script>
