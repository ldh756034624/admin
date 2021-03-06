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

export function addBigRich(data) {    // 增加大富贵期数
  return fetch({
    url: '/activity/bigRich',
    method: 'POST',
    data
  })
}

export function updateBigRich(data) {    // 编辑大富贵期数
  return fetch({
    url: '/activity/bigRich',
    method: 'PUT',
    data
  })
}

export function enableBigRich(id, status) {    // 启用、禁用大富贵期数
  return fetch({
    url: `/activity/bigRich/${id}/${status}`,
    method: 'PUT'
  })
}

export function addBigRichUser(data) {    // 添加中奖人
  return fetch({
    url: '/activity/bigRich/user',
    method: 'POST',
    data
  })
}

export function addProject(data) {    // 添加专题
  return fetch({
    url: '/goodsTopic/type',
    method: 'POST',
    data
  })
}

export function updateProject(data) {    // 编辑专题
  return fetch({
    url: '/goodsTopic/type',
    method: 'PUT',
    data
  })
}

export function addProjectModule(data) {    // 添加专题模块
  return fetch({
    url: '/goodsTopic/module',
    method: 'POST',
    data
  })
}

export function updateProjectModule(data) {    // 编辑专题模块
  return fetch({
    url: '/goodsTopic/module',
    method: 'PUT',
    data
  })
}

export function delProjectModule(id) {    // 删除专题模块
  return fetch({
    url: '/goodsTopic/module/del/' + id,
    method: 'PUT'
  })
}

export function addCoupon(data) {    // 添加优惠券
  return fetch({
    url: '/addCoupons',
    method: 'POST',
    data
  })
}

export function updateCoupon(data, id) {    // 编辑优惠券
  return fetch({
    url: `/updateCoupons/${id}`,
    method: 'POST',
    data
  })
}

export function sendCoupon(params) {    // 赠送优惠券
  return fetch({
    url: `/coupons/send`,
    method: 'POST',
    params
  })
}