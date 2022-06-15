import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/login/Login";
import Register from "../views/login/Register";
import ResetPassword from "../views/login/ResetPassword";
import Main from "../views/Main";
import {checkToken} from "@/api/login";

const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    label: '登录',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    label: '注册',
    name: 'Register',
    component: Register
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    label: '重置密码',
    component: ResetPassword
  },
  {
    path: '/',
    redirect: 'Login'
  },
  {
    path: '/home',
    name: 'Main',
    label: '主页',
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
    label: '404',
    component: () => import('../components/NotFound')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (to.path === '/login' || to.path === '/register' || to.path === '/resetPassword') {
    sessionStorage.clear();
    next()
  } else {
    const token = sessionStorage.token
    const username = sessionStorage.getItem("username")
    if (!token) {
      next({path: '/login'})
    } else {
      checkToken(token, username)
        .then(response => {
          if (!response) {
            next({path: '/login'})
          } else {
            next(to);
          }
        })
      next();
    }
  }
})

export default router
