<template>
  <el-card>
    <el-table :data="menuList" border stripe style="width:100%">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="菜单路径" prop="path" align="center"></el-table-column>
      <el-table-column label="菜单名称" prop="name" align="center"></el-table-column>
      <el-table-column label="菜单标签" prop="label" align="center"></el-table-column>
      <el-table-column label="菜单图标" prop="icon" align="center"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "Menu",
  data() {
    return {
      menuList: []
    }
  },
  created() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      request({
        url: '/menu/getAllMenus',
        method: 'get'
      }, (response) => {
        this.menuList = response.data;
        console.log(this.menuList);
      }, (failure) => {
        this.$message.error("获取失败！")
      })
    }
  }
}
</script>

<style scoped>

</style>
