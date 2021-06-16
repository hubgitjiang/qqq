<template>
  <div class="hmnavbar">
    <!-- 顶部导航组件 -->
    <van-nav-bar>
      <template #left>
        <i class="iconfont iconbtn_nav_back myicon" @click="back"></i>
      </template>
      <template #title>
        <h3>{{ title }}</h3>
      </template>
      <template #right>
        <span @click="save" v-if="hassave">保存</span>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'hmnavbar',
  // 接收一个属性： title，hassave
  props: ['title', 'hassave'],
  methods: {
    // 点击左侧的箭头时触发
    back () {
      this.$emit('back')
    },
    // 点击右侧的保存按钮时会触发
    save () {
      this.$emit('save')
    }
  }
}
</script>

<style lang="less" scoped>
.hmnavbar {
  .myicon {
    font-size: 40px;
    color: #191b3a;
  }
  /deep/ .van-nav-bar__left {
    padding: 0;
  }
}
</style>
