<template>
  <div class="singlePicturePhone">
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
              <h4>
                {{ phoneData.singlePicture.title }}
              </h4>
            </div>
          </template>

          <div
            :class="
              !showOriginalText
                ? 'templateText templateTextPadding'
                : 'templateText'
            "
          >
            {{ phoneData.templateText }}
          </div>
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
  name: "SinglePicturePhone",
  mixins: [phoneMixin]
};
</script>
