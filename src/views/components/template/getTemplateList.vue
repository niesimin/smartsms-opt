<template>
  <div>
    <Alert show-icon>
      目前各厂商模板支持情况：
      <div>
        单图文（OPPO、VIVO、小米支持）、多图文（OPPO、小米支持）、视频（OPPO支持）、橱窗（OPPO支持）、轮播图（OPPO支持）、通知（小米支持）、应用下载（VIVO支持）、优惠券（VIVO支持）。
      </div>
    </Alert>
    <Card :bordered="false" class="bg-Transparent" dis-hover>
      <!-- <Button type="primary" @click="exportExcel">导出为Csv文件</Button> -->

      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form ref="searchForm" :model="tableParma" inline class="searchForm">
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
            <Icon type="md-add" /> 新建模板
          </Button>
        </Form>
      </div>

      <div class="cardTable">
        <template>
          <Tabs
            :animated="false"
            @on-click="handleContextMenu"
            :value="'tb-' + tableParma.templateType"
          >
            <TabPane
              v-for="item in SearTemplateType"
              :key="item.did + item.dv"
              :label="item.dv"
              :name="'tb-' + item.did"
            >
              <Spin size="large" v-if="showLoading"></Spin>
              <TabPaneList
                v-if="tableParma.templateType == item.did"
                :panelData="cardData"
                :templateType="item.did"
                @delTemplate="openRemoveModal"
              >
              </TabPaneList
            ></TabPane>
          </Tabs>
        </template>
      </div>
    </Card>
    <!-- 分页 -->
    <Pagination
      :total="recTotal"
      :currentPage="tableParma.page"
      :recPerPage="tableParma.recPerPage"
      @pageChange="handlePageChange"
      @sizeChange="onPageSizeChange"
    ></Pagination>

    <!-- 删除模态窗 -->
    <Alertmodal
      :modalContent="delModalContent"
      @handleDelete="handleRemove($event)"
      ref="delModal"
    ></Alertmodal>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { remoteKeyFactory } from "@/libs/util";
import { getFormatTimesTamp } from "@/libs/tools";
import TabPaneList from "./tabPaneList.vue";
import Pagination from "@/components/page/page.vue";
import Alertmodal from "@/components/modal/alertmodal.vue";

