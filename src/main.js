import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
//导入element-ui
import ElementUI from 'element-ui';
//导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
//注册为全局
Vue.component('tree-table',TreeTable)

Vue.use(ElementUI);
//配置请求的根路径
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器
axios.interceptors.request.use(config => {
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})

// axios挂载到vue原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
