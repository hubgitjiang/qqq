<template>
  <div class="home">
    <!-- 路由出口 -->
    <keep-alive include="find">
      <router-view></router-view>
    </keep-alive>
    <!-- 底部的 tab栏 -->
    <van-tabbar
      v-if="$route.meta.needTab"
      v-model="active"
      active-color="red"
      route
    >
      <van-tabbar-item icon="home-o"
        >公司
        <template #icon>
          <i class="iconfont myicon iconicon_footbar_gs_sel"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="search" to="/question"
        >刷题
        <template #icon>
          <i class="iconfont myicon iconicon_footbar_st_sel"></i> </template
      ></van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/find"
        >发现
        <template #icon>
          <i class="iconfont myicon iconicon_footbar_fx_nor"></i> </template
      ></van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/my"
        >我的
        <template #icon>
          <i class="iconfont myicon iconicon_footbar_wode_nor"></i> </template
      ></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .myicon {
    font-size: 25px;
  }
}
</style>
