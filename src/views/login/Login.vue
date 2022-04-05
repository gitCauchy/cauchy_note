<template>
  <div class="login">
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="loginForm" status-icon label-width="80px">
          <h3>登录</h3>
          <hr>
          <el-form-item prop="username" label="用户名：" class="form_username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码：" class="form_password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-row style="margin: 20px">
            <el-button type="primary" @keyup.enter.native="enterLogin" @click="doLogin" size="small">登录账号</el-button>
            <el-button type="success" @click="goToLink('/resetPassword')" size="small">找回密码</el-button>
            <el-button type="info" @click="goToLink('/register')" size="small">注册账号</el-button>
          </el-row>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {request} from "../../network/request";
import {initDynamicRouter} from "../../router";

export default {

  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    }
  },
  created() {
    this.enterLogin();
  },
  methods: {
    goToLink(link) {
      this.$router.replace(link)
    },

    enterLogin() {
      document.onkeydown = e => {
        //13表示回车键，baseURI是当前页面的地址，为了更严谨，也可以加别的，可以打印e看一下
        if (e.keyCode === 13 && e.target.baseURI.match(/login/)) {
          //回车后执行搜索方法
          this.doLogin();
        }
      }
    },

    doLogin() {
      if (!this.loginForm.username) {
        this.$message.error("请输入用户名！");
      } else if (!this.loginForm.password) {
        this.$message.error("请输入密码！");
      } else {
        // 校验用户名，密码
        request({
          url: '/login',
          method: 'post',
          data: this.loginForm
        }, (response) => {
          if (response.data.SystemStatusCode === 100000) { // 登录验证通过
            // 1. 将登录成功后的 token 保存到客户端的 sessionStorage 中
            sessionStorage.setItem("username", this.loginForm.username)
            sessionStorage.setItem("email", response.data.userInfo.email)
            sessionStorage.setItem("user_id", response.data.userInfo.id)
            sessionStorage.setItem("userRole", response.data.userInfo.authorities[0].authority)
            sessionStorage.setItem("token", response.data.token)
            this.$store.commit("setMenuList", response.data.userInfo.menus)
            initDynamicRouter()
            this.$router.push("/home")
          } else {
            this.$message.error("用户名或密码错误")
          }
        }, (failure) => {
          console.log(failure);
          this.$message.error("网络错误！");
        })
      }
    },
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
