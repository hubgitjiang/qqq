<template>
  <div class="shareItem">
    <div class="item" @click="toDetail">
      <div class="title">
        <div v-html="item.title"></div>
      </div>
      <div class="content">
        {{ item.content }}
      </div>
      <div class="other">
        <div class="user">
          <img :src="baseURL + item.author.avatar" alt="" />
          <span>{{ item.author.nickname }}</span>
        </div>
        <div class="time">{{ item.created_at | hmtimefilter }}</div>
        <div class="comment">
          <i class="iconfont iconicon_pinglunliang"></i> {{ item.read }}
        </div>
        <div class="star">
          <i class="iconfont iconbtn_dianzan_small_nor"></i> {{ item.star }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shareItem',
  props: ['item'],
  data () {
    return {
      baseURL: process.env.VUE_APP_URL
    }
  },
  methods: {
    toDetail () {
      // 跳转到详情页面
      this.$router.push(`/shareDetail/${this.item.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.shareItem {
  .item {
    padding: 20px 15px;
    font-size: 12px;
    .title {
      font-size: 16px;
      font-weight: 700;
      line-height: 23px;
    }
    .content {
      margin: 14px 0;
      font-size: 13px;
      line-height: 19px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .other {
      display: flex;
      align-items: center;
      .user {
        flex: 1;
        img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          margin-right: 6px;
        }
      }
      .user,
      .comment,
      .star {
        display: flex;
        align-items: center;
      }
      .time,
      .comment,
      .star {
        margin-left: 20px;
      }
    }
  }
}
</style>
