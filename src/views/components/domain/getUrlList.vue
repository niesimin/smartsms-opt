<template>
  <div>
    <Card :bordered="false" class="main-card-content">
      <!-- <Button type="primary" @click="exportExcel">导出为Csv文件</Button> -->

      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form ref="searchForm" :model="tableParma" inline class="searchForm">
          <FormItem prop="shortChainName">
            <Input
              type="text"
              v-model="tableParma.shortChainName"
              placeholder="请输入短链名称"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">域名名称</span>
            </Input>
          </FormItem>

          <FormItem prop="shortChain">
            <Input
              type="text"
              v-model="tableParma.shortChain"
              placeholder="请输入短链"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">域名</span>
            </Input>
          </FormItem>

          <FormItem
            prop="status"
            label="报备状态"
            class="searchSelect propLable"
          >
            <Select
              v-model="tableParma.status"
              transfer
              @on-change="handleSearchSubmit()"
            >
              <Option
                v-for="item in SearStatusType"
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
        :page="true"
        :detailTitleRowWidth="7"
        ref="remote"
        @on-edit="openEditModal"
        @on-delete="openRemoveModal"
      >
      </Tables>
    </Card>

    <!-- 新增模态窗 -->
    <FormModal ref="formModal" @handleSubmit="handleAddSubmit" :action="action">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="域名名称" prop="shortChainName">
          <Input
            v-model="formValidate.shortChainName"
            placeholder="请输入域名名称,用于区分域名，限制20字"
            maxlength="20"
            show-word-limit
          ></Input>
        </FormItem>

        <FormItem label="域名" prop="shortChain">
          <Input
            :disabled="action == 'edit' ? true : false"
            v-model="formValidate.shortChain"
            placeholder="请输入需要报备的URL域名"
          ></Input>
        </FormItem>

        <FormItem label="描述" prop="description">
          <Input
            v-model="formValidate.description"
            placeholder="请输入描述，如域名归属，域名用途等"
            maxlength="500"
            show-word-limit
            type="textarea"
          ></Input>
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
import { remoteKeyFactory } from "@/libs/util";
import { getFormatTimesTamp, validates } from "@/libs/tools";
import FormModal from "@/components/modal/formModal.vue";
import Alertmodal from "@/components/modal/alertmodal.vue";

export default {
  name: "getUrlList",
  components: {
    Tables,
    FormModal,
    Alertmodal
  },
  data() {
    return {
      SearStatusType: remoteKeyFactory.getConstStore("companyStatusType", true),
      tableParma: {
        status: "null",
        shortChainName: "",
        shortChain: "",
        page: 1,
        recPerPage: 15,
        accurate: false
      },

      columns: [
        // {
        //   key: "id",
        //   width: 80,
        //   title: "Id"
        // },
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "域名名称",
          key: "shortChainName",
          minWidth: 120
        },
        {
          title: "域名",
          key: "shortChain",
          minWidth: 120
        },
        {
          title: "描述",
          key: "description",
          minWidth: 120
        },
        {
          title: "报备状态",
          key: "status",
          keyFactoryCode: 6,
          render: (h, { row }) => {
            return h(
              "Tag",
              {
                props: {
                  color: remoteKeyFactory.getColor(
                    this.SearStatusType,
                    row.status
                  )
                }
              },
              remoteKeyFactory.getValue(this.SearStatusType, row.status)
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
      formValidate: {
        shortChainName: "",
        description: "",
        shortChain: ""
      },
      ruleValidate: {
        shortChainName: [
          {
            required: true,
            max: 20,
            message: "域名名称不能为空"
          }
        ],
        shortChain: [
          {
            required: true,
            validator: validates.isRealmName,
            message: "请输入正确格式的域名"
          }
        ]
      },
      currentData: {},
      action: "add",
      modalContent: ""
    };
  },
  mounted() {
    this.remoteTable();
  },

  methods: {
    //请求table数据
    remoteTable() {
      this.$refs.remote.remoteTable(this.$api.url.getUrlList, this.tableParma);
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
      this.formValidate.shortChainName = row.shortChainName;
      this.formValidate.shortChain = row.shortChain;
      this.formValidate.description = row.description;
      this.$refs.formModal.openModal();
    },

    //添加/编辑提交
    handleAddSubmit() {
      let axiosUrl;
      let axiosParam = this.formValidate;
      if (this.action == "add") {
        axiosUrl = this.$api.url.saveUrl;
      } else {
        axiosUrl = this.$api.url.updateUrl;
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
        "您确定要删除域名 <i class='text-danger'> " +
        params.shortChainName +
        " </i>吗?";
      this.$refs.delModal.openModal();
    },

    //删除回调
    handleRemove(item) {
      this.$post(this.$api.url.deleteUrl, {
        id: item.id
      }).then(res => {
        if (res.error == 0) {
          this.$Message.success("删除成功");
          this.remoteTable();
          this.$refs.delModal.colseModal();
        }
      });
    }
  }
};
</script>
