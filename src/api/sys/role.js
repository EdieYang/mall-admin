import request from '@/plugin/axios'

export function getRolePage(data) {
  return request({
    url: '/api/sys/role/page',
    method: 'get',
    params: data
  })
}
export function getRole(data) {
  return request({
    url: '/api/sys/role',
    method: 'get',
    params: data
  })
}
export function saveRole(data) {
  return request({
    url: '/api/sys/role',
    method: 'post',
    data
  })
}
export function uptRole(data) {
  return request({
    url: '/api/sys/role',
    method: 'put',
    data
  })
}
export function delRole(data) {
  return request({
    url: '/api/sys/role',
    method: 'delete',
    params: data
  })
}
export function getRolePagByUserId(data) {
  return request({
    url: '/api/sys/role/page',
    method: 'get',
    params: data
  })
}
