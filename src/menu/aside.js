// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    path: '/shop',
    title: '商户管理',
    icon: 'address-book-o',
    children: [
      {
        path: '/shop/shop/index',
        title: '商家列表',
        icon: ''
      },
      {
        path: '/shop/businessArea/index',
        title: '商圈列表',
        icon: ''
      },
      {
        path: '/shop/shopSysUser/index',
        title: '商家管理员列表',
        icon: ''
      }
    ]
  },
  {
    path: '/commodity',
    title: '商品管理',
    icon: 'shopping-bag',
    children: [
      {
        path: '/commodity/index',
        title: '商品列表',
        icon: ''
      }
    ]
  }
]
