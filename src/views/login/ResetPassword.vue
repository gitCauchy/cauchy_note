<template>
  <div class="resetPassword-page">
    <div class="resetPassword-form">
      <el-form :model="resetPasswordForm" style="width: 30%;display:inline-block" status-icon :rules="rules"
               ref="resetPasswordForm"
               label-width="100px" class="resetPassword-ruleForm">
        <h3>重置密码</h3>
        <el-form-item label="用户名" class="form_username">
          <el-input v-model="resetPasswordForm.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :class="{codeGetting:isGeting}" :disabled="isDisabled" @click="sendCheckCode">
            {{ getCode }}
          </el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode" class="form_check_code">
          <el-input v-model="resetPasswordForm.checkCode" placeholder="请输入您收到的验证码"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="form_password">
          <el-input type="password" show-password v-model="resetPasswordForm.password" autocomplete="off"
                    placeholder="请输入密码"/>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPassword" class="form_password">
          <el-input type="password" show-password v-model="resetPasswordForm.checkPassword"
                    autocomplete="off" placeholder="请重新输入一次密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="resetPassword">重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {sendCheckCode, resetPassword} from "@/api/login";
import {SystemStatusCode} from "@/common/const";

export default {
  name: "ResetPassword",
  data() {
    const validateCheckCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码长度错误'))
      }
      callback();
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.resetPasswordForm.checkPassword !== '') {
          this.$refs.resetPasswordForm.validateField('checkPassword');
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      getCode: '获取验证码',
      count: 60,
      isGeting: false,
      isDisabled: false,
      resetPasswordForm: {
        password: '',
        checkPassword: '',
        username: '',
        checkCode: '',
      },
      rules: {
        checkCode: [
          {validator: validateCheckCode, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {validator: validateCheckPass, trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    sendCheckCode() {
      let countDown = setInterval(() => {
        if (this.count < 1) {
          this.isGeting = false
          this.isDisabled = false
          this.getCode = '获取验证码'
          this.count = 6
          clearInterval(countDown)
        } else {
          this.isGeting = true
          this.isDisabled = true
          this.getCode = this.count-- + 's后重发'
        }
      }, 1000);
      sendCheckCode(this.resetPasswordForm.username, "密码重置服务")
        .then(response => {
          if (response.SystemStatusCode === SystemStatusCode.SUCCESS) {
            this.$message.success("验证码发送成功！")

          } else {
            this.$message.error("系统异常，请稍后再试！")
          }
        })
    },
    resetPassword() {
      this.$refs['resetPasswordForm'].validate((valid) => {
        if (!valid) {
          this.$message.error("填写有误")
        } else {
          resetPassword(this.resetPasswordForm.username, this.resetPasswordForm.password, this.resetPasswordForm.checkCode)
            .then(response => {
              if (response.SystemStatusCode === SystemStatusCode.SUCCESS) {
                this.$message.success("修改成功！")
              } else {
                this.$message.error("验证码错误！")
              }
            })
        }
      })
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
