import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  },
  {
    path: '/shop',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: 'shop/index',
        name: 'shopList',
        meta: {
          title: '商家列表',
          auth: true
        },
        component: _import('shop/shop/index')
      },
      {
        path: 'shop/new',
        name: 'shopDetail',
        meta: {
          title: '商家信息',
          auth: true
        },
        component: _import('shop/shop/new')
      },
      {
        path: 'businessArea/index',
        name: 'businessAreaList',
        meta: {
          title: '商圈信息',
          auth: true
        },
        component: _import('shop/businessArea/index')
      }
    ]
  },
  {
    path: '/commodity',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: 'index',
        name: 'commodityList',
        meta: {
          title: '商品管理',
          auth: true
        },
        component: _import('commodity/index')
      },
      {
        path: 'new',
        name: 'commodityDetail',
        meta: {
          title: '商品信息',
          auth: true
        },
        component: _import('commodity/new')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [...frameIn, ...frameOut, ...errorPage]
