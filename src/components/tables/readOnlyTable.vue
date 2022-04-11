<template>
  <div>
    <!-- table -->
    <Tables
      :columns="columns"
      :deleable="false"
      :detailable="false"
      :editable="false"
      :page="true"
      ref="remote"
      @on-checked="onChecked"
    >
    </Tables>
  </div>
</template>

<script>
import Tables from "@/components/tables/tables.vue";

export default {
  name: "ReadOnlyTable",
  props: {
    tableParma: {
      type: Object,
      default() {
        return {};
      }
    },
    axiosUrl: {
      type: String,
      default: ""
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Tables
  },
  data() {
    return {};
  },
  mounted() {
    this.remoteTable();
  },

  methods: {
    //请求table数据
    remoteTable() {
      this.$refs.remote.remoteTable(this.axiosUrl, this.tableParma);
    },
    onChecked(row) {
      this.$emit("on-checked", row);
    }
  }
};
</script>
