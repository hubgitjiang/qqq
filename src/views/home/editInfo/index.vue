<template>
  <div class="edifInfo">
    <!-- 头部导航栏 -->
    <hmnavbar
      :title="title"
      @back="back"
      @save="save"
      :hassave="user[prop] !== value"
    ></hmnavbar>
    <!-- 输入框 -->
    <div class="ipt" v-if="prop !== 'avatar'">
      <van-field v-model="value" />
    </div>
    <!-- 上传组件 -->
    <div class="upload" v-else>
      <van-uploader
        v-model="fileList"
        :before-read="beforRead"
        :after-read="afterRead"
        :max-count="1"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// 导入操作用户信息的方法
import { editUserApi, uploadApi } from '../../../api/login'
export default {
  data () {
    return {
      // 输入框中的默认值
      value: '',
      // 动态设置一个标题
      title: '',
      // 要操作的属性
      prop: '',
      // 上传组件预览图片的数据列表
      fileList: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['setUser']),
    // 选择图片完毕之后触发的回调函数
    async afterRead (file) {
      // file：当前选择的图片文件
      // 得到上传的图片，并且将图片提交到服务器中
      // console.log(file.file)
      const res = await uploadApi(file.file)
      // 接收服务器返回的图片 id
      const id = res.data[0].id
      this.value = id
    },
    // 选择图片完毕之前会触发
    beforRead (file) {
      // 验证图片：
      //  类型 file.type：只能是 jpg
      const isType = file.type === 'image/jpeg'
      //  大小 file.size：只能小于 2m
      const isSize = file.size / 1024 / 1024 < 2
      if (!isType) {
        this.$toast.fail('只能接收 jpg 类型的图片')
      }
      if (!isSize) {
        this.$toast.fail('只能接收小于 2m 的图片')
      }
      return isType && isSize
    },
    // 点击返回箭头触发的事件
    back () {
      // this.$router.push('/info')
      this.$router.back()
    },
    // 点击头部导航中的保存按钮时会触发
    async save () {
      // 判断：当前操作的属性
      this.$toast({
        type: 'loading',
        message: '加载中...',
        duration: 0
      })
      // 1.0 得到修改后的数据: value
      // 2.0 将数据提交到服务器
      await editUserApi({
        [this.prop]: this.value
      })
      // 3.0 更新用户信息
      this.setUser()
      // 4.0 跳转回我的资料页面
      // this.$router.push('/info')
      this.$router.back()
      this.$toast.clear()
    }
  },
  // 打开页面之前会触发的钩子函数
  created () {
    // 接收参数： prop
    this.prop = this.$route.query.prop
    // 判断 prop
    if (this.prop === 'nickname') {
      // 设置标题
      this.title = '修改昵称'
    } else if (this.prop === 'intro') {
      this.title = '修改个人简介'
    } else if (this.prop === 'position') {
      this.title = '修改岗位'
    } else if (this.prop === 'avatar') {
      this.title = '修改头像'
      // 将当前用户的头像添加到 fileList
      this.fileList.push({
        url: process.env.VUE_APP_URL + this.user.avatar
      })
    }
    // 设置输入框中的内容
    this.value = this.user[this.prop]
  }
}
</script>

<style lang="less" scoped>
.edifInfo {
  .ipt {
    padding: 15px;
  }
  /deep/ .van-cell.van-field {
    background-color: #f7f4f5;
    border-radius: 4px;
  }
  .upload {
    text-align: center;
    /deep/ .van-image.van-uploader__preview-image,
    /deep/ .van-uploader__upload {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
