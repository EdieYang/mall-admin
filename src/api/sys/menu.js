import request from '@/plugin/axios'

export function getMenuList() {
  return request({
    url: '/api/sys/menu/list',
    method: 'get'
  })
}
export function getMenu(data) {
  return request({
    url: '/api/sys/menu',
    method: 'get',
    params: data
  })
}
export function saveMenu(data) {
  return request({
    url: '/api/sys/menu',
    method: 'post',
    data
  })
}
export function uptMenu(data) {
  return request({
    url: '/api/sys/menu',
    method: 'put',
    data
  })
}
export function delMenu(data) {
  return request({
    url: '/api/sys/menu',
    method: 'delete',
    params: data
  })
}
