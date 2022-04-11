<template>
  <div class="cropper-wrapper">
    <div class="img-box" :style="{ height: imgBox + 'px' }">
      <img class="cropper-image" :id="imgId" alt="" />
    </div>
    <div class="right-con">
      <div
        v-if="preview"
        class="preview-box"
        :style="{ height: previewBox + 'px' }"
        :id="previewId"
      ></div>
      <div class="button-box">
        <div v-show="insideSrc" class="ctrlbtn">
          <Button type="primary" v-if="showRotate" @click="rotate">
            <Icon type="md-refresh" :size="18" />
          </Button>
          <Button type="primary" v-if="showShrink" @click="shrink">
            <Icon type="md-remove" :size="18" />
          </Button>
          <Button type="primary" v-if="showMagnify" @click="magnify">
            <Icon type="md-add" :size="18" />
          </Button>
          <Button type="primary" v-if="showMove" @click="move(0, -moveStep)">
            <Icon type="md-arrow-round-up" :size="18" />
          </Button>
          <Button type="primary" v-if="showMove" @click="move(-moveStep, 0)">
            <Icon type="md-arrow-round-back" :size="18" />
          </Button>
          <Button type="primary" v-if="showMove" @click="move(0, moveStep)">
            <Icon type="md-arrow-round-down" :size="18" />
          </Button>
          <Button type="primary" v-if="showMove" @click="move(moveStep, 0)">
            <Icon type="md-arrow-round-forward" :size="18" />
          </Button>
        </div>
        <div v-show="insideSrc">
          <Button
            style="width: 100%;margin-top: 10px;"
            type="primary"
            :loading="loading"
            @click="onCrop"
          >
            {{ cropButtonText }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import "./cropper.less";
export default {
  name: "CropperUpload",
  props: {
    src: {
      type: String,
      default: ""
    },
    preview: {
      type: Boolean,
      default: true
    },
    cropButtonText: {
      type: String,
      default: "确定裁剪"
    },

    aspectRatio: {
      type: Number,
      default: 16 / 9
    },
    ratio: {
      type: String,
      default: "16 / 9"
    },
    moveStep: {
      type: Number,
      default: 4
    },
    showRotate: {
      type: Boolean,
      default: true
    },
    showShrink: {
      type: Boolean,
      default: true
    },
    showMagnify: {
      type: Boolean,
      default: true
    },
    showMove: {
      type: Boolean,
      default: false
    },

    cropperContinerHeight: {
      type: Number,
      default: 300
    },
    file: {
      typeof: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      insideSrc: "",
      cropper: null,
      imgBox: 300,
      previewBox: 150,
      loading: false,
      ratioWidth: 16,
      ratioHeight: 9
    };
  },
  computed: {
    imgId() {
      return `cropper${this._uid}`;
    },
    previewId() {
      return `cropper_preview${this._uid}`;
    }
  },
  mounted() {
    console.log(this.aspectRatio);

    this.ratioWidth = Number(this.ratio.split("/")[0]);
    this.ratioHeight = Number(this.ratio.split("/")[1]);
    console.log(this.ratioWidth, this.ratioHeight);
    this.$nextTick(() => {
      let imgDom = document.getElementById(this.imgId);
      this.cropper = new Cropper(imgDom, {
        aspectRatio: this.aspectRatio,
        preview: `#${this.previewId}`,
        viewMode: 1,
        autoCropArea: 1,
        checkCrossOrigin: false
      });

      let imgBox = document.getElementsByClassName("img-box")[0].clientWidth;
      let previewBox = document.getElementsByClassName("preview-box")[0]
        .clientWidth;
      this.previewBox = previewBox / this.aspectRatio;
      this.imgBox = (imgBox * 9) / 16 + 100;

      if (this.src) {
        this.insideSrc = this.src;
      }
    });
  },
  watch: {
    src(src) {
      this.replace(src);
    },
    insideSrc(src) {
      this.replace(src);
    }
  },
  methods: {
    //旋转
    rotate() {
      this.cropper.rotate(90);
    },
    //缩小
    shrink() {
      this.cropper.zoom(-0.1);
    },
    //放大
    magnify() {
      this.cropper.zoom(0.1);
    },
    //移动
    move(...argu) {
      this.cropper.move(...argu);
    },
    //替换img的url地址。
    replace(src) {
      //cropper方法replace(url[, hasSameSize])
      //替换img的url地址。
      this.cropper.replace(src);
      this.insideSrc = src;
    },

    onCrop() {
      this.loading = true;
      this.$Message.info("图片裁剪中，请稍后！");
      let getdata = this.cropper.getData();
      console.log(getdata);
      // if (this.aspectRatio == 16 / 9) {
      //   if (Math.round(getdata.width) / Math.round(getdata.height) != 16 / 9) {
      //     let hei = parseInt(Math.round(getdata.height) / 9) * 9;
      //     let wei = hei * (16 / 9);
      //     getdata.width = wei;
      //     getdata.height = hei;
      //     console.log(getdata);
      //     this.cropper.setData(getdata);
      //   }
      // }

      // if (this.aspectRatio == 3 / 1) {
      //   if (Math.round(getdata.width) / Math.round(getdata.height) != 3 / 1) {
      //     let hei = parseInt(Math.round(getdata.width) / 3);
      //     let wei = hei * 3;
      //     getdata.width = wei;
      //     getdata.height = hei;
      //     console.log(getdata);
      //     this.cropper.setData(getdata);
      //   }
      // }

      if (
        Math.round(getdata.width) / Math.round(getdata.height) !=
        this.aspectRatio
      ) {
        let ngetdata = getdata;
        let per = parseInt(parseInt(getdata.height) / this.ratioHeight);
        let hei = per * this.ratioHeight;
        let wei = per * this.ratioWidth;
        ngetdata.width = wei;
        ngetdata.height = hei;
        this.cropper.setData(ngetdata);
        console.log(ngetdata);
      }

      setTimeout(() => {
        this.getCroppedCanvas();
      }, 1000);
    },

    getCroppedCanvas() {
      let cropper = this.cropper.getCroppedCanvas({
        imageSmoothingQuality: "high"
      });
      console.log(cropper, this.cropper.getData());

      let cropperedUrl = cropper.toDataURL("image/jpeg", 0.8);
      this.$emit("on-crop", cropperedUrl);
      this.loading = false;
      this.$Message.success("裁剪成功!");
    }
  }
};
</script>
