<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img v-if="gender===0" src="../../assets/img/user_man.jpg" alt="用户头像"/>
          <img v-if="gender===1" src="../../assets/img/user_woman.jpg" alt="用户头像"/>
          <div class="userinfo">
            <p class="name">{{ displayName }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>当前日期：<span>{{ date|formatDate }}</span></p>
          <p>当前时间：<span>{{ date|formatTime }}</span></p>
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
import * as echarts from 'echarts';
import {formatDate, formatTime} from "@/utils/date";
import {getTableData, getCountData, getTrendData} from "@/api/home";

export default {
  name: "Home",
  data() {
    return {
      date: new Date(),
      displayName: JSON.parse(sessionStorage.profile).nickName === "" ?
        JSON.parse(sessionStorage.userInfo).username : JSON.parse(sessionStorage.profile).nickName,
      gender: null,
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
    }
  },
  filters: {
    formatDate: formatDate,
    formatTime: formatTime
  },
  created() {
    this.gender = Number(sessionStorage.getItem("gender"));
  },
  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000)
    getCountData(JSON.parse(sessionStorage.userInfo).id)
      .then(response => {
        this.countData[0].value = response.userLoginData.countOfWeek;
        this.countData[1].value = response.userLoginData.countOfMonth;
        this.countData[2].value = response.userLoginData.countOfYear;
        this.countData[3].value = response.userArticleData.countOfWeek;
        this.countData[4].value = response.userArticleData.countOfMonth;
        this.countData[5].value = response.userArticleData.countOfYear;
      })
    getTableData()
      .then(response => {
        this.tableData = response
      })
    getTrendData()
      .then(response => {
        this.trendData = response
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
        const E = echarts.init(this.$refs.echarts)
        E.setOption(option)
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
