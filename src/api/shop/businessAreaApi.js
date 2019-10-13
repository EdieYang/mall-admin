import request from '@/plugin/axios'

/**
 * 获取商圈列表
 * @param data
 */
export function businessAreaList (data) {
  return request({
    url: '/api/shopBusinessArea/list',
    method: 'get',
    params: data
  })
}

/**
 * 新增商圈
 * @param data
 */
export function businessAreaNew (data) {
  console.log(data)
  return request({
    url: '/api/shopBusinessArea',
    method: 'post',
    data
  })
}

/**
 * 获取商圈详情
 */
export function businessAreaDetail (id) {
  return request({
    url: '/api/shopBusinessArea',
    method: 'get',
    params: data
  })
}

/**
 * 修改商铺
 * @param data
 */
export function businessAreaEdit (data) {
  return request({
    url: '/api/shopBusinessArea',
    method: 'put',
    data
  })
}
