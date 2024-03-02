import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './utils/store'
import HTTP from './utils/http'
import Login from './views/Login'
import Index from './views/Index'
import User from "./views/User";
import Branch from "./views/Branch";
import Poster from "./views/Poster";
import Activity from "./views/Activity";
import Commodity from "./views/Commodity";
import Coupon from "./views/Coupon";
import UserCoupon from "./views/UserCoupon";

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Login },
    { path: '/index', component: Index },
    { path: '/user', component: User },
    { path: '/branch', component: Branch },
    { path: '/poster', component: Poster },
    { path: '/activity', component: Activity },
    { path: '/commodity', component: Commodity },
    { path: '/coupon', component: Coupon },
    { path: '/user_coupon', component: UserCoupon }
]

const router = new VueRouter({
    mode: 'hash',
    routes,
})

router.beforeEach(async(to, from, next) => {
    let isLogin = true
    let token = localStorage.getItem('token')
    if (!token) {
        isLogin = false
    } else {
        // 验证token是否有效，有效即是处于登陆状态
        let res = await HTTP.request({
            url: '/token/validate',
            method: 'post',
            data: {
                token: token
            }
        })
        if (res.data.res) {
            isLogin = true
        } else {
            isLogin = false
        }
    }
    if (isLogin) {
        // 已登陆，跳过登陆直接进入首页
        if (to.path === '/') {
            next('/index')
        } else {
            next()
        }
    } else {
        // 先清空登陆信息
        localStorage.clear()
            // 如果访问其他页面，则跳转到登陆页
        if (to.path !== '/') next('/')
        else next()
    }
})

export default router