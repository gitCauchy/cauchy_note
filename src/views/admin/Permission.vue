<template>
  <el-card>
    <el-table :data="permissionList" border stripe style="width:100%">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="权限名称" prop="permissionName" align="center"></el-table-column>
      <el-table-column label="权限标签" prop="permissionTag" align="center"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {getAllPermissions} from "@/api/admin";

export default {
  name: "Permission",
  data() {
    return {
      permissionList: []
    }
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    getPermissionList() {
      getAllPermissions()
        .then(response => {
          this.permissionList = response;
        })
    }
  }
}
</script>

<style scoped>

</style>
