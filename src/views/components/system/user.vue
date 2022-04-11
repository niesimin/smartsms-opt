<template>
  <div>
    <Card :bordered="false" class="wrapCard">
      <!-- <Button type="primary" @click="exportExcel">导出为Csv文件</Button> -->

      <!-- searchForm -->
      <div slot="title" class="flowhidden">
        <Form ref="searchForm" :model="searchForm" inline class="searchForm">
          <FormItem prop="appletName">
            <Input
              type="text"
              v-model="searchForm.userName"
              placeholder="请输入管理员名称"
              @on-enter="handleSearchSubmit()"
            >
              <span slot="prepend">名称</span>
            </Input>
          </FormItem>

          <Button type="primary" @click="handleSearchSubmit()">
            <Icon type="md-search" /> 搜索
          </Button>

          <div class="pull-right">
            <Button type="primary" @click="openAddModal()">
              <Icon type="md-add" /> 添加
            </Button>
          </div>
        </Form>
      </div>

      <!-- table -->
      <Tables
        :columns="columns"
        :deleable="false"
        :detailable="false"
        :editable="false"
        :page="true"
        ref="remote"
        @handleSwitchChange="switchChange"
      >
      </Tables>
    </Card>

    <!-- 删除模态窗 -->
    <Alertmodal
      :modalContent="modalContent"
      @handleDelete="handleRemove($event)"
      :currentData="currentData"
      ref="delModal"
    ></Alertmodal>

    <!-- 新增模态窗 -->
    <FormModal
      ref="formModal"
      @handleSubmit="handleAddSubmit"
      :action="action"
      :formTitleText="getFormTitleText"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="管理员名称" prop="userName" v-if="action != 'pwd'">
          <Input
            v-model="formValidate.userName"
            placeholder="请输入管理员名称"
          ></Input>
        </FormItem>

        <FormItem label="原密码" prop="oldPasswd" v-if="action == 'pwd'">
          <Input
            type="password"
            v-model="formValidate.oldPasswd"
            placeholder="请输入管理员密码"
          ></Input>
        </FormItem>

        <FormItem
          :label="action == 'add' ? '管理员密码' : '新密码'"
          prop="userPasswd"
          v-if="action != 'edit'"
        >
          <Input
            type="password"
            v-model="formValidate.userPasswd"
            placeholder="请输入管理员密码"
          ></Input>
        </FormItem>

        <FormItem
          label="重复新密码"
          prop="repeatPassword"
          v-if="action == 'pwd'"
        >
          <Input
            type="password"
            v-model="formValidate.repeatPassword"
            placeholder="请再次输入新密码"
          ></Input>
        </FormItem>

        <FormItem label="手机号码" prop="mobile" v-if="action != 'pwd'">
          <Input
            v-model="formValidate.mobile"
            placeholder="请输入手机号码"
          ></Input>
        </FormItem>

        <FormItem label="管理员类型" prop="adminType" v-if="action != 'pwd'">
          <Select v-model="formValidate.adminType">
            <Option
              v-for="item in SearchAdminType"
              :key="item.did + 'adminType'"
              :value="item.did"
              >{{ item.dv }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </FormModal>

    <Drawer
      width="320"
      :title="drawerTitle"
      v-model="openDraw"
      :mask-closable="true"
      :styles="styles"
    >
      <Tree :data="permissionData" show-checkbox> </Tree>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="openDraw = false"
          >取消</Button
        >
        <Button type="primary" @click="submitPowerData">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import Tables from "@/components/tables/tables.vue";
import Alertmodal from "@/components/modal/alertmodal.vue";
import FormModal from "@/components/modal/formModal.vue";
import { getFormatTimesTamp, validates } from "@/libs/tools";
import { remoteKeyFactory } from "@/libs/util";
export default {
  name: "adminLists",
  components: {
    Tables,
    Alertmodal,
    FormModal
  },
  data() {
    return {
      openDraw: false,
      drawerTitle: "",
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px!important",
        paddingLeft: "20px!important",
        position: "static"
      },
      searchForm: {
        userName: ""
      },

      SearchAdminType: remoteKeyFactory.getConstStore("adminType"),

      columns: [
        {
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "管理员名称",
          key: "userName",
          minWidth: 160
          // ellipsis: true,
          // tooltip: true
        },
        {
          title: "密码明文",
          minWidth: 200,
          key: "userPasswd",
          render: (h, { row }) => {
            if (row.id != 1) {
              return h("div", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "重置密码",
                      placement: "bottom"
                    }
                  },
                  [
                    h("Icon", {
                      class: "text-darkPrimary",
                      props: {
                        type: "md-alert",
                        size: 20
                      },
                      style: {
                        paddingRight: "4px",
                        verticalAlign: "middle"
                      },
                      on: {
                        click: () => {
                          this.openEditModal(row, 1);
                        }
                      }
                    }),
                    h(
                      "i",
                      {
                        style: {
                          cursor: "pointer"
                        },
                        on: {
                          click: () => {
                            this.openEditModal(row, 1);
                          }
                        }
                      },
                      row.userPasswd
                    )
                  ]
                )
              ]);
            } else {
              return h(
                "div",
                {
                  style: {
                    paddingLeft: "30px"
                  }
                },
                row.userPasswd
              );
            }
          }
        },
        {
          title: "手机号",
          key: "mobile",
          minWidth: 160
        },
        {
          title: "管理类型",
          key: "adminType",
          minWidth: 160,
          render: (h, { row }) => {
            return h(
              "div",
              remoteKeyFactory.getValue(this.SearchAdminType, row.adminType)
            );
          }
        },

        {
          title: "创建时间",
          key: "createDate",
          minWidth: 210,
          ellipsis: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.createDate));
          }
        },
        {
          title: "最后登录时间",
          key: "lastLoginDate",
          minWidth: 210,
          ellipsis: true,
          render: (h, { row }) => {
            return h("div", getFormatTimesTamp(row.createDate));
          }
        },
        {
          title: "状态",
          key: "enabled",
          slot: "iswitch",
          minWidth: 100
        },
        {
          title: "操作",
          key: "操作",
          minWidth: 150,
          align: "center",
          render: (h, { row }) => {
            if (row.id != 1) {
              return h("div", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "编辑",
                      placement: "bottom"
                    }
                  },
                  [
                    h("Icon", {
                      class: "text-primary",
                      props: {
                        custom: " iconfont icon-editor"
                      },
                      on: {
                        click: () => {
                          this.openEditModal(row);
                        }
                      }
                    })
                  ]
                ),
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "权限设置",
                      placement: "top"
                    }
                  },
                  [
                    h("Icon", {
                      class: "text-darkPrimary",
                      props: {
                        type: "md-warning",
                        size: "18"
                      },
                      on: {
                        click: () => {
                          this.openPowerModal(row);
                        }
                      }
                    })
                  ]
                ),
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "删除",
                      placement: "top"
                    }
                  },
                  [
                    h("Icon", {
                      class: "text-danger",
                      props: {
                        custom: "iconfont icon-del"
                      },
                      on: {
                        click: () => {
                          this.openRemoveModal(row);
                        }
                      }
                    })
                  ]
                )
              ]);
            }
          }
        }
      ],
      tableParma: {
        userName: "",
        page: 1,
        recPerPage: 15
      },
      modalContent: "",
      currentData: {}, //当前操作的数据,
      formValidate: {
        userName: "",
        adminType: "",
        mobile: "",
        userPasswd: "",
        oldPasswd: "",
        repeatPassword: ""
      },
      ruleValidate: {
        userName: [
          {
            required: true,
            message: "名称不能为空"
          }
        ],
        adminType: [
          {
            required: true,
            message: "请选择管理员类型"
          }
        ],
        mobile: [
          {
            required: true,
            validator: validates.isphones
          }
        ],
        oldPasswd: [
          {
            min: 6,
            max: 18,
            required: true,
            message: "6-18位字母或数字开头，允许字母数字下划线"
          }
        ],
        userPasswd: [
          {
            min: 6,
            max: 18,
            required: true,
            message: "6-18位字母或数字开头，允许字母数字下划线"
          }
        ],
        repeatPassword: [
          {
            min: 6,
            max: 18,
            required: true,
            message: "6-18位字母或数字开头，允许字母数字下划线"
          }
        ]
      },
      action: "add",
      hiddenId: "",
      permissionData: []
    };
  },
  computed: {
    getFormTitleText() {
      return this.action == "pwd"
        ? "修改密码"
        : this.action == "add"
        ? "添加管理员"
        : "编辑管理员";
    }
  },
  mounted() {
    this.remoteTable();
  },
  methods: {
    //请求table数据
    remoteTable() {
      this.$refs.remote.remoteTable(
        this.$api.system.adminLists,
        this.tableParma
      );
    },

    //搜索
    handleSearchSubmit() {
      this.tableParma = Object.assign(this.tableParma, this.searchForm, {
        page: 1
      });
      this.remoteTable();
    },

    //初始化添加
    openAddModal() {
      this.action = "add";
      this.$refs.formValidate.resetFields();
      this.formValidate.userName = "";
      this.formValidate.userPasswd = "";

      this.formValidate.adminType =
        this.SearchAdminType.length > 0 ? this.SearchAdminType[0].did : null;

      this.$refs.formModal.openModal();
    },

    //初始化编辑
    openEditModal(row, idx) {
      this.$refs.formValidate.resetFields();
      this.action = idx == 1 ? "pwd" : "edit";
      this.formValidate.oldPasswd = this.action == "pwd" ? row.userPasswd : "";
      this.formValidate.adminType = this.action == "edit" ? row.adminType : "";
      this.formValidate.mobile = this.action == "edit" ? row.mobile : "";
      this.formValidate.userName = this.action == "edit" ? row.userName : "";
      this.hiddenId = row.id;
      this.$refs.formModal.openModal();
    },

    //添加/编辑提交
    handleAddSubmit() {
      let axiosUrl = this.$api.system.adminAdd;
      let axiosParam = {};
      if (this.action == "add") {
        axiosParam.userName = this.formValidate.userName;
        axiosParam.userPasswd = this.formValidate.userPasswd;
        axiosParam.mobile = this.formValidate.mobile;
        axiosParam.adminType = this.formValidate.adminType;
      } else if (this.action == "pwd") {
        axiosUrl = this.$api.system.passwdSet;
        axiosParam.oldPasswd = this.formValidate.oldPasswd;
        axiosParam.repeatPassword = this.formValidate.repeatPassword;
        axiosParam.id = this.hiddenId;
        axiosParam.userPasswd = this.formValidate.userPasswd;
      } else {
        axiosParam.id = this.hiddenId;
        axiosUrl = this.$api.system.adminUpdate;
        axiosParam.userName = this.formValidate.userName;
        axiosParam.adminType = this.formValidate.adminType;
        axiosParam.mobile = this.formValidate.mobile;
      }
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$post(axiosUrl, axiosParam).then(res => {
            if (res.error == 0) {
              this.$Message.success("操作成功!");
              this.remoteTable();
              this.$refs.formModal.colseModal();
            }
          });
        } else {
          this.$Message.error("输入有误,请检查!");
        }
      });
    },

    //删除用户
    openRemoveModal(params) {
      this.currentData = params;
      this.modalContent =
        "您确定要删除管理员<i class='text-danger'> " +
        params.userName +
        " </i>吗?";
      this.$refs.delModal.openModal();
    },

    //删除回调、状态变更回调
    handleRemove(item) {
      this.$post(this.$api.system.adminDelete, {
        id: item.id
      }).then(res => {
        if (res.error == 0) {
          this.$Message.success("操作成功!");
          this.remoteTable();
          this.$refs.delModal.colseModal();
        }
      });
    },

    switchChange(row) {
      setTimeout(() => {
        this.$post(this.$api.system.adminStatus, {
          enabled: row.enabled,
          id: row.id
        }).then(res => {
          if (res.error == 0) {
            this.$Message.success("操作成功!");
          }
          this.remoteTable();
        });
      }, 500);
    },

    makePowerData(data) {
      if (data.length > 0) {
        data.filter((item, index) => {
          let permission = {};
          permission.title = item.name;
          permission.id = item.id;
          permission.expand = index == 0 ? true : false;
          permission.checked = false;
          permission.children = [];
          if (item.pagelist && item.pagelist.length > 0) {
            item.pagelist.filter(citem => {
              let ren = {
                title: citem.name,
                checked: citem.check,
                id: citem.id
              };
              permission.children.push(ren);
            });
          }
          this.permissionData.push(permission);
        });
      }
    },

    //权限设置
    openPowerModal(row) {
      this.openDraw = true;
      this.currentData = row;
      this.drawerTitle = "权限设置" + "(" + row.userName + ")";
      this.permissionData = [];
      this.$post(this.$api.system.permission, { id: row.id }).then(res => {
        if (res.error == 0) {
          this.makePowerData(res.data);
        }
      });
    },

    //提交权限
    submitPowerData() {
      let data = this.permissionData;
      let parma = [];
      data.filter(item => {
        item.children.filter(citem => {
          if (citem.checked) {
            parma.push(citem.id);
          }
        });
      });
      this.$post(this.$api.system.permissionSet, {
        id: this.currentData.id,
        snCode: JSON.stringify(parma)
      }).then(res => {
        if (res.error == 0) {
          this.$Message.success("操作成功!");
          this.remoteTable();
          this.openDraw = false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
