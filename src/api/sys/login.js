import request from '@/plugin/axios'

export function sysLogin (data) {
  return request({
    url: '/sys/login',
    method: 'get',
    params:data
  })
}
