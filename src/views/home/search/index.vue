<template>
  <div class="search">
    <!-- 头部导航 -->
    <hmnavbar @back="$router.push('/shareList')" title="面经搜索"></hmnavbar>
    <!-- 搜索区域 -->
    <van-search
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @search="search"
      @cancel="onCancel"
      shape="round"
    />
    <div v-if="isShowHot">
      <!-- 大家都在搜索 -->
      <div class="hotsearch">
        <van-cell>
          <template #title>
            <h3 class="mytitle">大家都在搜索</h3>
          </template>
        </van-cell>
        <div class="tags">
          <div
            @click="search(item)"
            class="tag"
            v-for="(item, index) in hotList"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <!-- 历史记录 -->
      <div class="hotsearch">
        <van-cell>
          <template #title>
            <h3 class="mytitle">历史记录</h3>
          </template>
          <template #default>
            <span @click="clear">清空</span>
          </template>
        </van-cell>
        <div class="tags">
          <div
            @click="search(item)"
            class="tag"
            v-for="(item, index) in historyList"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="article" v-else>
      <!--
        onload:
          list 组件下拉触底时会执行
          list 组件中没有数据时，初始化也会执行
       -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onload"
      >
        <share-item
          :item="item"
          v-for="(item, index) in shareList"
          :key="index"
        ></share-item>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getHotSearch, getShareApi } from '../../../api/articles'
import { setLocal, getLocal, removeLocal } from '../../../utils/local'
export default {
  data () {
    return {
      // 输入框中的内容
      value: '',
      // 保存热搜数据
      hotList: [],
      // 控制文章与搜索关键字的显示与隐藏
      isShowHot: true,
      // 搜索之后得到的面经分享的数据源
      shareList: [],
      loading: false,
      finished: false,
      start: -5,
      limit: 5,
      total: 0,
      // 搜索历史
      historyList: []
    }
  },
  methods: {
    // 清空搜索历史
    clear () {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要清空搜索历史吗'
        })
        .then(() => {
          // 清除 hsitoryList
          this.historyList = []
          // 清除 localstorage
          removeLocal('history')
        })
        .catch(() => {
          console.log('取消')
        })
    },
    // list 的 load 事件
    async onload () {
      this.start += this.limit
      const res = await getShareApi({
        start: this.start,
        limit: this.limit,
        q: this.value
      })
      // 将数据源进行遍历得到所有的 title 属性
      res.data.list.forEach(item => {
        // 将 item 中的 title 属性中的关键字进行替换
        item.title = item.title.replace(
          this.value,
          `<span style="color:red">${this.value}</span>`
        )
      })
      this.shareList.push(...res.data.list)
      this.total = res.data.total
      // 关闭加载状态
      this.loading = false
      // 判断数据源是否加载完毕
      if (this.shareList.length >= this.total) {
        this.finished = true
      }
    },
    // 点击热搜中的元素会触发
    search (item) {
      // 将关键字赋值给输入框
      this.value = item
      // 隐藏热搜结构
      this.isShowHot = false
      // 将搜索的关键字保存起来
      this.historyList.unshift(item)
      // 数组去重：
      this.historyList = [...new Set(this.historyList)]
      // 限长
      this.historyList.splice(5)
      // 将 historyList 中的数据保存到 localstorage 中
      setLocal('history', JSON.stringify(this.historyList))
    },
    // // 点击手机键盘上的完成按钮会触发
    // // 在谷歌模拟器上：点击回车的效果跟完成是一样的
    // onSearch (value) {
    //   console.log('onSearch')
    //   console.log(value)
    // },
    // 点击右侧的取消按钮时会触发
    onCancel () {
      // 隐藏面经列表 & 将历史搜索显示
      this.isShowHot = true
      // 钭面经列表对应的数据清空
      this.shareList = []
      this.loading = false
      this.finished = false
      this.start = -5
      this.total = 0
    }
  },
  async created () {
    // 得到 localostrage 中的历史数据
    this.historyList = JSON.parse(getLocal('history')) || []
    // 得到热搜数据
    const res = await getHotSearch()
    this.hotList = res.data
  }
}
</script>

<style lang="less" scoped>
.search {
  .hotsearch {
    .mytitle {
      font-size: 20px;
      font-weight: 400;
    }
    .tags {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      .tag {
        background-color: #eceaea;
        padding: 4px 6px;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
}
</style>
