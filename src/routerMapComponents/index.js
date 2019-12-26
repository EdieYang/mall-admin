const files = require.context('./', true, /\.js$/)
import layoutHeaderAside from '@/layout/header-aside'

let componentMaps = {
  layoutHeaderAside: layoutHeaderAside,
  shopList: () => import('@/views/shop/shop/index'),
  shopNew: () => import('@/views/shop/shop/new'),
  businessAreaList: () => import('@/views/shop/businessArea/index'),
  shopUser: () => import('@/views/shop/shopUser/shopIndex'),
  shopUserList: () => import('@/views/shop/shopUser/index'),
  commodityList: () => import('@/views/commodity/commoditylist/index'),
  commodityDetail: () => import('@/views/commodity/commoditylist/new'),
  customerSupport: () => import('@/views/settings/customerSupport/index'),
  menu: () => import(/* webpackChunkName: "menu" */ '@/views/sys/menu'),
  route: () => import(/* webpackChunkName: "route" */ '@/views/sys/route'),
  permission: () =>
    import(/* webpackChunkName: "route" */ '@/views/sys/permission'),
  role: () => import(/* webpackChunkName: "role" */ '@/views/sys/role'),
  user: () => import(/* webpackChunkName: "user" */ '@/views/sys/user')
}
files.keys().forEach(key => {
  if (key === './index.js') return
  Object.assign(componentMaps, files(key).default)
})
export default componentMaps
