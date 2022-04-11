<template>
  <!-- breakpoint="md" -->
  <Layout class="main">
    <Sider
      hide-trigger
      collapsible
      :width="220"
      :collapsed-width="80"
      v-model="collapsed"
      :style="{ overflow: 'hidden' }"
      class="left-sider"
    >
      <SideMenu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <div class="logo-on">
          <div v-show="!collapsed">{{ $config.title }}</div>
        </div>
      </SideMenu>
    </Sider>
    <Layout>
      <Header>
        <HeaderBar
          :collapsed="collapsed"
          @on-coll-change="handleCollapsedChange"
        >
          <!-- 全屏设置 -->
          <Fullscreen
            v-if="!collapsed"
            v-model="isFullscreen"
            style="margin-right:10px;display:inline-block"
          ></Fullscreen>
          <!-- 用户下拉 -->
          <User :user-avatar="userAvatar" class="userAvatar"></User>
        </HeaderBar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <TagsNav
              :value="$route"
              :list="tagNavList"
              @on-close="handleCloseTag"
              @input="handleClick"
            ></TagsNav>
          </div>

          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import "./main.less";
import SideMenu from "./components/side-menu/side-menu";
import HeaderBar from "./components/header-bar/header-bar";
import User from "./components/user/user";
import Fullscreen from "./components/fullscreen/fullscreen";
import TagsNav from "./components/tags-nav/tags-nav";
import { mapMutations } from "vuex";
import { getNewTagList, routeEqual } from "@/libs/util";
import routers from "@/router/routers";
import { hasNameOneOf } from "@/libs/tools";
export default {
  components: {
    SideMenu,
    HeaderBar,
    User,
    Fullscreen,
    TagsNav
  },
  data() {
    return {
      collapsed: false, //默认tree不隐藏
      isFullscreen: false,
      screenWidth: document.body.clientWidth
    };
  },
  mounted() {
    /**
     * 初始化面包屑和导航菜单
     */

    this.setHomeRoute(routers); //设置首页路由
    this.setBreadCrumb(this.$route); //初始化面包屑
    this.setTagNavList(); //初始化顶部导航菜单
    const { name, params, query, meta } = this.$route;
    this.addTag({
      route: { name, params, query, meta }
    });
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      });
    }
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
        if (that.screenWidth < 992) {
          that.collapsed = true;
        } else {
          that.collapsed = false;
        }
      })();
    };
  },
  computed: {
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    menuList() {
      return this.$store.getters["app/menuList"];
    },
    unreadCount() {
      return this.$store.state.user.unreadCount;
    },
    cacheList() {
      const list = [
        "ParentView",
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter(item => !(item.meta && item.meta.notCache))
              .map(item => item.name)
          : [])
      ];
      return list;
    },
    userAvatar() {
      return this.$store.state.user.avatarImgPath;
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    },
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val;

        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
    }
  },
  methods: {
    ...mapMutations({
      setHomeRoute: "app/setHomeRoute",
      setBreadCrumb: "app/setBreadCrumb",
      setTagNavList: "app/setTagNavList",
      addTag: "app/addTag",
      closeTag: "app/closeTag"
    }),
    handleCollapsedChange(state) {
      this.collapsed = state;
    },

    //关闭的路由 关闭类型 当前路由 this.$emit("on-close", res, "all");
    handleCloseTag(res, type, route) {
      if (type !== "others") {
        if (type === "all") {
          //关闭所有 res之剩下首页
          this.turnToPage(this.$config.homeName);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },

    turnToPage(route, handelMenuRefresh = false) {
      let { name, params, query } = {};
      if (typeof route === "string") {
        name = route;
      } else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      if (this.$route.name == name) {
        // let nmame = name;
        // this.$router.push({
        //   name: "home"
        // });
        // let nroute = this.$router;
        // setTimeout(function() {
        //   nroute.push({ name: nmame });
        // }, 100);
        return;
      }

      if (handelMenuRefresh && hasNameOneOf(name, this.tagNavList)) {
        let rout = this.$router;
        return new Promise(resolve => {
          this.closeTag({
            name,
            params,
            query
          });
          resolve();
        }).then(() => {
          rout.push({
            name,
            params,
            query
          });
        });
      } else {
        this.$router.push({
          name,
          params,
          query
        });
      }
    },

    handleClick(item) {
      this.turnToPage(item);
    }
  }
};
</script>
