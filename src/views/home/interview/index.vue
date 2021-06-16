<template>
  <div class="interview" v-if="currQue.detail">
    <!-- 头部导航 -->
    <van-nav-bar>
      <template #left>
        <i class="iconfont iconbtn_nav_back myicon" @click="back"></i>
      </template>
      <template #title>
        <span
          >面试题<sup>{{ questionList.length }}</sup></span
        >
      </template>
      <template #right>
        <span @click="opencard">答题卡</span>
      </template>
    </van-nav-bar>
    <!-- 试题区域 -->
    <div class="box">
      <div class="title">
        【{{ typeObj[currQue.detail.type] }}】{{ currQue.detail.title }}
      </div>
      <div class="tags">
        <div
          class="tag"
          v-for="(item, index) in currQue.detail.tag"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <!-- 单选的答案 -->
      <div class="items" v-if="currQue.detail.type === 1">
        <div
          class="item"
          :class="{
            select: str[index] === singleAnswer,
            correct:
              step >= 2 &&
              currQue.answer &&
              currQue.answer.singleAnswer === str[index],
            error:
              step >= 2 &&
              singleAnswer !== currQue.answer.singleAnswer &&
              singleAnswer === str[index]
          }"
          v-for="(item, index) in currQue.detail.option"
          :key="index"
          @click="changeAnswer(str[index])"
        >
          {{ str[index] }}. {{ item }}
        </div>
      </div>
      <!-- 多选的答案 -->
      <div class="items" v-if="currQue.detail.type === 2">
        <div
          class="item"
          :class="{
            select: multipleAnswer.includes(str[index]),
            correct:
              step >= 2 && currQue.answer.multipleAnswer.includes(str[index]),
            error:
              step >= 2 &&
              !currQue.answer.multipleAnswer.includes(str[index]) &&
              multipleAnswer.includes(str[index])
          }"
          v-for="(item, index) in currQue.detail.option"
          :key="index"
          @click="changeMutiAnswer(str[index])"
        >
          {{ str[index] }}. {{ item }}
        </div>
      </div>
    </div>
    <!-- 答案解析 -->
    <div class="answer" v-if="step >= 2">
      <h3>答案解析</h3>
      <div class="rightAns">
        正确答案：{{
          currQue.answer.singleAnswer || currQue.answer.multipleAnswer
        }}
      </div>
      <div class="msg">
        <span>难度：{{ diffObj[currQue.answer.difficulty] }}</span>
        <span>提交次数 {{ currQue.answer.submitNum }}</span>
        <span>正确次数 {{ currQue.answer.correctNum }}</span>
      </div>
      <div class="info">
        {{ currQue.answer.answerAnalysis }}
      </div>
    </div>
    <!-- 底部区域 -->
    <div class="foot">
      <div class="one">
        <i class="iconfont iconbtn_shoucang_nor"></i><span>收藏</span>
      </div>
      <div class="one">
        <i class="iconfont iconbtn_shuati_fankui"></i><span>反馈</span>
      </div>
      <div class="two">
        <span class="mynum">{{ currIndex + 1 }}</span
        >/{{ questionList.length }}题
      </div>
      <div class="two">
        <van-button @click="nextone" type="info" v-if="step >= 2 && !isFinished"
          >下一题</van-button
        >
        <van-button
          @click="submit"
          type="danger"
          v-if="step < 2 && !isFinished"
          :disabled="step !== 1"
          >提交</van-button
        >
        <van-button @click="jiaojuan" type="danger" v-if="isFinished"
          >交卷</van-button
        >
      </div>
    </div>
    <!-- 答题卡界面 -->
    <van-popup class="answercard" v-model="cardShow" position="bottom">
      <van-nav-bar title="答题卡">
        <template #right
          ><span>{{ currIndex + 1 }}</span
          >/{{ questionList.length }}题
        </template>
      </van-nav-bar>
      <div class="total">共{{ questionList.length }}题</div>
      <ul class="items">
        <li
          class="item"
          :class="{
            current: currIndex === index,
            error:
              questionList[index].answer && !questionList[index].answer.isRight,
            success:
              questionList[index].answer && questionList[index].answer.isRight
          }"
          v-for="(item, index) in questionList.length"
          :key="index"
          @click="changeIndex(index)"
        >
          {{ item }}
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import {
  getQuestionListApi,
  submitQuestionApi,
  getNextoneApi
} from '@/api/question'
export default {
  data () {
    return {
      // 答题的状态：
      //  0：有题目，还未做
      //  1：做了题，还没交
      //  2：交了题，还没点击下一题
      //  3: 交了题，没有下一题
      step: 0,
      // 城市数据
      city: '',
      // 岗位数据
      type: '',
      // 面试题的列表
      questionList: [],
      // 表示当前所答的题目
      currIndex: 0,
      // 题型
      typeObj: {
        1: '单选',
        2: '多选',
        3: '简答'
      },
      // 难度
      diffObj: {
        1: '简单',
        2: '一般',
        3: '困难'
      },
      // 定义选项
      str: 'ABCDEFGHIJKL',
      // 定义单选题的答案
      singleAnswer: '',
      // 定义多选题的答案
      multipleAnswer: [],
      // 答题卡的显示与隐藏
      cardShow: false
    }
  },
  computed: {
    // 将当前操作题目封装为一个计算属性
    currQue () {
      return this.questionList[this.currIndex] || {}
    },
    isFinished () {
      // 判断题目数据源中是否每个元素都有 answer 属性
      return this.questionList.every(item => {
        return !!item.answer
      })
    }
  },
  methods: {
    // 答题结束，提交试卷
    jiaojuan () {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否提交试卷'
        })
        .then(() => {
          this.$toast.success('试卷提交完成')
          this.$router.push('/question')
        })
        .catch()
    },
    // 跳题
    async changeIndex (index) {
      this.currIndex = index
      // 关闭面板
      this.cardShow = false
      if (this.currQue.answer) {
        this.step = 2
      } else if (this.currQue.detail) {
        this.step = 0
      } else {
        // 根据最新 currIndex 请求题面信息
        const res = await getNextoneApi(this.currQue.id)
        // 保存题面信息
        this.$set(this.currQue, 'detail', res.data)
        // 将状态改为 0
        this.step = 0
      }
    },
    // 打开答题卡面板
    opencard () {
      this.cardShow = true
    },
    // 修改多选的答案
    changeMutiAnswer (ans) {
      // 判断： ans 在 multipleAnswer 是否存在 ：
      //  存在：多数组中去掉
      //  不存在：添加
      // 得到 ans 在 multipleAnswer 中的下标
      const index = this.multipleAnswer.indexOf(ans)
      if (this.step < 2) {
        if (index === -1) {
          // ans 在 multipleAnswer 不存在
          this.multipleAnswer.push(ans)
        } else {
          // ans 在 multipleAnswer 存在
          this.multipleAnswer.splice(index, 1)
        }
        // 将状态改为 1
        this.step = 1
      }
    },
    // 下一题
    async nextone () {
      // 当前题 + 1
      this.currIndex += 1
      if (this.currQue.answer) {
        this.step = 2
      } else if (this.currQue.detail) {
        this.step = 0
      } else {
        // 修改状态every
        this.step = 0
        // 清空之前的答案
        this.singleAnswer = ''
        this.multipleAnswer = []
        // 得到下一题的题面信息
        const res = await getNextoneApi(this.currQue.id)
        // 将下一题的题面信息，保存起来
        // this.currQue.detail = res.data
        this.$set(this.currQue, 'detail', res.data)
      }
    },
    // 提交答案
    async submit () {
      // 提交答案到服务器
      const res = await submitQuestionApi({
        id: this.currQue.id,
        singleAnswer: this.singleAnswer,
        multipleAnswer: this.multipleAnswer
      })
      console.log(res.data)
      // 将当前题目的答案保存到当前题目中，与 detail 属性同级
      // this.currQue.answer = res.data
      this.$set(this.currQue, 'answer', res.data)
      // 将状态修改为 2
      this.step = 2
    },
    // 修改答案
    changeAnswer (ans) {
      // 判断：step < 2 时，才能切换答案
      if (this.step < 2) {
        this.singleAnswer = ans
        // 将状态改为：1
        this.step = 1
      }
    },
    back () {}
  },
  async created () {
    // 得到城市 & 岗位数据
    this.city = this.$route.params.city
    this.type = this.$route.params.type
    // 发送请求得到题目信息
    const res = await getQuestionListApi({
      type: this.type,
      city: this.city
    })
    this.questionList = res.data
  }
}
</script>

