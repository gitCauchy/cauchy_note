<template>
  <div class="resetPassword-page">
    <div class="resetPassword-form">
      <el-form :model="resetPasswordForm" style="width: 40%;display:inline-block" status-icon :rules="rules"
               ref="ruleForm"
               label-width="100px" class="resetPassword-ruleForm">
        <h3>重置密码</h3>
        <el-form-item label="用户名">
          <el-input v-model="resetPasswordForm.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="isSend" @click="sendCheckCode">发送验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <el-input v-model="resetPasswordForm.checkCode"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="resetPasswordForm.pass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="resetPasswordForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="">重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: "ResetPassword",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.resetPasswordForm.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isSend:false,
      resetPasswordForm: {
        password: '',
        checkPassword: '',
        username: '',
        checkCode: '',
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    sendCheckCode(){

    },
    resetPassword(){

    }
  }
}
</script>

<style scoped>
.resetPassword-page {
  height: 100%;
  width: 100%;
  background: url("../../assets/img/reset_password_background.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
}

.resetPassword-form {
  text-align: center;
  margin: 100px auto;
}

.el-button {
  width: 50%;
  margin-left: -50px;
}

h3 {
  color: #0babeab8;
  font-size: 24px;
  text-align: left;
}

</style>
