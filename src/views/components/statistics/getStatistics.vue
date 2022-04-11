<template>
  <div>
    <Card :bordered="false" class="main-card-content">
      <!-- <Button type="primary" @click="exportExcel">导出为Csv文件</Button> -->

      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form ref="searchForm" :model="tableParma" inline class="searchForm">
          <FormItem class="dateLimits">
            <DateLimits
              :betweenDate="30"
              :timeLimit="timeLimit"
              ref="dateLimits"
              forbbidToday
            ></DateLimits>
          </FormItem>

          <FormItem
            prop="cmpTeddyId"
            label="公众号"
            class="searchSelect propLable"
          >
            <Select
              v-model="tableParma.cmpTeddyId"
              transfer
              @on-change="handleSearchSubmit()"
            >
              <Option
                v-for="item in searCompanyData"
                :value="item.did"
                :key="item.did"
                >{{ item.dv }}
              </Option>
            </Select>
          </FormItem>

          <Button type="primary" @click="handleSearchSubmit()">
            <Icon type="md-search" /> 搜索
          </Button>
        </Form>
      </div>

      <!-- table -->
      <Tables
        :columns="columns"
        :deleable="true"
        :detailable="true"
        :editable="true"
        :page="false"
        :detailTitleRowWidth="7"
        ref="remote"
      >
      </Tables>
    </Card>
  </div>
</template>

<script>
import Tables from "@/components/tables/tables.vue";
import DateLimits from "@/components/datePicker/dateLimits.vue";
import { getFormatDateTamp } from "@/libs/tools";

export default {
  name: "getStatistics",
  components: {
    Tables,
    DateLimits
  },
  data() {
    return {
      timeLimit: {
        endDate:
          new Date(getFormatDateTamp(new Date().getTime())).valueOf() -
          1 * 24 * 60 * 60 * 1000,
        startDate:
          new Date(getFormatDateTamp(new Date().getTime())).valueOf() -
          7 * 24 * 60 * 60 * 1000
      },
      searCompanyData: [],
      tableParma: {
        cmpTeddyId: null,
        page: 1
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
          title: "日期",
          key: "strDate",
          minWidth: 120
        },
        {
          title: "厂商",
          key: "firmName",
          minWidth: 120
        },
        {
          title: "公众号",
          key: "companyName",
          minWidth: 120
        },
        {
          title: "投放名称",
          key: "putName",
          minWidth: 120
        },
        {
          title: "模板名称",
          key: "templateName",
          minWidth: 120
        },
        {
          title: "解析数",
          key: "analysisNumber",
          minWidth: 120
        },
        {
          title: "曝光PV",
          key: "exposePv",
          minWidth: 120
        },
        {
          title: "曝光UV",
          key: "exposeUv",
          minWidth: 120
        },
        {
          title: "点击PV",
          key: "clickPv",
          minWidth: 120
        },
        {
          title: "点击UV",
          key: "clickUv",
          minWidth: 120
        }
      ],
      formValidate: {
        shortChainName: "",
        description: "",
        shortChain: ""
      }
    };
  },
  mounted() {
    this.getCompanyAll();
  },

  methods: {
    //请求table数据
    remoteTable() {
      this.tableParma = Object.assign(this.tableParma, {
        startTime: this.$refs.dateLimits.getTime().startDate.replace(/-/g, ""),
        endTime: this.$refs.dateLimits.getTime().endDate.replace(/-/g, "")
      });
      this.$refs.remote.remoteTable(
        this.$api.statistics.getStatistics,
        this.tableParma
      );
    },

    getCompanyAll() {
      this.$post(this.$api.company.getCompanyAll, {}).then(res => {
        let searCompanyData = [];
        if (res.error == 0 && res.data && res.data.length > 0) {
          this.tableParma.cmpTeddyId = res.data[0].teddyId;
          res.data.filter(item => {
            searCompanyData.push({
              did: item.teddyId,
              dv: item.companyaNme
            });
          });
          this.searCompanyData = searCompanyData;
          this.remoteTable();
          console.log(this.searCompanyData);
        }
      });
    },

    //搜索
    handleSearchSubmit() {
      this.tableParma = Object.assign(this.tableParma, { page: 1 });
      this.remoteTable();
    }
  }
};
</script>
