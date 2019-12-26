import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'
import page from '@/store/modules/d2admin/modules/page'

// 路由数据
import routes from './routes'

// 固定菜单与路由
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'
//路由与组件映射关系
import routerMapComponents from '@/routerMapComponents'
import * as loginService from '@/api/sys/login'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
let router = new VueRouter({
  routes
})

let permissionMenu,
  permissionRouter = []

let permission = {
  functions: [],
  roles: [],
  isAdmin: false
}

//标记是否已经拉取权限信息
let isFetchPermissionInfo = false

let clearRouteAndTabs = () => {
  let indexOpend = page.state.opened[0]
  page.state.opened = []
  page.state.opened.push(indexOpend)
  if (page.state.pool.length != 0) {
    let indexPool = page.state.pool[0]
    page.state.pool = []
    page.state.pool.push(indexPool)
  }
  const newRouter = new VueRouter({
    routes: []
  })
  // router.matcher = newRouter.matcher
}

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
    // let respMock =
    //   '{"userName":"MenuManager","userRoles":["R_MENUADMIN"],"userPermissions":["p_menu_view","p_menu_edit","p_menu_menu"],"accessMenus":[{"id":"2bf39892-f047-44b1-88d3-ccd7ea5c8c45","parentId":0,"title":"系统","path":"/system","icon":"cogs","sort":"1","children":[{"id":"1f3ea5ba-0d67-4710-b75c-52a267296b85","parentId":"52500348-50f0-4327-a898-9e4b9893f1a9","title":"菜单管理","path":"/system/menu","icon":"th-list","sort":"1"},{"id":"6db38bfe-9ad0-4db4-a9be-28082741ef20","parentId":"52500348-50f0-4327-a898-9e4b9893f1a9","path":"/system/route","title":"路由管理","sort":"2","icon":"share-alt-square"},{"id":"6db38bfe-9ad0-4db4-a9be-28082741ef12","parentId":"52500348-50f0-4327-a898-9e4b9893f1a9","path":"/system/permission","title":"权限管理","sort":"2","icon":"gavel"},{"id":"1a74ac59-001c-4914-874e-6dbefe33415c","parentId":"52500348-50f0-4327-a898-9e4b9893f1a9","title":"角色管理","path":"/system/role","sort":"3","icon":"users"},{"id":"d0d47bda-ab26-4909-a7f2-74bc2591a357","parentId":"52500348-50f0-4327-a898-9e4b9893f1a9","title":"用户管理","path":"/system/user","sort":"4","icon":"user"}]}],"accessRoutes":[{"id":"3af738f0-0792-4f34-aae9-3339d0ab12a7","parentId":0,"name":"System","path":"/system","permission":"","component":"layoutHeaderAside","componentPath":"layout/header-aside/layout","sort":"1","isLock":false,"children":[{"id":"aa4c13f7-f3eb-4d1e-aac2-c2b2f7f8d296","parentId":"3af738f0-0792-4f34-aae9-3339d0ab12a7","name":"MenuPage","path":"/system/menu","component":"menu","componentPath":"pages/sys/menu/index","sort":"2","meta":{"title":"菜单管理","cache":true}},{"id":"618e2e9c-8afe-4c64-b486-a4b08c752a81","parentId":"3af738f0-0792-4f34-aae9-3339d0ab12a7","name":"RoutePage","path":"/system/route","component":"route","componentPath":"pages/sys/route/index","sort":"3","meta":{"title":"路由管理","cache":true}},{"id":"618e2e9c-8afe-4c64-b486-a4b08c752a22","parentId":"3af738f0-0792-4f34-aae9-3339d0ab12a7","name":"PermissionPage","path":"/system/permission","component":"permission","componentPath":"pages/sys/route/index","sort":"3","meta":{"title":"权限管理","cache":true}},{"id":"67a76a8f-c765-4015-bebd-03edc3170e63","parentId":"3af738f0-0792-4f34-aae9-3339d0ab12a7","name":"RolePage","path":"/system/role","component":"role","sort":"3","componentPath":"pages/sys/role/index","meta":{"title":"角色管理","cache":true}},{"id":"58c5bc63-dfdc-413c-9bd6-b827ef06203e","parentId":"3af738f0-0792-4f34-aae9-3339d0ab12a7","componentPath":"pages/sys/user/index","sort":"4","component":"user","path":"/system/user","name":"UserPage","meta":{"title":"用户管理","cache":true}},{"id":"d8808450-aa31-4a4a-817d-e49c8eee983b","parentId":"3af738f0-0792-4f34-aae9-3339d0ab12a7","name":"InterfacePage","path":"/system/interface","component":"interface","sort":"5","meta":{"title":"接口管理"}}],"meta":{"title":"系统设置","cache":true}}],"accessInterfaces":[],"isAdmin":0,"avatarUrl":"https://api.adorable.io/avatars/85/abott@adorable.png"}'

    // // let userPermissionInfo = JSON.parse(respMock)
    const userId = util.cookies.get('userId')
    let userPermissionInfo = await loginService.getSysUserPermission({
      userId: userId
    })
    console.log(userPermissionInfo)
    permissionMenu = userPermissionInfo.accessMenus
    permissionRouter = userPermissionInfo.accessRoutes
    permission.roles = userPermissionInfo.userRoles
  } catch (ex) {
    console.log(ex)
  }

  formatRoutes(permissionRouter)
  let allMenuAside = [...menuAside, ...permissionMenu]
  let allMenuHeader = [...menuHeader, ...permissionMenu]
  //动态添加路由
  router.addRoutes(permissionRouter)
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
  await Promise.resolve()
}
//免校验token白名单
let whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  const token = util.cookies.get('token')
  const userId = util.cookies.get('userId')
  if (whiteList.indexOf(to.path) === -1) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (
      token &&
      typeof token !== 'undefined' &&
      userId &&
      typeof userId !== 'undefined'
    ) {
      //拉取权限信息
      if (!isFetchPermissionInfo) {
        await fetchPermissionInfo()
        isFetchPermissionInfo = true
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
      NProgress.done()
    }
  } else {
    if (to.name === 'login') {
      isFetchPermissionInfo = false
      clearRouteAndTabs()
      // 如果已经登录，则直接进入系统
      if (token && token !== undefined) {
        next(from.path, true)
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
