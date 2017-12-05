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

/*活动管理*/
const activityList = _import('activity/activity_list')
const hongbao = _import('activity/hongbao')
const hongbaoPeople = _import('activity/hongbao_people')

/*社区管理*/
const functionAssort = _import('community/function_assort')
const functionList = _import('community/function_list')
const articleAssort = _import('community/article_assort')
const articleList = _import('community/article_list')
const announceList = _import('community/announce_list')
const singlePage = _import('community/single_page')

/*交易管理*/
const goodsList = _import('deal/goods_list')
const goodsAssort = _import('deal/goods_assort')
const insertGoodsData = _import('deal/insert_goods_data')
const orderList = _import('deal/list')

/*财务管理*/
const customer = _import('finance/customer')
const transfer = _import('finance/transfer')
const transfered = _import('finance/transfered')
const withdraw = _import('finance/withdraw')
const withDrawDetail = _import('finance/withdraw_detail')
const userInfo = _import('finance/user_info')
const moneyDetail = _import('finance/money_detail')
const vExchange = _import('finance/v_exchange')
const vDetail = _import('finance/v_detail')

/*基础设置*/
const accountBlacklist = _import('base/account_blacklist')
const addAccBlacklist = _import('base/add_acc_blacklist')
const phoneBlacklist = _import('base/phone_blacklist')
const whiteList = _import('base/white_list')
const addPhoneBlacklist = _import('base/add_phone_blacklist')
const params = _import('base/params')
const backCard = _import('base/bank_card')
const admins = _import('base/admins')
const roles = _import('base/roles')
const sysUsers = _import('base/sys_users')
const version = _import('base/version')
const fileManage = _import('base/file_manage')

/*日志管理*/
const withdrawApi = _import('log/withdraw_api')
const message = _import('log/message')

Vue.use(Router)

export const constantRouterMap = [
  {path: '/login', component: Login, hidden: true},
  {path: '/404', component: Err404, hidden: true},
  {   // 默认打开工作台
    path: '',
    component: Layout,
    redirect: 'work',
    meta_name: 'Home2',
    icon: 'zujian',
    noDropdown: true,
    children: [{path: 'work', component: dashboard, name: '我的工作台'}]
  }
]

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
    path: '/activity',
    component: Layout,
    redirect: 'noredirect',
    name: '活动管理',
    meta_name: 'Activity',
    icon: 'zujian',
    children: [
      {path: 'activityList', component: activityList, name: '活动列表', meta_name: 'activityList'},
      {path: 'hongbao', component: hongbao, name: '抢红包', meta_name: 'hongbao'},
      {path: 'hongbaoPeople', component: hongbaoPeople, name: '参与列表', meta_name: 'hongbaoPeople', hidden: true}
    ]
  },
  {
    path: '/community',
    component: Layout,
    redirect: 'noredirect',
    name: '社区管理',
    meta_name: 'Community',
    icon: 'zujian',
    children: [
      {path: 'fnassort', component: functionAssort, name: '功能', meta_name: 'functionAssort'},
      {path: 'fnlist', component: functionList, name: '功能列表', meta_name: 'functionList', hidden: true},
      {path: 'article_assort', component: articleAssort, name: '文章分类', meta_name: 'articleAssort', hidden: true},
      {path: 'article_list', component: articleList, name: '文章', meta_name: 'articleList'},
      {path: 'announce_list', component: announceList, name: '公告', meta_name: 'announceList'},
      {path: 'single_page', component: singlePage, name: '单网页', meta_name: 'singlePage'}
    ]
  },
  {
    path: '/deal',
    component: Layout,
    redirect: 'noredirect',
    name: '交易管理',
    meta_name: 'Deal',
    icon: 'zujian',
    children: [
      {path: 'goods_list', component: goodsList, name: '商品', meta_name: 'goodsList'},
      {path: 'goodsAssort', component: goodsAssort, name: '商品分类', meta_name: 'goodsAssort', hidden: true},
      {path: 'insertGoodsData', component: insertGoodsData, name: '导入数据', meta_name: 'insertGoodsData', hidden: true},
      {path: 'orderList', component: orderList, name: '订单', meta_name: 'orderList'}
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: 'noredirect',
    name: '财务管理',
    meta_name: 'Finance',
    icon: 'zujian',
    children: [
      {path: 'customer', component: customer, name: '用户管理', meta_name: 'customer'},
      {path: 'withdraw', component: withdraw, name: '提现管理', meta_name: 'withdraw'},
      {path: 'transfer', component: transfer, name: '转账', meta_name: 'transfer'},
      {path: 'vExchange', component: vExchange, name: 'V币兑换', meta_name: 'vExchange'},
      {path: 'transfered', component: transfered, name: '已操作转账', meta_name: 'transfered', hidden: true},
      {path: 'moneyDetail', component: moneyDetail, name: '钱包明细', meta_name: 'moneyDetail', hidden: true},
      {path: 'withDrawDetail', component: withDrawDetail, name: '提现明细', meta_name: 'withDrawDetail', hidden: true},
      {path: 'vDetail', component: vDetail, name: 'V币明细', meta_name: 'vDetail', hidden: true},
      {path: 'userInfo', component: userInfo, name: '用户信息', meta_name: 'userInfo', hidden: true}
    ]
  },
  {
    path: '/base',
    component: Layout,
    redirect: 'noredirect',
    name: '基础设置',
    meta_name: 'Base',
    icon: 'zujian',
    children: [
      {path: 'accountBlacklist', component: accountBlacklist, name: '账户黑名单', meta_name: 'accountBlacklist'},
      {
        path: 'addAccBlacklist',
        component: addAccBlacklist,
        name: '新增账户黑名单',
        meta_name: 'addAccBlacklist',
        hidden: true
      },
      {path: 'phoneBlacklist', component: phoneBlacklist, name: '手机黑名单', meta_name: 'phoneBlacklist'},
      {
        path: 'addPhoneBlacklist',
        component: addPhoneBlacklist,
        name: '新增手机黑名单',
        meta_name: 'addPhoneBlacklist',
        hidden: true
      },
      {path: 'whiteList', component: whiteList, name: '白名单', meta_name: 'whiteList'},
      {path: 'params', component: params, name: '参数配置', meta_name: 'params'},
      {path: 'backCard', component: backCard, name: '银行卡管理', meta_name: 'backCard'},
      {path: 'admins', component: admins, name: '管理员', meta_name: 'admins'},
      {path: 'roles', component: roles, name: '角色管理', meta_name: 'roles'},
      {path: 'sysUsers', component: sysUsers, name: '系统用户', meta_name: 'sysUsers'},
      {path: 'version', component: version, name: '版本管理', meta_name: 'version'},
      {path: 'fileManage', component: fileManage, name: '文件管理', meta_name: 'fileManage'}
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: 'noredirect',
    name: '日志管理',
    meta_name: 'Log',
    icon: 'zujian',
    children: [
      {path: 'withdrawApi', component: withdrawApi, name: '提现接口日志', meta_name: 'withdrawApi'},
      {path: 'message', component: message, name: '短信发送日志', meta_name: 'message'},
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

// 线上hack，暂时没有权限的做法，加入权限后，请删除该行
let routers = constantRouterMap.concat(asyncRouterMap)

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: routers
})
