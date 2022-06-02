<template>
  <header>
    <div class="l-content">
      <el-button plain icon="el-icon-menu" size="mini" @click="handleMenu()"></el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{ current.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link" v-if="this.hasNewMessage">
          <img src="../assets/img/user_man_message.jpg" class="user" alt="UserImg" v-if="this.gender===0"/>
          <img src="../assets/img/user_woman_message.jpg" class="user" alt="UserImg" v-else/>
        </span>
        <span class="el-dropdown-link" v-else>
          <img src="../assets/img/user_man.jpg" class="user" alt="UserImg" v-if="this.gender===0"/>
          <img src="../assets/img/user_woman.jpg" class="user" alt="UserImg" v-else/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="goToLink('/message')">消息
            <span v-if="hasNewMessage"><img src="../assets/img/red-dot.jpg" alt="red-dot"
                                            style="height: 10px;width: 10px"></span></el-dropdown-item>
          <el-dropdown-item @click.native="goToLink('/userinfo')">个人资料</el-dropdown-item>
          <el-dropdown-item @click.native="quit()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>

</template>

<script>
import {mapState} from 'vuex'
import {getMessageCount} from "@/api/message";

export default {
  name: "CommonHeader",
  data() {
    return {
      hasNewMessage: false,
      gender: null,
    };
  },
  methods: {
    handleMenu() {
      this.$store.commit("CollapseMenu")
    },
    quit() {
      // 1. 路由指向登录页
      this.$router.replace('/login')
      // 2. 删除 sessionStorage 中数据
      sessionStorage.clear()
      // 3. 清除 vuex 中数据, 页面刷新
      window.location.reload()
    },
    goToLink(link) {
      this.$router.replace(link)
    },
    getMessageCount() {
      getMessageCount(JSON.parse(sessionStorage.userInfo).id).then(response => {
        this.hasNewMessage = response !== 0;
      })
    },
  },
  created() {
    this.getMessageCount();
    this.gender = Number(sessionStorage.getItem("gender"))
  },
  computed: {
    ...mapState({
      current: (state) => state.currentMenu,
    }),
    messageRefreshStatus() {
      return this.$store.state.messageStatus;
    },
  },
  watch: {
    messageRefreshStatus() {
      this.getMessageCount();
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.l-content {
  display: flex;
  align-items: center;
}

.el-button {
  margin-right: 20px;
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
