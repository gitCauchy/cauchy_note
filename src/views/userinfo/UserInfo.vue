<template>
  <div>
    <el-form :model="userInfoForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width: 55%"
             class="demo-ruleForm">
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
        <el-input v-model="userInfoForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="userInfoForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkNewPassword">
        <el-input type="password" v-model="userInfoForm.checkNewPassword"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="">确认修改</el-button>
        <el-button @click="">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data() {

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userInfoForm.newPassword !== '') {
          this.$refs.ruleForm.validateField('newPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userInfoForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      username: sessionStorage.getItem('username'),
      email: sessionStorage.getItem('email'),
      userInfoForm: {
        oldPassword: '',
        newPassword: '',
        checkNewPassword: '',
      },
      rules: {
        newPassword: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkNewPassword: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    modifyPassword() {

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
