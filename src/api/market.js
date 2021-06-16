// 用来封装所有与市场相关的网络请求
import request from '../utils/request'

// 封装接口
// 得到城市数据
export function getIndexesApi () {
  return request({
    url: '/chart-data/indexes'
  })
}

// 得到所有的统计数据
export function getDataApi (params) {
  return request({
    url: '/chart-data/statistics',
    params: params
  })
}
