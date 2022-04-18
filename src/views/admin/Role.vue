<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="角色名称" v-model="queryInfo.keyword" @keyup.enter.native="handleSearchList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-form class="operation-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>数据列表</span>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd" style="margin:20px">添加</el-button>
    </el-form>
    <div class="data-container">
      <el-table ref="roleTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.roleDescription }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="编辑角色" placement="top">
                <el-button type="primary" icon="el-icon-edit"
                           @click="handleUpdate(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="分配权限" placement="top">
                <el-button type="warning" icon="el-icon-setting"
                           @click="handleSelectPermission(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除角色" placement="top">
                <el-button type="danger" icon="el-icon-delete"
                           @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="total,sizes,prev,pager,next,jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sycn="queryInfo.pageNum"
      :page-size="queryInfo.pageSize"
      :page-sizes="[5,10,15]"
      :total="total">
    </el-pagination>
    <el-dialog :title="isEdit?'编辑角色':'添加角色'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="role.roleDescription" style="width:250px" type="textarea" :rows="5"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="distributionDialogVisible"
      width="30%">
      <el-select v-model="permissionIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option v-for="item in permissionList" :key="item.id" :label="item.permissionName"
                   :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionDialogVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDistributeDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addPermissionOfRole,
  getAllRoles,
  getPermissionByRoleId,
  deleteRole,
  updateRole,
  addNewRole,
  getAllPermissions
} from "@/api/admin";

export default {
  name: 'roleList',
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 5,
        keyword: "",
      },
      list: null,
      total: null,
      listLoading: false,
      role: {},
      isEdit: false,
      permission: {},
      dialogVisible: false,
      distributionRoleId: null,
      distributionDialogVisible: false,
      permissionIds: [],
      permissionList: [],
    }
  },
  methods: {
    handleSizeChange(value) {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = value;
      this.getList();
    },
    handleCurrentChange(value) {
      this.queryInfo.pageNum = value;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getAllRoles(this.queryInfo.pageNum, this.queryInfo.pageSize, this.queryInfo.keyword)
        .then(response => {
          this.list = response.roles;
          this.total = response.total;
          this.listLoading = false;
        })
    },
    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.role = {};
    },
    handleSelectPermission(index, row) {
      this.distributionRoleId = row.id;
      this.distributionDialogVisible = true;
      this.getPermissionListByRoleId(row.id);
    },
    getPermissionListByRoleId(roleId) {
      getPermissionByRoleId(roleId)
        .then(response => {
          let reqPermissionList = response;
          this.permissionIds = [];
          if (reqPermissionList != null && reqPermissionList.length > 0) {
            for (let i = 0; i < reqPermissionList.length; i++) {
              this.permissionIds.push(reqPermissionList[i].id)
            }
          }
        })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.role = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id)
          .then(response => {
            this.$message.success("删除成功！");
            this.getList();
          })
      })
    },
    handleDialogConfirm() {
      if (this.isEdit) { // 更新操作
        updateRole(this.role)
          .then(response => {
            this.$message.success("修改成功！");
            this.dialogVisible = false;
            this.getList();
          })
      } else { // 新增操作
        addNewRole(this.role)
          .then(response => {
            this.$message.success("添加成功！");
            this.dialogVisible = false;
            this.getList();

          })
      }
    },
    getAllPermissionList() {
      getAllPermissions()
        .then(response => {
          this.permissionList = response;
        })
    },
    handleDistributeDialogConfirm() {
      addPermissionOfRole(this.distributionRoleId, this.permissionIds)
        .then(response => {
          this.$message.success("分配成功！")
          this.distributionDialogVisible = false;
        })
    }
  },
  created() {
    this.getList();
    this.getAllPermissionList();
  }
}
</script>

