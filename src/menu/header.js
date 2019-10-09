// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  { path: '/shop/index', title: '商家管理', icon: 'address-book-o' },
  {
    path: '', title: '商品管理', icon: 'shopping-bag',
    children: [
      {
        path: '/commodity/index',
        title: '商品列表',
        icon: ''
      }
    ]
  }
]
