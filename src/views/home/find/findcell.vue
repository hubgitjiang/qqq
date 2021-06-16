<template>
  <div class="findcell">
    <van-cell class="titlecell" is-link>
      <template #title>
        <span class="left">{{ title }}</span>
      </template>
      <template #default>
        <span @click="more">查看更多</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  props: ['title'],
  methods: {
    more () {
      this.$emit('more')
    }
  }
}
</script>

<style lang="less" scoped>
.findcell {
  .titlecell {
    .left {
      font-weight: 700;
      font-size: 18px;
    }
  }
}
</style>
