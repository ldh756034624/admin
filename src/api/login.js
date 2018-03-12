import fetch from '@/utils/fetch'

export function login(name, password) {    // 登录
  return fetch({
    url: '/user/login',
    method: 'post',
    data: {
      name,
      password
    }
  })
}

export function getRouterInfo(token) {
  return fetch({
    url: '/admin/menus',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'get'
  })
}

export function getDashboard() {
  return fetch({
    url: '/basis/statistics',
    method: 'get'
  })
}

export function getDashboard1(params) {
  console.log(params)
  return fetch({
    url: '/basis/sys/funds/info',
    method: 'get',
    params
  })
}


