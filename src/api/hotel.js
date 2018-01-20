import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function addHotel(data) {    // 增加酒店
  return fetch({
    url: '/hotel',
    method: 'POST',
    data
  })
}

export function updateHotel(data) {    // 编辑酒店
  return fetch({
    url: '/hotel',
    method: 'put',
    data
  })
}

export function changeHotelStatus(params) {    // 修改酒店状态
  return fetch({
    url: '/hotel/status',
    method: 'put',
    params
  })
}

export function changeRoomaStatus(params) {   //修改房间状态
  return fetch({
    url: '/hotel/room/status',
    method: 'put',
    params
  })
}