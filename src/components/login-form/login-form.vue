<template>
  <div>
    <Form
      ref="loginForm"
      :model="form"
      :rules="rules"
      @keydown.enter.native="handleSubmit"
    >
      <FormItem prop="userName">
        <Input
          type="text"
          placeholder="请输入账号"
          prefix="md-person"
          v-model="form.userName"
        />
      </FormItem>

      <FormItem prop="userPasswd">
        <Input
          type="password"
          placeholder="请输入密码"
          prefix="md-lock"
          v-model="form.userPasswd"
        />
      </FormItem>

      <FormItem>
        <Button
          @click="handleSubmit"
          type="primary"
          long
          :loading="submitLoading"
          >确认登录</Button
        >
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      form: {
        userName: "",
        userPasswd: ""
      },
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        userPasswd: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    submitLoading() {
      return this.$store.state.user.submitLoading;
    }
  },
  watch: {
    submitLoading() {
      return this.$store.state.user.submitLoading;
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            userName: this.form.userName,
            userPasswd: this.form.userPasswd
          });
        }
      });
    }
  }
};
</script>
