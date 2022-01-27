<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="角色名称" v-model="queryInfo.keyword" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-form class="operation-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>数据列表</span>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd()" style="margin:20px">添加</el-button>
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
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
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
        <el-button type="primary" @click="handleDistributeDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {request} from "../../network/request";

const defaultQueryInfo = {
  pageNum: 1,
  pageSize: 5,
  keyword: "",

};
const defaultRole = {
  id: null,
  roleName: null,
  roleDescription: null,
};
const defaultPermission = {
  id: null,
  permissionName: null,
  permissionTag: null,
};
export default {
  name: 'roleList',
  data() {
    return {
      queryInfo: Object.assign({}, defaultQueryInfo),
      list: null,
      total: null,
      listLoading: false,
      role: Object.assign({}, defaultRole),
      isEdit: false,
      permission: Object.assign({}, defaultPermission),
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
      request({
        url: '/role/getAllRoles',
        method: 'get',
        params: {
          'pageNum': this.queryInfo.pageNum,
          'pageSize': this.queryInfo.pageSize,
          'keyword': this.queryInfo.keyword
        }
      }, (response) => {
        this.list = response.data.roles;
        this.total = response.data.total;
        this.listLoading = false;
      }, (faliure) => {
        console.log(failure);
      })
    },
    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },
    handleSearchReset() {
      this.queryInfo = Object.assign({}, defaultQueryInfo)
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.role = Object.assign({}, defaultRole)
    },
    handleSelectPermission(index, row) {
      this.distributionRoleId = row.id;
      this.distributionDialogVisible = true;
      this.getPermissionListByRoleId(row.id);
    },
    getPermissionListByRoleId(roleId) {
      request({
        url: '/permission/getPermissionByRoleId',
        method: 'get',
        params: {
          'id': roleId
        }
      }, (response) => {
        let reqPermissionList = response.data;
        this.permissionIds = [];
        if (reqPermissionList != null && reqPermissionList.length > 0) {
          for (let i = 0; i < reqPermissionList.length; i++) {
            this.permissionIds.push(reqPermissionList[i].id)
          }
        }
      }, (failure) => {
        console.log(failure);
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
        request({
          url: '/role/deleteRole',
          method: 'get',
          params: {
            'id': row.id,
          }
        }, (response) => {
          this.$message({
            type: 'success',
            message: '删除成功！',
          });
          this.getList();
        }, (failure) => {
          console.log(failure);
        })
      })
    },
    handleDialogConfirm() {
      if (this.isEdit) { // 更新操作
        request({
          url: '/role/updateRole',
          method: 'post',
          data: this.role,
        }, (response) => {
          this.$message(
            {
              type: 'success',
              message: '修改成功'
            }
          );
          this.dialogVisible = false;
          this.getList();
        }, (failure) => {
          console.log(failure);
        })
      } else { // 新增操作
        request({
          url: '/role/addNewRole',
          method: 'post',
          data: this.role,
        }, (response) => {
          this.$message(
            {
              type: 'success',
              message: '新增成功'
            }
          );
          this.dialogVisible = false;
          this.getList();
        }, (failure) => {
          console.log(failure);
        })
      }
    },
    getAllPermissionList() {
      request({
        url: 'permission/getAllPermissions',
        method: 'get',
      }, (response => {
        this.permissionList = response.data;
      }), (failure) => {
        console.log(failure);
      })
    },
    handleDistributeDialogConfirm() {
      request({
        url: '/permission/addPermissionOfRole',
        method: 'post',
        data: {
          'roleId': this.distributionRoleId,
          'permissionIds': this.permissionIds
        },
      }, () => {
        this.$message({
          message: '分配成功！',
          type: 'success'
        });
        this.distributionDialogVisible = false;
      }, (failure) => {
        console.log(failure);
      })
    }
  },

  created() {
    this.getList();
    this.getAllPermissionList();
  },
}
</script>

