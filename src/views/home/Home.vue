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
          <p>上次登录时间：<span>2022-02-02</span></p>
          <p>上次登录地址：<span>127.0.0.1</span></p>
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
      ],
      orderData: {
        "data":
          [
            {"Cauchy": 20, "Lucy": 30, "Tom": 50},
            {"Cauchy": 22, "Lucy": 34, "Tom": 56},
            {"Cauchy": 24, "Lucy": 36, "Tom": 58},
            {"Cauchy": 26, "Lucy": 34, "Tom": 52},
            {"Cauchy": 32, "Lucy": 36, "Tom": 59},
            {"Cauchy": 21, "Lucy": 34, "Tom": 57}
          ],
        "date": ["202101", "202102", "202103", "202104", "202105", "202106"]
      }
    }
  },
  mounted() {
    const order = this.orderData
    const xData = order.date
    const keyArray = Object.keys(order.data[0])
    const series = []
    keyArray.forEach(key => {
      series.push({
        name: key,
        data: order.data.map(item => item[key]),
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
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/home";
</style>
