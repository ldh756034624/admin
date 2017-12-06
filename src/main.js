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

Vue.prototype.IMGUP_API = process.env.IMGUP_API   // 图片上传地址
Vue.prototype.FILE_API = process.env.FILE_API   // 文件上传地址

Vue.use(ElementUI)
Vue.component('icon-svg', IconSvg)

const whiteList = ['/login']

Vue.filter('formatDate', val => {   // 只有日期
  return formatDate(new Date(val), 'yyyy-MM-dd')
})

Vue.filter('formatDateTime', val => {   // 有日期和时间
  return formatDate(new Date(val), 'yyyy-MM-dd hh:mm:ss')
})

// Vue.directive('numberOnly', { // 只允许输入数字
//   // 当被绑定的元素插入到 DOM 中时……
//   bind(el) {
//     el.handler = function () {
//       el.children[0].value = el.children[0].value.replace(/\D+/, '')
//     }
//     el.addEventListener('input', el.handler)
//   },
//   unbind(el) {
//     el.removeEventListener('input', el.handler)
//   }
// })

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
      // console.log('设置路由信息')
      // store.dispatch('SetAdminMenus').then(() => {
      //   router.addRoutes(store.getters.addRouters)
      //   console.log('设置路由信息完成')
      //   next({...to})
      //   console.log('next走起')
      // })
      store.dispatch('SetAdminMenus')   // 去除权限后，生成左侧列表数据
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
