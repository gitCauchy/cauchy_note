<template>
  <div class="login clearfix">
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="user" status-icon label-width="80px">
          <h3>注册</h3>
          <hr>
          <el-form-item prop="username" label="用户名：" class="form_username">
            <el-input v-model="user.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱：" class="form_email">
            <el-input v-model="user.email" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：" class="form_password">
            <el-input v-model="user.password" show-password placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-row>
            <el-button type="primary" @click="doRegister()" style="float:left" size="small">注册账号</el-button>
            <el-button type="primary" @click="this.$router.replace('/login')" style="float:right" size="small">登录账号</el-button>
          </el-row>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {request} from "../network/request";

export default {
  name: "login",
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: ""
      },
    };
  },
  created() {
  },
  methods: {
    doRegister() {
      if (!this.user.username) {
        this.$message.error("请输入用户名！");
        return;
      } else if (!this.user.email) {
        this.$message.error("请输入邮箱！");
        return;
      } else if (this.user.email != null) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(this.user.email)) {
          this.$message.error("请输入有效的邮箱！");
        } else if (!this.user.password) {
          this.$message.error("请输入密码！");
          return;
        } else {
          // this.$router.push({ path: "/" }); //无需向后台提交数据，方便前台调试
          request({
            url: '/register',
            method: 'post',
            data: this.user
          }, () => {
            console.log('success');
          }, () => {
            console.log('failure');
          })

          axios
            .post("/register/", {
              name: this.user.username,
              email: this.user.email,
              password: this.user.password
            })
            .then(res => {
              if (res.data.status === 200) {
                this.$router.push({path: "/"});
              } else {
                alert("您输入的用户名已存在！");
              }
            });
        }
      }
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("../assets/img/login_background.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
}

.login-wrap {
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
