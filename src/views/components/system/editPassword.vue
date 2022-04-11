<template>
  <Card :bordered="false">
    <p slot="title"><Icon type="md-key" size="20" /> 管理员密码设置</p>
    <Row>
      <Col
        :xs="24"
        :sm="{ span: 20, offset: 1 }"
        :md="{ span: 16, offset: 3 }"
        :lg="{ span: 12, offset: 5 }"
        :xl="{ span: 12, offset: 5 }"
      >
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="120"
        >
          <FormItem label="原密码" prop="oldPasswd">
            <Input
              type="password"
              v-model="formValidate.oldPasswd"
              placeholder="请输入管理员密码"
            ></Input>
          </FormItem>

          <FormItem label="新密码" prop="userPasswd">
            <Input
              type="password"
              v-model="formValidate.userPasswd"
              placeholder="请输入管理员密码"
            ></Input>
          </FormItem>

          <FormItem label="重复新密码" prop="repeatPassword">
            <Input
              type="password"
              v-model="formValidate.repeatPassword"
              placeholder="请再次输入新密码"
            ></Input>
          </FormItem>
          <FormItem class="text-center">
            <Button
              size="large"
              type="primary"
              @click="handleSubmit('formValidate')"
              >保存</Button
            >
          </FormItem>
        </Form>
      </Col>
    </Row>
  </Card>
</template>

<script>
export default {
  data() {
    return {
      formValidate: {
        userPasswd: "",
        oldPasswd: "",
        repeatPassword: ""
      },
      ruleValidate: {
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
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$post(this.$api.system.passwdModify, this.formValidate).then(
            res => {
              if (res.error == 0) {
                this.$Message.success("操作成功!");
              }
            }
          );
        } else {
          this.$Message.error("输入有误,请检查!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-row {
  padding: 30px 16px;
  .text-center {
    margin-bottom: 0;
    padding-top: 24px;
  }
}
</style>
