<template>
  <div class="multiPicturePhone">
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
            <span>服务信息</span>
            <span
              class="cursor"
              @click="showOriginalText = !showOriginalText"
              >{{ showOriginalText ? "查看原文" : "查看卡片" }}</span
            >
          </div>
          <template v-if="phoneData.multiPicture">
            <div
              v-if="showOriginalText"
              class="img-wrap"
              @click="toLink(phoneData.multiPicture.urlClickAction.url)"
            >
              <img
                v-if="phoneData.multiPicture.url"
                :src="phoneData.multiPicture.url"
              />
              <img v-else :src="banner" style="width:80px;margin:0 auto" />
              <div class="templateIntro-bg">
                <div>{{ phoneData.multiPicture.introduction }}</div>
              </div>
            </div>
            <div v-else class="templateText">
              {{ phoneData.templateText ? phoneData.templateText : "短信原文" }}
            </div>
            <ul class="prefButtonList" v-if="showOriginalText">
              <li
                v-for="(item, idx) in phoneData.multiPicture.smallPictures"
                :key="idx + 'smallPictures'"
                @click="toLink(item.clickAction.url)"
              >
                <h4>{{ item.title }}</h4>
                <div class="img-wrap">
                  <img :src="item.url ? item.url : banner" />
                </div>
              </li>
            </ul>
          </template>
        </div>
      </div>

      <!-- xiaomi -->
      <div class="phone-body xiaomi-body" v-else-if="vendor == 3">
        <div class="singlePicTextViewOppo" v-if="showOriginalText">
          <template v-if="phoneData.multiPicture">
            <div
              class="img-wrap"
              @click="toLink(phoneData.multiPicture.urlClickAction.url)"
            >
              <img
                v-if="phoneData.multiPicture.url"
                :src="phoneData.multiPicture.url"
              />
              <img v-else :src="banner" style="width:80px;margin:0 auto" />
              <div class="templateIntro-bg">
                <div>{{ phoneData.multiPicture.introduction }}</div>
              </div>
            </div>

            <ul class="prefButtonList" v-if="showOriginalText">
              <li
                v-for="(item, idx) in phoneData.multiPicture.smallPictures"
                :key="idx + 'smallPictures'"
                @click="toLink(item.clickAction.url)"
              >
                <div class="img-wrap">
                  <img :src="item.url ? item.url : banner" />
                </div>
                <h4>{{ item.title }}</h4>
              </li>
            </ul>

            <!-- <div
              class="img-text"
              @click="toLink(phoneData.multiPicture.urlClickAction.url)"
            >
              <h4 v-if="phoneData.multiPicture.title">
                {{ phoneData.multiPicture.title }}
              </h4>
              <div class="digest" v-if="phoneData.multiPicture.introduction">
                {{ phoneData.multiPicture.introduction }}
              </div>
            </div> -->
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
  name: "MultiPicturePhone",
  mixins: [phoneMixin]
};
</script>

<style lang="less" scope>
.multiPicturePhone {
  .singlePicTextViewOppo {
    font-size: 12px;
    .img-wrap {
      position: relative;

      .templateIntro-bg {
        font-size: 12px;
        font-weight: 700;

        text-align: left;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: -moz-linear-gradient(
          bottom,
          rgba(0, 0, 0, 0.5) 0,
          transparent 100%
        );
        background: -webkit-gradient(
          bottom,
          color-stop(0, rgba(0, 0, 0, 0.5)),
          color-stop(100%, transparent)
        );
        background: -webkit-linear-gradient(
          bottom,
          rgba(0, 0, 0, 0.5),
          transparent
        );
        background: -o-linear-gradient(
          bottom,
          rgba(0, 0, 0, 0.5) 0,
          transparent 100%
        );
        background: -ms-linear-gradient(
          bottom,
          rgba(0, 0, 0, 0.5) 0,
          transparent 100%
        );
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0, transparent);
        div {
          font-size: 12px;
          margin: 15px 15px 12px;
          word-break: break-all;
          line-height: 16px;
          color: #fff;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
    .templateText {
      padding: 0 0 16px;
    }
    .prefButtonList {
      padding: 16px 0 0;
      li {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        margin-left: -4px;
        h4 {
          flex: 1;
          font-weight: 400;
          word-break: break-all;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          padding-left: 10px;
        }
        .img-wrap {
          width: 42px;
          height: 42px;
          background: #fff;
          margin-left: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .phone {
    .oppo-body .singlePicTextViewOppo {
      padding: 16px 16px 0;
    }

    .xiaomi-body {
      .img-wrap {
        height: 146px;
        border-radius: 0 none;
      }
      .prefButtonList {
        padding: 16px 16px 0;
      }
    }
  }
}
</style>
