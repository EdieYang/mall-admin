import request from '@/plugin/axios'

/**
 * 获取商铺ID
 * @param data
 */
export function getShopId() {
  return request({
    url: '/api/shop/id',
    method: 'get'
  })
}

/**
 * 获取分页商铺列表
 * @param data
 */
export function shopPage(data) {
  return request({
    url: '/api/shop/page',
    method: 'get',
    params: data
  })
}

/**
 * 获取商铺列表
 * @param data
 */
export function shopList() {
  return request({
    url: '/api/shop/list',
    method: 'get'
  })
}

/**
 * 新增商铺
 * @param data
 */
export function shopNew(data) {
  console.log(data)
  return request({
    url: '/api/shop/info',
    method: 'post',
    data
  })
}

/**
 * 获取商铺详情
 */
export function shopDetail(id) {
  return request({
    url: '/api/shop/'+id+'/info',
    method: 'get',
  })
}

/**
 * 修改商铺
 * @param data
 */
export function shopEdit(data) {
  return request({
    url: '/api/shop/info',
    method: 'put',
    data
  })
}

