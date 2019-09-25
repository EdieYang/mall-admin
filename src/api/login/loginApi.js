import request from '@/plugin/axios'

export function Login (data) {
  return request({
    url: '/test/adopt/login/login',
    method: 'post',
    data
  })
}
