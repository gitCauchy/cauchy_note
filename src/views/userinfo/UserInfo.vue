<template>
  <div>
    <el-form :model="userInfoForm" status-icon :rules="rules" ref="userInfoForm" label-width="100px" style="width: 55%"
             class="modify-password-ruleForm">
      <h3>用户基本信息</h3>
      <el-form-item label="用户名">
        <el-input type="text" v-model="username" readonly/>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input type="text" v-model="email" readonly/>
      </el-form-item>
      <br>
      <br>
      <h3>密码修改</h3>
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input v-model="userInfoForm.oldPassword"/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" show-password v-model="userInfoForm.newPassword"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkNewPassword">
        <el-input type="password" show-password v-model="userInfoForm.checkNewPassword"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="modifyPasswrod">确认修改</el-button>
        <el-button @click="resetForm">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {modifyPassword} from "@/api/userinfo";
import {SystemStatusCode} from "@/common/const";

export default {
  name: "UserInfo",
  data() {

    const validateNewpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userInfoForm.checkNewPassword !== '') {
          this.$refs.userInfoForm.validateField('checkNewpassword');
        }
        callback();
      }
    };
    const validateCheckNewpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userInfoForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      username: JSON.parse(sessionStorage.userInfo).username,
      email: JSON.parse(sessionStorage.userInfo).email,
      userInfoForm: {
        oldPassword: '',
        newPassword: '',
        checkNewPassword: '',
      },
      rules: {
        newPassword: [
          {validator: validateNewpassword, trigger: 'blur'}
        ],
        checkNewPassword: [
          {validator: validateCheckNewpassword, trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    modifyPasswrod() {
      this.$refs['userInfoForm'].validate((valid) => {
        if (!valid) {
          this.$message.error("按要求填写信息！")
        } else {
          modifyPassword(this.username, this.userInfoForm.oldPassword, this.userInfoForm.newPassword)
            .then(response => {
              if (response.SystemStatusCode === SystemStatusCode.SUCCESS) {
                this.$message.success("修改成功！")
              } else {
                this.$message.error("密码错误！")
              }
            })
        }
      });
    },
    resetForm() {
      this.$refs['userInfoForm'].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
