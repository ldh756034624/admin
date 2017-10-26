import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* dashboard */
const dashboard = _import('dashboard/index');

/* error page */
const Err404 = _import('404');

/* demo page */
const Form = _import('page/form');
const Table = _import('table/index');

/* 系统设置*/
const systemMenus = _import('systems/menus');
const systemRoles = _import('systems/roles');
const systemUsers = _import('systems/users');
const systemDepartment = _import('systems/department');
const systemLogs = _import('systems/logs');
const systemAction = _import('systems/action');
const systemBusiness = _import('systems/node');
const BusinessLayout = _import('systems/index');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta_name :   用来控制路由表的动态显示 对应菜单管理的route_name
  **/
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
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
});

export const asyncRouterMap = [
  {
    path: '/customer',
    component: Layout,
    redirect: 'noredirect',
    name: '客户管理',
    meta_name: 'Customer',
    icon: 'zujian',
    children: [
      { path: 'enterprise', component: enterpriseList, name: '企业客户管理', meta_name: 'enterpriseList' },
      { path: 'enterprise/add/', component: enterpriseEdit, name: '新增企业管理', hidden: true, meta_name: 'enterpriseEdit' },
      { path: 'guarantee', component: guaranteeList, name: '企业担保客户管理', meta_name: 'guaranteeList' }
    ]
  },
  {
    path: '/loan',
    component: Layout,
    redirect: 'noredirect',
    name: '贷款受理',
    meta_name: 'LoanApply',
    icon: 'zujian',
    children: [
      { path: 'apply', component: loanApplyList, name: '贷款申请', meta_name: 'loanApplyList' },
      { path: 'apply/add/', component: loanApplyEdit, name: '贷款申请编辑', hidden: true, meta_name: 'loanApplyEdit' },
      { path: 'approval', component: waitApprovalList, name: '待审批', meta_name: 'waitApprovalList' },
      { path: 'recheack', component: recheckList, name: '复审', meta_name: 'recheckList' },
      { path: 'approved', component: approvedList, name: '已审批记录', meta_name: 'approvedList' }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
