import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Rights from '@/components/Power/Rights.vue'
import Roles from '@/components/Power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/', 
    redirect: '/login',
  },
  
  { 
    path: '/login',
    component: Login
   },
  { 
    path: '/home', 
    component: Home ,
  // 子路由,重定向到welcome
    redirect: '/welcome',
    children:[
    { path: '/welcome', component: Welcome },
    { path: '/users', component: Users },
    { path: '/rights', component: Rights },
    { path: '/roles', component: Roles },
    { path: '/categories', component: Cate },
    { path: '/params', component: Params },
  ]
},


]

const router = new VueRouter({
  routes
})

export default router
