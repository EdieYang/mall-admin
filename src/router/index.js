import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

// 固定菜单与路由
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'
//路由与组件映射关系
import routerMapComponents from '@/routerMapComponents'
// import * as userService from "@/api/sys/user";

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

let permissionMenu, permissionRouter = []

let permission = {
  functions: [],
  roles: [],
  isAdmin: false
}



//标记是否已经拉取权限信息
let isFetchPermissionInfo = false

let fetchPermissionInfo = async () => {
  //处理动态添加的路由
  const formatRoutes = function(routes) {
    routes.forEach(route => {
      route.component = routerMapComponents[route.component]
      if (route.children) {
        formatRoutes(route.children)
      }
    })
  }

  try {
    let respMock='{"userName":"MenuManager","userRoles":["R_MENUADMIN"],"userPermissions":["p_menu_view","p_menu_edit","p_menu_menu"],"accessMenus":[{"title":"设置","path":"/system","icon":"cogs","children":[{"title":"客服设置","path":"/settings/customerSupport/index","icon":"th-list"}]},{"title":"商户管理","path":"/shop","icon":"address-book-o","children":[{"path":"/shop/shop/index","title":"商家列表","icon":""},{"path":"/shop/businessArea/index","title":"商圈列表","icon":""},{"path":"/shop/shopSysUser/index","title":"商家管理员列表","icon":""}]},{"title":"商品管理","path":"/commodity","icon":"shopping-bag","children":[{"path":"/commodity/commoditylist/index","title":"商品列表","icon":""}]}],"accessRoutes":[{"name":"shop","path":"/shop","component":"layoutHeaderAside","componentPath":"layout/header-aside/layout","meta":{"title":"商户管理","cache":true},"children":[{"name":"shopList","path":"shop/index","component":"shopList","meta":{"title":"商家列表","cache":true}},{"name":"shopDetail","path":"shop/new","component":"shopDetail","meta":{"title":"商家信息","cache":true}},{"name":"businessAreaList","path":"businessArea/index","component":"businessAeraList","meta":{"title":"商圈信息","cache":true}},{"name":"shopSysUser","path":"shopSysUser/shopIndex","component":"shopSysUser","meta":{"title":"商家管理员信息","cache":true}},{"name":"shopSysUserList","path":"shopSysUser/index","component":"shopSysUserList","meta":{"title":"商家管理员列表","cache":true}}]},{"name":"commodity","path":"/commodity","component":"layoutHeaderAside","componentPath":"layout/header-aside/layout","meta":{"title":"商品管理","cache":true},"children":[{"name":"commodityList","path":"commoditylist/index","component":"commodityList","meta":{"title":"商品列表","cache":true}},{"name":"commodityDetail","path":"commoditylist/new","component":"commodityDetail","meta":{"title":"商品信息","cache":true}}]},{"name":"settings","path":"/settings","component":"layoutHeaderAside","componentPath":"layout/header-aside/layout","meta":{"title":"设置","cache":true},"children":[{"name":"customerSupport","path":"customerSupport/index","component":"customerSupport","meta":{"title":"客服设置","cache":true}}]}],"accessInterfaces":[],"isAdmin":0,"avatarUrl":"https://api.adorable.io/avatars/85/abott@adorable.png"}'
    let userPermissionInfo = JSON.parse(respMock)
    permissionMenu = userPermissionInfo.accessMenus
    permissionRouter = userPermissionInfo.accessRoutes
    permission.functions = userPermissionInfo.userPermissions
    permission.roles = userPermissionInfo.userRoles
    permission.interfaces = util.formatInterfaces(userPermissionInfo.accessInterfaces)
    permission.isAdmin = userPermissionInfo.isAdmin == 1
  } catch (ex) {
    console.log(ex)
  }


  formatRoutes(permissionRouter)
  let allMenuAside = [...menuAside, ...permissionMenu]
  let allMenuHeader = [...menuHeader, ...permissionMenu]
  //动态添加路由
  router.addRoutes(permissionRouter);
  // 处理路由 得到每一级的路由设置
  store.commit('d2admin/page/init', [...frameInRoutes, ...permissionRouter])
  // 设置顶栏菜单
  store.commit('d2admin/menu/headerSet', allMenuHeader)
  // 设置侧边栏菜单
  store.commit('d2admin/menu/fullAsideSet', allMenuAside)
  // 初始化菜单搜索功能
  store.commit('d2admin/search/init', allMenuHeader)
  // 设置权限信息
  store.commit('d2admin/permission/set', permission)
  // 加载上次退出时的多页列表
  store.dispatch('d2admin/page/openedLoad')
  await Promise.resolve()
}
//免校验token白名单
let whiteList = ['/login']


/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  // await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  // await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // const token = util.cookies.get('token')
  const token='111'
  if (whiteList.indexOf(to.path) === -1) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (token && token !== 'undefined') {
      debugger
      //拉取权限信息
      if (!isFetchPermissionInfo) {
        await fetchPermissionInfo();
        isFetchPermissionInfo = true;
        next(to.path, true)
      } else {
        next()
      }
    } else {
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect', to.fullPath)
      // 没有登录的时候跳转到登录界面
      next({
        name: 'login'
      })
    }
  } else {
    if (to.name === 'login') {
      // 如果已经登录，则直接进入系统
      if (token && token !== undefined) {
        next(from.path, true);
        NProgress.done()
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
