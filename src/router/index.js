import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/login/Login";
import Register from "../views/login/Register";
import ResetPassword from "../views/login/ResetPassword";
import NotFound from "../components/NotFound"
import Main from "../views/Main";
import store from '../store'
import {ruleMapping} from "./dynamic-routers";
import {request} from "@/network/request";

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
    path: '/resetPassword',
    name: 'ResetPassword',
    component: ResetPassword
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
  {
    path: '*',
    redirect: {
      component: NotFound
    }
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register' || to.path === '/resetPassword') {
    next()
  } else {
    const token = sessionStorage.getItem("token")
    const username = sessionStorage.getItem("username")
    if (!token) {
      next({path: '/login'})
    } else {
      request({
        url: '/checkToken',
        method: 'get',
        headers: {
          "token": token,
          "username": username
        }
      }, (response) => {
        if (!response.data) {
          // token 校验失败
          next({path: '/login'})
        }
      })
      next();
    }
  }
})


export function initDynamicRouter() {
  const currentRoutes = router.options.routes
  const menuList = store.state.userMenuList;
  menuList.forEach(item => {
    const tmp = ruleMapping[item.name]
    currentRoutes[4].children.push(tmp)
  })
  router.addRoutes(currentRoutes)
}

export default router
