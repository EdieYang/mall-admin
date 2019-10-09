import request from '@/plugin/axios'

export function Login(data) {
  return request({
    url: '/api/sysUser/login',
    method: 'get',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    params: data
  })
}
