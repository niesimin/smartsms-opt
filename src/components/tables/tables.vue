<template>
  <!-- class="mainPageTable" ref="mainPageTable" -->
  <div>
    <template>
      <!-- :height="tableHeight" -->
      <Table
        :columns="insideColumns"
        :data="insideTableData"
        ref="tablesMain"
        :loading="showLoading"
        :show-summary="showSummary"
        :summary-method="handleSummary"
      >
        <template slot-scope="{ row, column }" slot="image">
          <Avatar :src="row[column.key]" v-if="row[column.key]" size="large" />
          <Avatar icon="ios-person" v-else size="large" />
        </template>

        <template slot-scope="{ row, column }" slot="iswitch">
          <Ivswitch
            :value="row[column.key] ? true : false"
            :switchDisabled="
              column.switchDisabled || (row.userName && row.userName == 'admin')
                ? true
                : false
            "
            :openText="column.openText ? column.openText : '启用'"
            :closeText="column.closeText ? column.closeText : '停用'"
            :rowData="row"
            :column="column"
            @handleSwitchChange="handleSwitchChange"
          ></Ivswitch>
        </template>

        <template slot-scope="{ row, column }" slot="action">
          <!-- editable 默认true -->
          <Tooltip content="编辑" placement="bottom" v-if="editable">
            <Icon
              custom="iconfont icon-editor"
              @click="openEditModal(row)"
              size="18"
              class="text-primary"
            />
          </Tooltip>

          <!-- deleable 默认true 删除 -->
          <Tooltip content="删除" placement="bottom" v-if="deleable">
            <Icon
              custom="iconfont icon-del"
              @click="openRemoveModal(row)"
              class="text-danger"
            />
          </Tooltip>

          <!-- detailable 默认true 详情 -->
          <Tooltip content="查看详情" placement="bottom">
            <i
              class="text-darkPrimary detailWithoutControl"
              style="padding-right:4px;cursor:pointer"
              v-if="column.key != '操作'"
              @click="openDetailModal(row)"
              >{{ row[column.key] }}</i
            >
            <Icon
              v-if="detailable"
              custom="iconfont icon-detail"
              @click="openDetailModal(row)"
              size="18"
              class="text-darkPrimary"
            />
          </Tooltip>
        </template>

        <template slot-scope="{ row, index }" slot="radio">
          <Radio
            v-model="row.checked"
            @on-change="onChecked({ row, index })"
          ></Radio>
        </template>
      </Table>
      <!-- <Table border :columns="insideColumns" :data="insideColumns"> </Table> -->
    </template>
    <!-- 分页 -->
    <Pagination
      v-if="page"
      :total="recTotal"
      :currentPage="query.page"
      :recPerPage="query.recPerPage"
      @pageChange="handlePageChange"
      @sizeChange="onPageSizeChange"
    ></Pagination>
    <Pagination
      v-if="localPage"
      :total="localRecTotal"
      :currentPage="query.page"
      :recPerPage="query.recPerPage"
      @pageChange="handleLocalPageChange"
      @sizeChange="handleOnPageSizeChange"
    ></Pagination>
    <!-- 详情 -->
    <InfoModal
      ref="detailModal"
      :class="detailClass"
      :detailTitleRowWidth="detailTitleRowWidth"
    ></InfoModal>
  </div>
</template>

<script>
import InfoModal from "@/components/modal/infomodal.vue";

