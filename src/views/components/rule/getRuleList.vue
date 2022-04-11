<template>
  <div>
    <Alert show-icon>
      提示：投放自审核通过后，30天内有效，之后视为过期，
      过期无法解析富媒体模板；
      <div>
        支持在平台发送短信，为您提供短信发送+富媒体模板解析全流程服务。
      </div>
    </Alert>
    <Card :bordered="false">
      <!-- <Button type="primary" @click="exportExcel">导出为Csv文件</Button> -->

      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form ref="searchForm" :model="tableParma" inline class="searchForm">
          <FormItem prop="putName">
            <Input
              type="text"
              v-model="tableParma.putName"
              placeholder="请输入投放名称"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">投放名称</span>
            </Input>
          </FormItem>

          <FormItem
            prop="putType"
            label="投放类型"
            class="searchSelect propLable"
          >
            <Select
              v-model="tableParma.putType"
              transfer
              @on-change="handleSearchSubmit()"
            >
              <Option
                v-for="item in SearPutTypeType"
                :value="item.did"
                :key="item.did"
                >{{ item.dv }}
              </Option>
            </Select>
          </FormItem>

          <FormItem prop="companyName">
            <Input
              type="text"
              v-model="tableParma.companyName"
              placeholder="请输入公众号"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">公众号名称</span>
            </Input>
          </FormItem>

          <FormItem prop="templateName">
            <Input
              type="text"
              v-model="tableParma.templateName"
              placeholder="请输入模板名称"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">模板名称</span>
            </Input>
          </FormItem>

          <FormItem prop="url">
            <Input
              type="text"
              v-model="tableParma.url"
              placeholder="按URL查询"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">URL</span>
            </Input>
          </FormItem>

          <FormItem
            prop="oppoStatus"
            label="OPPO状态"
            class="searchSelect propLable"
          >
            <Select
              v-model="tableParma.oppoStatus"
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

          <FormItem
            prop="vivoStatus"
            label="VIVO状态"
            class="searchSelect propLable"
          >
            <Select
              v-model="tableParma.vivoStatus"
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

          <FormItem
            prop="xiaomiStatus"
            label="XM状态"
            class="searchSelect propLable"
          >
            <Select
              v-model="tableParma.xiaomiStatus"
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
        :detailable="false"
        :editable="false"
        :page="true"
        :detailTitleRowWidth="7"
        ref="remote"
        @on-delete="openRemoveModal"
        width="auto"
      >
      </Tables>
    </Card>

    <!-- 删除模态窗 -->
    <Alertmodal
      :modalContent="modalContent"
      @handleDelete="handleRemove($event)"
      :currentData="currentData"
      :okBtn="action == 'delect' ? '删除' : '确定'"
      ref="delModal"
    ></Alertmodal>
  </div>
</template>

<script>
import Tables from "@/components/tables/tables.vue";
import { remoteKeyFactory } from "@/libs/util";
import { getFormatTimesTamp, keyFactory } from "@/libs/tools";
import Alertmodal from "@/components/modal/alertmodal.vue";