export default {
  name: "getTemplateList",
  components: {
    TabPaneList,
    Pagination,
    Alertmodal
  },
  data() {
    return {
      SearTemplateType: remoteKeyFactory.getConstStore("templateType"),
      SearStatusType: remoteKeyFactory.getConstStore(
        "templateStatusType",
        true
      ),
      getFormatTimesTamp,
      showLoading: false,
      tableParma: {
        templateType: 1,
        companyName: "",
        templateName: "",
        oppoStatus: "null",
        vivoStatus: "null",
        xiaomiStatus: "null",
        page: 1,
        recPerPage: 8,
        accurate: false
      },
      recTotal: 0,
      cardData: [],

      delId: {},
      delModalContent: ""
    };
  },
  mounted() {
    this.showLoading = true;
    if (this.$store.state.app.templateType) {
      this.tableParma.templateType = parseInt(
        this.$store.state.app.templateType
      );
    } else {
      this.tableParma.templateType = 1;
      this.setTemplateType(this.tableParma.templateType);
    }

    this.remoteTable();
  },

  methods: {
    ...mapMutations({
      setTemplateType: "app/setTemplateType"
    }),
    handleContextMenu(data) {
      this.tableParma.templateType = Number(data.split("-")[1]);
      this.tableParma.page = 1;
      this.setTemplateType(this.tableParma.templateType);
      this.remoteTable();
    },
    //请求table数据
    remoteTable() {
      let that = this;
      that
        .$post(this.$api.template.getTemplateList, this.tableParma)
        .then(res => {
          if (res.error == 0) {
            that.cardData = res.data;
            that.recTotal = res.pager.recTotal;
          }
          that.showLoading = false;
        })
        .catch(() => {
          that.showLoading = false;
        });
    },

    /**
     * @description 页码改变的回调，返回改变后的页码
     * @description 页码改变后要重新请求table
     */
    handlePageChange(obj) {
      this.tableParma = Object.assign(this.tableParma, obj);
      this.remoteTable();
    },

    /**
     * @description 切换每页条数时的回调，返回切换后的每页条数
     * @description 切换每页条数时要重新请求table
     */
    onPageSizeChange(obj) {
      this.tableParma == Object.assign(this.tableParma, obj);
      this.remoteTable();
    },

    //搜索
    handleSearchSubmit() {
      this.tableParma = Object.assign(this.tableParma, { page: 1 });
      this.remoteTable();
    },

    //初始化添加
    openAddModal() {
      const route = {
        name: "createTemplate",
        query: {
          templateType: this.tableParma.templateType
        }
      };
      this.$router.push(route);
    },

    //初始化删除
    openRemoveModal({ id, templateName }) {
      this.delId = id;
      this.delModalContent =
        "您确定要删除模板 <i class='text-danger'> " + templateName + " </i>?";
      this.$refs.delModal.openModal();
    },

    //删除回调
    handleRemove() {
      this.$post(this.$api.template.deleteTemplate, {
        id: this.delId
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
<style lang="less">
.bg-Transparent {
  background: transparent !important;
  .ivu-card-head,
  .ivu-tabs-nav-scroll {
    background: #ffffff !important;
  }
  .ivu-card-body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
}

.cardTable {
  .ivu-tag {
    padding: 0;
  }
  .ivu-spin-dot {
    margin: auto;
  }
  .text-ellipsis {
    font-weight: 600;
  }
  .text-ellipsis-clamp {
    height: 42px;
  }
  .ivu-card {
    margin-right: 10px;

    margin-bottom: 20px;
    width: 380px;
    display: inline-block;
    .ivu-card-body {
      padding-left: 16px;
      padding-right: 16px;
      padding-top: 16px;
      color: #3b4859;
    }

    .vvu-card-body {
      background: #f5f5f5;
      margin-top: 10px;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      video {
        vertical-align: middle;
      }
      img {
        width: 100%;
      }
      .vvu-card-body-text {
        padding: 10px 10px 0 10px;
      }
    }
    .coupon-card-body {
      border: 1px solid #e5e5e5;
      background: #fdfdfd;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);

      p {
        padding: 10px 12px 0 12px;
      }
    }

    .vvu-card-foot {
      border-top: 1px solid #e8eaec;
      margin-top: 10px;
      padding-top: 16px;
      text-align: center;
      vertical-align: middle;
      display: -webkit-flex; /*在webkit内核的浏览器上使用要加前缀*/
      display: flex; //将对象作为弹性伸缩盒显示
      justify-content: space-around;
      cursor: pointer;
    }
    .ivu-list-item {
      padding: 12px;
      .ivu-avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }
      .ivu-list-item-meta-title,
      .ivu-list-item-meta-description {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        line-height: 40px;
        margin-bottom: 0;
      }
      .ivu-list-item-meta-description {
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
        // overflow: hidden;
        // word-break: break-all;
        line-height: 20px;
        // height: 42px;
      }
      .ivu-list-item-meta {
        width: 70%;
      }
      .ivu-list-item-meta-avatar {
        margin-right: 6px;
      }
      .ivu-list-item-meta-content {
        width: 86%;
      }
      .ivu-btn-ghost.ivu-btn-primary {
        height: 26px;
        line-height: 26px;
      }
    }
    .line {
      margin-top: 12px;
      position: relative;
      .line-left,
      .line-right {
        position: absolute;
        width: 30px;
        height: 30px;
        background: #f3f3f3;
        border-radius: 30px;
        top: -15px;
      }
      .line-left {
        left: -20px;
      }
      .line-right {
        right: -20px;
      }
      .line-center {
        border-bottom: 3px dashed #f3f3f3;
      }
    }

    .ivu-tag {
      border: 0 none;
      background: 0 none;
    }
  }
  .weather {
    height: 80px;
    margin-top: 10px;
    margin-bottom: 10px;
    overflow: auto;
    div {
      padding: 4px 0;
    }
  }
  .buttonList {
    text-align: center;
    margin-bottom: 10px;
    .ivu-btn {
      width: 70%;
      font-weight: 600;
    }
  }
  .swiperText {
    padding: 10px;
    background: #f5f5f5;
  }
}
</style>
