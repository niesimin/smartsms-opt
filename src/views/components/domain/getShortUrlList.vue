<template>
  <div>
    <Card :bordered="false" class="main-card-content">
      <!-- <Button type="primary" @click="exportExcel">导出为Csv文件</Button> -->

      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form ref="searchForm" :model="tableParma" inline class="searchForm">
          <FormItem prop="shortUrlName">
            <Input
              type="text"
              v-model="tableParma.shortUrlName"
              placeholder="请输入短链名称"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">短链名称</span>
            </Input>
          </FormItem>

          <FormItem prop="shortUrl">
            <Input
              type="text"
              v-model="tableParma.shortUrl"
              placeholder="请输入短链"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">短链</span>
            </Input>
          </FormItem>

          <FormItem prop="landingUrl">
            <Input
              type="text"
              v-model="tableParma.landingUrl"
              placeholder="请输入原链"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">原链</span>
            </Input>
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
            <Icon type="md-add" /> 创建短链
          </Button>
        </Form>
      </div>

      <!-- table -->
      <Tables
        :columns="columns"
        :deleable="true"
        :detailable="true"
        :editable="false"
        :page="true"
        :detailTitleRowWidth="7"
        ref="remote"
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
        <Alert show-icon style="width:85%;margin:0 auto 20px">
          提示：支持将长链接一键生成短链,短链具备数据统计功能；
          <div>
            新建短链默认有效时长365天。
          </div>
        </Alert>
        <FormItem label="短链名称" prop="shortUrlName">
          <Input
            v-model="formValidate.shortUrlName"
            placeholder="请输入短链名称,用于区分域名，限制20字"
            maxlength="20"
            show-word-limit
          ></Input>
        </FormItem>

        <FormItem label="原链" prop="landingUrl">
          <Input
            v-model="formValidate.landingUrl"
            placeholder="请输入http://或https://开头的原链接网址"
            maxlength="500"
            show-word-limit
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
    </FormModal>

    <Alertmodal
      titleIcon="md-list-box"
      titleText="已关联模板"
      :width="1000"
      okBtn="关闭"
      @handleDelete="closeAssociatedModal($event)"
      @onvisiblechange="onvisiblechange"
      ref="associatedModal"
      ><ReadOnlyTable
        v-if="showAassociatedModale"
        :tableParma="associatedParam"
        :axiosUrl="$api.url.getUrlTemplate"
        :columns="associatedColumns"
      ></ReadOnlyTable
    ></Alertmodal>

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
import ReadOnlyTable from "@/components/tables/readOnlyTable.vue";
import { remoteKeyFactory } from "@/libs/util";
import { getFormatTimesTamp, keyFactory } from "@/libs/tools";
import FormModal from "@/components/modal/formModal.vue";
import Alertmodal from "@/components/modal/alertmodal.vue";

