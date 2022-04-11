<template>
  <div class="videoPhone">
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
          <div class="templateText" v-if="!showOriginalText">
            {{ phoneData.templateText }}
          </div>
          <template v-if="phoneData.video && showOriginalText">
            <div
              class="img-wrap"
              @click="toLink(phoneData.video.clickAction.url)"
            >
              <video
                preload="auto"
                type="video/mp4"
                v-if="phoneData.video.url"
                :src="phoneData.video.url"
                controls
                style="width:100%"
              />

              <img v-else :src="banner" style="width:100px" />
            </div>
            <div
              class="img-text"
              @click="toLink(phoneData.video.clickAction.url)"
            >
              <h4 v-if="phoneData.video.title">
                {{ phoneData.video.title }}
              </h4>
              <div class="digest" v-if="phoneData.video.introduction">
                {{ phoneData.video.introduction }}
              </div>
            </div>
            <div class="bottom">
              <div
                class="btn-ul"
                @click="toLink(phoneData.video.button.clickAction.url)"
              >
                {{
                  phoneData.video.button.title
                    ? phoneData.video.button.title
                    : "按钮文案"
                }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import phoneMixin from "./phone-mixin";

export default {
  name: "VideoPhone",
  mixins: [phoneMixin]
};
</script>

<style lang="less" scope>
.videoPhone {
  .templateText {
    padding: 0 0 16px !important;
  }
}
</style>
