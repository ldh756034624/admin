import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function addFn(data) {    // 新增功能
  return fetch({
    url: '/community/banner_type',
    method: 'POST',
    data
  })
}

export function upadateFn(data) {    // 编辑增加的功能
  return fetch({
    url: '/community/banner_type',
    method: 'put',
    data
  })
}
