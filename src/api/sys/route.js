import request from '@/plugin/axios'

export function getRouteList() {
  return request({
    url: '/api/sys/route/list',
    method: 'get'
  })
}
export function getRoute(data) {
  return request({
    url: '/api/sys/route',
    method: 'get',
    params: data
  })
}
export function saveRoute(data) {
  return request({
    url: '/api/sys/route',
    method: 'post',
    data
  })
}
export function uptRoute(data) {
  return request({
    url: '/api/sys/route',
    method: 'put',
    data
  })
}
export function delRoute(data) {
  return request({
    url: '/api/sys/route',
    method: 'delete',
    params: data
  })
}
