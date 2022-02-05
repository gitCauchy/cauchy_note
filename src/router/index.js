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
    redirect: 'Login'
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
  base: process.env.BASE_URL,
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem("token")
    const username = sessionStorage.getItem("username")
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
          next({path: '/login'})
        } else { // 校验通过
          console.log(router);
          next()
        }
      }, (response) => {
      })
    }
  }
})

export default router
