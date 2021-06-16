// 用来管理所有与登录相关的网络请求
// 导入 request
import request from '../utils/request.js'
// 封装网络请求

// 得到登录的验证码
export function getCodeApi (data) {
  // 将服务器返回的结果对象交给外界，通过外界来 .then
  return request({
    url: '/au/code',
    method: 'POST',
    data: data
  })
}

// 提示登录的参数
export function loginApi (data) {
  return request({
    url: '/au/login',
    method: 'POST',
    data: data
  })
}

// 根据 token 得到用户信息
export function getUserApi () {
  return request({
    url: '/au/info',
    needToken: true // 当前请求需要携带 token
  })
}

// 修改用户信息
export function editUserApi (data) {
  return request({
    url: '/au/edit',
    method: 'POST',
    needToken: true,
    data: data
  })
}

// 上传文件
export function uploadApi (file) {
  // console.log(file)
  // 将图片包裹到 formData 中
  var fd = new FormData()
  fd.append('files', file)
  return request({
    url: '/upload',
    method: 'POST',
    needToken: true,
    data: fd
  })
}
