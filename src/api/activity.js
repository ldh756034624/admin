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
