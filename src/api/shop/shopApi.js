import request from '@/plugin/axios'

/**
 * 获取商铺列表
 * @param data
 */
export function shopList(data) {
  return request({
    url: '/api/shop/list',
    method: 'get',
    params: data
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