<style lang="less" scoped>
.interview {
  margin-bottom: 80px;
  .myicon {
    font-size: 40px;
    color: #191b3a;
  }
  /deep/ .van-nav-bar__left {
    padding: 0;
  }
  .box {
    padding: 30px 15px;
    .title {
      font-size: 16px;
      line-height: 24px;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      padding: 20px 0;
      .tag {
        padding: 4px 8px;
        background: #f7f4f5;
        margin-right: 20px;
      }
    }
    .items {
      font-size: 16px;
      .item {
        border: 1px solid #f7f4f5;
        padding: 10px 15px;
        border-radius: 6px;
        margin-bottom: 20px;
      }
      .select {
        border: 1px solid #ccc;
      }
      .correct {
        background-color: #ddfad9;
        color: #42c779;
        position: relative;
        &::after {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          font-family: 'iconfont' !important;
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          content: '\e604';
        }
      }
      .error {
        background-color: #ffefea;
        color: #ec5851;
        position: relative;
        &::after {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          font-family: 'iconfont' !important;
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          content: '\e605';
        }
      }
    }
  }
  .answer {
    padding: 0 15px;
    h3 {
      font-size: 18px;
    }
    .rightAns {
      font-size: 16px;
      color: #1dc779;
      line-height: 50px;
    }
    .msg {
      font-size: 12px;
      background-color: #f7f4f5;
      padding: 8px;
      display: flex;
      justify-content: space-between;
    }
    .info {
      font-size: 14px;
      padding: 20px 0;
    }
  }
  .foot {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 15px 15px;
    background-color: #fff;
    .one {
      flex: 1;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      text-align: center;
      i {
        font-size: 26px;
      }
    }
    .two {
      flex: 4;
      text-align: center;
      font-size: 14px;
      .mynum {
        font-size: 20px;
        color: red;
      }
    }
  }
  .answercard {
    .total {
      background-color: #f7f4f5;
      padding: 15px;
      font-size: 14px;
      color: #b4b4bd;
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      color: #b4b4bd;
      padding: 20px;
      .item {
        width: 33px;
        height: 33px;
        border-radius: 50%;
        border: 1px solid #b4b4bd;
        line-height: 33px;
        text-align: center;
        margin: 0 12px 10px 0;
      }
      .current {
        border: 1px solid #666;
        color: #666;
      }
      .error {
        border: 1px solid transparent;
        color: #ff6d49;
        background-color: #ffefea;
      }
      .success {
        border: 1px solid transparent;
        color: #1dc779;
        background-color: #ddfad9;
      }
    }
  }
}
</style>
