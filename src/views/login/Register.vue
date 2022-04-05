<template>
  <div class="register">
    <div class="register-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="user" :rules="rules" :model="user" status-icon label-width="80px">
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
            <el-button type="primary" @click="goToLink('/login')" style="float:right" size="small">登录账号
            </el-button>
          </el-row>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "login",
  data() {
    const validQC = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error("字母，数字，英文符号组成，不可为汉字"));
        } else {
          // 验证通过
          callback();
        }
        callback();
      }
    };
    return {
      user: {
        username: "",
        email: "",
        password: ""
      },
      rules: {
        username: [
          {validator: validQC, trigger: 'blur'},
          {min: 6, max: 14, message: '长度在4-16字符之间', trigger: "blur"}
        ],
        password: [{min: 6, max: 14, message: '长度在6-16字符之间', trigger: "blur"}]
      },
    };
  },
  created() {
  },
  methods: {
    goToLink(link) {
      this.$router.replace(link)
    },
    doRegister() {
      if (!this.user.username) {
        this.$message.error("请输入用户名！");

      } else if (!this.user.email) {
        this.$message.error("请输入邮箱！");
      } else {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(this.user.email)) {
          this.$message.error("请输入有效的邮箱！");
        } else if (!this.user.password) {
          this.$message.error("请输入密码！");
        } else {
          request({
            url: '/register',
            method: 'post',
            data: this.user
          }, (response) => {
            if (response.data === 100000) {
              this.$message.success("注册成功！跳转至登录页面... ...")
              this.$router.push('/login')
            } else if (response.data === -300000) {
              this.$message.error("用户已存在！")
            }
          }, () => {
            console.log('failure');
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.register {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/login_background.jpg") no-repeat;
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
