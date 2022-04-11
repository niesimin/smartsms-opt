<template>
  <div>
    <Card :bordered="false" class="main-card-content">
      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form
          ref="searchForm"
          :model="tableParma"
          inline
          class="searchForm"
          id="subscribeListSearch"
        >
          <FormItem class="dateLimits">
            <DateLimits
              ref="dateLimits"
              :betweenDate="31"
              :timeLimit="timeLimit"
            ></DateLimits>
          </FormItem>

          <FormItem prop="companyaNme">
            <Input
              type="text"
              v-model="tableParma.companyaNme"
              placeholder="公众号名称"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">公众号名称</span>
            </Input>
          </FormItem>

          <FormItem prop="status" label="状态" class="searchSelect propLable">
            <Select
              v-model="tableParma.status"
              transfer
              @on-change="handleSearchSubmit()"
            >
              <Option
                v-for="item in companyStatusType"
                :value="item.did"
                :key="item.did"
                >{{ item.dv }}
              </Option>
            </Select>
          </FormItem>

          <Checkbox
            v-model="tableParma.accurate"
            @on-change="handleSearchSubmit()"
            >精确查询</Checkbox
          >

          <Button type="primary" @click="handleSearchSubmit()">
            <Icon type="md-search" /> 搜索
          </Button>

          <Button class="pull-right" type="primary" @click="openAddModal()">
            <Icon type="md-add" /> 添加
          </Button>
        </Form>
      </div>

      <!-- table -->
      <Tables
        :columns="columns"
        :deleable="true"
        :detailable="true"
        :editable="true"
        @on-edit="openEditModal"
        @on-delete="openRemoveModal"
        :page="true"
        :detailTitleRowWidth="8"
        ref="remote"
      >
      </Tables>
    </Card>

    <!-- 新增模态窗 -->
    <FormModal
      ref="formModal"
      @handleSubmit="handleAddSubmit"
      :action="action"
      :width="700"
      @onvisiblechange="onvisiblechange"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="公众号名称" prop="companyaNme">
          <Input
            v-model="formValidate.companyaNme"
            placeholder="请输入公众号名称"
          ></Input>
        </FormItem>

        <FormItem label="LOGO" prop="logo">
          <UploadFile
            ref="uploadLogo"
            aspectRatio="1 / 1"
            :maxSize="500"
            :url="formValidate.logo"
            :crop="false"
            @UploadSuccess="getLogoUrl"
          >
            <img :src="formValidate.logo" v-if="formValidate.logo" />

            <template v-slot:tips>
              <div class="text-gray">
                <Icon type="ios-information-circle-outline" />
                比例：1:1 ， 大小不超过500K，格式：JPG、PNG、JPEG；
              </div>
            </template>
          </UploadFile>
          <CropperUpload
            v-if="showUploadLogo"
            :aspectRatio="1 / 1"
            :maxSize="500"
            :src="logo"
            @on-crop="getCropLogoUrl"
          ></CropperUpload>
        </FormItem>

        <FormItem label="行业" prop="industry">
          <Select v-model="formValidate.industry">
            <Option
              v-for="item in SearchIndustryType"
              :key="item.did + 'industry'"
              :value="item.did"
              >{{ item.dv }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="上报目的" prop="purpose">
          <Select v-model="formValidate.purpose" multiple>
            <Option
              v-for="item in purposeType"
              :key="item.dv"
              :value="item.did"
              >{{ item.dv }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="资质审核" prop="authInfo">
          <div class="upContainer">
            <div
              v-for="(item, idx) in formValidate.authInfo"
              :key="idx + item"
              class="mulupContainer"
              @mouseenter="showDelIcon = idx"
              @mouseleave="showDelIcon = -1"
            >
              <img :src="item" />
              <div class="delMask" v-if="showDelIcon == idx">
                <Icon type="ios-trash" @click="delAuthImg(idx)" />
              </div>
            </div>
            <UploadFile
              v-if="formValidate.authInfo.length < 6"
              ref="uploadAuth"
              :maxSize="4096"
              aspectRatio="646 / 925"
              :crop="false"
              @UploadSuccess="getAuthUrl"
              :bgUploadBtn="uploadpng"
            >
              <template v-slot:tips> </template>
            </UploadFile>
          </div>

          <div class="text-gray">
            <Icon type="ios-information-circle-outline" />
            请上传授权书、营业执照、合同证明等图片（最多上传6张）；<br />
            支持图片格式：JPG,JPEG,PNG;
            图片在100k-4M之间；图片光线良好，无软件处理；图像清晰度可辨认
          </div>
          <CropperUpload
            v-if="showUploadAuth"
            :aspectRatio="25 / 35.4"
            ratio="25/35.4"
            :maxSize="4096"
            :src="authUrl"
            @on-crop="getCropAuthUrl"
          ></CropperUpload>
        </FormItem>
      </Form>
    </FormModal>

    <!-- 删除模态窗 -->
    <Alertmodal
      :modalContent="modalContent"
      @handleDelete="handleRemove($event)"
      :currentData="currentData"
      ref="delModal"
    ></Alertmodal>
  </div>
</template>

<script>
import Tables from "@/components/tables/tables.vue";
import DateLimits from "@/components/datePicker/dateLimits.vue";
import FormModal from "@/components/modal/formModal.vue";
import uploadpng from "@/assets/images/upload3.png";
import Alertmodal from "@/components/modal/alertmodal.vue";
import UploadFile from "@/components/upload/upload.vue";
import CropperUpload from "@/components/upload/cropperUpload.vue";
//import dl from "@/assets/images/dl.png";
import {
  getFormatTimesTamp,
  keyFactory,
  getFormatDateTamp
} from "@/libs/tools";
import { remoteKeyFactory } from "@/libs/util";
export default {
  name: "getCompanyList",
  components: {
    Tables,
    DateLimits,
    Alertmodal,
    FormModal,
    UploadFile,
    CropperUpload
  },
  data() {
    return {
      logo: "",
      fileName: "",
      authUrl: "",
      uploadpng: uploadpng,
      showUploadLogo: false,
      showUploadAuth: false,
      showDelIcon: -1,
      maxAuthLength: 6,
      timeLimit: {
        endDate: getFormatDateTamp(new Date().getTime()),
        startDate:
          new Date(getFormatDateTamp(new Date().getTime())).valueOf() -
          30 * 24 * 60 * 60 * 1000
      },
      tableParma: {
        companyaNme: "",
        status: "null",
        page: 1,
        recPerPage: 15,
        accurate: false
      },
      SearchIndustryType: keyFactory.getConstStore(7),
      purposeType: remoteKeyFactory.getConstStore("purposeType"),
      companyStatusType: remoteKeyFactory.getConstStore(
        "companyStatusType",
        true
      ),
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "公众号名称",
          key: "companyaNme",
          minWidth: 120
        },
        {
          title: "LOGO",
          key: "logo",
          slot: "image",
          minWidth: 120
        },
        {
          title: "行业",

          key: "industry",
          keyFactoryCode: 7,
          render: (h, { row }) => {
            return h(
              "div",
              keyFactory.getValue(this.SearchIndustryType, row.industry)
            );
          },
          minWidth: 120
        },
        {
          title: "状态",
          key: "status",

          keyFactoryCode: "companyStatusType",
          render: (h, { row }) => {
            return h(
              "Tag",
              {
                props: {
                  color: remoteKeyFactory.getColor(
                    this.companyStatusType,
                    row.status
                  )
                }
              },
              remoteKeyFactory.getValue(this.companyStatusType, row.status)
            );
          },
          minWidth: 120
        },
        {
          title: "创建时间",
          key: "createDate",

          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.createDate));
          },
          minWidth: 170
        },
        {
          title: "更新时间",

          key: "updateDate",
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.updateDate));
          },
          minWidth: 170
        },
        {
          title: "操作",
          key: "操作",
          width: 150,
          align: "center",
          slot: "action"
        }
      ],
      action: "",
      currentData: null,
      formValidate: {
        companyaNme: "",
        industry: 2,
        authInfo: [],
        logo: "",
        purpose: []
      },

      ruleValidate: {
        companyaNme: [
          {
            required: true,
            message: "名称不能为空"
          }
        ],
        logo: [
          {
            required: true,
            message: "请选择图片"
          }
        ],
        industry: [
          {
            required: true,
            message: "请选择行业"
          }
        ],
        purpose: [
          {
            required: true,
            message: "请选择上报目的"
          }
        ]
      },
      modalContent: ""
    };
  },
  mounted() {
    this.remoteTable();
  },

  methods: {
    //监听新增、编辑模态窗显示隐藏
    onvisiblechange(event) {
      if (!event) {
        this.showUploadLogo = false;
      }
    },

    //请求table数据
    remoteTable() {
      this.$refs.remote.remoteTable(
        this.$api.company.getCompanyList,
        Object.assign(this.tableParma, this.$refs.dateLimits.getTime())
      );
    },

    //搜索
    handleSearchSubmit() {
      this.tableParma = Object.assign(this.tableParma, { page: 1 });
      this.remoteTable();
    },

    //初始化添加
    openAddModal() {
      this.action = "add";
      this.$refs.formModal.openModal();
      this.$refs.formValidate.resetFields();
    },

    //初始化编辑
    openEditModal(row) {
      this.$refs.formValidate.resetFields();
      this.action = "edit";
      this.currentData = row;
      this.formValidate.companyaNme = row.companyaNme;
      this.formValidate.logo = row.logo;
      this.formValidate.industry = row.industry;
      this.formValidate.purpose = row.purpose;
      let authInfo = [
        row.authInfo1,
        row.authInfo2,
        row.authInfo3,
        row.authInfo4,
        row.authInfo5,
        row.authInfo6
      ];
      this.formValidate.authInfo = authInfo.filter(item => {
        return item;
      });

      this.$refs.formModal.openModal();
    },

    //添加/编辑提交
    handleAddSubmit() {
      let axiosUrl;
      let axiosParam = {};
      for (let i = 0; i < this.formValidate.authInfo.length; i++) {
        axiosParam["authInfo" + (i + 1 + "")] = this.formValidate.authInfo[i];
      }
      axiosParam.companyaNme = this.formValidate.companyaNme;
      axiosParam.industry = this.formValidate.industry;
      axiosParam.purpose = JSON.stringify(this.formValidate.purpose);

      axiosParam.logo = this.formValidate.logo;
      if (this.action == "add") {
        axiosUrl = this.$api.company.saveCompany;
      } else {
        axiosUrl = this.$api.company.updateCompany;
        axiosParam.id = this.currentData.id;
      }

      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$post(axiosUrl, axiosParam).then(res => {
            if (res.error == 0) {
              this.$Message.success("操作成功!");
              this.remoteTable();
              this.$refs.formModal.colseModal();
            }
          });
        } else {
          this.$Message.error("输入有误,请检查!");
        }
      });
    },

    //初始化删除
    openRemoveModal(params) {
      this.currentData = params;
      this.modalContent =
        "您确定要删除公众号 <i class='text-danger'> " +
        params.companyaNme +
        " </i>吗?";
      this.$refs.delModal.openModal();
    },

    //删除回调
    handleRemove(item) {
      this.$post(this.$api.company.deleteCompany, {
        id: item.id
      }).then(res => {
        if (res.error == 0) {
          this.$Message.success("删除成功");
          this.remoteTable();
          this.$refs.delModal.colseModal();
        }
      });
    },

    getLogoUrl(cropperedUrl) {
      this.logo = cropperedUrl;
      this.showUploadLogo = true;
    },

    getCropLogoUrl(cropperedUrl) {
      this.formValidate.logo = cropperedUrl;
      this.showUploadLogo = false;
    },

    getAuthUrl(cropperedUrl) {
      this.authUrl = cropperedUrl;
      this.showUploadAuth = true;
    },

    getCropAuthUrl(cropperedUrl) {
      this.formValidate.authInfo.push(cropperedUrl);
      this.showUploadAuth = false;
    },
    delAuthImg(idx) {
      this.formValidate.authInfo.splice(idx, 1);
    }
  }
};
</script>
<style lang="less" scope>
@import "../template/singleForm.less";
.Cropper {
  width: 100%;
}
</style>
