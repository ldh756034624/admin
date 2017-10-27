import fetch from '@/utils/fetch'

export function login(phone, password) {    // 登录
  return fetch({
    url: '/admin/login',
    method: 'post',
    data: {
      phone,
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
    url: '/admin/logout',
    method: 'get'
  })
}


export function getDashboard() {
  return fetch({
    url: '/admin/dashboard',
    method: 'get'
  })
}


