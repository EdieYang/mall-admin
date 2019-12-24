import request from '@/plugin/axios'

export function getUserPage(data) {
  return request({
    url: '/api/sys/user/page',
    method: 'get',
    params: data
  })
}
export function getUser(data) {
  return request({
    url: '/api/sys/user',
    method: 'get',
    params: data
  })
}
export function saveUser(data) {
  return request({
    url: '/api/sys/user',
    method: 'post',
    data
  })
}
export function uptUser(data) {
  return request({
    url: '/api/sys/user',
    method: 'put',
    data
  })
}
export function delUser(data) {
  return request({
    url: '/api/sys/user',
    method: 'delete',
    params: data
  })
}
