<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
}
li {
  list-style: none;
}
#app {
  .size;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.bg-white {
  background: #ffffff !important;
}
.text-cursor {
  cursor: pointer;
}
.pull-right {
  float: right;
}
.text-center {
  text-align: center;
}
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.text-ellipsis-clamp {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
.align-center {
  text-align: center;
}

i {
  font-style: normal;
}

//搜索
.flowhidden {
  .ivu-card-head {
    padding-bottom: 6px;
  }
  .searchForm {
    overflow: hidden;
    .ivu-form-item {
      margin-bottom: 10px;
    }
    .searchSelect {
      .ivu-form-item-content {
        display: inline-block;
      }
      .ivu-form-item-content {
        width: 155px !important;
      }
    }
    .propLable .ivu-form-item-label {
      background: #f8f8f9;
      border: 1px solid #dcdee2;
      height: 32px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: right;
      padding-left: 7px;
      padding-right: 7px;
      margin-top: 1px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-right: 0;
    }
    .ivu-form-item-content {
      margin-left: 0 !important;
      width: 240px;
    }
    .dateLimits .ivu-form-item-content {
      width: 344px;
    }
    .ivu-checkbox-wrapper {
      padding-top: 10px;
    }
  }
}

// table
.ivu-table-wrapper {
  .ivu-table-cell-ellipsis div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  overflow: visible !important;
  .ellipsisRow .ivu-tooltip,
  .ellipsisRow .ivu-tooltip-rel,
  .ellipsisRow .detailWithoutControl {
    display: block;
  }
  .ellipsisRow .detailWithoutControl {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ivu-tooltip-inner {
    max-width: fit-content;
  }
}

// 时间选择
.hourPicker {
  width: 100%;
  .ivu-select-dropdown {
    .ivu-time-picker-cells-with-seconds {
      min-width: 90px !important;
      > .ivu-time-picker-cells-list:first-child {
        width: 100%;
      }
      > .ivu-time-picker-cells-list:last-child {
        display: none;
      }
      > .ivu-time-picker-cells-list:nth-child(2) {
        display: none;
      }
    }
  }
  .ivu-time-picker-with-range.ivu-time-picker-with-seconds
    .ivu-picker-panel-body {
    min-width: 180px !important;
  }
}

.addModal .hourPicker .ivu-select-dropdown {
  width: 180px !important;
  min-width: 180px !important;
}
// .main-card-content .ivu-card-body {
//   overflow: hidden;
// }
// @media (max-width: 1280px) {
//   .ivu-table-cell {
//     min-width: 120px!important;
//   }
// }
.upContainer {
  .upContainer {
    display: inline-block;
  }
  img {
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    width: 152px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .mulupContainer {
    width: 152px;
    position: relative;
    display: inline-block;
    margin-right: 10px;
  }
  .delMask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0%, 0%, 0.479);
    line-height: 100%;
    text-align: center;
    i {
      cursor: pointer;
      color: #ffffff;
      font-size: 30px;
      margin-top: 60%;
    }
  }
}

.variable {
  border: 1px solid #4d7cfe;
  color: #4d7cfe;
  padding: 0 6px;
  margin: 0 4px;
  border-radius: 4px;
  user-select: none;
  .ivu-icon {
    font-size: 12px;
    vertical-align: middle;
    margin-left: 4px;
  }
}
</style>
