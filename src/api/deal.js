import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function insertData(data) {    // 获取table列表,通用
  return fetch({
    url: '/transaction/card_coupons/list',
    method: 'post',
    data
  })
}

export function changeBatchStatus(id) {    // 改变批次状态，启用禁用
  return fetch({
    url: `/transaction/card_coupons/${id}/status`,
    method: 'put'
  })
}

export function HotelRefund(data){
  return fetch({
    url:'/hotel/order/status',
    method:'put',
    data
  })
}
