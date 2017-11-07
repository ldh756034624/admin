import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function addFn(data) {    // 新增功能分类
  return fetch({
    url: '/community/banner_type',
    method: 'POST',
    data
  })
}

export function banSort(id) {    // 新增功能分类
  return fetch({
    url: '/community/banner_type/status/' + id,
    method: 'put',
  })
}

export function upadateFn(data) {    // 编辑功能分类
  return fetch({
    url: '/community/banner_type',
    method: 'put',
    data
  })
}

export function addFunction(data) {    // 新增功能
  return fetch({
    url: '/community/banner',
    method: 'POST',
    data
  })
}

export function upadateFunction(data) {    // 编辑功能
  return fetch({
    url: '/community/banner',
    method: 'put',
    data
  })
}

export function delFunction(id) {    // 删除功能
  return fetch({
    url: '/community/banner/' + id,
    method: 'delete',
  })
}

export function addGoods(data) {    // 新增商品
  return fetch({
    url: '/community/goods',
    method: 'POST',
    data
  })
}

export function upadateGoods(data) {    // 编辑商品
  return fetch({
    url: '/community/goods',
    method: 'put',
    data
  })
}

export function changeGoodsStatus(id) {    // 上架下架商品
  return fetch({
    url: `/community/goods/${id}/status`,
    method: 'put',
  })
}
