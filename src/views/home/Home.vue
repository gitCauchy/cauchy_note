<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/img/user.jpg" alt="用户头像"/>
          <div class="userinfo">
            <p class="name">{{ username }}</p>
            <p class="access">{{ userRole }}</p>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top:20px;height: 460px">
        <el-table :data="tableData">
          <el-table-column
            show-overflow-tooltip
            v-for="(val ,key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          shadow="hover"
          v-for="item in countData"
          :key="item.name"
          :body-style="{display:'flex',padding:0}">
          <i class="icon" :class="`el-icon-${item.icon}`" :style="{background:item.color}"/>
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover" style="height: 280px"></el-card>
      <div class="graph">
        <el-card shadow="hover" style="height: 260px"></el-card>
        <el-card shadow="hover" style="height: 260px"></el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      username: sessionStorage.getItem("username"),
      userRole: sessionStorage.getItem("userRole"),
      tableData: [
        {
          name: "Cauchy",
          todayAdd: 100,
          monthAdd: 300,
          totalAdd: 800
        },
        {
          name: "Lucy",
          todayAdd: 100,
          monthAdd: 300,
          totalAdd: 800
        },
        {
          name: "Tom",
          todayAdd: 100,
          monthAdd: 300,
          totalAdd: 800
        },
        {
          name: "Maria",
          todayAdd: 100,
          monthAdd: 300,
          totalAdd: 800
        },
        {
          name: "Json",
          todayAdd: 100,
          monthAdd: 300,
          totalAdd: 800
        },
        {
          name: "NewTon",
          todayAdd: 100,
          monthAdd: 300,
          totalAdd: 800
        }
      ],
      tableLabel: {
        name: '用户',
        todayAdd: '今日新增',
        monthAdd: '本月新增',
        totalAdd: '总计数',
      },
      countData: [
        {
          name: '今日登录次数',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '本月登录次数',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '总计登录次数',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '今日新增笔记',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '本月新增笔记',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '笔记总数',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/home";
</style>
