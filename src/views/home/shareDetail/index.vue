<template>
  <div ref="mydetail" class="shareDetail" v-if="detailObj && detailObj.author">
    <!-- 头部标题 -->
    <hmnavbar @back="$router.back()"></hmnavbar>
    <!-- 文章标题 -->
    <h3 class="title">
      {{ detailObj.title }}
    </h3>
    <!-- 作者信息区域 -->
    <div class="author">
      <img class="avatar" :src="baseURL + detailObj.author.avatar" alt="" />
      <div class="info">
        <div class="nickname">{{ detailObj.author.nickname }}</div>
        <div class="time">{{ detailObj.created_at | hmtimefilter }}</div>
      </div>
    </div>
    <!-- 文章区域 -->
    <div class="content" v-html="detailObj.content"></div>
    <!-- 评论区域 -->
    <div class="comment">
      <h3>评论<sup>87</sup></h3>
      <div class="items">
        <van-list
          @load="onload"
          v-model="loading"
          finished-text="没有更多了"
          :finished="finished"
        >
          <comment
            @imgclick="openReplayComment"
            :item="item"
            v-for="(item, index) in commentList"
            :key="index"
          ></comment>
        </van-list>
      </div>
    </div>
    <!-- 书写评论区域 -->
    <div class="write">
      <div class="input" @click="opencomment">
        我来补充两句
      </div>
      <div class="part">
        <i
          @click="collectArt"
          class="iconfont iconbtn_shoucang_nor"
          :class="{
            active: getState(id, 'collectArticles')
          }"
        ></i
        ><span>{{ detailObj.collect }}</span>
      </div>
      <div class="part">
        <i
          @click="starArt"
          class="iconfont iconbtn_dianzan_small_nor"
          :class="{
            active: getState(id, 'starArticles')
          }"
        ></i
        ><span>{{ detailObj.star }}</span>
      </div>
      <div class="part">
        <i @click="openShare" class="iconfont iconbtn_share"></i
        ><span>322</span>
      </div>
    </div>
    <!-- 评论面板 -->
    <van-popup v-model="commentShow" position="bottom" class="commentpanel">
      <textarea class="ipt" :placeholder="myplace" v-model="content"></textarea>
      <div class="btn">
        <span v-if="content.trim().length === 0" style="color: #ccc">发送</span>
        <span @click="sendComment" v-else style="color: red">发送</span>
      </div>
    </van-popup>
    <!-- 分享面板 -->
    <van-popup class="sharepanel" v-model="shareShow">
      <div class="top">长按图片下载并分享</div>
      <div class="box">
        <div class="img">
          <img :src="pageImage" alt="" />
        </div>
        <div class="logo">
          <img src="../../../assets/img_share_logo@2x.png" alt="" />
        </div>
        <div class="ewm">
          <div id="qrcode" ref="qrcode"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入 api
