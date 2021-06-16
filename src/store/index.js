import Vue from 'vue'
import Vuex from 'vuex'
// 导入获取用户信息的方法
import { getUserApi } from '../api/login.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 保存数据
  state: {
    // 保存登录之后的用户信息
    user: '',
    // 用来表示用户是否登录、
    isLogin: false,
    // 数字与性别的对应关系
    genderObj: {
      0: '未知',
      1: '男',
      2: '女'
    }
  },
  // 相当于 state 的计算属性
  getters: {
    // 再给两个属性封装为一个共同的属性
    getState (state) {
      return function (id, prop) {
        return state.user[prop] && state.user[prop].includes(+id)
      }
    },
    // 注意点：getters 不允许带参数
    // 得到收藏的状态
    collectState (state) {
      return function (id) {
        return (
          state.user.collectArticles && state.user.collectArticles.includes(+id)
        )
      }
    },
    // 得到点赞状态
    starState (state) {
      return function (id) {
        return state.user.starArticles && state.user.starArticles.includes(+id)
      }
    }
  },
  // 修改数据
  mutations: {
    // 给 user 赋值
    setUser (state, payload) {
      state.user = payload
    },
    // 给 isLogin 赋值
    setIsLogin (state, payload) {
      state.isLogin = payload
    }
  },
  actions: {
    // 重新给 user 赋值
    async setUser (context) {
      // 1.0 发送网络请求到服务器获取用户信息
      const res = await getUserApi()
      // 2.0 将用户信息交给 mutations
      context.commit('setUser', res.data)
    }
  },
  modules: {}
})
