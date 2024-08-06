import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'
import UserHouse from '../views/HousingResource'
import User from '../views/User'
import Login from '../views/Login'
import AdminHouse from '../views/AdminHouse'
import My from '../views/My.vue'
import MyPw from '../views/MyPw.vue'
import AdminReserve from '@/views/AdminReserve.vue'
import UserReserve from '@/views/UserReserve.vue'
import UserOrder from '@/views/UserOrder.vue'
import QuitOrder from '@/views/QuitOrder.vue'
import Renting from '@/views/Renting.vue'
import QuitApply from '@/views/QuitApply.vue'
import AdminRepair from '@/views/AdminRepair.vue'
import UserRepair from '@/views/UserRepair.vue'
import HomePage from '@/views/HomePage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'Login',
    component:Login
  },
  {
    // 主页
    path: '/',
    name: 'Layout',
    component: Layout,
    // 默认显示房源页面
    redirect:'/homepage',
    children:[
      {
        path: '/homepage',
        name: '/homepage',
        component: HomePage
      },
      {
        path: 'userhouse',
        name: 'userhouse',
        component: UserHouse
      },
      {
        path: 'adminhouse',
        name: 'adminhouse',
        component: AdminHouse
      },
      {
        path: 'uuser',
        name: 'uuser',
        component: User
      },
      {
        path: 'My',
        name: 'my',
        component: My
      },
      {
        path: 'MyPw',
        name: 'mypw',
        component: MyPw
      },
      {
        path: 'areserve',
        name: 'areserve',
        component: AdminReserve
      },
      {
        path: 'ureserve',
        name: 'ureserve',
        component: UserReserve
      },
      {
        path: '/renting',
        name: 'renting',
        component: Renting
      },
      {
        path: 'quitorder',
        name: 'quitorder',
        component: QuitOrder
      },
      {
        path: 'userorder',
        name: 'userorder',
        component: UserOrder
      },
      {
        path: 'quitapply',
        name: 'quitapply',
        component: QuitApply
      },
      {
        path: 'adminrepair',
        name: 'adminrepair',
        component: AdminRepair
      },
      {
        path: 'userrepair',
        name: 'userrepair',
        component: UserRepair
      },
    ]
  },
  
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 路由守卫（通用但仍然不安全，使用jwt认证才安全）
// 鉴权放在前端是不安全的，我们登录的鉴权肯定要放在服务端来完成
router.beforeEach((to,from,next)=>{
  // 先尝试获取已经登录的用户信息
  const user=localStorage.getItem("user");
  // 如果没有用户信息，证明没有登录，在这种情况下，当要去的路由不是登录页面或注册页面时
  if(!user && to.path !=='/login'){
    // 则强行将路由跳转到登录页面
    return next("/login");
  }
  next();
})

export default router