import {
  getShareDetail,
  getCommentApi,
  sendCommentApi,
  collectArtApi,
  starArtApi
} from '@/api/articles'
// 导入子组件
import comment from './comment'
import { getLocal } from '@/utils/local.js'
// 使用辅助函数
import { mapState, mapGetters } from 'vuex'
// 导入将页面转为图片的第三方包
import html2canvas from 'html2canvas'
// 导入将路径转为二维码的第三方包
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      // 当前文章的 id
      id: '',
      // 文章的详情
      detailObj: {},
      // 基地址
      baseURL: process.env.VUE_APP_URL,
      // list 的加载状态
      loading: false,
      // list 数据源的加载状态
      finished: false,
      // 页容量
      limit: 5,
      // 起始的下标
      start: -5,
      // 评论的数据源
      commentList: [],
      // 总数量
      total: 0,
      // 控制评论面板的显示与隐藏
      commentShow: false,
      // 输入框中的内容
      content: '',
      // 设置标识：用来表示当前操作是否为添加评论的回复
      isReplay: false,
      // 文本域中的提示文本
      myplace: '',
      // 当前操作的评论数据
      currentComment: {},
      // 控制分享面板的显示与隐藏
      shareShow: false,
      // 得到当前页面的图片路径
      pageImage: ''
    }
  },
  computed: {
    ...mapState(['user', 'isLogin']),
    ...mapGetters(['collectState', 'starState', 'getState'])
    // // 得到收藏的状态
    // collectState () {
    //   return (
    //     this.user.collectArticles &&
    //     this.user.collectArticles.includes(+this.id)
    //   )
    // },
    // // 得到点赞的状态
    // starState () {
    //   return this.user.starArticles && this.user.starArticles.includes(+this.id)
    // }
  },
  methods: {
    openShare () {
      // 打开分享面板
      this.shareShow = true
      // 将页面转为图片
      html2canvas(window.document.body, {
        // 允许图片跨域
        useCORS: true
      }).then(canvas => {
        // 将 canvas 图片对象，转为图片字符串
        this.pageImage = canvas.toDataURL('image/png')
      })
      this.$nextTick(() => {
        // 清除之前的二维码
        this.$refs.qrcode.innerHTML = ''
        // 将地址转为二维码
        const qrcode = new QRCode('qrcode', {
          width: 75,
          height: 75,
          text: window.location.href
        })
        console.log(qrcode)
      })
    },
    // 点赞文章 & 取消点赞文章
    async starArt () {
      if (!this.$login()) {
        return
      }
      this.$toast({
        type: 'loading',
        message: '加载中...',
        duration: 0
      })
      // 点赞 & 取消点赞
      await starArtApi(this.id)
      // 判断状态
      if (this.user.starArticles && this.user.starArticles.includes(+this.id)) {
        this.$toast.success('取消点赞成功')
        this.detailObj.star -= 1
      } else {
        this.$toast.success('点赞成功')
        this.detailObj.star += 1
      }
      // 更新用户信息
      this.$store.dispatch('setUser')
    },
    // 收藏文章
    async collectArt () {
      // 判断 user 中是否存在数据
      if (!this.isLogin) {
        // 说明 user 中的没有数据
        // 判断是否存在 token
        const token = getLocal('token')
        if (token) {
          // 根据 token 重新得到用户信息
          this.$store.dispatch('setUser')
          // 将登录状态改为 true
          this.$store.commit('setIsLogin', true)
        } else {
          // 提示用户未登录
          this.$toast.fail('对不起，您还没有登录')
          // 跳转到登录页面
          this.$router.push('/login?_redirect=' + this.$route.fullPath)
          return
        }
      }
      // 提示加载中
      this.$toast({
        type: 'loading',
        message: '加载中...',
        duration: 0
      })
      // 收藏 & 取消收藏
      await collectArtApi(this.id)
      // 判断：
      if (
        this.user.collectArticles &&
        this.user.collectArticles.includes(+this.id)
      ) {
        // 如果取消收藏：
        //  提示取消收藏，将收藏的数字 - 1
        this.$toast.success('取消收藏成功')
        this.detailObj.collect -= 1
      } else {
        // 如果收藏成功：
        //  提示收藏成功, 将收藏的数字 + 1
        this.$toast.success('收藏成功')
        this.detailObj.collect += 1
      }
      // 更新用户信息
      this.$store.dispatch('setUser')
    },
    // 点击评论中的头像，打开评论面板
    openReplayComment (item) {
      this.commentShow = true
      // 将回复状态改为: true
      this.isReplay = true
      this.myplace = `回复：${item.author.nickname}`
      // 将当前操作的评论数据保存起来
      this.currentComment = item
    },
    // 提交评论数据
    // 提交评论回复的数据
    async sendComment () {
      // 判断用户是否登录（判断是否存在 token）
      // 得到 token
      const token = getLocal('token')
      if (!token) {
        // 提示用户
        this.$toast.fail('对不起，您还没有登录')
        // 跳转回登录页面
        this.$router.push(`/login?_redirect=${this.$route.fullPath}`)
        return // 结束后续的代码
      }
      if (this.isReplay === false) {
        // 提交评论数据
        // 发送请求到服务器：提交评论数据
        const res = await sendCommentApi({
          content: this.content,
          article: this.id
        })
        // 接收返回的评论数据
        const returnObj = res.data
        // 给返回的评论数据添加一个点赞数据
        returnObj.star = 0
        // 将返回的评论数据添加到评论列表中
        this.commentList.unshift(returnObj)
      } else {
        // 提交评论回复的数据
        const res = await sendCommentApi({
          content: this.content, // 回复的内容
          article: this.id, // 当前回复所属文章的 id
          parent: this.currentComment.id // 当前回复所属评论的 id
        })
        // 接收服务器返回回复的信息
        const replayObj = res.data
        // 将回复的数据渲染到页面上
        this.currentComment.children_comments.push(replayObj)
      }
      // 清空面板
      this.content = ''
      // 关闭面板
      this.commentShow = false
    },
    // 打开评论面板
    opencomment () {
      this.commentShow = true
      // 将回复状态改为 false
      this.isReplay = false
      this.myplace = '我来补充两句'
    },
    // 1.0 上拉触底
    // 2.0 list 组件中没有数据源时， list 组件被加载
    async onload () {
      // 给起始下标加上页容量
      this.start += this.limit
      // 发送请求到服务器得到详情评论数据
      const res = await getCommentApi({
        id: this.id,
        limit: this.limit,
        start: this.start
      })
      // 保存评论的数据源
      this.commentList.push(...res.data.list)
      this.total = res.data.total
      // 关闭 LIST 的加载状态
      this.loading = false
      // 判断数据源是否加载完毕
      if (this.commentList.length >= this.total) {
        this.finished = true
      }
    }
  },
  async created () {
    // 打开页面时，得到文章的 id
    this.id = this.$route.params.id
    try {
      // 根据 id 发送请求到服务器得到文章详情
      const res = await getShareDetail(this.id)
      this.detailObj = res.data
    } catch {}
  },
  components: {
    comment
  }
}
</script>

