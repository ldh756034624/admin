import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function updateOrder(data) {    // 更新订单信息
  return fetch({
    url: '/order/express',
    method: 'post',
    data
  })
}
