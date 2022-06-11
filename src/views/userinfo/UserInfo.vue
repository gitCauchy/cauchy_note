<template>
  <div>
    <el-form :model="userProfileForm"
             status-icon
             ref="userProfileForm"
             :rules="rulesProfile"
             label-width="100px"
             style="width:70%"
             class="user-profile-ruleForm">
      <h3>用户基本信息</h3>
      <el-form-item label="用户名">
        <el-input type="text" v-model="userProfileForm.username" readonly/>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input type="text" v-model="userProfileForm.email" readonly/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input type="text" v-model="userProfileForm.nickName"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="userProfileForm.gender" placeholder="请选择性别">
          <el-option
            v-for="item in userProfileForm.genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input type="text" v-model="userProfileForm.telephone"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-cascader :options="userProfileForm.addressOptions" v-model="userProfileForm.addressSelectedOptions"
                     @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="userProfileForm.birthday" type="date" placeholder="选择出生日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存信息</el-button>
      </el-form-item>
    </el-form>
    <br>
    <h3>修改绑定邮箱</h3>
    <el-form :model="userEmailForm" label-width="100px" ref="userEmailForm"
             :rules="rulesEmail">
      <el-form-item label="当前邮箱">
        <el-input v-model="userEmailForm.email" readonly></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :class="{codeGetting:isGeting}" :disabled="isDisabled" @click="sendCheckCode">
          {{ getCode }}
        </el-button>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input type="text" v-model="userEmailForm.checkCode" prop="checkCode"></el-input>
      </el-form-item>
      <el-form-item label="新邮箱">
        <el-input type="text" v-model="userEmailForm.newEmail" prop="newEmail"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmModifyEmail">确认修改</el-button>
      </el-form-item>
    </el-form>
    <br>
    <h3>密码修改</h3>
    <el-form :model="userPasswordForm"
             status-icon ref="userPasswordForm"
             :rules="rulesPassword"
             label-width="100px"
             style="width:70%"
             class="modify-password-ruleForm">
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input v-model="userPasswordForm.oldPassword"/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" show-password v-model="userPasswordForm.newPassword"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkNewPassword">
        <el-input type="password" show-password v-model="userPasswordForm.checkNewPassword"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="modifyPassword">确认修改</el-button>
        <el-button @click="resetForm">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getProfile, modifyEmail, modifyPassword, saveProfile} from "@/api/userinfo";
import {SystemStatusCode} from "@/common/const";
import {regionData, CodeToText} from "element-china-area-data";
import {sendCheckCode} from "@/api/login";

export default {
  name: "UserInfo",
  data() {

    const validateTelephone = (rule, value, callback) => {
      if (value) {
        if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
          callback(new Error("电话号码格式错误"));
        }
        callback();
      }
    };
    const validateNewpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userPasswordForm.checkNewPassword !== '') {
          this.$refs.userPasswordForm.validateField('checkNewpassword');
        }
        callback();
      }
    };
    const validateCheckNewpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userPasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value) {
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
          callback(new Error("邮箱格式错误"));
        }
        callback();
      }
    };
    return {
      userId: JSON.parse(sessionStorage.userInfo).id,
      getCode: '获取验证码',
      count: 60,
      isGeting: false,
      isDisabled: false,
      userProfileForm: {
        nickName: '',
        genderOptions: [{
          value: 0,
          label: '男'
        }, {
          value: 1,
          label: '女'
        }],
        gender: null,
        telephone: null,
        birthday: null,
        addressOptions: regionData,
        addressSelectedOptions: null,
        username: JSON.parse(sessionStorage.userInfo).username,
        email: JSON.parse(sessionStorage.userInfo).email,
      },
      userEmailForm: {
        email: null,
        checkCode: null,
        newEmail: null,
      },
      userPasswordForm: {
        oldPassword: '',
        newPassword: '',
        checkNewPassword: '',
      },
      rulesProfile: {
        telephone: [
          {validator: validateTelephone, trigger: 'blur'},
        ],
      },
      rulesEmail: {
        checkCode: [
          {required: true, trigger: 'blur', message: '请输入验证码'},
          {length: 6, trigger: 'blur', message: '验证码长度为 6 个字符'}
        ],
        newEmail: [{validator: validateEmail, trigger: 'blur'}]
      },
      rulesPassword: {
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
      sendCheckCode(this.userProfileForm.username)
        .then(response => {
          if (response.SystemStatusCode === SystemStatusCode.SUCCESS) {
            this.$message.success("验证码发送成功");
          } else {
            this.$message.error("系统异常，请稍后再试")
          }
        })
    },
    confirmModifyEmail(){
      this.$refs['userEmailForm'].validate((valid)=>{
        if(!valid){
          this.$message.error("按要求填写信息");
        }else{
          modifyEmail(this.userProfileForm.username,this.userEmailForm.checkCode,this.userEmailForm.newEmail)
          .then(response=>{
            if(response === SystemStatusCode.SUCCESS){
              this.$message.success("修改成功");
              this.getProfile();
            }else {
              this.$message.error("修改失败");
            }
          })
        }
      })
    },
    saveProfile() {
      this.$refs['userProfileForm'].validate((valid) => {
        if (!valid) {
          this.$message.error("手机号码错误！")
        } else {
          saveProfile(
            this.userId,
            this.userProfileForm.nickName,
            this.userProfileForm.gender,
            this.userProfileForm.telephone,
            this.userProfileForm.addressSelectedOptions.toString(),
            this.userProfileForm.birthday,
          ).then(response => {
            if (response === SystemStatusCode.SUCCESS) {
              sessionStorage.setItem("gender", this.userProfileForm.gender);
              sessionStorage.setItem("nickName", this.userProfileForm.nickName);
              this.$message.success("保存成功!");
            } else {
              this.$message.error("保存失败！");
            }
          })
        }
      })
    },
    handleChange() {
      let loc = "";
      for (let i = 0; i < this.userProfileForm.addressSelectedOptions.length; i++) {
        loc += CodeToText[this.userProfileForm.addressSelectedOptions[i]];
      }
    },
    modifyPassword() {
      this.$refs['userPasswordForm'].validate((valid) => {
        if (!valid) {
          this.$message.error("按要求填写信息！")
        } else {
          modifyPassword(this.username, this.userPasswordForm.oldPassword, this.userPasswordForm.newPassword)
            .then(response => {
              if (response === SystemStatusCode.SUCCESS) {
                this.$message.success("修改成功！")
              } else {
                this.$message.error("密码错误！")
              }
            })
        }
      });
    },
    resetForm() {
      this.$refs['userPasswordForm'].resetFields();
    },
    getProfile() {
      getProfile(JSON.parse(sessionStorage.userInfo).id)
        .then(response => {
          this.userProfileForm.gender = response.gender;
          this.userProfileForm.nickName = response.nickName;
          this.userProfileForm.telephone = response.telephone;
          this.userProfileForm.addressSelectedOptions = response.address === null ? "" : response.address.split(",");
          this.userProfileForm.birthday = response.birthday;
          this.userEmailForm.email = response.email;
        })
    }
  },
  created() {
    this.getProfile();
  }
}
</script>

<style scoped>

</style>
