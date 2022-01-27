<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="用户名" v-model="queryInfo.searchWord" clearable>
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
      <el-table ref="userTable" :data="userList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="用户名" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="是否有效" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isEnable===0">是</span>
            <span v-if="scope.row.isEnable===1">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="编辑用户" placement="top">
                <el-button type="primary" icon="el-icon-edit"
                           @click="handleUpdate(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting"
                           @click="handleSelectRole(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除用户" placement="top">
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
      :page-sizes="[10,15,20]"
      :total="total">
    </el-pagination>
    <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="user" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="用户名：">
          <el-input v-model="user.username" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="user.email" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="user.password" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-radio-group v-model="user.isEnable">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="distributionDialogVisible"
      width="30%">
      <el-select v-model="roleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
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
  pageSize: 10,
  searchWord: ""
};

const defaultUser = {
  id: null,
  username: null,
  password: null,
  email: null,
  createTime: null,
  isEnable: null
}

export default {
  name: "userList",
  data() {
    return {
      queryInfo: Object.assign({}, defaultQueryInfo),
      userList: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      user: Object.assign({}, defaultUser),
      distributionUserId: null,
      distributionDialogVisible: false,
      roleIds: [],
      roleList: [],
    }
  },
  created() {
    this.getList();
    this.getAllRoleList();
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
        url: '/user/queryAllUsers',
        method: 'get',
        params: {
          "pageSize": this.queryInfo.pageSize,
          "pageNum": this.queryInfo.pageNum,
          "keyword": this.queryInfo.searchWord
        }
      }, (response) => {
        this.listLoading = false;
        this.userList = response.data.users;
        this.total = response.data.total;
      }, (failure) => {
        console.log(failure);
      })
    },
    getAllRoleList() {
      request({
        url: 'role/getAllRoles',
        method: 'get',
        params: {
          'pageSize': 100,
          'pageNum': 1,
          'keyword': ''
        }
      }, (response => {
        this.roleList = response.data.roles;
      }), (failure) => {
        console.log(failure);
      })

    },
    handleDelete(index, row) {
      this.$confirm('是否删除该用户？', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          request({
            url: '/user/deleteUser',
            method: "get",
            params: {
              'id': row.id
            }
          }, (response) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getList()
          }, (failure) => {
            console.log(failure);
          })
        }
      )
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.user = Object.assign({}, row)
    },
    handleDialogConfirm() {
      if (this.isEdit) { // 如果是编辑窗口
        request({
          url: '/user/updateUser',
          method: 'post',
          data: this.user
        }, (response) => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        })
      } else { // 如果是新增窗口
        request({
          url: '/user/addUser',
          method: 'post',
          data: this.user
        }, (response) => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        }, (failure) => {
          console.log(failure);
        })
      }
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.user = Object.assign({}, defaultUser)
    },
    handleSelectRole(index, row) {
      this.distributionUserId = row.id;
      this.distributionDialogVisible = true;
      this.getRoleListByUserId(row.id);
    },
    getRoleListByUserId(userId) {
      request({
        url: '/role/findRoleByUserId',
        method: 'get',
        params: {
          'id': userId
        }
      }, (response) => {
        let reqRoleList = response.data;
        this.roleIds = [];
        if (reqRoleList != null && reqRoleList.length > 0) {
          for (let i = 0; i < reqRoleList.length; i++) {
            this.roleIds.push(reqRoleList[i].id)
          }
        }
      }, (failure) => {
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
    handleDistributeDialogConfirm() {
      request({
        url: '/role/addRoleOfUser',
        method: 'post',
        data: {
          'userId': this.distributionUserId,
          'roleIds': this.roleIds
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
  }
}
</script>

<style scoped>

</style>