import Ivswitch from "@/components/switch/switch.vue";
import Pagination from "@/components/page/page.vue";
export default {
  components: {
    InfoModal,
    Ivswitch,
    Pagination
  },
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    page: {
      //显示分页
      type: Boolean,
      default: true
    },
    localPage: {
      //显示分页
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    deleable: {
      //是否显示删除按钮
      type: Boolean,
      default: true
    },
    detailable: {
      //是否显示详情
      type: Boolean,
      default: true
    },
    useRemoteSummaryData: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ""
    },
    detailClass: {
      type: String,
      default: ""
    },
    detailTitleRowWidth: {
      type: Number,
      default: 5
    },
    editable: {
      //是否显示编辑
      type: Boolean,
      default: true
    },
    switchTitle: {
      //状态切换
      type: String,
      default: "状态切换"
    },
    switchDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableWidth: "",
      //tableHeight: 500,
      detailColumns: [], //详情
      insideColumns: [], //table 头
      insideTableData: [],
      query: {}, //表格请求参数
      recTotal: 0, //当前总页数
      localRecTotal: 0, //当前总页数
      url: "", //table url，
      showLoading: false,
      checked: ""
    };
  },

  methods: {
    /**
     * @description 调用子组件remoteTable方法请求表格数据
     * @param {*} url 请求接口
     * @param {*} parma 请求参数
     */
    remoteTable(url, parma) {
      this.showLoading = true;
      this.insideTableData = [];
      this.lotalInsideTableData = [];
      this.$post(url, parma)
        .then(res => {
          this.query = parma;
          this.url = url;

          if (this.localPage) {
            this.lotalInsideTableData = res.error == 0 ? res.data : [];

            this.localRecTotal = res.pager.recTotal;
            if (this.lotalInsideTableData.length > 0) {
              this.insideTableData = this.dealLotalInsideTableData(parma);
            }
            if (res.reportCount) {
              this.reportCount = res.reportCount;
            }
          } else {
            this.recTotal = res.pager.recTotal;
            let insideTableData = res.error == 0 ? res.data : [];
            if (this.checked == "radio") {
              insideTableData = insideTableData.filter(item => {
                item.checked = false;
                return item;
              });
            }
            this.insideTableData = insideTableData;
          }

          if (this.showSummary) {
            this.showSummarys = res.data && res.data.length > 0 ? true : false;
          }
          this.showLoading = false;
        })
        .catch(() => {
          this.showLoading = false;
        });
    },

    dealLotalInsideTableData(parma) {
      let stIdx = (parseInt(parma.page) - 1) * parseInt(parma.recPerPage);
      let endIdx = parseInt(parma.page) * parseInt(parma.recPerPage);
      let insideTableData = [];
      insideTableData = this.lotalInsideTableData.slice(stIdx, endIdx);
      let stockConfirmationResultDtos = [];
      stockConfirmationResultDtos = insideTableData.filter((item, index) => {
        let nidx = index + (parma.page - 1) * parma.recPerPage + 1;
        return Object.assign(item, { tindex: nidx });
      });
      return stockConfirmationResultDtos;
    },

    /**
     * @description 页码改变的回调，返回改变后的页码
     * @description 页码改变后要重新请求table
     */
    handlePageChange(obj) {
      let formData = Object.assign(this.query, obj);
      this.remoteTable(this.url, formData);
    },
    handleLocalPageChange(obj) {
      let formData = Object.assign(this.query, obj);
      this.insideTableData = this.dealLotalInsideTableData(formData);
    },
    /**
     * @description 切换每页条数时的回调，返回切换后的每页条数
     * @description 切换每页条数时要重新请求table
     */
    onPageSizeChange(obj) {
      let formData = Object.assign(this.query, obj);
      this.remoteTable(this.url, formData);
    },

    handleOnPageSizeChange(obj) {
      let formData = Object.assign(this.query, obj);
      this.insideTableData = this.dealLotalInsideTableData(formData);
    },

    /**
     * @description 表格表头,剔除隐藏列
     * @parma {*} columns 头部数组
     */
    handleColumns(columns) {
      if (columns[0].slot == "radio") {
        this.checked = "radio";
      } else {
        this.checked = "";
      }
      this.insideColumns = columns.filter(item => {
        if (!item.hidden) {
          return item;
        }
      });
    },

    /**
     * @param {*} row 当前操作的行数据
     * @description 打开编辑模态窗
     */
    openEditModal(row) {
      this.$emit("on-edit", row);
    },

    /**
     * @description 导出
     */
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params);
    },

    /**
     * @param {*} row 当前操作的行数据
     * @description 打开删除模态窗
     */
    openRemoveModal(row) {
      this.$emit("on-delete", row);
    },

    /**
     * @param {*} row 当前操作的行数据
     * @description 打开详情模态窗
     */
    openDetailModal(row) {
      this.$refs.detailModal.initDetailModal(row, this.detailColumns);
    },

    /**
     * @description 切换开关状态
     */
    handleSwitchChange(row) {
      this.$emit("handleSwitchChange", row.rowData, row.column);
    },

    /**
     * @description 统计
     */
    handleSummary({ columns, data }) {
      const sums = {};
      if (data.length == 0) {
        return;
      }
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "统计"
          };
          return;
        }
        if (this.useRemoteSummaryData) {
          let countKey = column.key + "Count";
          if (this.reportCount[countKey] || this.reportCount[countKey] == 0) {
            sums[key] = {
              key,
              value: this.reportCount[countKey]
            };
          } else {
            sums[key] = {
              key,
              value: ""
            };
          }
        } else {
          const values = data.map(item => Number(item[key]));
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v
            };
          } else {
            sums[key] = {
              key,
              value: ""
            };
          }
        }
      });

      return sums;
    },

    /**
     * @description 获取表格数据
     */
    getTableData() {
      return this.insideTableData;
    },

    //单选
    onChecked({ row, index }) {
      this.insideTableData.forEach(items => {
        //items.checked=false      错误，使用$set设置
        this.$set(items, "checked", false); //正确
      });
      this.insideTableData[index].checked = true;
      this.$emit("on-checked", row);
    }
  },

  mounted() {
    this.handleColumns(this.columns);
    this.detailColumns = this.columns;
    // setTimeout(() => {
    //   let height = this.$refs.mainPageTable.offsetHeight - 50;
    //   this.tableHeight = height;
    // }, 1000);
  }
};
</script>
<style lang="less">
.ivu-table-summary td span {
  font-weight: 700;
  color: #ea644a;
  font-size: 16px;
}
.ivu-table-wrapper {
  height: ~"calc(100% - 60px)";
  // overflow: auto;
  // .ivu-table {
  //   overflow: auto;
  // }
}
// .ivu-table td,
// .ivu-table th {
//   height: 38px !important;
// }
.ivu-tag {
  font-size: 14px;
}
.ivu-table td .ivu-icon {
  margin-left: 6px;
}
.ivu-table td .ivu-icon-md-power {
  font-weight: 700;
}
tr.ivu-table-row-hover td {
  background-color: #f8f8f9;
}
.ivu-table td .ivu-icon-ios-person {
  margin: 0;
}
</style>
