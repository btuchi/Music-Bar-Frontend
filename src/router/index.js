import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InfoView from '../views/InfoView.vue'
import ActivityView from '../views/ActivityView.vue'
import LoginView from '../views/LoginView.vue'
import BranchListView from '../views/BranchListView.vue'
import OrderView from '../views/OrderView.vue'
import OrderSubmit from '../views/OrderSubmit.vue'

import HTTP from '../utils/http'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/activity',
        name: 'activity',
        component: ActivityView
    },
    {
        path: '/info',
        name: 'info',
        component: InfoView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/branchList',
        name: 'branchList',
        component: BranchListView
    },
    {
        path: '/order',
        name: 'order',
        component: OrderView
    },
    {
        path: '/orderSubmit',
        name: 'orderSubmit',
        component: OrderSubmit
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach(async (to, from, next) => {
    let isLogin = true
    let token = localStorage.getItem('token')
    if (!token) {
        isLogin = false
    } else {
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
        if (to.path === '/login') {
            next('/info')
        } else {
            next()
        }
    } else {
        localStorage.clear()
        if (to.path === '/') next()
        else if (to.path === '/login') next()
        else next('/login')
    }
})

export default router