import request from '@/plugin/axios'

export function sysLogin(data) {
  return request({
    url: '/api/sys/login',
    method: 'get',
    params: data
  })
}
export function getSysUserPermission(data) {
  return request({
    url: '/api/sys/login/permission',
    method: 'get',
    params: data
  })
}
