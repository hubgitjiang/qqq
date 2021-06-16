<template>
  <div class="info">
    <!-- 头部导航 -->
    <hmnavbar @back="back" title="我的资料"></hmnavbar>
    <div class="userInfo">
      <!-- 用户信息 -->
      <van-cell @click="toEdit('avatar')" title="头像" is-link>
        <template #default>
          <div class="avatar">
            <img :src="baseURL + user.avatar" alt="" />
          </div>
        </template>
      </van-cell>
      <van-cell-group class="group">
        <van-cell
          @click="toEdit('nickname')"
          title="昵称"
          :value="user.nickname"
          is-link
        ></van-cell>
        <van-cell
          title="性别"
          :value="genderObj[user.gender]"
          is-link
          @click="openGender"
        ></van-cell>
        <van-cell
          title="地区"
          :value="areaList.city_list[user.area]"
          is-link
          @click="openArea"
        ></van-cell>
        <van-cell
          @click="toEdit('intro')"
          title="个人简介"
          :value="user.intro"
          is-link
        ></van-cell>
      </van-cell-group>
      <!-- 退出按钮 -->
      <van-button @click="logout" class="btn" color="#ea3a64" plain size="large"
        >退出登录</van-button
      >
    </div>
    <!-- 性别修改面板 -->
    <van-popup v-model="gendershow" position="bottom">
      <!-- 性别 picker 组件 -->
      <van-picker
        v-if="pickerShow"
        show-toolbar
        :columns="columns"
        :default-index="user.gender"
        @confirm="genderConfirm"
        @cancel="genderCancel"
      />
    </van-popup>
    <!-- 地区修改面板 -->
    <van-popup v-model="areashow" position="bottom">
      <!-- 地区面板 -->
      <van-area
        title="标题"
        :area-list="areaList"
        :value="user.area"
        :columns-num="2"
        @confirm="areaConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
// 导入辅助函数
import { mapState, mapMutations, mapActions } from 'vuex'
// 导入城市数据
import { areaList } from '@vant/area-data'
// 导入操作 localstorage 的方法
import { removeLocal } from '../../../utils/local'
// 导入操作用户的 api
import { editUserApi } from '../../../api/login.js'
export default {
  data () {
    return {
      baseURL: process.env.VUE_APP_URL,
      // 城市数据
      areaList: areaList,
      // 控制性别面板的显示与隐藏
      gendershow: false,
      // 设置性别 picker 的数据源
      columns: ['未知', '男', '女'],
      // 控制地区面板的显示与隐藏
      areashow: false,
      // 静态刷新的属性：性别
      pickerShow: true
    }
  },
  computed: {
    ...mapState(['user', 'genderObj'])
  },
  methods: {
    ...mapMutations(['setIsLogin']),
    ...mapActions(['setUser']),
    // 跳转到 editInfo 页面
    toEdit (prop) {
      this.$router.push(`/editInfo?prop=${prop}`)
    },
    // 点击地区面板中的确定按钮时会触发
    async areaConfirm (arr) {
      this.$toast({
        type: 'loading',
        message: '加载中...',
        duration: 0
      })
      // 得到地区面板中的选中的数据
      console.log(arr[1].code)
      // 将数据提交到服务器
      await editUserApi({
        area: arr[1].code
      })
      // 关闭面板
      this.areashow = false
      // 更新用户数据
      this.setUser()
      this.$toast.clear()
    },
    // 打开地区面板
    openArea () {
      this.areashow = true
    },
    // 点击性别面板中的取消按钮会触发
    genderCancel () {
      console.log('取消')
      this.gendershow = false
    },
    // 点击性别面板中的确定按钮会触发
    async genderConfirm (value, index) {
      // 提示
      this.$toast({
        type: 'loading',
        message: '加载中...',
        duration: 0
      })
      // 得到了当前选择的元素下标: index
      // 将性别的下标提交到服务器
      await editUserApi({
        gender: index
      })
      // 关闭面板
      this.gendershow = false
      // // 更新用户信息到 vuex 中（重新请求用户信息）
      // const res = await getUserApi()
      // // 将新的数据保存到 vuex 中
      // this.$store.commit('setUser', res.data)
      this.$store.dispatch('setUser')
      // 关闭提示
      this.$toast.clear()
    },
    // 打开性别面板
    openGender () {
      this.gendershow = true
      // 静默刷新： picker
      this.pickerShow = false
      setTimeout(() => {
        this.pickerShow = true
      }, 100)
    },
    // 退出登录
    logout () {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否退出登录'
        })
        .then(() => {
          // 删除 token
          removeLocal('token')
          // 将 isLogin 改为 false
          this.setIsLogin(false)
          // 跳转回登录页面
          this.$router.push('/login')
        })
        .catch(() => {
          console.log('取消')
        })
    },
    back () {
      // 跳转到回上一个页面：
      this.$router.push('/my')
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  height: 100vh;
  background-color: #f7f4f5;
  .userInfo {
    margin-top: 18px;
    padding: 0 15px;
    /deep/ .van-cell.van-cell--clickable {
      align-items: center;
      border-radius: 6px;
    }
    .avatar {
      display: inline-block;
      vertical-align: bottom;
      width: 40px;
      height: 40px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .group {
      margin-top: 10px;
      border-radius: 6px;
    }
    .btn {
      margin-top: 10px;
      border: none;
      font-weight: 700;
      border-radius: 6px;
    }
  }
}
</style>
