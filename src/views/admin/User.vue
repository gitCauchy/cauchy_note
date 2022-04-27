<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="用户名" @keyup.enter.native="handleSearchList" v-model="queryInfo.searchWord" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList"/>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-form class="operation-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>数据列表</span>
      <el-button size="mini" type="primary" @click="handleAdd()" style="margin:20px">添加</el-button>
    </el-form>
    <div class="data-container">
      <el-table ref="userTable" :data="userList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"/>
        <el-table-column label="用户名" align="center">
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
                           @click="handleUpdate(scope.row)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting"
                           @click="handleSelectRole(scope.row)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除用户" placement="top">
                <el-button type="danger" icon="el-icon-delete"
                           @click="handleDelete(scope.row)"/>
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
      <el-form :model="user" ref="user" label-width="150px" size="small" :rules="rules">
        <el-form-item prop="username" label="用户名：">
          <el-input v-model="user.username" style="width: 250px"/>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input v-model="user.email" style="width: 250px"/>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input type="password" show-password v-model="user.password" style="width: 250px"/>
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
        <el-button type="primary" @click="handleDistributeDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRoleOfUser,
  addUser,
  deleteUser,
  findRoleByUserId,
  getAllRoles,
  queryAllUsers,
  updateUser
} from "@/api/admin";
import {SystemStatusCode} from "@/utils/constant";

export default {
  name: "User",
  data() {
    const validUsername = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error("字母，数字，英文符号组成，不可为汉字"));
        }
        callback();
      }
    };

    const validEmail = (rule, value, callback) => {
      if (value) {
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
          callback(new Error("邮箱格式错误"));
        }
        callback();
      }
    }
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        searchWord: ""
      },
      userList: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      user: {},
      distributionUserId: null,
      distributionDialogVisible: false,
      roleIds: [],
      roleList: [],
      rules: {
        username: [
          {validator: validUsername, trigger: 'blur'},
          {min: 6, max: 14, message: '长度在6-14字符之间', trigger: "blur"}
        ],
        email: [{validator: validEmail, trigger: 'blur'}],
        password: [{min: 6, max: 14, message: '长度在6-16字符之间', trigger: "blur"}]
      }
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
      queryAllUsers(this.queryInfo.pageSize, this.queryInfo.pageNum, this.queryInfo.searchWord)
        .then(response => {
          this.listLoading = false;
          this.userList = response.users;
          this.total = response.total;
        })
    },
    getAllRoleList() {
      getAllRoles(1, 100, '')
        .then(response => {
          this.roleList = response.roles;
        })

    },
    handleDelete(row) {
      this.$confirm('是否删除该用户？', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          deleteUser(row.id)
            .then(response => {
              if (response === SystemStatusCode.SUCCESS) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error("删除失败！");
              }
            })
        }
      )
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.user = Object.assign({}, row)
    },
    handleDialogConfirm() {
      this.$refs['user'].validate((valid) => {
        if (!valid) {
          this.$message.error("输入内容不合法！")
        } else {
          if (this.isEdit) { // 如果是编辑窗口
            updateUser(this.user)
              .then(response => {
                if (response === SystemStatusCode.SUCCESS) {
                  this.$message.success("修改成功！");
                  this.getList();
                } else {
                  this.$message.error("修改失败！");
                }
                this.dialogVisible = false;
              })
          } else { // 如果是新增窗口
            addUser(this.user)
              .then(response => {
                if (response === SystemStatusCode.SUCCESS) {
                  this.$message.success("添加成功！");
                  this.getList();
                } else {
                  this.$message.error("添加失败！");
                }
                this.dialogVisible = false;
              })
          }
        }
      })
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.user = {};
    },
    handleSelectRole(row) {
      this.distributionUserId = row.id;
      this.distributionDialogVisible = true;
      this.getRoleListByUserId(row.id);
    },
    getRoleListByUserId(userId) {
      findRoleByUserId(userId)
        .then(response => {
          let reqRoleList = response;
          this.roleIds = [];
          if (reqRoleList != null && reqRoleList.length > 0) {
            for (let i = 0; i < reqRoleList.length; i++) {
              this.roleIds.push(reqRoleList[i].id)
            }
          }
        })
    },
    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },

    handleDistributeDialogConfirm() {
      addRoleOfUser(this.distributionUserId, this.roleIds)
        .then(response => {
          if (response === SystemStatusCode.SUCCESS) {
            this.$message.success("分配成功！");
          } else {
            this.$message.error("分配失败");
          }
          this.distributionDialogVisible = false;
        })
    }
  }
}
</script>

<style scoped>

</style>

