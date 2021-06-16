<template>
  <div class="usevant">
    <h2>使用 vant</h2>
    <h3>0.0使用button</h3>
    <div class="btn"><button>确定</button><br /></div>
    <div>使用字体图标</div>
    <i class="iconfont iconbtn_nav_back"></i>
    <i class="iconfont iconbianzu1"></i>
    <i class="iconfont iconyanzhengma"></i>
    <h3>1.0 使用 vant 中的按钮</h3>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <h3>2.0使用 vant 中的图标</h3>
    <van-icon name="like-o" />
    <van-icon name="gem-o" />
    <h3>3.0 使用 vant 中的单元格</h3>
    <van-cell-group>
      <van-cell title="左侧" value="右侧" />
      <van-cell title="左侧标题" value="右侧内容" label="下方的描述"></van-cell>
    </van-cell-group>
    <h3>4.0 使用 vant 中的插槽</h3>
    <van-cell>
      <template #title>
        <van-icon name="gem-o" />左侧<van-icon name="gem-o" />
      </template>
      <template #default>
        <van-icon name="gem-o" />右侧<van-icon name="gem-o" />
      </template>
    </van-cell>
    <h3>5.0 使用 vant 中的 navbar</h3>
    <van-nav-bar>
      <template #left>
        <i class="iconfont iconbtn_nav_back myarrow05"></i>
      </template>
    </van-nav-bar>
    <h3>6.0 使用 vant 中的 field</h3>
    <div>文本输入框</div>
    <van-field
      type="text"
      v-model="value"
      label="用户名"
      placeholder="请输入用户名"
    />
    <div>手机号输入框</div>
    <van-field
      type="tel"
      v-model="value"
      label="手机号"
      placeholder="请输入手机号"
    />
    <div>纯数字输入框</div>
    <van-field
      type="digit"
      v-model="value"
      label="手机号"
      placeholder="请输入手机号"
    />
    <div>数字输入框</div>
    <van-field
      type="number"
      v-model="value"
      label="手机号"
      placeholder="请输入手机号"
    />
    <div>密码框</div>
    <van-field
      type="password"
      v-model="value"
      label="手机号"
      placeholder="请输入手机号"
    />
    <h3>7.0 使用 vant 中的 form</h3>
    <h4>表单验证</h4>
    <van-form>
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="use.phone"
        :rules="rules.phone"
      ></van-field>
    </van-form>
    <h4>全局表单验证:方式一</h4>
    <van-form ref="myglobform">
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="use.phone"
        :rules="rules.phone"
      ></van-field>
      <van-field
        label="验证码"
        placeholder="请输入手机号"
        v-model="use.code"
        :rules="rules.code"
      ></van-field>
      <div>
        <a @click="login" href="javascript:void(0)">登录</a>
      </div>
    </van-form>
    <h4>全局表单验证:方式二</h4>
    <van-form @submit="event">
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="use.phone"
        :rules="rules.phone"
      ></van-field>
      <van-field
        label="验证码"
        placeholder="请输入手机号"
        v-model="use.code"
        :rules="rules.code"
      ></van-field>
      <van-button>提交</van-button>
    </van-form>
    <h4>单独验证某几项</h4>
    <van-form ref="myform">
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="use.phone"
        :rules="rules.phone"
        name="phone"
      ></van-field>
      <van-field
        label="验证码"
        placeholder="请输入手机号"
        v-model="use.code"
        :rules="rules.code"
      >
        <template #button>
          <span @click="checkphone">发送验证码</span>
        </template>
      </van-field>
    </van-form>
    <h3>8.0 vant 中的 toast</h3>
    <van-button @click="toast1">文字提示</van-button>
    <van-button @click="toast2">加载提示</van-button>
    <van-button @click="toast3">成功提示</van-button>
    <van-button @click="toast4">失败提示</van-button>
    <van-button @click="toast5">综合方法</van-button>
    <van-button @click="clear">清除</van-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      use: {
        phone: '', // 手机号
        code: '' // 验证码
      },
      rules: {
        phone: [
          // 必填
          { required: true, message: '请输入手机号', trigger: 'onBlur' },
          // 满足手机号的正则
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号',
            trigger: 'onBlur'
          }
        ],
        code: [
          // 必填
          { required: true, message: '请输入验证码', trigger: 'onBlur' },
          // 长度为 4
          {
            pattern: /^\d{4}$/,
            message: '验证码的长度为 4',
            trigger: 'onBlur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      // 得到 form 元素
      // validate(): 将表单元素进行全局验证
      //  then：如果验证通过，就执行 .then 中的方法，否则执行 catch
      this.$refs.myglobform
        .validate()
        .then(() => {
          console.log('验证通过')
        })
        .catch(err => {
          console.log(err)
        })
    },
    event () {
      console.log('提交方法')
    },
    checkphone () {
      this.$refs.myform
        .validate(['phone'])
        .then(() => {
          console.log('验证通过')
        })
        .catch(err => {
          console.log(err)
        })
    },
    toast1 () {
      this.$toast('文字提示')
    },
    toast2 () {
      this.$toast.loading({
        message: '加载提示'
      })
    },
    toast3 () {
      this.$toast.success({
        message: '成功提示'
      })
    },
    toast4 () {
      this.$toast.fail({
        message: '失败提示'
      })
    },
    toast5 () {
      this.$toast({
        type: 'loading', // success & fail
        message: '文本提示',
        duration: 0
      })
    },
    clear () {
      this.$toast.clear()
    }
  }
}
</script>

<style lang="less" scoped>
.usevant {
  font-size: 12px;
}
.btn {
  padding: 0 15px;
  button {
    width: 100%;
    height: 44px;
    background-color: #e40137;
    border-radius: 30px;
    color: #fff;
    border: none;
  }
}
h2 {
  font-size: 18px;
}
h3 {
  font-size: 14px;
}
/deep/ .van-nav-bar__left {
  padding: 0;
  .myarrow05 {
    font-size: 40px;
  }
}
</style>
