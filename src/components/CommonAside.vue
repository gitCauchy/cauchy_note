<template>
  <el-menu
    class="el-menu"
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
    <el-submenu index="item.path" v-for="item in hasChildren" :key="item.path">
      <template slot="title">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
        <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">{{ subItem.label }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>


</template>

<script>

export default {
  name: "CommonAside",
  data() {
    return {
      menu: [],
    };
  },
  methods: {
    clickMenu(item) {
      this.$router.push({name: item.name})
      this.$store.commit("selectMenu", item)
    },
  },
  computed: {
    noChildren() {
      return this.asyncMenu.filter((item) => !item.children)
    },
    hasChildren() {
      return this.asyncMenu.filter((item) => item.children)
    },
    isCollapse() {
      return this.$store.state.isCollapse
    },
    asyncMenu(){
      return this.$store.state.menu;
    },
  },
}
</script>

<style>
.el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
</style>


