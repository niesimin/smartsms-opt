<template>
  <div>
    <div class="phone">
      <div class="phone-hair"></div>
      <div class="phone-head">
        <div>
          <b v-if="phoneData.companyName">{{ phoneData.companyName }}</b>
          <b v-else>公众号名称</b>
        </div>
        <div class="phone-Num">
          106XXXX34567
        </div>
        <Icon type="ios-arrow-back" size="22" />
      </div>
      <div class="phone-time">{{ getFormatWeekTamp() }}</div>

      <!-- oppo -->
      <div class="phone-body oppo-body" v-if="vendor == 1">
        <div class="singlePicTextViewOppo">
          <div class="head">
            <span>服务信息</span>
            <span
              class="cursor"
              @click="showOriginalText = !showOriginalText"
              >{{ showOriginalText ? "查看原文" : "查看卡片" }}</span
            >
          </div>
          <template v-if="phoneData.singlePicture && showOriginalText">
            <div
              class="img-wrap"
              @click="toLink(phoneData.singlePicture.clickAction.url)"
            >
              <img
                v-if="phoneData.singlePicture.url"
                :src="phoneData.singlePicture.url"
              />
              <img v-else :src="banner" style="width:100px" />
            </div>
            <div
              class="img-text"
              @click="toLink(phoneData.singlePicture.clickAction.url)"
            >
              <h4 v-if="phoneData.singlePicture.title">
                {{ phoneData.singlePicture.title }}
              </h4>
              <div class="digest" v-if="phoneData.singlePicture.introduction">
                {{ phoneData.singlePicture.introduction }}
              </div>
            </div>
            <div class="bottom">
              <div
                class="btn-ul"
                @click="toLink(phoneData.singlePicture.button.clickAction.url)"
              >
                {{
                  phoneData.singlePicture.button.title
                    ? phoneData.singlePicture.button.title
                    : "按钮文案"
                }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- vivo -->
      <div class="phone-body vivo-body" v-else-if="vendor == 2">
        <div class="singlePicTextViewOppo">
          <div
            class="originalText"
            @click.stop="showOriginalText = !showOriginalText"
          >
            <span style="color:#ffffff" v-if="showOriginalText">显示原文</span>
            <span v-else>显示卡片</span>
          </div>

          <template v-if="phoneData.singlePicture && showOriginalText">
            <div
              class="img-wrap"
              @click="toLink(phoneData.singlePicture.clickAction.url)"
            >
              <img
                v-if="phoneData.singlePicture.url"
                :src="phoneData.singlePicture.url"
              />
              <img v-else :src="banner" style="width:100px" />
            </div>
            <div
              class="img-text"
              @click="toLink(phoneData.singlePicture.clickAction.url)"
            >
              <h4 v-if="phoneData.singlePicture.title">
                {{ phoneData.singlePicture.title }}
              </h4>
            </div>
          </template>
          <div :class="!showOriginalText ? 'templateTextPadding' : ''"></div>
        </div>
      </div>

      <!-- xiaomi -->
      <div class="phone-body xiaomi-body" v-else-if="vendor == 3">
        <div class="singlePicTextViewOppo" v-if="showOriginalText">
          <template v-if="phoneData.singlePicture && showOriginalText">
            <div
              class="img-wrap"
              @click="toLink(phoneData.singlePicture.clickAction.url)"
            >
              <img
                v-if="phoneData.singlePicture.url"
                :src="phoneData.singlePicture.url"
              />
              <img v-else :src="banner" style="width:100px" />
            </div>
            <div
              class="img-text"
              @click="toLink(phoneData.singlePicture.clickAction.url)"
            >
              <h4 v-if="phoneData.singlePicture.title">
                {{ phoneData.singlePicture.title }}
              </h4>
              <div class="digest" v-if="phoneData.singlePicture.introduction">
                {{ phoneData.singlePicture.introduction }}
              </div>
            </div>
            <div class="bottom">
              <div
                class="btn-ul"
                @click="toLink(phoneData.singlePicture.button.clickAction.url)"
              >
                {{
                  phoneData.singlePicture.button.title
                    ? phoneData.singlePicture.button.title
                    : "按钮文案"
                }}
              </div>
            </div>
          </template>
        </div>
        <div v-else class="aim">
          短信原文
        </div>
        <div
          class="originalText"
          @click.stop="showOriginalText = !showOriginalText"
        >
          {{ showOriginalText ? "显示原文" : "查看卡片" }}
        </div>
      </div>

      <!-- {{ phoneData }} -->
    </div>
  </div>
</template>

<script>
import { keyFactory, getFormatWeekTamp } from "@/libs/tools.js";
import banner from "@/assets/images/banner.png";
export default {
  name: "Phone",
  props: {
    vendor: {
      type: Number,
      default: NaN
    },
    showOriginal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      templateData: keyFactory.getConstStore(11),
      vendorBtnData: [],
      getFormatWeekTamp,
      banner,
      showOriginalText: true
    };
  },

  computed: {
    //从store中获取templatePannelData
    phoneData() {
      return this.$store.state.app.templatePannelData;
    }
  },
  mounted() {
    // this.templateType = this.$store.state.app.templateType;
    // this.vendorBtnData = this.templateData[this.templateType - 1]["cn"]; //各厂商模板支持情况
    // this.vendor = this.vendorBtnData[0].did; //默认显示的厂商
  },
  watch: {
    vendor() {
      this.showOriginalText = true;
    }
  },
  // watch: {
  //   templateType(newValue) {
  //     this.vendorBtnData = this.templateData[newValue - 1]["cn"];
  //     this.vendor = this.vendorBtnData[0].did;
  //   }
  // },
  methods: {
    toLink(url) {
      if (url) {
        window.open(url);
      }
    }
  }
};
</script>

