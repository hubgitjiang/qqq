// 导入 vue
import Vue from 'vue'
// 导入根组件： app
import App from './App.vue'
// 导入路由
import router from './router'
// 导入 vuex
import store from './store' // 暂时还未用过
// 导入 vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入 flexible
import 'amfe-flexible'
// 统一样式
import 'normalize.css'
// 导入字体图标
import './style/iconfont.css'
// // 导入全局组件
// import hmnavbar from './components/hmnavbar.vue'
// // 注册全局组件
// Vue.component(hmnavbar.name, hmnavbar)
// 导入插件
import plugin from './utils/plugin'

// 使用插件
Vue.use(plugin) // plugin.install(Vue)
// 使用 vant
Vue.use(Vant)
Vue.config.productionTip = false

// 创建了一个 vue 实例
new Vue({
  router, // 挂载路由
  store, // 挂载 vuex
  render: h => h(App) // 将根组件渲染到 vue 实例中
}).$mount('#app') // 与  el: '#app' 的作用一样
