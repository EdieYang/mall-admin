import request from '@/plugin/axios'

/**
 * 获取客服分页列表
 * @param data
 */
export function customerSupportTableList(data) {
  return request({
    url: '/api/customerSupport/page',
    method: 'get',
    params: data
  })
}


/**
 * 获取客服列表
 * @param data
 */
export function customerSupportList(data) {
  return request({
    url: '/api/customerSupport/list',
    method: 'get',
    params: data
  })
}


/**
 * 新增客服
 * @param data
 */
export function customerSupportNew(data) {
  console.log(data)
  return request({
    url: '/api/customerSupport',
    method: 'post',
    data
  })
}

/**
 * 获取客服信息
 */
export function customerSupportDetail(id) {
  return request({
    url: '/api/customerSupport/' + id,
    method: 'get'
  })
}

/**
 * 修改客服
 * @param data
 */
export function customerSupportEdit(data) {
  return request({
    url: '/api/customerSupport',
    method: 'put',
    data
  })
}

/**
 * 删除客服
 * @param data
 */
export function customerSupportDel(id) {
  return request({
    url: '/api/customerSupport/' + id,
    method: 'delete'
  })
}
