<template>
  <div class="login">
    <img :src="bgLogin" class="login-bg" />
    <img :src="bgLogin2" class="login-bg2" />
    <div class="login-con">
      <Card title="用户登录">
        <LoginForm @on-success-valid="handleSubmit"></LoginForm>
        <p class="login-tip">输入任意用户名和密码登陆</p>
      </Card>
    </div>
  </div>
</template>

<script>
import bgLogin from "@/assets/images/bg-login.png";
import bgLogin2 from "@/assets/images/bg-login2.png";
import LoginForm from "@/components/login-form/login-form.vue";
import { mapActions } from "vuex";
import { canTurnTo } from "@/libs/util";
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      bgLogin,
      bgLogin2
    };
  },
  methods: {
    ...mapActions({
      handleLogin: "user/handleLogin"
    }),
    handleSubmit({ userName, userPasswd }) {
      this.handleLogin({ userName, userPasswd }).then(() => {
        this.$router.push({
          name: this.$config.homeName
        });
        let nrouter = this.$router;
        let that = this;
        setTimeout(function() {
          let accessMenu = that.$store.getters["app/menuList"];
          // console.log("accessMenu", accessMenu);
          if (canTurnTo(that.$config.defaultShowPage, accessMenu)) {
            nrouter.push({
              name: that.$config.defaultShowPage
            });
          }
        }, 20);
      });
    }
  }
};
</script>

<style lang="less">
@import "./login.less";
</style>
