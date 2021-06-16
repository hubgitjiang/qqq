<template>
  <div class="find">
    <!-- 顶部导航 -->
    <van-nav-bar>
      <template #title>
        <h3>发现</h3>
      </template>
    </van-nav-bar>
    <!-- 下拉刷新组件 -->
    <van-pull-refresh v-model="isLoading" @refresh="refresh">
      <!-- 面试技巧 -->
      <div class="skill">
        <findcell title="面试技巧"></findcell>
        <div class="items">
          <technicItem
            :item="item"
            v-for="(item, index) in technicList"
            :key="index"
          ></technicItem>
        </div>
      </div>
      <!-- 市场数据 -->
      <div class="data">
        <findcell title="市场数据" @more="toMarket"></findcell>
        <div class="tags">
          <div class="tag">{{ city }}</div>
          <div class="tag">{{ position }}</div>
        </div>
        <div class="items">
          <div class="item" v-for="(item, index) in showList" :key="index">
            <div class="left">{{ item.year }}</div>
            <div class="center">
              <div
                class="content"
                :style="{
                  width: Math.round((item.salary / topSalary) * 100) + '%'
                }"
              >
                ￥{{ item.salary }}
              </div>
            </div>
            <div class="right">
              <div v-if="item.percent">
                <i
                  v-if="item.percent < 0"
                  style="color: red;"
                  class="iconfont iconicon_xiajiang"
                ></i>
                <i
                  v-else
                  style="color: green;"
                  class="iconfont iconicon_shangsheng"
                ></i>
                {{ Math.abs(item.percent) }}%
              </div>
            </div>
          </div>
        </div>
        <div class="extend">
          <span ref="mymore" v-if="isOpen === false" @click="openmore"
            >展开更多<i class="iconfont iconicon_zhankai"></i
          ></span>
          <span v-else @click="closemore"
            >收起内容<i class="iconfont myicon iconicon_zhankai"></i
          ></span>
        </div>
      </div>
      <!-- 面经分享 -->
      <div class="share">
        <findcell
          @more="$router.push('/shareList')"
          title="面经分享"
        ></findcell>
        <div class="items">
          <shareItem
            :item="item"
            v-for="(item, index) in shareList"
            :key="index"
          ></shareItem>
        </div>
      </div>
      <div class="foot">
        -- 我是有底线的 --
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import findcell from './findcell'
import technicItem from './technicItem'
// 导入获取数据的方法
import { getTechnicApi, getHotApi, getShareApi } from '../../../api/articles.js'
export default {
  name: 'find',
  data () {
    return {
      // 控制展开更多是否打开
      isOpen: false,
      // 面试技巧数据
      technicList: [],
      // 市场数据
      hotList: [],
      city: '',
      position: '',
      topSalary: 0,
      // 显示在页面上的市场数据
      showList: [],
      // 面经分享列表
      shareList: [],
      // 下拉刷新的状态
      isLoading: false
    }
  },
  // 打开页面时可以发送一些网络请求
  created () {
    this.getAllData()
  },
  methods: {
    // 跳转到市场数据
    toMarket () {
      this.$router.push('/market')
    },
    // 下拉刷新时触发的事件
    refresh () {
      // 清除原始数据
      this.isOpen = false
      this.technicList = []
      this.hotList = []
      this.city = ''
      this.position = ''
      this.topSalary = 0
      this.showList = []
      this.shareList = []
      // 重新请求新的数据
      this.getAllData()
    },
    async getAllData () {
      // 得到面试技巧数据
      const resTechnic = await getTechnicApi({
        start: 0,
        limit: 3
      })
      // 保存面试技巧数据
      this.technicList = resTechnic.data.list
      // 得到热门数据
      const resHot = await getHotApi()
      // 保存市场数据
      // 将市场数据进行翻转
      this.hotList = resHot.data.yearSalary.reverse()
      this.city = resHot.data.city
      this.position = resHot.data.position
      this.topSalary = resHot.data.topSalary
      this.showList = this.hotList.slice(0, 4)
      // 得到面经分享数据
      const resShare = await getShareApi({
        start: 0,
        limit: 3
      })
      // 保存面经分享数据
      this.shareList = resShare.data.list
      // 将加载状态改为 false
      this.isLoading = false
    },
    // 展开更多
    openmore () {
      this.isOpen = true
      // 将显示的数组长度变为 7
      this.showList = this.hotList
    },
    // 收起内容
    closemore () {
      this.isOpen = false
      // 将显示的数组长度变为 4
      this.showList = this.hotList.slice(0, 4)
    }
  },
  // 被缓存的页面打开时会执行
  activated () {
    // 取出之前保存的滚动距离，并且让页面滚动到对应的位置
    window.scrollTo(0, this.$route.meta.scrollTop)
  },
  components: {
    findcell,
    technicItem
  }
}
</script>

<style lang="less" scoped>
.find {
  background-color: #f7f4f5;
  padding-bottom: 50px;
  .skill {
    margin-top: 4px;
    background-color: #fff;
    .items {
    }
  }
  .data {
    background-color: #fff;
    margin-top: 10px;
    .tags {
      padding: 25px 15px 20px;
      display: flex;
      flex-wrap: wrap;
      .tag {
        font-size: 14px;
        background: #eceaea;
        padding: 4px 8px;
        margin-right: 10px;
      }
    }
    .items {
      .item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        .left {
          font-size: 14px;
        }
        .center {
          flex: 1;
          height: 12px;
          background-color: #ebdfdf;
          border-radius: 10px;
          margin: 0 10px;
          .content {
            background-color: #fe6d67;
            border-radius: 10px;
            font-size: 12px;
            line-height: 12px;
            color: #fff;
            text-align: right;
          }
        }
        .right {
          font-size: 14px;
          width: 55px;
        }
      }
    }
    .extend {
      display: flex;
      padding: 15px 0px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      i {
        font-size: 12px;
        margin-left: 6px;
      }
      .myicon {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
  .share {
    margin-top: 10px;
    background-color: #fff;
    .items {
    }
  }
  .foot {
    color: #ccc;
    font-size: 14px;
    text-align: center;
    line-height: 50px;
  }
}
</style>
