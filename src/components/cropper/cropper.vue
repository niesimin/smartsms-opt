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
        <slot>
          <Upload
            action="image/upload"
            :on-format-error="handleFormatError"
            :before-upload="beforeUpload"
            :format="imgFormat"
            :max-size="maxSize"
            :on-exceeded-size="handleMaxSize"
          >
            <Button style="width: 100%;" type="primary">选择上传图片</Button>
          </Upload>
        </slot>
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
  name: "Cropper",
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
    maxSize: {
      type: Number,
      default: 2048
    },
    aspectRatio: {
      type: Number,
      default: 16 / 9
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
    imgFormat: {
      type: Array,
      default() {
        return ["jpg", "jpeg", "png"];
      }
    },
    cropperContinerHeight: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      insideSrc: "",
      cropper: null,
      imgBox: 300,
      previewBox: 150,
      loading: false
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
      console.log(previewBox);
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
    //Upload方法  上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
    beforeUpload(file) {
      if (file.size / 1024 <= this.maxSize && this.handleFormat(file.type)) {
        //使用FileReader对象（和他的方法）来操作目标文件/图片
        const reader = new FileReader();
        //即将被读取的 Blob 或 File 对象。
        reader.readAsDataURL(file);
        //当文件成功读取时，执行load 事件
        reader.onload = event => {
          this.insideSrc = event.srcElement.result;
        };
        return false;
      }
    },

    handleFormat(fm) {
      return this.imgFormat.some(item => {
        return fm.indexOf(item) > -1;
      });
    },

    handleMaxSize() {
      this.$Message.warning({
        content: "请上传大小小于" + this.maxSize + "kb的图片",
        duration: 5
      });
    },
    handleFormatError() {
      this.$Message.warning({
        content: "请上传正确格式的文件",
        duration: 5
      });
    },

    onCrop() {
      this.loading = true;
      this.$Message.info("图片裁剪中，请稍后！");
      setTimeout(() => {
        this.getCroppedCanvas();
      }, 1000);
    },

    getCroppedCanvas() {
      let cropperedUrl = this.cropper
        .getCroppedCanvas({
          imageSmoothingQuality: "high"
        })
        .toDataURL();
      this.$emit("on-crop", cropperedUrl);
      this.loading = false;
      this.$Message.success("裁剪成功!");
    }
  }
};
</script>

<style lang="scss" scoped></style>
