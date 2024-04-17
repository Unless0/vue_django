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

//全局导入富文本编辑器
import VueQuillEditor  from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//将富文本注册为全局可用的组件
Vue.use(VueQuillEditor)

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

// 时间过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
//年月日
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
//时分秒
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// axios挂载到vue原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
