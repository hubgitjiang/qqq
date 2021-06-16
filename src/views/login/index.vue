<template>
  <div class="login">
    <!-- 顶部导航 -->
    <hmnavbar @back="back"></hmnavbar>
    <!-- 底部表单 -->
    <div class="form">
      <h3>您好，请登录</h3>
      <van-form @submit="login" ref="myform">
        <van-field
          v-model="user.phone"
          placeholder="请输入手机号"
          :rules="rules.phone"
          name="phone"
        >
          <template #left-icon>
            <i class="iconfont iconbianzu1 formicon"></i>
          </template>
        </van-field>
        <van-field
          v-model="user.code"
          placeholder="请输入验证码"
          :rules="rules.code"
        >
          <template #left-icon>
            <i class="iconfont iconyanzhengma formicon"></i>
          </template>
          <template #button>
            <span v-if="totalTime === 6" @click="getCode" class="mycolor"
              >获取验证码</span
            >
            <span v-else>{{ totalTime }}s 后重试</span>
          </template>
        </van-field>
        <div class="xieyi">
          登录即同意<span class="mycolor">《用户使用协议》</span>和<span
            class="mycolor"
            >《隐私协议》</span
          >
        </div>
        <div class="btn">
          <van-button class="sure" size="large" color="#e40137"
            >确定</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
// 导入自己封装的方法
import { getCodeApi, loginApi } from '../../api/login.js'
// 导入 localstroage 的操作方法
import { setLocal } from '../../utils/local'
// 导入子组件
// import hmnavbar from '../../components/hmnavbar'
export default {
  data () {
    return {
      // 设置表单中的值
      user: {
        phone: '18888881111',
        code: ''
      },
      // 设置验证规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'onBlur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号',
            trigger: 'onBlur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'onBlur' },
          {
            pattern: /^\d{4}$/,
            message: '验证码的长度为4',
            trigger: 'onBlur'
          }
        ]
      },
      // 环境变量
      baseURL: process.env.VUE_APP_URL,
      // 设置倒计时的参数
      totalTime: 6
    }
  },
  methods: {
    back () {
      // 跳转到发现页面
      this.$router.push('/find')
    },
    // 获取码证码
    getCode () {
      // 1.0 验证手机号是否合法
      this.$refs.myform.validate(['phone']).then(async () => {
        // 设置一个定时器：用来进行倒计时
        const interval = setInterval(() => {
          this.totalTime--
          if (this.totalTime <= 0) {
            // 清除定时器
            clearInterval(interval)
            // 重置时间
            this.totalTime = 6
          }
        }, 1000)
        // 添加一个提示信息
        this.$toast({
          type: 'loading',
          message: '加载中...',
          duration: 0
        })
        // 验证成功
        try {
          // 2.0 发送请求到服务器得到验证码
          const res = await getCodeApi({
            mobile: this.user.phone
          })
          // 提示用户验证码
          this.$toast(res.data)
          // 自动填充验证码
          this.user.code = res.data
        } catch {
          console.log('服务器异常')
        }
      })
    },
    // 点击确定时，触发的登录方法
    async login () {
      // 开启提示
      this.$toast({
        type: 'loading',
        message: '加载中...',
        duration: 0
      })
      try {
        // 调用登录接口
        const res = await loginApi({
          mobile: this.user.phone,
          code: this.user.code
        })
        // 返回的数据中有两条关键信息：
        //  jwt：登录成功后用户的 token
        //  user：当前登录用户的个人信息
        // 登录成功之后要完成以下三件事件：
        // 2.0 保存用户的 token （保存到 localStorage 中）
        setLocal('token', res.data.jwt)
        // 3.0 保存用户信息(保存到 vuex 中)
        this.$store.commit('setUser', res.data.user)
        // 关闭加载效果
        this.$toast.clear()
        // 4.0 将用户的登录状态改为 true
        this.$store.commit('setIsLogin', true)
        // 判断：当前路径中是否存在参数： _redirect
        // console.log(this.$route.query._redirect)
        const redirect = this.$route.query._redirect
        if (redirect) {
          // 保存了路径，就跳转到路径对应的页面中
          this.$router.push(redirect)
        } else {
          // 没有保存路径，就跳转到 my 页面
          this.$router.push('/my')
        }
      } catch {
        console.log('服务器异常')
      }
    }
  }
  // components: {
  //   hmnavbar
  // }
}
</script>

<style lang="less" scoped>
.login {
  .form {
    padding: 0 15px;
    h3 {
      font-size: 18px;
      padding: 50px 0;
    }
    .formicon {
      margin-right: 15px;
    }
    .mycolor {
      color: #00b8d4;
    }
    .xieyi {
      font-size: 12px;
      margin-top: 15px;
    }
    .btn {
      margin-top: 44px;
      .sure {
        border-radius: 30px;
      }
    }
  }
}
</style>
