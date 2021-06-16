<template>
  <div class="shareList">
    <!-- 头部导航 -->
    <hmnavbar @back="$router.push('/find')" title="我分享的面经"></hmnavbar>
    <!-- 搜索模块 -->
    <div class="search" @click="$router.push('/search')">
      <i class="iconfont iconicon_search"></i>
      <span>请输入关键字</span>
    </div>
    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onload"
    >
      <share-item
        :item="item"
        v-for="(item, index) in list"
        :key="index"
      ></share-item>
    </van-list>
  </div>
</template>

<script>
import { getShareApi } from '../../../api/articles'
export default {
  data () {
    return {
      // 面经分享的数据源
      list: [],
      // list 组件的状态
      loading: false,
      // list 中数组源的状态
      finished: false,
      // 定义分页的数据
      // 开始的下标
      start: -5,
      // 页容量
      limit: 5,
      // 数据的总条数
      total: 0
    }
  },
  methods: {
    // list 组件被加载 & 上拉触底时会触发
    async onload () {
      // 将开始的下标添加上页容量
      this.start += this.limit
      const res = await getShareApi({
        start: this.start,
        limit: this.limit
      })
      // 保存数据
      // this.list = res.data.list
      // 拼接数据源
      this.list.push(...res.data.list)
      this.total = res.data.total
      // 关闭加载状态
      this.loading = false
      // 判断数据源是否加载完毕
      if (this.list.length === this.total) {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.shareList {
  .search {
    margin: 10px 15px;
    height: 34px;
    background-color: #f7f4f5;
    border-radius: 20px;
    font-size: 14px;
    color: #c4c3c3;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 20px;
      margin-right: 6px;
    }
  }
}
</style>
