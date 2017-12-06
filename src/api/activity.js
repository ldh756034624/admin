import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function addGame(data) {    // 增加活动
  return fetch({
    url: '/community/activity',
    method: 'POST',
    data
  })
}

export function updateGame(data) {    // 编辑活动
  return fetch({
    url: '/community/activity',
    method: 'put',
    data
  })
}

export function activeGame(id) {    // 开启或者关闭活动
  return fetch({
    url: '/community/activity/' + id + '/status',
    method: 'put'
  })
}
