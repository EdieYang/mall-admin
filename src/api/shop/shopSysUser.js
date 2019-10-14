import request from '@/plugin/axios'


/**
 * 获取商户管理员列表
 * @param data
 */
export function shopSysUserList(data) {
  return request({
    url: '/api/sysUser/shop/users',
    method: 'get',
    params: data
  })
}

/**
 * 新增商户管理员
 * @param data
 */
export function shopSysUserNew(data,shopId) {
  console.log(data)
  return request({
    url: '/api/sysUser/shop/user',
    method: 'post',
    params:{
      shopId:shopId
    },
    data
  })
}

/**
 * 获取商户管理员
 */
export function shopSysUserDetail(data) {
  return request({
    url: '/api/sysUser/shop/user',
    method: 'get',
    params: data
  })
}

/**
 * 修改商户管理员
 * @param data
 */
export function shopSysUserEdit(data,shopId) {
  return request({
    url: '/api/sysUser/shop/user',
    method: 'put',
    params:{
      shopId:shopId
    },
    data
  })
}

