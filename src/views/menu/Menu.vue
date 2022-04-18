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
import {getAllMenus} from "@/api/admin";

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
      getAllMenus()
        .then(response => {
          this.menuList = response;
        })
    }
  }
}
</script>

<style scoped>

</style>
