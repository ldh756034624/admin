import fetch from '@/utils/fetch'

export function addFn(data) {    // 新增功能
  return fetch({
    url: '/community/banner_type',
    method: 'POST',
    data
  })
}

export function getTableData(url, params) {    // 获取table列表
  return fetch({
    url,
    method: 'get',
    params
  })
}
