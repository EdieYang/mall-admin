const files = require.context('./', true, /\.js$/);
import layoutHeaderAside from '@/layout/header-aside'

let componentMaps = {
    "layoutHeaderAside": layoutHeaderAside,
    "shopList": () => import('@/views/shop/shop/index'),
    "shopDetail": () => import('@/views/shop/shop/new'),
    "businessAreaList": () => import('@/views/shop/businessArea/index'),
    "shopSysUser": () => import('@/views/shop/shopSysUser/shopIndex'),
    "shopSysUserList": () => import('@/views/shop/shopSysUser/index'),
    "commodityList": () => import('@/views/commodity/commoditylist/index'),
    "commodityDetail": () => import('@/views/commodity/commoditylist/new'),
    "customerSupport": () => import('@/views/settings/customerSupport/index'),
    "menu": () => import(/* webpackChunkName: "menu" */'@/views/sys/menu'),
    "route": () => import(/* webpackChunkName: "route" */'@/views/sys/route'),
    "role": () => import(/* webpackChunkName: "role" */'@/views/sys/role'),
    "user": () => import(/* webpackChunkName: "user" */'@/views/sys/user'),

}
files.keys().forEach((key) => {
    if (key === './index.js') return
    Object.assign(componentMaps, files(key).default)
})
export default componentMaps