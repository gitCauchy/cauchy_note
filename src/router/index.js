import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Register from "../components/Register";
import Main from "../views/Main";
import {request} from "../network/request";

const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    redirect:'Login'
  },
  {
    path: '/home',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/Home')
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    sessionStorage.clear()
    next()
  } else {
    let token = sessionStorage.getItem("token")
    let username = sessionStorage.getItem("username")
    if (!token) {
      next({path: '/login'})
    } else {
      // 发送请求校验 token 是否合法
      request({
        url: '/checkToken',
        method: 'get',
        headers: {
          "token": token,
          "username": username
        }
      }, (response) => {
        if (!response.data) {
          console.log('校验失败');
          next({path: '/login'})
        }
      }, (response) => {
        this.$message.error("网络错误！")
      })
      next()
    }
  }
})

export default router
