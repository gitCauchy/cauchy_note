<template>
  <div class="register">
    <div class="register-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="registerForm" :rules="rules" :model="registerForm" status-icon label-width="80px">
          <h3>注册</h3>
          <hr>
          <el-form-item prop="username" label="用户名：" class="form_username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱：" class="form_email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：" class="form_password">
            <el-input v-model="registerForm.password" @keyup.enter.native="doRegister" show-password placeholder="请输入密码"
                      prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-row>
            <el-button type="primary" @click="doRegister" style="float:left"
                       size="small">注册账号
            </el-button>
            <el-button type="primary" @click="doLogin" style="float:right" size="small">登录账号
            </el-button>
          </el-row>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {goToLink} from "@/utils/public";
import {register} from "@/api/login";
import {SystemStatusCode} from "@/common/const";

export default {
  name: "Register",
  data() {
    const validUserName = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error("字母，数字，英文符号组成，不可为汉字"));
        }
        callback();
      }
    };

    const validEmail = (rule, value, callback) => {
      if (value) {
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
          callback(new Error("邮箱格式错误"));
        }
        callback();
      }
    }
    return {
      registerForm: {
        username: "",
        email: "",
        password: ""
      },
      rules: {
        username: [
          {validator: validUserName, trigger: 'blur'},
          {min: 6, max: 14, message: '长度在6-14字符之间', trigger: "blur"}
        ],
        email: [{validator: validEmail, trigger: 'blur'}],
      },
    };
  },
  methods: {
    doLogin() {
      goToLink('/login');
    },
    doRegister() {
      this.$refs['registerForm'].validate((valid) => {
        if (!valid) {
          this.$message.error("输入内容不合法！");
        } else {
          register(this.registerForm.username, this.registerForm.password, this.registerForm.email)
            .then(response => {
              if (response === SystemStatusCode.SUCCESS) {
                this.$message.success("注册成功！跳转至登录页面... ...");
                this.$router.push('/login');
              }
              if (response === SystemStatusCode.USERNAME_EXIST_ALREADY) {
                this.$message.error("用户已存在");
              }
              if (response === SystemStatusCode.EMAIL_REGISTERED_ALREADY) {
                this.$message.error("邮箱已被注册");
              }
              if(response === SystemStatusCode.PASSWORD_ILLEGAL){
                this.$message.error("密码过于简单");
              }
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.register {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/register_background.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
}

.register-wrap {
  width: 400px;
  height: 320px;
  margin: 100px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 20px;
}

h3 {
  color: #0babeab8;
  font-size: 24px;
}

hr {
  background-color: #444;
  margin: 20px auto;
}

.el-button {
  width: 50%;
  margin-left: -50px;
}

</style>
