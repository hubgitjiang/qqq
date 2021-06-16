<template>
  <div class="market">
    <!-- 导入标题 -->
    <hmnavbar title="市场数据" @back="$router.push('/find')"></hmnavbar>
    <!-- 下拉菜单区域 -->
    <van-dropdown-menu>
      <van-dropdown-item :title="selCity" ref="mycity">
        <!-- 搜索框 -->
        <van-search
          v-model="cityValue"
          shape="round"
          background="#f7f4f5"
          placeholder="请输入搜索关键词"
        />
        <!-- 城市选项 -->
        <van-index-bar>
          <template v-for="(value, key) in cityList">
            <van-index-anchor :index="key" :key="key" />
            <van-cell
              @click="changeCity(item)"
              v-for="(item, index) in value"
              :key="index"
              :title="item[0]"
            />
          </template>
        </van-index-bar>
      </van-dropdown-item>
      <van-dropdown-item :title="selPosition" ref="myposition">
        <van-cell
          @click="changePosition(item)"
          v-for="(item, index) in positionList"
          :key="index"
          :title="item"
        ></van-cell>
      </van-dropdown-item>
    </van-dropdown-menu>
    <!-- 工资收入 -->
    <div class="gongzi">
      <h3>工资收入</h3>
      <canvas id="gongzi" width="375" height="260"></canvas>
    </div>
  </div>
</template>

<script>
// 导入接口请求的 api
import { getIndexesApi, getDataApi } from '@/api/market'
// 导入内容
import F2 from '@antv/f2'
export default {
  data () {
    return {
      // 城市搜索框中的内容
      cityValue: '',
      // 城市数据源
      cityList: {},
      // 默认选中的城市数据
      selCity: '',
      // 默认选中的岗位数据
      selPosition: '',
      // 当前选中城市下的岗位列表
      positionList: [],
      // 绘制工资收入的对象
      gzchart: null,
      // 得到工资收入数据
      percentSalary: []
    }
  },
  async created () {
    // 得到城市数据
    const res = await getIndexesApi()
    this.cityList = res.data
    // 设置默认值
    // 默认城市
    this.selCity = this.cityList['热门'][0][0]
    // 当前城市下的岗位列表
    this.positionList = this.cityList['热门'][0][1]
    // 默认岗位
    this.selPosition = this.cityList['热门'][0][1][0]
    // 得到所有的统计数据
    this.getData()
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化绘制对象
      this.initdraw()
    })
  },
  methods: {
    // 得到所有的统计数据
    async getData () {
      const res = await getDataApi({
        city: this.selCity,
        position: this.selPosition
      })
      // 保存工资收入的数据源
      this.percentSalary = res.data.percentSalary
      // 绘制工资收入
      this.drawGongozi()
    },
    // 初始化绘制对象
    initdraw () {
      // Step 1: 创建 Chart 对象
      this.gzchart = new F2.Chart({
        id: 'gongzi',
        pixelRatio: window.devicePixelRatio // 指定分辨率
      })
    },
    drawGongozi () {
      // 将之前绘制的图形清除掉
      this.gzchart.clear()
      // 图表的数据源
      // 将数据源中添加一条 a: 1的元素
      this.percentSalary.forEach(item => {
        item.a = '1'
      })
      // 对数据源的处理
      const map = {}
      this.percentSalary.forEach(function (obj) {
        map[obj.assetType] = obj.percent + '%'
      })
      // 指定数据源
      this.gzchart.source(this.percentSalary, {
        percent: {
          formatter: function formatter (val) {
            return val + '%'
          }
        }
      })
      // 不使用工具栏
      this.gzchart.tooltip(false)
      // 设置说明文字
      this.gzchart.legend({
        position: 'right',
        itemFormatter: function itemFormatter (val) {
          return val + '    ' + map[val]
        }
      })
      // 设置图形
      this.gzchart.coord('polar', {
        transposed: true,
        innerRadius: 0.6,
        radius: 0.8
      })
      this.gzchart.axis(false)
      // 设计图形结构
      this.gzchart
        .interval()
        .position('a*percent')
        .color('assetType', ['#FE5D4D', '#3BA4FF', '#737DDE'])
        .adjust('stack')
      // 设置圆环中的文本
      this.gzchart.guide().html({
        position: ['50%', '45%'],
        html: `<div style="width: 250px;height: 40px;text-align: center;">
      <div style="font-size: 16px">平均</div>
      <div style="font-size: 24px">￥1190</div>
    </div>`
      })
      console.log('重新绘制')
      // 开始绘制
      this.gzchart.render()
    },
    // 修改城市
    changeCity (item) {
      // 保存当前切换的城市
      this.selCity = item[0]
      // 保存当前切换的城市下的岗位列表
      this.positionList = item[1]
      // 修改当前城市下的选中岗位
      this.selPosition = this.positionList[0]
      // 关闭下拉菜单
      this.$refs.mycity.toggle()
      // 重新得到数据源
      this.getData()
    },
    changePosition (item) {
      // 切换岗位
      this.selPosition = item
      // 关闭岗位的下拉菜单
      this.$refs.myposition.toggle()
      // 重新得到数据源
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.market {
  /deep/ .van-cell.van-cell--borderless.van-field {
    background: #fff;
    border-radius: 20px;
  }
  /deep/ .van-index-anchor {
    background: #f7f4f5;
  }
  .gongzi {
    h3 {
      padding: 20px;
      font-size: 18px;
      font-weight: 400;
    }
  }
}
</style>
