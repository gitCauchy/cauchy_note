<template>
  <el-menu
    class="el-menu"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <h3 v-show="!isCollapse" style="color:#fff;text-align:center;">Cauchy Note</h3>
    <h3 v-show="isCollapse" style="color:#fff;text-align:center;">主页</h3>

    <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path" @click="clickMenu(item)">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>


</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "CommonAside",
  data() {
    return {
      menuList: []
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item) {
      this.$router.push({name: item.name})
      this.$store.commit("selectMenu", item)
    },
  },
  computed: {
    noChildren() {
      return this.menuList.filter((item) => !item.children)
    },
    hasChildren() {
      return this.menuList.filter((item) => item.children)
    },
    isCollapse() {
      return this.$store.state.isCollapse
    },
    ...mapState(['userMenuList'])
  },
  created() {
    // 初始化 menuList
    this.menuList = this.userMenuList;
  }
}
</script>

<style>
.el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
</style>


