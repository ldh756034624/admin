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

export function transfer(data) {    // 转账
  return fetch({
    url: `/finance/lottery/flow/record`,
    method: 'POST',
    data
  })
}

export function retransfer(id) {    // 重新转账
  return fetch({
    url: `/finance/lottery/flow/record/${id}/status`,
    method: 'put'
  })
}

export function batchImport(data) {    // 导入批次
  return fetch({
    url: `/batch/import`,
    method: 'POST',
    data
  })
}

export function batchRecharge(data) {    // 转账
  return fetch({
    url: `/batch/recharge`,
    method: 'POST',
    data
  })
}