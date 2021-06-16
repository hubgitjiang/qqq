<template>
  <div class="mycomment">
    <div class="item">
      <div class="top">
        <div class="avatar" @click="imgclick">
          <img class="avatar" :src="baseURL + item.author.avatar" alt="" />
        </div>
        <div class="info">
          <div class="name">{{ item.author.nickname }}</div>
          <div class="time">{{ item.created_at | hmtimefilter }}</div>
        </div>
        <div class="star">
          <span>{{ item.star }}</span
          ><i class="iconfont iconbtn_dianzan_small_nor"></i>
        </div>
      </div>
      <div class="center">
        {{ item.content }}
      </div>
      <div class="bottom" v-if="item.children_comments.length > 0">
        <div
          class="repaly"
          v-for="(myitem, myindex) in item.children_comments"
          :key="myindex"
        >
          <span>{{ myitem.author }}：</span>{{ myitem.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      baseURL: process.env.VUE_APP_URL
    }
  },
  methods: {
    imgclick () {
      // 点击评论组件中的头像，暴露一个方法给父组件： imgclick
      this.$emit('imgclick', this.item)
    }
  }
}
</script>

<style lang="less" scoped>
.mycomment {
  .item {
    margin-top: 30px;
    font-size: 12px;
    .top {
      display: flex;
      .avatar {
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
      .info {
        flex: 1;
        .name {
          color: #545671;
          font-weight: 700;
          line-height: 17px;
        }
        .time {
          color: #b4b4bd;
          line-height: 17px;
        }
      }
      .star {
        color: #b4b4bd;
        i {
          font-size: 20px;
        }
      }
    }
    .center {
      padding-left: 45px;
      font-size: 16px;
      color: #181a39;
      line-height: 27px;
      word-break: break-all;
      word-wrap: break-word;
    }
    .bottom {
      margin-top: 20px;
      margin-left: 45px;
      background-color: #f7f4f5;
      padding: 15px;
      .repaly {
        word-break: break-all;
        word-wrap: break-word;
        span {
          font-weight: 700;
          float: left;
        }
      }
    }
  }
}
</style>
