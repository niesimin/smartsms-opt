<template>
  <div class="showcasePhone">
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
        <div
          :class="[
            'singlePicTextViewOppo',
            showOriginalText ? 'showcaseViewOppo' : ''
          ]"
        >
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
          <template v-if="phoneData.window && showOriginalText">
            <swiper class="swiper" :options="swiperOptions">
              <swiper-slide
                v-for="(winitem, idx) in phoneData.window"
                :key="idx + 'win'"
                class="slide"
              >
                <div class="img-wrap">
                  <img v-if="winitem.url" :src="winitem.url" />
                  <img v-else :src="banner" style="width:80px" />
                </div>

                <div class="img-text">
                  <div style="height:60px">
                    <h4 class="text-ellipsis">
                      {{ winitem.title }}
                    </h4>
                    <div class="digest text-ellipsis-clamp">
                      {{ winitem.introduction }}
                    </div>
                  </div>
                  <div class="bottom">
                    <div class="btn-ul">
                      {{
                        winitem.button.title ? winitem.button.title : "按钮文案"
                      }}
                    </div>
                  </div>
                </div></swiper-slide
              >
            </swiper>
          </template>
        </div>
      </div>

      <!-- {{ phoneData }} -->
    </div>
  </div>
</template>

<script>
import phoneMixin from "./phone-mixin";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  name: "ShowcasePhone",
  mixins: [phoneMixin],
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 2,
        spaceBetween: 10,
        autoplay: true,
        delay: 3000
      }
    };
  }
};
</script>

<style lang="less" scope>
.showcasePhone {
  .templateText {
    padding: 0 0 16px !important;
  }
  .oppo-body {
    .showcaseViewOppo {
      padding: 0 !important;
      box-shadow: 0 0px 0px #ffffff;
      border: 0;
    }
    .slide {
      .img-wrap {
        border-radius: 0;
      }
      img {
        width: 100%;
        vertical-align: middle;
        margin: 0 auto;
      }
      .img-text {
        margin: 0;
        background: #f5f5f5;
        padding: 15px 10px 12px;
      }
      .bottom {
        margin-bottom: 0;
        .btn-ul {
          color: #000;
          font-weight: 700 !important;
          background: #fff;
          border-radius: 32px;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
