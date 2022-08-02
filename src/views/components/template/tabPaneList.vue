<template>
  <div>
    <template v-if="cardData.length > 0">
      <Card :bordered="false" v-for="item in cardData" :key="item.id">
        <Row slot="title">
          <Col span="18" class="text-ellipsis"
            >模板名称：{{ item.templateName }}</Col
          >
          <Col span="6" class="text-center">
            <Dropdown>
              <a href="javascript:void(0)">
                审核详情
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem
                  ><Tag :color="getStatusColor(item.oppoStatus)"
                    >oppo {{ getStatusValue(item.oppoStatus) }}</Tag
                  ></DropdownItem
                >
                <DropdownItem
                  ><Tag :color="getStatusColor(item.vivoStatus)"
                    >vivo {{ getStatusValue(item.vivoStatus) }}</Tag
                  ></DropdownItem
                >

                <DropdownItem
                  ><Tag :color="getStatusColor(item.xiaomiStatus)"
                    >小米 {{ getStatusValue(item.xiaomiStatus) }}</Tag
                  ></DropdownItem
                >
              </DropdownMenu>
            </Dropdown></Col
          >
        </Row>
        <p>所属公众号：{{ item.companyName }}</p>
        <p>更新时间： {{ getFormatTimesTamp(item.updateDate) }}</p>

        <div
          class="vvu-card-body"
          v-if="item.templateType == 1"
          @click="editTemplate(item.id, 3)"
        >
          <img :src="item.singlePicture.url" />
          <div class="vvu-card-body-text">
            <div class="text-ellipsis">
              {{ matchBrace(item.singlePicture.title) }}
            </div>
            <div class="text-ellipsis-clamp">
              {{ matchBrace(item.singlePicture.introduction) }}
            </div>
          </div>
        </div>

        <div
          class="vvu-card-body"
          v-else-if="item.templateType == 2"
          @click="editTemplate(item.id, 3)"
        >
          <img :src="item.multiPicture.url" />
          <List>
            <ListItem
              ><ListItemMeta
                :avatar="item.multiPicture.smallPictures[0].url"
                :title="item.multiPicture.smallPictures[0].title"
              ></ListItemMeta
            ></ListItem>
          </List>
        </div>

        <div class="vvu-card-body" v-if="item.templateType == 3">
          <!-- <div :class="" @click="showVideo = true" :key="item.id">
            <img :src="item.video.coverUrl" />
          </div> -->
          <video
            width="100%"
            preload="auto"
            type="video/mp4"
            :src="item.video.url"
            controls
          />

          <div class="vvu-card-body-text" @click="editTemplate(item.id, 3)">
            <div class="text-ellipsis">{{ item.video.title }}</div>
            <div class="text-ellipsis-clamp">
              {{ item.video.introduction }}
            </div>
          </div>
        </div>

        <div
          class="vvu-card-body bg-white"
          v-if="item.templateType == 4"
          @click="editTemplate(item.id, 3)"
        >
          <swiper
            class="swiper"
            :options="swiperOptions"
            v-if="item.window.length > 0"
          >
            <swiper-slide
              v-for="(winitem, idx) in item.window"
              :key="idx + 'win'"
              class="slide"
              ><img :src="winitem.url" />
              <div class="swiperText">
                <div class="text-ellipsis">
                  {{ winitem.title }}
                </div>
                <div class="text-ellipsis-clamp">
                  {{ winitem.introduction }}
                </div>
                <Button shape="circle" long
                  ><b>{{ winitem.button.title }}</b></Button
                >
              </div></swiper-slide
            >
          </swiper>
        </div>

        <div
          class="vvu-card-body"
          v-if="item.templateType == 5"
          @click="editTemplate(item.id, 3)"
        >
          <img :src="item.notice.url" />
          <div class="vvu-card-body-text">
            <div class="text-ellipsis">{{ item.notice.title }}</div>
            <div class="weather">
              <div v-for="items in item.notice.messageList" :key="items.name">
                <p>{{ items.name }}</p>
                <p>
                  <b>{{ items.content }}</b>
                </p>
              </div>
            </div>
            <div
              v-for="btnss in item.notice.buttonList"
              :key="btnss.title"
              class="buttonList"
            >
              <Button shape="circle" long>{{ btnss.title }}</Button>
            </div>
          </div>
        </div>

        <div
          class="vvu-card-body coupon-card-body"
          v-else-if="item.templateType == 6"
          @click="editTemplate(item.id, 3)"
        >
          <p class="text-ellipsis">{{ item.templateText }}</p>

          <List>
            <ListItem
              ><ListItemMeta
                :avatar="item.app.url"
                :title="item.app.appName"
                :description="item.app.introduction"
              ></ListItemMeta>
              <template slot="action">
                <li>
                  <Button type="primary" shape="circle" ghost>下载</Button>
                </li>
              </template></ListItem
            >
          </List>
        </div>

        <div
          class="vvu-card-body coupon-card-body"
          v-else-if="item.templateType == 7"
          @click="editTemplate(item.id, 3)"
        >
          <p class="text-ellipsis">{{ item.templateText }}</p>
          <p class="text-ellipsis text-gray">{{ item.coupon.tips }}</p>
          <div class="line">
            <div class="line-left"></div>
            <div class="line-center"></div>
            <div class="line-right"></div>
          </div>

          <List>
            <ListItem
              ><ListItemMeta
                :avatar="item.coupon.url"
                :title="item.coupon.title"
                :description="item.coupon.introduction"
              ></ListItemMeta
            ></ListItem>
          </List>
        </div>

        <div class="vvu-card-foot">
          <div @click="editTemplate(item.id, 1)">
            <Icon type="ios-copy-outline" size="20" />
            <div>复制</div>
          </div>
          <template
            v-if="
              (item.oppoStatus == 3 || item.oppoStatus == 2) &&
                (item.vivoStatus == 3 || item.vivoStatus == 2) &&
                (item.xiaomiStatus == 3 || item.xiaomiStatus == 2)
            "
          >
            <div @click="editTemplate(item.id, 2)">
              <Icon type="ios-create-outline" size="22" />
              <div>编辑</div>
            </div>
            <div @click="deleteTemplate(item.id, item.templateName)">
              <Icon type="ios-trash-outline" size="22" />
              <div>删除</div>
            </div>
          </template>
        </div>
      </Card>
    </template>
  </div>