export default {
  name: "getRuleList",
  components: {
    Tables,
    Alertmodal
  },
  data() {
    return {
      SearPutTypeType: remoteKeyFactory.getConstStore("putType", true),
      SearStatusType: remoteKeyFactory.getConstStore("ruleStatusType", true),

      tableParma: {
        putName: "",
        putType: "null",
        companyName: "",
        templateName: "",
        url: "",
        oppoStatus: "null",
        vivoStatus: "null",
        xiaomiStatus: "null",

        page: 1,
        recPerPage: 15,
        accurate: false
      },

      columns: [
        {
          type: "index",
          width: 60,
          fixed: "left",
          align: "center"
        },
        {
          title: "投放名称",
          width: 160,
          fixed: "left",
          key: "putName",
          render: (h, { row }) => {
            return h(
              "Tooltip",
              {
                props: {
                  content: "查看详情",
                  placement: "bottom"
                }
              },
              [
                h(
                  "i",
                  {
                    class: "text-darkPrimary",
                    style: { cursor: "pointer" },
                    on: {
                      click: () => {
                        this.openAddModal(row.id);
                      }
                    }
                  },
                  row.putName
                )
              ]
            );
          }
        },
        {
          title: "投放类型",
          width: 160,
          key: "putType",
          keyFactoryCode: "putType",
          render: (h, { row }) => {
            return h(
              "div",
              keyFactory.getValue(this.SearPutTypeType, row.putType)
            );
          }
        },
        {
          title: "公众号",
          width: 160,
          key: "companyName"
        },
        {
          title: "模板名称",
          width: 200,
          key: "templateName"
        },
        {
          title: "URL",
          key: "url",
          width: 150
        },
        {
          title: "OPPO状态",
          key: "oppoStatus",
          width: 160,
          keyFactoryCode: "ruleStatusType",
          render: (h, { row }) => {
            let oppoStatus = keyFactory.getValue(
              this.SearStatusType,
              row.oppoStatus
            );
            if (oppoStatus && oppoStatus != "-") {
              return h(
                "Tag",
                {
                  props: {
                    color: keyFactory.getColor(
                      this.SearStatusType,
                      row.oppoStatus
                    )
                  }
                },
                keyFactory.getValue(this.SearStatusType, row.oppoStatus)
              );
            } else {
              return h("div", oppoStatus);
            }
          }
        },
        {
          title: "VIVO状态",
          key: "vivoStatus",
          width: 160,
          keyFactoryCode: "ruleStatusType",
          render: (h, { row }) => {
            let vivoStatus = keyFactory.getValue(
              this.SearStatusType,
              row.vivoStatus
            );
            if (vivoStatus && vivoStatus != "-") {
              return h(
                "Tag",
                {
                  props: {
                    color: keyFactory.getColor(
                      this.SearStatusType,
                      row.vivoStatus
                    )
                  }
                },
                keyFactory.getValue(this.SearStatusType, row.vivoStatus)
              );
            } else {
              return h("div", vivoStatus);
            }
          }
        },
        {
          title: "XM状态",
          width: 160,
          keyFactoryCode: "ruleStatusType",

          render: (h, { row }) => {
            let xiaomiStatus = keyFactory.getValue(
              this.SearStatusType,
              row.xiaomiStatus
            );
            if (xiaomiStatus && xiaomiStatus != "-") {
              return h(
                "Tag",
                {
                  props: {
                    color: keyFactory.getColor(
                      this.SearStatusType,
                      row.xiaomiStatus
                    )
                  }
                },
                keyFactory.getValue(this.SearStatusType, row.xiaomiStatus)
              );
            } else {
              return h("div", xiaomiStatus);
            }
          }
        },
        {
          title: "通道号",
          width: 140,
          key: "channelNum",
          hidden: true
        },

        {
          title: "创建时间",
          key: "createDate",
          width: 170,
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.createDate));
          }
        },
        {
          title: "更新时间",
          key: "updateDate",
          width: 170,
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.updateDate));
          }
        },
        {
          title: "上线时间",
          key: "onlineDate",
          width: 170,
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.onlineDate));
          }
        },
        {
          title: "下线时间",
          key: "offlineDate",
          width: 170,
          timesTamp: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.offlineDate));
          }
        },

        {
          title: "操作",
          key: "操作",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, { row }) => {
            return h("div", [
              row.oppoStatus != 0 &&
              row.vivoStatus != 0 &&
              row.xiaomiStatus != 0
                ? h(
                    "Tooltip",
                    {
                      props: {
                        content: "删除",
                        placement: "bottom"
                      }
                    },
                    [
                      h("Icon", {
                        class: "text-danger",
                        props: {
                          custom: "iconfont icon-del"
                        },
                        style: {
                          cursor: "pointer"
                        },
                        on: {
                          click: () => {
                            this.openRemoveModal(row);
                          }
                        }
                      })
                    ]
                  )
                : "",

              row.oppoStatus == 3 ||
              row.vivoStatus == 3 ||
              row.xiaomiStatus == 3
                ? h(
                    "Tooltip",
                    {
                      props: {
                        content: "下线",
                        placement: "bottom"
                      },
                      style: {
                        cursor: "pointer"
                      }
                    },
                    [
                      h("Icon", {
                        class: "text-darkPrimary",
                        props: {
                          size: "20",
                          type: "md-arrow-round-down"
                        },
                        on: {
                          click: () => {
                            this.updateAuditStatusRule(row, 4);
                          }
                        }
                      })
                    ]
                  )
                : "",

              row.oppoStatus == 4 ||
              row.vivoStatus == 4 ||
              row.xiaomiStatus == 4
                ? h(
                    "Tooltip",
                    {
                      props: {
                        content: "上线",
                        placement: "bottom"
                      },
                      style: {
                        cursor: "pointer"
                      }
                    },
                    [
                      h("Icon", {
                        class: "text-darkPrimary",
                        props: {
                          size: "20",
                          type: "md-arrow-round-up"
                        },
                        on: {
                          click: () => {
                            this.updateAuditStatusRule(row, 3);
                          }
                        }
                      })
                    ]
                  )
                : ""
            ]);
          }
        }
      ],
      formValidate: {
        putName: "",
        description: "",
        shortChain: ""
      },
      ruleValidate: {
        putName: [
          {
            required: true,
            max: 20,
            message: "名称不能为空"
          }
        ],
        shortChain: [
          {
            required: true,
            type: "url",
            message: "域名链接不能为空"
          }
        ]
      },
      currentData: {},
      action: "add",
      modalContent: "",
      auditStatus: null
    };
  },
  mounted() {
    this.remoteTable();
  },

  methods: {
    //请求table数据
    remoteTable() {
      this.$refs.remote.remoteTable(
        this.$api.rule.getRuleList,
        this.tableParma
      );
    },

    //搜索
    handleSearchSubmit() {
      this.tableParma = Object.assign(this.tableParma, { page: 1 });
      this.remoteTable();
    },

    //初始化添加
    openAddModal(id) {
      this.action = id ? "detail" : "add";
      const route = {
        name: "editRule",
        query: { action: this.action, id: id }
      };
      this.$router.push(route);
    },

    //上线下线规则
    updateAuditStatusRule(params, type) {
      this.action = "uplevel";
      this.auditStatus = type;
      this.currentData = params;
      this.modalContent =
        type == 3
          ? "提交上线后，运营人员会配置上线物料，存在时间延迟，是否确认上线？"
          : "提交下线后，运营人员会配置下线物料，存在时间延迟，是否确认下线？";
      this.$refs.delModal.openModal();
    },

    //初始化删除
    openRemoveModal(params) {
      this.action = "delect";
      this.currentData = params;
      this.modalContent =
        "您确定要删除 <i class='text-danger'> " + params.putName + " </i>吗?";
      this.$refs.delModal.openModal();
    },

    //删除回调
    handleRemove(item) {
      let url = "";
      let params = { id: item.id };
      if (this.action == "delect") {
        url = this.$api.rule.deleteRule;
      } else {
        url = this.$api.rule.updateAuditStatusRule;
        params.auditStatus = this.auditStatus;
      }
      this.$post(url, params).then(res => {
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
<style lang="less"></style>
