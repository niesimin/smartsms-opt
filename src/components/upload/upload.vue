<template>
  <div :class="['upContainer', ratio != 1 / 1 ? 'bannerImg' : '']">
    <Upload
      :action="action ? action : 'image/upload'"
      :format="format"
      :max-size="maxSize"
      :accept="accept"
      :before-upload="handelBeforeUpload"
      :on-format-error="handelFormatError"
      :on-exceeded-size="handelExceededSize"
      :data="uploadData"
      :on-success="onUploadSuccess"
      :on-error="onUploadError"
      :show-upload-list="false"
    >
      <div v-if="uploadUrl || url">
        <slot></slot>
      </div>
      <img :src="bgUploadBtn" v-else-if="bgUploadBtn" class="bgUploadBtn" />
      <img :src="uploadImg" v-else />
    </Upload>
    <Progress
      v-if="percent"
      :percent="percent"
      :status="uploadStatus"
      text-inside
      :stroke-width="5"
    />
    <slot name="tips"></slot>

    <Modal v-model="showCropModal" title="裁剪图片" footerHide>
      <div class="Cropper" v-if="showCropModal">
        <CropperUpload
          :file="file"
          :src="cropUrl"
          :aspectRatio="ratio"
          :ratio="aspectRatio"
          :maxSize="maxSize"
          @on-crop="getCropUrl"
        ></CropperUpload>
      </div>
    </Modal>
  </div>
</template>

<script>
import uploadpng1 from "@/assets/images/upload.png";
import uploadpng2 from "@/assets/images/upload2.png";
import CropperUpload from "./cropperUpload.vue";

export default {
  name: "UploadFile",
  components: {
    CropperUpload
  },
  props: {
    bgUploadBtn: {
      type: String,
      default: ""
    },
    uploadParam: {
      type: Object,
      default() {
        return {};
      }
    },
    idx: {
      type: Number,
      default: 0
    },
    crop: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    format: {
      type: Array,
      default() {
        return ["jpg", "jpeg", "png"];
      }
    },
    maxSize: {
      type: Number,
      default: 500
    },
    aspectRatio: {
      type: String,
      default: "16 / 9"
    }
  },
  data() {
    return {
      uploadpng2: uploadpng2,
      uploadUrl: "",
      showCropModal: false,
      cropUrl: "",
      file: null,
      uploadData: {},
      percent: 0,
      uploadStatus: "normal",
      ratio: 16 / 9
    };
  },
  mounted() {
    this.ratio =
      Number(this.aspectRatio.split("/")[0]) /
      Number(this.aspectRatio.split("/")[1]);

    this.uploadData = this.uploadParam;
  },
  computed: {
    accept() {
      return this.format.join(",");
    },
    uploadImg() {
      return this.ratio == 1 / 1 ? uploadpng1 : uploadpng2;
    }
  },

  methods: {
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
    handelBeforeUpload(file) {
      if (
        file.size / 1024 <= this.maxSize &&
        this.handleFormat(file.type, file.name)
      ) {
        this.resetProgress();
        //使用FileReader对象（和他的方法）来操作目标文件/图片
        const reader = new FileReader();
        //即将被读取的 Blob 或 File 对象。
        reader.readAsDataURL(file);

        if (this.action) {
          this.uploadData.fileName = file.name;

          this.addProgress(Math.floor(Math.random() * 90));
        } else {
          //当文件成功读取时，执行load 事件
          reader.onload = event => {
            this.$nextTick(() => {
              this.file = file;
              if (this.crop) {
                this.showCropModal = true;
                this.cropUrl = event.srcElement.result;
              } else {
                this.$emit("UploadSuccess", event.srcElement.result, file);
                // this.addProgress(100);
              }

              console.log(this.uploadUrl);
            });
          };
        }
        return this.action ? true : false;
      }
    },

    getCropUrl(cropperedUrl) {
      this.$emit("cropSuccess", {
        cropperedUrl,
        file: this.file,
        idx: this.idx
      });
      this.addProgress(90);
    },

    onUploadSuccess(res) {
      if (this.action) {
        this.$emit("UploadSuccess", res.imgPath);
      }

      this.addProgress(100);
      this.$Message.success("上传成功!");
      if (this.crop) {
        this.closeCropModal();
      }
    },

    resetProgress() {
      this.percent = 0;
      this.uploadStatus = "normal";
    },

    addProgress(pre, status) {
      if (this.percent >= pre) {
        if (this.percent == 100) {
          this.uploadStatus = status ? status : "success";
        }
        return false;
      } else {
        this.percent += 10;
        this.uploadStatus = "active";
        this.addProgress(pre, status);
      }
    },

    onUploadError(err) {
      console.log(err);
      this.addProgress(60);
      this.$nextTick(() => {
        this.addProgress(100, "wrong");
      });
      // this.percent = 100;
      // this.uploadStatus = "wrong";
      if (!err.errorMsg) {
        this.$Message.error("上传失败!");
      }
      if (this.crop) {
        this.closeCropModal();
      }
    },

    onUploadRemove(file) {
      console.log(file);
    },

    handleFormat(fm, name) {
      return this.format.some(item => {
        return (
          fm.indexOf(item.toLowerCase()) > -1 ||
          name.indexOf(item.toLowerCase()) > -1
        );
      });
    },

    //文件格式验证失败时的钩子，返回字段为 file, fileList
    handelFormatError() {
      this.$Message.warning({
        content: "请上传正确格式的文件",
        duration: 5
      });
    },

    //文件超出指定大小限制时的钩子，返回字段为 file, fileList
    handelExceededSize() {
      this.$Message.warning({
        content: "请上传大小小于" + this.maxSize + "kb的图片",
        duration: 5
      });
    },
    closeCropModal() {
      this.showCropModal = false;
    }
  }
};
</script>

<style lang="less" scoped>
.bgUploadBtn {
  width: 150px !important;
}
</style>