<style lang="less">
.phone {
  padding: 0 10px;
  background: #fff;
  width: 292px;
  height: 585px;
  border-top: 11px solid #000;
  border-bottom: 11px solid #000;
  border-left: 8px solid #000;
  border-right: 8px solid #000;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  transform: translate(30%);
  z-index: 10;
  .phone-hair {
    width: 90px;
    height: 18px;
    background: #000;
    border-radius: 8px;
    margin: 0 auto;
    margin-top: -10px;
  }
  .phone-head {
    width: 100%;
    text-align: center;
    margin-top: 12px;
    position: relative;
    .phone-Num {
      font-size: 12px;
      color: #858585;
      margin-top: -4px;
    }
    .ivu-icon-ios-arrow-back {
      position: absolute;
      color: #44a1f2;
      left: -6px;
      top: 6px;
    }
  }
  .phone-body {
    cursor: pointer;
  }
  .phone-time {
    color: #b2b2b2;
    font-size: 10px;
  }
  .originalText {
    font-size: 12px;
  }
  .singlePicTextViewOppo {
    overflow: hidden;
    margin-top: 5px;

    background: #fff;
    border: 0.25px solid #f3f3f3;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.14);
    border-radius: 7.5px;
    .head {
      font-size: 12px;
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
      .cursor {
        cursor: pointer;
        color: #2ad181;
      }
    }

    .img-wrap {
      width: 100%;
      height: 126px;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
      text-align: center;
      img {
        width: 100%;
      }
    }

    .img-text {
      margin-top: 16px;
      h4 {
        margin: 0 -3px;
        color: #000;
        font-weight: 400;
        font-size: 13px;
        margin-bottom: 7px;
      }
      .digest {
        font-size: 12px;
        color: #727272;
        line-height: 16px;
      }
    }
    .bottom {
      margin: 10px 0;
      .btn-ul {
        text-align: center;
        font-weight: 500;
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .oppo-body .singlePicTextViewOppo {
    padding: 16px 16px 0;
  }
  .vivo-body,
  .xiaomi-body {
    .img-wrap {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    .img-text {
      padding: 16px 16px 12px;
      margin-top: 0;
    }
  }
  .vivo-body {
    .img-text {
      h4 {
        border-bottom: 2px solid #f1f1f1;
        color: #999;
        font-weight: 700;
      }
    }
    .templateTextPadding {
      padding: 0 18px 16px;
      padding-top: 38px;
    }
    .singlePicTextViewOppo {
      position: relative;
    }
    .originalText {
      position: absolute;
      right: 14px;
      top: 16px;
      z-index: 9;
    }
  }
  .xiaomi-body {
    .singlePicTextViewOppo {
      background: #f5f5f5;
      box-shadow: none !important;
    }

    .img-text h4 {
      color: #000;
      font-weight: 700;
    }
    .btn-ul {
      color: #000;
      font-weight: 700 !important;
      background: #fff;
      border-radius: 32px;
      width: 80%;
      margin: 10px auto;
    }
    .originalText {
      color: #44a1f2;
      margin-top: 10px;
    }
    .aim {
      border-radius: 10px;
      overflow: hidden;
      margin-top: 5px;
      padding: 16px;
      background: #fff;
      box-shadow: 0 0 5px #ccc;
      font-size: 12px;
    }
  }
}
</style>