</template>

<script>
import { getFormatTimesTamp } from "@/libs/tools";
import { remoteKeyFactory } from "@/libs/util";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import uploadpng1 from "@/assets/images/upload.png";
import "swiper/dist/css/swiper.css";
export default {
  name: "TabPaneList",
  components: {
    swiper,
    swiperSlide
  },
  props: {
    panelData: {
      type: Array,
      default() {
        return [];
      }
    },
    templateType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      uploadpng1,
      getFormatTimesTamp,
      cardData: [],

      SearStatusType: remoteKeyFactory.getConstStore(
        "templateStatusType",
        true
      ),
      swiperOptions: {
        slidesPerView: 2,
        spaceBetween: 10,
        autoplay: true,
        delay: 3000
      },
      showVideo: null
    };
  },
  computed: {
    matchBrace() {
      return txt => {
        let newtxt = txt;
        return newtxt.replace(/{|}/g, "");
      };
    }
  },
  mounted() {
    this.cardData = this.panelData;
  },
  watch: {
    panelData(newValue) {
      this.cardData = newValue;
    }
  },
  methods: {
    //获取审核状态文字
    getStatusValue(status) {
      return remoteKeyFactory.getValue(this.SearStatusType, status);
    },
    //获取审核状态颜色
    getStatusColor(status) {
      return remoteKeyFactory.getColor(this.SearStatusType, status);
    },
    //触发编辑按钮
    editTemplate(id, type) {
      const route = {
        name: "createTemplate",
        query: {
          type: Number(type),
          temPlateId: id,
          templateType: Number(this.templateType)
        }
      };
      this.$router.push(route);
    },
    deleteTemplate(id, templateName) {
      this.$emit("delTemplate", { id, templateName });
    }
  }
};
</script>

<style lang="less" scope>
// .swiper-slide {
//   text-align: center;
//   font-size: 18px;
//   background: #fff;

//   /* Center slide text vertically */
//   display: -webkit-box;
//   display: -ms-flexbox;
//   display: -webkit-flex;
//   display: flex;
//   -webkit-box-pack: center;
//   -ms-flex-pack: center;
//   -webkit-justify-content: center;
//   justify-content: center;
//   -webkit-box-align: center;
//   -ms-flex-align: center;
//   -webkit-align-items: center;
//   align-items: center;
// }

// .swiper-slide img {
//   display: block;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }
</style>
