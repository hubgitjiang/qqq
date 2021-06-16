<template>
  <div class="question">
    <!-- 头部导航 -->
    <van-dropdown-menu>
      <van-dropdown-item ref="mycity">
        <template #title>
          <div class="box">
            面试宝典
            <span>{{ selCity }}</span>
          </div>
        </template>
        <van-index-bar>
          <template v-for="(value, key) in cityList">
            <van-index-anchor :index="key" :key="key" />
            <van-cell
              @click="changeCity(item)"
              v-for="(item, index) in value"
              :title="item"
              :key="index + key"
            />
          </template>
        </van-index-bar>
      </van-dropdown-item>
    </van-dropdown-menu>
    <!-- 岗位区域 -->
    <div class="positionbox">
      <div
        class="tags"
        :class="{ active: currentIndex === index }"
        v-for="(item, index) in postionList"
        :key="index"
        @click="changeIndex(index)"
      >
        {{ item.name }}
      </div>
    </div>
    <!-- 刷题区域 -->
    <div class="contentbox">
      <div class="one item">
        <i class="iconfont iconicon_mine_cuoti"></i>
        <span>常错题库</span>
      </div>
      <div class="two item">
        <i class="iconfont iconicon_mine_tikushoucang"></i>
        <span>收藏题库</span>
      </div>
      <div class="three item">
        <i class="iconfont iconicon_mine_qiyeshoucang"></i>
        <span>企业题库</span>
      </div>
      <div class="four item">
        <i class="iconfont iconicon_mine_mianjing"></i>
        <span>已答题库</span>
      </div>
      <div class="center">
        <van-circle
          class="circle"
          v-model="currentRate"
          stroke-width="70"
          layer-color="transparent"
          :rate="rate"
          :speed="100"
        >
          <template>
            <div class="text">
              <div class="title">顺序刷题</div>
              <div class="num">{{ rightNum }}/{{ totalNum }}</div>
            </div>
          </template>
        </van-circle>
      </div>
    </div>
    <!-- 累计收录 -->
    <div class="total">
      <div class="text">累计收录</div>
      <div class="num">{{ totalNum }}</div>
    </div>
    <!-- 按钮区域 -->
    <div class="btn">
      <van-button
        @click="toInterview"
        class="mybtn"
        size="large"
        color="#00b8d4"
        >模拟面试</van-button
      >
    </div>
  </div>
</template>

<script>
// 导入网络请求的接口
import { getQuestionDataApi } from '@/api/question.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      currentRate: 0,
      // 设置环形进度条的初始值
      rate: 0,
      // 城市数据源
      cityList: {},
      // 岗位数据源
      cityPosition: {},
      // 选中的城市
      selCity: '',
      // 选中城市下的岗位列表
      postionList: [],
      // 设置选中岗位的下标
      currentIndex: 0,
      // 定义一个所有的题目
      totalCount: 0,
      // 设置正确题数 & 总题数的默认过滤值 0
      rightNum: 0,
      totalNum: 0
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 跳转到模拟面试页面
    toInterview () {
      this.$router.push(
        `/interview/${this.postionList[this.currentIndex].id}/${this.selCity}`
      )
    },
    // 让数字从 0 加到对应的值
    myanimat () {
      // 设置一个总时长： 2000
      var totalTime = 2000
      // 将正确数从 0 加到 user.correctQuestions.length  25
      var timer1 = setInterval(() => {
        this.rightNum += 1
        // 如果 rightNum === user.correctQuestions.length ,清除定时器
        if (this.rightNum >= this.user.correctQuestions.length) {
          clearInterval(timer1)
        }
      }, totalTime / this.user.correctQuestions.length)
      // 将总数从 0 加到 totalCount 156
      var timer2 = setInterval(() => {
        this.totalNum += 1
        // 如果 rightNum === user.correctQuestions.length ,清除定时器
        if (this.totalNum >= this.totalCount) {
          clearInterval(timer2)
        }
      }, totalTime / this.totalCount)
      // 等待数字动画结束之后，将环形进度条动起来
      setTimeout(() => {
        this.rate = Math.round(
          (this.user.correctQuestions.length / this.totalCount) * 100
        )
      }, 2000)
    },
    // 修改城市
    changeCity (item) {
      // 修改选中的城市
      this.selCity = item
      // 修改城市对应的岗位
      this.postionList = this.cityPosition[this.selCity]
      // 重置选中的岗位
      this.currentIndex = 0
      // 关闭下拉菜单
      this.$refs.mycity.toggle()
    },
    // 修改岗位
    changeIndex (index) {
      this.currentIndex = index
    }
  },
  async created () {
    this.$toast({
      type: 'loading',
      message: '加载中...',
      duration: 0
    })
    // 得到城市 & 岗位数据
    const res = await getQuestionDataApi()
    // 保存数据
    this.cityList = res.data.citys
    this.cityPosition = res.data.cityPositions
    // 设置默认选中的城市
    this.selCity = this.cityList['全国'][0]
    // 设置选中城市下的岗位列表
    this.postionList = this.cityPosition[this.selCity]
    // 设置总题数
    this.totalCount = res.data.totalCount
    this.$toast.clear()
    // 开启动画
    this.myanimat()
  }
}
</script>

<style lang="less" scoped>
.question {
  background-color: #f7f4f5;
  height: 100vh;
  /deep/ .van-index-anchor {
    background-color: #ccc;
  }
  .box {
    span {
      font-size: 12px;
    }
  }
  .positionbox {
    display: flex;
    background-color: #fff;
    flex-wrap: nowrap;
    padding: 20px;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .tags {
      flex-shrink: 0; // 如果子元素的总长度超过一行，不需要子元素等比例缩小
      font-size: 12px;
      padding: 4px 6px;
      background-color: #ccc;
      border-radius: 20px;
      margin-right: 10px;
    }
    .active {
      background-color: red;
      color: #fff;
    }
  }
  .contentbox {
    position: relative;
    height: 200px;
    background-color: #fff;
    margin-top: 10px;
    .item {
      font-size: 12px;
      display: flex;
      flex-direction: column;
      text-align: center;
      position: absolute;
      i {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        line-height: 44px;
      }
      span {
        margin-top: 5px;
      }
    }
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      transform: translate(-50%, -50%);
      background-image: url('../../../assets/编组@2x.png');
      background-size: 100%;
      .circle {
        padding: 10px;
        box-sizing: border-box;
      }
      .text {
        width: 80px;
        height: 80px;
        background-color: #f23a66;
        border-radius: 50%;
        color: #fff;
        .title {
          font-size: 14px;
          font-weight: 700;
          padding-top: 20px;
        }
        .num {
          font-size: 14px;
          padding-top: 10px;
        }
      }
    }
    .one {
      top: 17px;
      left: 42px;
      i {
        background-color: #ff5a5a;
      }
    }
    .two {
      top: 18px;
      right: 42px;
      i {
        background-color: #ffc403;
      }
    }
    .three {
      bottom: 17px;
      left: 42px;
      i {
        background-color: #00cde2;
      }
    }
    .four {
      bottom: 18px;
      right: 42px;
      i {
        background-color: #28d18c;
      }
    }
  }
  .total {
    margin-top: 10px;
    height: 130px;
    background-color: #fff;
    text-align: center;
    .text {
      font-size: 16px;
      padding-top: 20px;
    }
    .num {
      font-size: 24px;
      padding-top: 30px;
    }
  }
  .btn {
    margin: 15px;
    .mybtn {
      border-radius: 6px;
    }
  }
}
</style>
