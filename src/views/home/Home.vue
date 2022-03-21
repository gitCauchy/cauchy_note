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
        <div class="login-info">
          <p>当前日期：<span>{{ current_date }}</span></p>
          <p>当前时间：<span>{{ current_time }}</span></p>
        </div>
      </el-card>
      <el-card style="margin-top:20px;height: 230px">
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
      <el-card shadow="hover" style="height: 350px">
        <div style="height: 280px" ref="echarts"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import * as echars from 'echarts'
import {request} from "../../network/request";

export default {
  name: "Home",
  data() {
    return {
      userId: sessionStorage.getItem("user_id"),
      username: sessionStorage.getItem("username"),
      userRole: sessionStorage.getItem("userRole"),
      tableData: null,
      tableLabel: {
        name: '用户',
        weekAdd: '本周新增',
        monthAdd: '本月新增',
        yearAdd: '本年新增',
      },
      countData: [
        {
          name: '本周登录次数',
          value: null,
          icon: 'time',
          color: '#2ec7c9'
        },
        {
          name: '本月登录次数',
          value: null,
          icon: 'success',
          color: '#2ec754'
        },
        {
          name: '本年登录次数',
          value: null,
          icon: 'key',
          color: '#00F5FF'
        },
        {
          name: '本周新增笔记',
          value: null,
          icon: 'position',
          color: '#FF8247'
        },
        {
          name: '本月新增笔记',
          value: null,
          icon: 'reading',
          color: '#FFAEB9'
        },
        {
          name: '本年笔记总数',
          value: null,
          icon: 'mouse',
          color: '#EE5C42'
        }
      ],
      trendData: null,
      current_time: null,
      current_date: null,
    }
  },
  created() {
    const current = new Date()
    this.current_time = current.toLocaleTimeString()
  },
  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.current_date = this.getDate(); // 修改数据date
      _this.current_time = this.getTime()
    }, 1000)
    request({
      url: '/article/getCountData',
      method: 'get',
      params: {
        "authorId": this.userId
      }
    }, (response) => {
      this.countData[0].value = response.data.userLoginData.countOfWeek;
      this.countData[1].value = response.data.userLoginData.countOfMonth;
      this.countData[2].value = response.data.userLoginData.countOfYear;
      this.countData[3].value = response.data.userArticleData.countOfWeek;
      this.countData[4].value = response.data.userArticleData.countOfMonth;
      this.countData[5].value = response.data.userArticleData.countOfYear;
    }, (failure) => {
      console.log(failure);
    })
    request({
      url: '/article/getTableData',
      method: 'get',
    }, (response) => {
      //console.log(response.data);
      this.tableData = response.data
    }, (failure) => {
      console.log(failure);
    })
    request({
      url: '/article/getTrendData',
      method: 'get',
    }, (response) => {
      this.trendData = response.data
      const datas = this.trendData
      const xData = datas.dates
      const keyArray = Object.keys(datas.data[0])
      const series = []
      keyArray.forEach(key => {
        series.push({
          name: key,
          data: datas.data.map(item => item[key]),
          type: 'line'
        })
      })

      const option = {
        xAxis: {
          data: xData
        },
        yAxis: {},
        legend: {
          data: keyArray
        },
        series
      }
      const E = echars.init(this.$refs.echarts)
      E.setOption(option)
    }, (failure) => {
      console.log(failure);
    })
  },
  methods: {
    getTime() {
      let date1 = new Date();
      let hours = date1.getHours();
      let minutes = date1.getMinutes();
      let seconds = date1.getSeconds();
      return hours + ":" + minutes + ":" + seconds
    },
    getDate() {
      let date1 = new Date();
      let year = date1.getFullYear();
      let month = date1.getMonth() + 1;
      let day = date1.getDate();
      return year + "年" + month + "月" + day + "日"
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/home";
</style>