<style lang="less" scoped>
.active {
  color: red;
}
.shareDetail {
  padding-bottom: 80px;
  .title {
    font-size: 18px;
    color: #181a39;
    line-height: 25px;
    padding: 20px 15px;
  }
  .author {
    padding: 0 15px;
    display: flex;
    .avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .info {
      font-size: 12px;
      .nickname {
        color: #545671;
        font-weight: 700;
        line-height: 17px;
      }
      .time {
        color: #b4b4bd;
        line-height: 17px;
      }
    }
  }
  .content {
    padding: 20px 15px;
    font-size: 16px;
    /deep/ img {
      width: 100%;
    }
  }
  .comment {
    font-size: 18px;
    color: #222222;
    line-height: 25px;
    padding: 20px 15px;
    h3 {
      sup {
        font-weight: 400;
        color: #bfbfc7;
        margin-left: 4px;
      }
    }
    .items {
    }
  }
  .write {
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 15px;
    display: flex;
    font-size: 12px;
    align-items: center;
    box-sizing: border-box;
    .input {
      background-color: #f7f4f5;
      width: 190px;
      height: 34px;
      line-height: 34px;
      padding-left: 8px;
      box-sizing: border-box;
      color: #c6c5cc;
    }
    .part {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      color: #c9c9d0;
      i {
        font-size: 30px;
      }
      span {
      }
    }
  }
  .commentpanel {
    padding: 20px 15px;
    box-sizing: border-box;
    .ipt {
      box-sizing: border-box;
      padding: 15px;
      width: 100%;
      height: 100px;
      border: none;
      background: #f7f4f5;
      font-size: 14px;
    }
    .btn {
      margin-top: 10px;
      font-size: 16px;
      text-align: right;
    }
  }
  .sharepanel {
    width: 90%;
    background-color: #00b8d4;
    padding: 0 15px 15px;
    box-sizing: border-box;
    .top {
      color: #fff;
      font-size: 12px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      // 设置文本之间的间隔
      letter-spacing: 5px;
    }
    .box {
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      .img {
        height: 350px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .logo {
        text-align: center;
        img {
          width: 120px;
          height: 36px;
        }
      }
      .ewm {
        #qrcode {
          /deep/ img {
            margin: 0 auto;
          }
        }
      }
    }
  }
}
</style>
