<template>
  <Breadcrumb :style="{ fontSize: `${fontSize}px` }">
    <BreadcrumbItem
      v-for="item in list"
      :to="item.to"
      :key="`bread-crumb-${item.name}`"
    >
      <CommonIcon
        :type="item.icon || ''"
        style="margin-right: 4px;"
      ></CommonIcon>
      {{ showTitle(item) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
import { showTitle } from "@/libs/util";
import CommonIcon from "@/components/common-icon/common-icon.vue";
export default {
  name: "CustomBreadCrumb",
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showTitle(item) {
      return showTitle(item, this);
    }
  }
};
</script>
