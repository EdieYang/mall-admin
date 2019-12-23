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
        param: data
    })
}
export function saveMenu(data) {
    return request({
        url: '/api/sys/menu',
        method: 'post',
        data
    })
}
export function delMenu(data) {
    return request({
        url: '/api/sys/menu',
        method: 'update',
        param: data
    })
}