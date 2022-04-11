<template>
  <div class="applicationsPhone">
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
          <template v-if="phoneData.app">
            <div class="templateText">
              {{ phoneData.templateText ? phoneData.templateText : "短信原文" }}
            </div>
            <ul class="prefButtonList" v-if="showOriginalText">
              <li @click="toLink(phoneData.app.urlClickAction.url)">
                <div class="img-wrap">
                  <img :src="phoneData.app.url ? phoneData.app.url : banner" />
                </div>
                <div class="appInfo">
                  <h4 class="text-ellipsis">{{ phoneData.app.appName }}</h4>
                  <div class="text-ellipsis">
                    {{ phoneData.app.introduction }}
                  </div>
                </div>
                <Button type="primary" shape="circle" ghost>下载</Button>
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
  name: "ApplicationPhone",
  mixins: [phoneMixin]
};
</script>

<style lang="less" scope>
.applicationsPhone {
  .phone .head .cursor {
    color: #44a1f2;
  }
  .prefButtonList {
    padding: 16px 0 0;
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
        max-width: 125px;
      }
      .ivu-btn {
        height: 22px;
        line-height: 22px;
        width: 45px;
        min-width: 45px;
        font-size: 12px;
        padding: 0;
      }
    }
  }
  .singlePicTextViewOppo {
    font-size: 12px;

    .templateText {
      padding: 0 0 16px;
    }
  }
}
</style>
