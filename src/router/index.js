import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

/* login */
const Login = _import('login/index')

/* dashboard */
const dashboard = _import('dashboard/index')

/* error page */
const Err404 = _import('404')


/* 系统设置*/
const systemMenus = _import('systems/menus')
const systemRoles = _import('systems/roles')
const systemUsers = _import('systems/users')
const systemDepartment = _import('systems/department')
const systemLogs = _import('systems/logs')
const systemAction = _import('systems/action')
const systemBusiness = _import('systems/node')
const BusinessLayout = _import('systems/index')

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {   // 默认打开工作台
    path: '',
    component: Layout,
    redirect: '/work',
    meta_name: 'Home2',
    icon: 'zujian',
    noDropdown: true,
    children: [{ path: 'work', component: dashboard, name: '我的工作台' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta_name :   用来控制路由表的动态显示 对应菜单管理的route_name
  * 当前版本没有权限设置
  **/

export const asyncRouterMap = [
  {
    path: '/systems',
    component: Layout,
    redirect: 'noredirect',
    name: '系统设置',
    meta_name: 'Systems',
    icon: 'zujian',
    children: [
      { path: 'menus', component: systemMenus, name: '菜单管理', meta_name: 'systemMenus' },
      { path: 'roles', component: systemRoles, name: '角色管理', meta_name: 'systemRoles' },
      { path: 'users', component: systemUsers, name: '系统用户', meta_name: 'systemUsers' },
      { path: 'department', component: systemDepartment, name: '部门管理', meta_name: 'systemDepartment' },
      { path: 'menus/action/:id', component: systemAction, name: 'actions', hidden: true, meta_name: 'systemAction' }
    ]
  }
]
