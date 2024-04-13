import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)
// 挂载
Vue.prototype.$message = Element.Message
Vue.prototype.$confirm = Element.MessageBox.confirm
