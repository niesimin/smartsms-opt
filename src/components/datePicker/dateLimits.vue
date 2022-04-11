<template>
  <Row>
    <Col span="5" class="dateLabel">起始时间</Col>
    <Col span="9">
      <DatePicker
        :editable="false"
        :clearable="false"
        transfer
        type="date"
        placeholder="请选择开始时间"
        v-model="dateParma.startDate"
        :options="startTimeOptions"
        @on-change="startTimeChange"
      ></DatePicker>
    </Col>
    <Col span="1" style="text-align: center">-</Col>
    <Col span="9">
      <DatePicker
        :editable="false"
        :clearable="false"
        transfer
        type="date"
        placeholder="请选择结束时间"
        v-model="dateParma.endDate"
        :options="endTimeOptions"
        @on-change="endTimeChange"
      ></DatePicker>
    </Col>
  </Row>
</template>

<script>
import { getFormatDateTamp } from "@/libs/tools";
export default {
  name: "DateLimits",
  props: {
    startDate: {
      type: String,
      default: "startDate"
    },
    forbbidToday: {
      type: Boolean,
      default: false
    },
    endDate: {
      type: String,
      default: "endDate"
    },
    betweenDate: {
      type: Number,
      default: 7
    },
    timeLimit: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      startTimeOptions: {
        // disabledDate(date) {
        //   return date && date.valueOf() > Date.now();
        // }
      },
      // endTimeOptions: {
      //   disabledDate(date) {
      //     let last = Date.now() - 1 * 24 * 60 * 60 * 1000;
      //     return date && (date.valueOf() > Date.now() || date.valueOf() < last);
      //   }
      // },
      endTimeOptions: {},
      dateParma: {}
    };
  },
  mounted() {
    this.dateParma = {
      [this.startDate]: this.timeLimit[this.startDate]
        ? this.timeLimit[this.startDate]
        : getFormatDateTamp(new Date().getTime()),
      [this.endDate]: this.timeLimit[this.endDate]
        ? this.timeLimit[this.endDate]
        : getFormatDateTamp(new Date().getTime())
    };
    let that = this;

    this.endTimeOptions = {
      disabledDate(date) {
        let star = that.timeLimit[that.startDate]
          ? that.timeLimit[that.startDate] - 1 * 24 * 60 * 60 * 1000
          : Date.now() - 1 * 24 * 60 * 60 * 1000;
        let end = that.timeLimit[that.endDate];
        return date && (date.valueOf() > end || date.valueOf() < star);
      }
    };

    this.startTimeOptions = {
      disabledDate(date) {
        return date && date.valueOf() > that.timeLimit[that.endDate];
      }
    };
  },
  watch: {
    dateParma() {
      this.getTime();
    }
  },
  methods: {
    startTimeChange: function(e) {
      //选择开始时间后设置结束时间
      this.dateParma[this.startDate] = e;

      //开始时间7天后的时间
      let bd = this.betweenDate - 1;
      let endTime = "";
      if (this.dateParma[this.startDate]) {
        if (
          new Date(this.dateParma[this.startDate]).valueOf() +
            bd * 24 * 60 * 60 * 1000 >
          this.timeLimit[this.endDate]
        ) {
          endTime = this.timeLimit[this.endDate];
        } else {
          endTime =
            new Date(this.dateParma[this.startDate]).valueOf() +
            bd * 24 * 60 * 60 * 1000;
        }
      }
      // let endTime = this.dateParma[this.startDate]
      //   ? new Date(this.dateParma[this.startDate]).valueOf() +
      //     bd * 24 * 60 * 60 * 1000
      //   : "";
      //如果7天后的时间大于当天 结束时间为当天 否则结束时间为7天后时间
      endTime = new Date().valueOf() < endTime ? new Date().valueOf() : endTime;
      this.dateParma[this.endDate] = getFormatDateTamp(endTime);

      this.endTimeOptions = {
        disabledDate: date => {
          //开始时间
          let startTime = this.dateParma[this.startDate]
            ? new Date(this.dateParma[this.startDate]).valueOf() -
              1 * 24 * 60 * 60 * 1000
            : "";

          //结束时间小于开始时间 或者 大于endTime的部分禁止选择
          return (
            date && (date.valueOf() <= startTime || date.valueOf() >= endTime)
          );
        }
      };
    },

    endTimeChange: function(e) {
      this.dateParma[this.endDate] = e;
    },

    getTime: function() {
      let startDate = new Date(this.dateParma[this.startDate]);
      let endDate = new Date(this.dateParma[this.endDate]);
      // this.dateParma[this.startDate] =
      //   startDate.getFullYear() +
      //   "-" +
      //   (startDate.getMonth() + 1) +
      //   "-" +
      //   startDate.getDate();
      // let endDate = new Date(this.dateParma[this.endDate]);
      // this.dateParma[this.endDate] =
      //   endDate.getFullYear() +
      //   "-" +
      //   (endDate.getMonth() + 1) +
      //   "-" +
      //   endDate.getDate();
      this.dateParma[this.startDate] = getFormatDateTamp(startDate);
      this.dateParma[this.endDate] = getFormatDateTamp(endDate);
      return this.dateParma;
    }
  }
};
</script>
<style lang="less">
.dateLimits {
  .dateLabel {
    background: #f8f8f9;
    border: 1px solid #dcdee2;
    height: 32px;
    box-sizing: border-box;
    text-align: right;
    padding-right: 1%;
    margin-top: 1px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .ivu-col.ivu-col-span-9 .ivu-date-picker {
    margin-left: -1px;
    .ivu-input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
