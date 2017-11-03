// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'   // bootstrap  样式
import '@/assets/iconfont/iconfont'
import IconSvg from '@/components/Icon-svg/index.vue'
import {getToken} from '@/utils/auth'
import * as filters from './filters' // 全局vue filter
import {formatDate} from './utils/index'


// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.component('icon-svg', IconSvg)

const whiteList = ['/login']

Vue.filter('formatDate', val => {   // 只有日期
  return formatDate(new Date(val), 'yyyy-MM-dd')
})

Vue.filter('formatDateTime', val => {   // 有日期和时间
  return formatDate(new Date(val), 'yyyy-MM-dd hh:mm:ss')
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      // store.dispatch('GetRouterInfo').then(res => {
      //   const routers = res.data
      //   store.dispatch('SetAdminMenus', {routers}).then(() => {
      //     router.addRoutes(store.getters.addRouters)
      //     next({...to})
      //   })
      // })

      // 去除权限，上面需要权限
      store.dispatch('SetAdminMenus').then(() => {
        router.addRoutes(store.getters.addRouters)
        next({...to})
      })
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
