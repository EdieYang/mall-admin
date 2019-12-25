// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'
// 表格
import D2Crud from '@d2-projects/d2-crud'
// MD5加密
import md5 from 'js-md5'
// SHA256加密
import sha256 from 'js-sha256'
// 时间格式转换
import moment from 'moment'
// 菜单和路由设置
import router from './router'
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'
import VueUeditorWrap from 'vue-ueditor-wrap'

// 核心插件
Vue.use(d2Admin)
// 表格
Vue.use(D2Crud)
Vue.component('vue-ueditor-wrap', VueUeditorWrap)

// MD5加密
Vue.prototype.$md5 = md5
// Sha256加密
Vue.prototype.$sha256 = sha256
Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {},
  mounted() {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    '$route.matched'(val) {
      let fullAside = this.$store.state.d2admin.menu.fullAside
      const _side = fullAside.filter(menu => menu.path === val[0].path)
      this.$store.commit(
        'd2admin/menu/asideSet',
        _side.length > 0 ? _side[0].children : []
      )
    }
  }
}).$mount('#app')
