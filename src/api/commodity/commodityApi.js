import request from '@/plugin/axios'

/**
 * 获取商品列表
 * @param data
 */
export function commodityTableList(data) {
  return request({
    url: '/api/commodity/list',
    method: 'get',
    params: data
  })
}

/**
 * 新增商品
 * @param data
 */
export function commodityNew(data) {
  console.log(data)
  return request({
    url: '/api/commodity',
    method: 'post',
    data
  })
}

/**
 * 获取商品详情
 */
export function commodityDetail(id) {
  return request({
    url: '/api/shopBusinessArea',
    method: 'get',
    params: data
  })
}

/**
 * 修改商品
 * @param data
 */
export function commodityEdit(data) {
  return request({
    url: '/api/commodity',
    method: 'put',
    data
  })
}