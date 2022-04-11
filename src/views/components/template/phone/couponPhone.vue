<template>
  <div class="couponPhone">
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

      <!-- VIVO -->
      <div class="phone-body oppo-body" v-if="vendor == 2">
        <div class="singlePicTextViewOppo">
          <div class="head">
            <span></span>
            <span
              class="cursor"
              @click="showOriginalText = !showOriginalText"
              >{{ showOriginalText ? "查看原文" : "查看卡片" }}</span
            >
          </div>
          <template v-if="phoneData.coupon">
            <div class="templateText">
              {{ phoneData.templateText ? phoneData.templateText : "短信原文" }}
            </div>
            <div class="line" v-if="showOriginalText">
              <div class="line-left"></div>
              <div class="line-center"></div>
              <div class="line-right"></div>
            </div>
            <ul class="prefButtonList" v-if="showOriginalText">
              <li @click="toLink(phoneData.coupon.urlClickAction.url)">
                <div class="img-wrap">
                  <img
                    :src="phoneData.coupon.url ? phoneData.coupon.url : banner"
                  />
                </div>
                <div class="appInfo">
                  <h4 class="text-ellipsis">{{ phoneData.coupon.title }}</h4>
                  <div class="text-ellipsis">
                    {{ phoneData.coupon.introduction }}
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import phoneMixin from "./phone-mixin";

export default {
  name: "CouponPhone",
  mixins: [phoneMixin]
};
</script>

<style lang="less" scope>
.couponPhone {
  .phone .head {
    padding: 10px 20px;
    margin-bottom: 0;
    .cursor {
      color: #44a1f2;
    }
  }
  .prefButtonList {
    padding: 12px 20px;
    border-top: 1px solid #f3f3f3;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      margin-left: -4px;
      h4 {
        font-weight: 700;
      }
      .img-wrap {
        width: 42px;
        height: 42px;
        margin-right: 10px;
        background: #fff;
        margin-left: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .appInfo {
        width: 100%;
        max-width: 144px;
        div {
          color: #0da0ee;
          font-weight: 500;
        }
      }
    }
  }
  .singlePicTextViewOppo {
    padding: 0 !important;
    font-size: 12px;

    .templateText {
      padding: 14px 23px 18px;
    }
  }
  .line {
    margin-top: 12px;
    position: relative;
    .line-left,
    .line-right {
      position: absolute;
      width: 30px;
      height: 30px;
      background: #f3f3f3;
      border-radius: 30px;
      top: -15px;
    }
    .line-left {
      left: -20px;
    }
    .line-right {
      right: -20px;
    }
    .line-center {
      border-bottom: 3px dashed #f3f3f3;
    }
  }
}
</style>
