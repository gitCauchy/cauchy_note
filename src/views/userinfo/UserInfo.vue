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
import {getProfile, modifyPassword, saveProfile} from "@/api/userinfo";
import {SystemStatusCode} from "@/common/const";
import {regionData, CodeToText} from "element-china-area-data";

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
    }

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
    return {
      userId: JSON.parse(sessionStorage.userInfo).id,
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
              sessionStorage.setItem("nickName",this.userProfileForm.nickName);
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
