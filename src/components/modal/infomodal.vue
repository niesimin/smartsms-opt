<template>
  <Modal v-model="showModal" class="infoModal" :closable="false">
    <p slot="header">
      <Icon :type="titleIcon ? titleIcon : 'md-list-box'" :style="styles" />
      <span style="font-weight:600">{{ titleText ? titleText : "详情" }}</span>
    </p>
    <Row v-for="(item, key) in infoData" :key="`detail-${key}`">
      <Col :xs="8" :sm="{ span: detailTitleRowWidth }" class="text-right">
        <b>{{ item.title }}:</b>
      </Col>
      <Col
        :xs="{ span: 16 }"
        :sm="{ span: 24 - detailTitleRowWidth, offset: 0 }"
        v-html="item.value"
      ></Col>
    </Row>
    <div slot="footer">
      <Button type="default" @click="colseModal">{{ closeBtn }}</Button>
    </div>
  </Modal>
</template>

<script>
import modalMixin from "./modal-mixin";
import { getFormatTimesTamp, keyFactory } from "@/libs/tools";
import { remoteKeyFactory } from "@/libs/util";
export default {
  name: "InfoModal",
  mixins: [modalMixin],
  props: {
    modalContent: {
      //内容显示
      type: String,
      default: ""
    },
    closeBtn: {
      type: String,
      default: "关闭"
    },
    detailTitleRowWidth: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      infoData: {}
    };
  },

  methods: {
    initDetailModal(row, column) {
      const columntil = column.filter(item => {
        if (item.key && item.title && item.title != "操作") {
          return item;
        }
      });
      // console.log(row, column);
      this.infoData = columntil.map(item => {
        if (item.slot && item.slot == "image") {
          item.value = row[item.key]
            ? "<img src=" + row[item.key] + ' style="width:80px"/>'
            : '<i class="ivu-icon ivu-icon-ios-person" style="font-size:50px"></i>';
        } else if (item.slot && item.slot == "iswitch") {
          if (item.title == "状态") {
            item.value = row[item.key]
              ? "<i class='text-success'>启用</i>"
              : "<i class='text-danger'>停用</i>";
          } else {
            item.value = row[item.key]
              ? "<i class='text-success'>是</i>"
              : "<i class='text-danger'>否</i>";
          }
        } else if (item.keyFactoryCode) {
          if (typeof item.keyFactoryCode == "number") {
            item.value = keyFactory.getValue(
              keyFactory.getConstStore(item.keyFactoryCode, true),
              row[item.key]
            );
          } else {
            item.value = remoteKeyFactory.getValue(
              remoteKeyFactory.getConstStore(item.keyFactoryCode, true),
              row[item.key]
            );
          }
        } else if (item.bolean) {
          item.value = row[item.key]
            ? "<i class='text-success'>" + item.bolean[0] + "</i>"
            : "<i class='text-danger'>" + item.bolean[1] + "</i>";
        } else {
          item.value = row[item.key];
        }

        if (item.array) {
          item.value = row[item.key].join("</br>");
        }

        if (item.timesTamp) {
          item.value = getFormatTimesTamp(row[item.key]);
        }

        if (item.turnSecondPoints) {
          item.value = row[item.key] / 60;
        }
        return item;
      });

      this.openModal();
    }
  }
};
</script>
<style lang="less">
@import "./modal.less";
// infoModal
.infoModal {
  .ivu-modal-header {
    border-bottom: 0 !important;
    padding: 14px 0 0 0;
  }
  .ivu-modal-footer {
    border: 0;
  }
  .ivu-modal-content {
    padding: 20px 40px;
    font-size: 14px;
  }
  .ivu-modal-body {
    .text-right {
      padding-right: 10px;
    }
    .ivu-row {
      line-height: 2.2em;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
