<template>
  <div class="login">
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="loginForm" :rules="rules" status-icon label-width="100px">
          <h3>登录</h3>
          <hr>
          <el-form-item prop="username" label="用户名：" class="form_username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码：" class="form_password">
            <el-input v-model="loginForm.password" @keyup.enter.native="doLogin" show-password placeholder="请输入密码"
                      prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-row style="margin: 20px">
            <el-button type="primary" @click="doLogin" size="small">登录账号</el-button>
            <el-button type="success" @click="resetPassword" size="small">找回密码</el-button>
            <el-button type="info" @click="register" size="small">注册账号</el-button>
          </el-row>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {initDynamicRouter} from "@/router";
import {login} from "@/api/login";
import {goToLink} from "@/utils/public";
import {SystemStatusCode} from "@/utils/constant";

export default {

  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    doLogin() {
      this.$refs['loginForm'].validate(valid => {
        if (!valid) {
          this.$message.error("请输入用户名密码");
        } else {
          login(this.loginForm.username, this.loginForm.password).then(response => {
            if (response.SystemStatusCode === SystemStatusCode.SUCCESS) {
              sessionStorage.setItem("userInfo", JSON.stringify(response.userInfo));
              sessionStorage.setItem("token", response.token);
              sessionStorage.setItem("username", this.loginForm.username);
              this.$store.commit("setMenuList", response.userInfo.menus)
              initDynamicRouter()
              this.$router.push("/home")
            } else {
              this.$message.error("用户名或密码错误")
            }
          })
        }
      })
    },
    resetPassword() {
      goToLink('/resetPassword')
    },
    register() {
      goToLink('/register')
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/login_background.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
}

.login-wrap {
  width: 400px;
  height: 300px;
  margin: 100px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}

#password {
  margin-bottom: 5px;
}

h3 {
  color: #0babeab8;
  font-size: 24px;
}

hr {
  background-color: #000000;
  margin: 20px auto;
}

a {
  text-decoration: none;
  color: black;
  font-size: 16px;
}

a:hover {
  color: coral;
}
</style>
