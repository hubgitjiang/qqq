// 导入 axios 对象
import request from '@/utils/request.js'

// 封装接口
// 得到城市 & 岗位数据
export function getQuestionDataApi () {
  return request({
    url: '/interview/filters'
  })
}

// 得到题目信息
export function getQuestionListApi (params) {
  return request({
    url: '/interview/questions',
    method: 'GET',
    needToken: true,
    params: params
  })
}

// 提交题目答案
export function submitQuestionApi (data) {
  return request({
    url: '/questions/submit',
    method: 'POST',
    needToken: true,
    data: data
  })
}

// 根据 id 得到面试题的题面信息
export function getNextoneApi (id) {
  return request({
    url: `/questions/${id}`,
    needToken: true
  })
}
