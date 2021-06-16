import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入得到 token 的方法
import { getLocal } from '../utils/local.js'
// 导入 toast
import { Toast } from 'vant'
// 导入 vuex
import store from '../store'
// 导入获取用户信息的方法
import { getUserApi } from '../api/login.js'

// 导入组件
import usevant from '../views/usevant.vue'
import login from '../views/login/index.vue'
import home from '../views/home/index.vue'
import find from '../views/home/find/index.vue'
import my from '../views/home/my/index.vue'
import question from '../views/home/question/index.vue'
import info from '../views/home/info/index.vue'
import editInfo from '../views/home/editInfo/index.vue'
import shareList from '../views/home/shareList/index.vue'
import search from '../views/home/search/index.vue'
import shareDetail from '../views/home/shareDetail/index.vue'
import market from '../views/home/market/index.vue'
import interview from '../views/home/interview/index.vue'

Vue.use(VueRouter)

// 创建路由选项
const routes = [
  { path: '/usevant', component: usevant },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/my',
    // 设置子路由
    children: [
      {
        path: '/find',
        component: find,
        meta: {
          needTab: true // 标记当前路由是否需要底部的标签栏
        }
      },
      {
        path: '/my',
        component: my,
        meta: {
          needLogin: true, // 标识当前路由需要登录
          needTab: true
        }
      },
      {
        path: '/question',
        component: question,
        meta: {
          needLogin: true, // 标识当前路由需要登录
          needTab: true
        }
      },
      {
        path: '/info',
        component: info,
        meta: {
          needLogin: true
        }
      },
      {
        path: '/editInfo',
        component: editInfo,
        meta: {
          needLogin: true
        }
      },
      {
        path: '/shareList',
        component: shareList
      },
      {
        path: '/search',
        component: search
      },
      {
        path: '/shareDetail/:id',
        component: shareDetail
      },
      {
        path: '/market',
        component: market
      },
      {
        path: '/interview/:type/:city',
        component: interview,
        meta: {
          needLogin: true
        }
      }
    ]
  }
]

// 如果在子路由中添加 /:
//  将来访问这个子路由时，直接访问 / 对应的路径：
//    find => /find     my => /my
// 如果在子路由中不加 /:
//  将来访问这个子路由时，就需要添加父路由的路径了
//    find => /home/find   my => /home/my

// 创建路由实例
const router = new VueRouter({
  routes
})

// 添加导航守卫
// 前置导航守卫
// to：（去哪里）跳转到哪个路由
// form：（从哪里来）从哪个路由中跳转的
// next：是否执行后续的代码
router.beforeEach(async (to, from, next) => {
  // 假设现在是从发现跳转到我的（需要将发现页面的滚动距离记录下来）
  from.meta.scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  // 得到要跳转的路由的元素信息中的 needLogin
  var needLogin = to.meta.needLogin
  // 判断 needLogin
  if (needLogin) {
    // 需要登录：判断 token
    // 得到 token
    var token = getLocal('token')
    if (token) {
      // token 存在：判断 user 中是否存在数据
      if (store.state.isLogin) {
        // 有：向下执行
        next()
      } else {
        // 无：根据 token 重新得到用户信息保存到 vuex 中
        // 发送网络请求
        const res = await getUserApi(token)
        // 重新将用户信息存入到 vuex 中
        store.commit('setUser', res.data)
        store.commit('setIsLogin', true)
        // 向下执行
        next()
      }
    } else {
      // token 不存在
      // 提示未登录，跳转到登录页面
      Toast.fail('对不起，您还未登录')
      // 在跳转到登录页面之前，应该将当前页面路由保存起来
      next('/login?_redirect=' + to.fullPath)
    }
  } else {
    // 不需要登录：向下执行
    next()
  }
})

// 后置钩子
router.afterEach((to, from) => {
  // 直接滚动到页面的顶部
  window.scrollTo(0, 0)
})

export default router
