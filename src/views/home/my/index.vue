<template>
  <div class="my" v-if="user && user.nickname">
    <!-- 个人信息 -->
    <div class="userInfo">
      <div class="user">
        <div class="left">
          <div class="name">{{ user.nickname }}</div>
          <div class="mark">{{ user.intro }}</div>
        </div>
        <div class="right" @click="toInfo">
          <img :src="baseURL + user.avatar" alt="" />
        </div>
      </div>
      <div class="data">
        <div class="item">
          <div class="num">{{ user.submitNum }}</div>
          <div class="title">累计答题</div>
        </div>
        <div class="item">
          <div class="num">{{ user.collectQuestions.length }}</div>
          <div class="title">收藏题目</div>
        </div>
        <div class="item">
          <div class="num">{{ user.errorQuestions.length }}</div>
          <div class="title">我的错题</div>
        </div>
        <div class="item">
          <div class="num">
            {{
              Math.round(
                ((user.submitNum - user.errorNum) / user.submitNum) * 100
              ) + '%'
            }}
          </div>
          <div class="title">正确率</div>
        </div>
      </div>
      <div class="position">
        <van-cell
          @click="toEdit"
          class="mycell"
          title="我的岗位"
          :value="user.position"
          is-link
        >
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
      </div>
    </div>
    <!-- 其它数据 -->
    <div class="other">
      <div class="face">
        <h3>面经数据</h3>
        <div class="items">
          <div class="item">
            <div class="top">
              昨日阅读<span>+{{ user.shareData.read.yesterday }}</span>
            </div>
            <div class="center">
              {{ user.shareData.read.total }}
            </div>
            <div class="bottom">阅读总数</div>
          </div>
          <div class="item">
            <div class="top">
              昨日获赞<span>+{{ user.shareData.star.yesterday }}</span>
            </div>
            <div class="center">
              {{ user.shareData.star.total }}
            </div>
            <div class="bottom">获赞总数</div>
          </div>
          <div class="item">
            <div class="top">
              昨日新增<span>+{{ user.shareData.comment.yesterday }}</span>
            </div>
            <div class="center">
              {{ user.shareData.comment.total }}
            </div>
            <div class="bottom">评论总数</div>
          </div>
        </div>
      </div>
      <div class="itembox">
        <van-cell class="mycell" title="我的面经分享" value="21" is-link>
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
        <van-cell class="mycell" title="我的消息" value="21" is-link>
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
        <van-cell class="mycell" title="收藏的题库" value="21" is-link>
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
        <van-cell class="mycell" title="收藏的企业" value="21" is-link>
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
        <van-cell class="mycell" title="我的错题" value="21" is-link>
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
        <van-cell class="mycell" title="收藏的面试经验" value="21" is-link>
          <template #icon>
            <i class="iconfont iconicon_mine_gangwei mypos"></i>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
// 导入辅助函数
import { mapState } from 'vuex'
export default {
  data () {
    return {
      baseURL: process.env.VUE_APP_URL
    }
  },
  methods: {
    // 跳转到修改页面
    toEdit () {
      this.$router.push('/editInfo?prop=position')
    },
    toInfo () {
      // 跳转到我的资料页面
      this.$router.push('/info')
    }
  },
  // 将 store 中的 state 下的 user 取出来
  computed: {
    // 映射：将 state 下的 user 从 vuex 中映射到当前 .vue 文件中
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f7f4f5;
  padding-bottom: 70px;
  .userInfo {
    height: 216px;
    background: linear-gradient(45deg, #ce0031, #b8002c);
    font-size: 12px;
    padding: 0 15px;
    color: #fff;
    .user {
      padding-top: 30px;
      display: flex;
      justify-content: space-between;
      .left {
        .name {
          font-size: 21px;
        }
        .mark {
          margin-top: 10px;
          opacity: 0.7;
        }
      }
      .right {
        img {
          width: 50px;
          height: 50px;
          opacity: 1;
          border: 3px solid rgba(255, 255, 255, 0.38);
          border-radius: 50%;
        }
      }
    }
    .data {
      margin-top: 30px;
      display: flex;
      .item {
        flex: 1;
        text-align: center;
        .num {
          font-size: 21px;
        }
        .title {
          margin-top: 8px;
          opacity: 0.7;
        }
      }
    }
    .position {
      margin-top: 20px;
      .mycell {
        border-radius: 6px;
      }
      .mypos {
        margin-right: 10px;
      }
    }
  }
  .other {
    margin-top: 25px;
    padding: 0 15px;
    .face {
      background-color: #fff;
      padding: 0 15px 16px;
      border-radius: 6px;
      h3 {
        font-size: 14px;
        padding: 18px 0;
      }
      .items {
        font-size: 12px;
        display: flex;
        .item {
          flex: 1;
          text-align: center;
          .top {
            color: #b4b4bd;
            span {
              color: #2cc4db;
            }
          }
          .center {
            padding: 10px 0 5px;
            font-weight: 700;
            font-size: 21px;
          }
          .bottom {
          }
        }
      }
    }
    .itembox {
      margin-top: 10px;
      border-radius: 6px;
      overflow: hidden;
      .mypos {
        margin-right: 8px;
      }
    }
  }
}
</style>
