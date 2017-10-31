import { asyncRouterMap, constantRouterMap } from '@/router/index';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param names
 * @param route
 */
 function hasPermission(names, route) {
   if (route.name && route.name.length) {
    // 过滤route 如果router的名字和权限的route_name相等 或者 route的route.hidden为true都符合
    return names.some(obj => route.meta_name === obj.route_name || route.hidden)
   } else {
     return true;
   }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, names) {
  const accessedRouters = [];
  asyncRouterMap.forEach(route => {
    if (hasPermission(names, route)) {
      if (route.children && route.children.length > 0 && route.name != '贷款受理') {
        let childNames = []
        names.forEach(function(item) {
          if (route.meta_name == item.route_name) {
            childNames = item.child
          }
        })
        route.children = filterAsyncRouter(route.children, childNames)
      }
      // 修改路由名称
      names.forEach(function(item) {
        if (route.meta_name == item.route_name) {
          route.name = item.name
        }
      })

      accessedRouters.push(route)
    }
  })
  return accessedRouters
}



const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    SetAdminMenus({ commit }, data) {
      return new Promise(resolve => {
        let accessedRouters
        // 需要权限时，下面两个放开
        // let rout = data.routers[0].child;
        // accessedRouters = filterAsyncRouter(asyncRouterMap, rout)
        accessedRouters = asyncRouterMap
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;
