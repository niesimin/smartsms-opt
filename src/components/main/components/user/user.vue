<template>
  <Dropdown @on-click="handleClick">
    <Badge>
      <Avatar :src="userAvatar"></Avatar>
    </Badge>
    <i> {{ token }}</i>
    <Icon :size="18" type="md-arrow-dropdown"></Icon>
    <DropdownMenu slot="list">
      <DropdownItem name="logOut">退出登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "User",
  props: {
    userAvatar: {
      type: String
    }
  },
  data() {
    return {
      token: this.$store.state.user.token
    };
  },
  methods: {
    ...mapActions({
      handleLoginOut: "user/handleLoginOut"
    }),
    handleClick(name) {
      switch (name) {
        case "logOut":
          this.logOut();
          break;
      }
    },
    logOut() {
      this.handleLoginOut().then(() => {
        this.$router.push({
          name: "login"
        });
      });
    }
  }
};
</script>
