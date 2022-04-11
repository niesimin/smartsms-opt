<template>
  <div class="notifyPhone">
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

      <!-- xiaomi -->
      <div class="phone-body xiaomi-body" v-if="vendor == 3">
        <div class="singlePicTextViewOppo" v-if="showOriginalText">
          <template v-if="phoneData.notice && showOriginalText">
            <div
              class="img-wrap"
              @click="toLink(phoneData.notice.urlClickAction.url)"
              v-if="phoneData.notice.url"
            >
              <img :src="phoneData.notice.url" />
            </div>
            <div class="img-text">
              <h4 v-if="phoneData.notice.title">
                {{ phoneData.notice.title }}
              </h4>
              <div class="digest" v-if="phoneData.notice.introduction">
                {{ phoneData.notice.introduction }}
              </div>
              <ul class="messageList">
                <li
                  v-for="(item, idx) in phoneData.notice.messageList"
                  :key="idx + 'messageList'"
                >
                  <span class="noticeName">{{
                    item.name ? item.name : "通知描述"
                  }}</span>
                  <span
                    class="noticeContent"
                    :style="{ fontSize: idx == 0 ? '18px' : '12px' }"
                    >{{ item.content }}</span
                  >
                </li>
              </ul>
              <ul class="bottom">
                <li
                  class="btn-ul"
                  v-for="(btnitem, idx) in phoneData.notice.buttonList"
                  :key="idx + 'buttonList'"
                  @click="toLink(btnitem.clickAction.url)"
                >
                  {{ btnitem.title ? btnitem.title : "按钮文案" }}
                </li>
              </ul>
            </div>
          </template>
        </div>
        <div v-else class="aim">
          {{ phoneData.templateText ? phoneData.templateText : "短信原文" }}
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
import phoneMixin from "./phone-mixin";

export default {
  name: "NotifyPhone",
  mixins: [phoneMixin]
};
</script>
<style lang="less" scoped>
.notifyPhone {
  .img-wrap {
    height: auto !important;
  }
  .xiaomi-body {
    height: 70%;
  }
  .singlePicTextViewOppo {
    max-height: 100%;
    overflow: auto;
  }
  .messageList {
    li {
      margin-top: 10px;
      span {
        margin-top: 5px;
        display: block;
      }
      .noticeName {
        color: #8c93b0;
        font-size: 12px;
      }
      .noticeContent {
        font-weight: 700;
        color: #000000;
      }
    }
  }
  .btn-ul {
    width: 100% !important;
  }
}
</style>
