// 给 vue 添加全局功能的插件
// 导入全局组件
import hmnavbar from '../components/hmnavbar.vue'
import shareItem from '../views/home/find/shareItem'
// 导入 dayjs
import dayjs from 'dayjs'
// 导入插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入语言包
import 'dayjs/locale/zh-cn'
// 导入 store
import store from '../store/index.js'
// 导入获取 token 的方法
import { getLocal } from '@/utils/local.js'
// 导入 toast
import { Toast } from 'vant'
// 导入 路由 对象
import router from '@/router/index.js'
// 扩展插件
dayjs.extend(relativeTime)
// 使用语言包
dayjs.locale('zh-cn')

export default function (Vue) {
  // 添加一个全局的组件
  Vue.component(hmnavbar.name, hmnavbar)
  // 添加一个全局的组件
  Vue.component(shareItem.name, shareItem)
  // 添加一个全局的过滤器
  // 将 dayjs 封装为一个全局过滤器：用来将时间从固定时间转为相对时间
  Vue.filter('hmtimefilter', function (value) {
    return dayjs().to(dayjs(value))
  })
  // 添加一个全局方法： $login 用来进行登录验证
  // 返回值；
  //   true: 说明登录过
  //   false: 说明未登录
  Vue.prototype.$login = function () {
    // 登录验证
    // 判断 user 中是否有数据
    if (!store.state.isLogin) {
      // user 中没有数据
      // 判断是否存在 token
      const token = getLocal('token')
      if (token) {
        // 根据 token 发送请求得到用户信息
        store.dispatch('setUser')
        // 将登录状态改为 true
        store.commit('setIsLogin', true)
        return true
      } else {
        // 提示用户未登录
        Toast.fail('对不起，您还没有登录')
        // 跳转到登录页面
        router.push('/login?_redirect=' + window.location.href.split('#')[1])
        return false
      }
    } else {
      // 有数据
      return true
    }
  }
}

// // 导入全局组件
// import hmnavbar from '../components/hmnavbar.vue'
// // 定义一个插件对象
// var pluginObj = {}
// // 定义插件的核心方法
// pluginObj.install = function (Vue) {
//   // 添加全局功能
//   // 添加一个全局的组件
//   Vue.component(hmnavbar.name, hmnavbar)
// }
// // 将插件对象暴露出去
// export default pluginObj
