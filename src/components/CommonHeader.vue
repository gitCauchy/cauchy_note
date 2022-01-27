<template>
  <header>
    <div class="l-content">
      <el-button plain icon="el-icon-menu" size="mini" @click="handleMenu()"></el-button>
      <el-breadcrumb separator>
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{ current.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img src="../assets/img/user.jpg" class="user" alt="UserImg"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="quit()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "CommonHeader",
  data() {
    return {};
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
    }
  },
  computed: {
    ...mapState({
      current: (state) => state.currentMenu,
    })
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
