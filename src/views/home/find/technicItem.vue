<template>
  <div class="techniciItem">
    <div class="item">
      <div class="msg">
        <div class="top">
          {{ item.title }}
        </div>
        <div class="bottom">
          <div class="time">{{ item.created_at | hmtimefilter }}</div>
          <div class="watch">
            <i class="iconfont iconicon_liulanliang"></i> {{ item.read }}
          </div>
          <div class="star">
            <i class="iconfont iconbtn_dianzan_small_nor"></i> {{ item.star }}
          </div>
        </div>
      </div>
      <div class="img">
        <img :src="baseURL + item.cover" alt="" />
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
  }
}
</script>

<style lang="less" scoped>
.techniciItem {
  .item {
    display: flex;
    padding: 20px 15px;
    .msg {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 12px;
      .top {
        font-size: 16px;
        font-weight: 700;
        line-height: 23px;
      }
      .bottom {
        display: flex;
        align-items: center;
        .time {
          flex: 1;
        }
        .star {
          margin-left: 21px;
        }
        .watch,
        .star {
          display: flex;
          align-items: center;
        }
      }
    }
    .img {
      margin-left: 16px;
      width: 113px;
      height: 75px;
      img {
        width: 113px;
        height: 75px;
      }
    }
  }
}
</style>
