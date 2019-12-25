import request from '@/plugin/axios'

export function getPermissionPage(data) {
  return request({
    url: '/api/sys/permission/page',
    method: 'get',
    params: data
  })
}
export function getPermission(data) {
  return request({
    url: '/api/sys/permission',
    method: 'get',
    params: data
  })
}
export function savePermission(data) {
  return request({
    url: '/api/sys/permission',
    method: 'post',
    data
  })
}
export function uptPermission(data) {
  return request({
    url: '/api/sys/permission',
    method: 'put',
    data
  })
}
export function delPermission(data) {
  return request({
    url: '/api/sys/permission',
    method: 'delete',
    params: data
  })
}
export function delPermissoins(data) {
  return request({
    url: '/api/sys/permission/batch',
    method: 'delete',
    params: data
  })
}
export function getPermissionPageByRoleId(data) {
  return request({
    url: '/api/sys/role/permission/page',
    method: 'get',
    params: data
  })
}
export function crtRolePermission(data) {
  return request({
    url: '/api/sys/role/permission',
    method: 'post',
    params: data
  })
}
export function delRolePermission(data) {
  return request({
    url: '/api/sys/role/permission',
    method: 'delete',
    params: data
  })
}