export default {
  name: "getShortUrlList",
  components: {
    Tables,
    FormModal,
    Alertmodal,
    ReadOnlyTable
  },
  data() {
    return {
      SearStatusType: remoteKeyFactory.getConstStore("companyStatusType", true),
      connectTemplateType: keyFactory.getConstStore(15),
      tableParma: {
        landingUrl: "",
        shortUrlName: "",
        shortUrl: "",
        page: 1,
        recPerPage: 15,
        accurate: false
      },

      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "短链Id",
          key: "id",
          minWidth: 80
        },
        {
          title: "短链名称",
          key: "shortUrlName",
          minWidth: 170
        },
        {
          title: "短链",
          key: "shortUrl",
          minWidth: 160,
          render: (h, { row }) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.checkLandingUrl(row.landingUrl);
                    }
                  }
                },

                [h("i", row.shortUrl)]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    content: "点击复制短链"
                  }
                },
                [
                  h("Icon", {
                    style: {
                      verticalAlign: "middle",
                      cursor: "pointer",
                      color: "#888"
                    },
                    props: {
                      type: "md-copy",
                      size: 20
                    },
                    on: {
                      click: () => {
                        this.copyShortUrl(row.shortUrl);
                      }
                    }
                  })
                ]
              )
            ]);
          }
        },
        {
          title: "剩余时长",
          key: "remainTime",
          width: 130,
          render: (h, { row }) => {
            return h("div", [h("div", row.remainTime + "天")]);
          }
        },
        {
          title: "原链",
          key: "landingUrl",
          minWidth: 100,
          render: (h, { row }) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    content: row.landingUrl,
                    placement: "bottom"
                  }
                },
                [
                  h(
                    "a",
                    {
                      style: {
                        cursor: "pointer"
                      },
                      on: {
                        click: () => {
                          this.checkLandingUrl(row.landingUrl);
                        }
                      }
                    },
                    "查看"
                  )
                ]
              )
            ]);
          }
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
          title: "是否关联模版",
          key: "associatedTemplate",
          className: "overInherit",
          keyFactoryCode: 15,
          render: (h, { row }) => {
            return h(
              "div",
              {
                style: {
                  cursor: row.associatedTemplate ? "pointer" : "auto",
                  position: "relative"
                }
              },
              [
                h(
                  "Tag",
                  {
                    props: {
                      color: keyFactory.getColor(
                        this.connectTemplateType,
                        row.associatedTemplate
                      )
                    }
                  },
                  keyFactory.getValue(
                    this.connectTemplateType,
                    row.associatedTemplate
                  )
                ),
                h("span", {
                  style: {
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "0",
                    bottom: "0"
                  },
                  on: {
                    click: () => {
                      this.getAssociatedTemplate(
                        row.shortUrl,
                        row.associatedTemplate
                      );
                    }
                  }
                })
              ]
            );
          },
          minWidth: 120
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
        shortUrlName: "",
        landingUrl: ""
      },
      ruleValidate: {
        shortUrlName: [
          {
            required: true,
            max: 20,
            message: "域名名称不能为空"
          }
        ],
        landingUrl: [
          {
            required: true,
            type: "url",
            message: "请填写原链"
          }
        ]
      },
      currentData: {},
      action: "add",
      modalContent: "",
      associatedParam: { page: 1, recPerPage: 8 },
      associatedColumns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "服务",
          key: "service"
        },
        {
          title: "模板名称",
          key: "templateName"
        },

        {
          title: "模板Id",
          key: "templateId"
        }
      ],
      showAassociatedModale: false
    };
  },
  mounted() {
    this.remoteTable();
  },

  methods: {
    //请求table数据
    remoteTable() {
      this.$refs.remote.remoteTable(
        this.$api.url.getShortUrlList,
        this.tableParma
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

    //添加
    handleAddSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$post(this.$api.url.saveShortUrl, this.formValidate).then(
            res => {
              if (res.error == 0) {
                this.$Message.success("操作成功!");
                this.remoteTable();
                this.$refs.formModal.colseModal();
              }
            }
          );
        } else {
          this.$Message.error("输入有误,请检查!");
        }
      });
    },

    //初始化删除
    openRemoveModal(params) {
      this.currentData = params;
      this.modalContent =
        "您确定要删除短链 <i class='text-danger'> " +
        params.shortUrlName +
        " </i>吗?";
      this.$refs.delModal.openModal();
    },

    //删除回调
    handleRemove(item) {
      this.$post(this.$api.url.deleteShortUrl, {
        id: item.id
      }).then(res => {
        if (res.error == 0) {
          this.$Message.success("删除成功");
          this.remoteTable();
          this.$refs.delModal.colseModal();
        }
      });
    },

    checkLandingUrl(url) {
      window.open(url, "_blank");
    },

    //复制短链
    copyShortUrl(url) {
      // 模拟 输入框
      var cInput = document.createElement("input");
      cInput.value = url;
      document.body.appendChild(cInput);
      cInput.select(); // 选取文本框内容

      // 执行浏览器复制命令
      // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
      // Input要在正常的编辑状态下原生复制方法才会生效

      document.execCommand("copy");
      this.$Message.success("复制成功!");
      // 复制成功后再将构造的标签 移除
      document.body.removeChild(cInput);
    },

    //获取关联模板
    getAssociatedTemplate(shortUrl, associatedTemplate) {
      if (associatedTemplate) {
        this.associatedParam = Object.assign(this.associatedParam, {
          shortUrl: shortUrl
        });

        this.$refs.associatedModal.openModal();
      }
    },

    //关闭关联模板弹窗
    closeAssociatedModal() {
      this.$refs.associatedModal.colseModal();
    },
    //监听模板弹窗显示隐藏
    onvisiblechange(event) {
      this.showAassociatedModale = event;
    }
  }
};
</script>
<style scoped></style>
