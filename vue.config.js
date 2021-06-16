// 项目根目录中创建了`vue.config.js`
const path = require('path')

// 导包
const autoprefixer = require('autoprefixer')
// 导包
const pxtorem = require('postcss-pxtorem')

// 暴露出去
module.exports = {
  // 插件配置
  pluginOptions: {
    // style-resources-loader配置
    'style-resources-loader': {
      // 预处理程序选择 less
      preProcessor: 'less',
      // 参数
      patterns: [
        // 项目根路径下 /src/styles/ 的所有less文件
        // 指定某一个的话可以具体设置为某一个less文件
        path.resolve(__dirname, './src/style/*.less')
      ]
    }
  },
  // css属性如何处理
  css: {
    // 处理的选项
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          // 使用 pxtorem库进行转换
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  }
}
