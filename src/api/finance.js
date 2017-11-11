import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function sendBack(id) {    // 退回
  return fetch({
    url: `/finance/withdraw_record/${id}/status`,
    method: 'POST'
  })
}
