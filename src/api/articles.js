// 专门用来管理与文章相关的网络请求
// 导入 request 对象
import request from '../utils/request'

// 封装接口
// 得到面试技巧数据
export function getTechnicApi (params) {
  return request({
    url: '/articles/technic',
    // axios: get => params post => data
    params: params
  })
}

// 得到市场数据
export function getHotApi () {
  return request({
    url: '/chart-data/hot'
  })
}

// 得到面经分享数据
export function getShareApi (params) {
  return request({
    url: '/articles/share',
    params: params
  })
}

// 得到面经热搜
export function getHotSearch () {
  return request({
    url: '/articles/shareTopSearch'
  })
}

// 得到面经详情
export function getShareDetail (id) {
  return request({
    url: `/articles/share/${id}`
  })
}

// 得到面经详情的评论数据
export function getCommentApi ({ id, limit, start }) {
  return request({
    url: `/articles/comments/${id}`,
    method: 'GET',
    params: {
      limit: limit,
      start: start
    }
  })
}

// 提交评论数据
export function sendCommentApi (data) {
  return request({
    url: '/articles/comments',
    method: 'POST',
    data: data,
    needToken: true
  })
}

// 收藏 & 取消收藏文章
export function collectArtApi (id) {
  return request({
    url: '/articles/collect',
    method: 'POST',
    data: {
      id: id
    },
    needToken: true
  })
}

// 点赞 & 取消点赞文章
export function starArtApi (id) {
  return request({
    url: '/articles/star',
    method: 'POST',
    needToken: true,
    data: {
      article: id
    }
  })
}
