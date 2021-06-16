// 专门用来封装 axios 对象，这个对象专门用来发送网络请求
// 导入 axios
import axios from 'axios'
// 导入 toast
import { Toast } from 'vant'
// 导入删除 token 的方法
import { removeLocal, getLocal } from './local.js'
// 导入 store
import store from '../store'
// 导入 router
import router from '../router'
// 创建一个 axios 对象
const request = axios.create({
  // 设置基地址
  baseURL: process.env.VUE_APP_URL
})
// 给 axios 设置拦截器
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 判断当前请求是否需要携带 token
    if (config.needToken) {
      // 获取 token
      const token = getLocal('token')
      if (token) {
        // 给请求信息的请求头中统一携带 token
        config.headers.authorization = `Bearer ${token}`
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 判断服务器中的返回数据的状态 code
    // 得到返回的状态：
    const code = response.data.code
    // 判断：
    // 200：说明服务器响应正常，直接返回 response.data
    if (code === 200) {
      return response.data
    } else if (code === 401 || code === 403) {
      // 401 & 403： 说明登录出现异常：提示 & 删除 token & 修改登录状态 & 返回登录页面 & 返回错误数据
      // 提示错误信息
      Toast.fail('登录异常')
      // 删除 token
      removeLocal('token')
      // 将修改状态改为： false
      store.commit('setIsLogin', false)
      // 返回登录页面
      router.push('/login')
      // 返回数据给页面中的 res
      return Promise.reject(new Error(response.data.message))
    } else {
      // 其它状态：直接返回错误信息
      Toast.fail(response.data.message)
      // 返回数据给页面中的 res
      return Promise.reject(new Error(response.data.message))
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 暴露 axios 对象
export default request
