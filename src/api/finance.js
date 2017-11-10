import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function sendBack(id) {    // 新增功能分类
  return fetch({
    url: `/finance/withdraw_record/${id}/status`,
    method: 'POST'
  })
}
