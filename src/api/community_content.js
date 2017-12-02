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

export function addArtAssort(data) {    // 新增文章分类
  return fetch({
    url: '/article/category',
    method: 'POST',
    data
  })
}

export function upadateArtAssort(data) {    // 编辑文章分类
  return fetch({
    url: '/article/category',
    method: 'put',
    data
  })
}

export function delArtAssort(id) {    // 删除文章分类
  return fetch({
    url: '/article/category/' + id,
    method: 'delete',
  })
}

export function addArt(data) {    // 新增文章
  return fetch({
    url: '/article/',
    method: 'POST',
    data
  })
}

export function upadateArt(data) {    // 编辑文章
  return fetch({
    url: '/article/',
    method: 'put',
    data
  })
}

export function delArt(id) {    // 删除文章
  return fetch({
    url: '/article/' + id,
    method: 'delete',
  })
}

export function addSinglePage(data) {    // 新增单网页
  return fetch({
    url: '/html/',
    method: 'POST',
    data
  })
}

export function upadateSinglePage(data) {    // 编辑单网页
  return fetch({
    url: '/html/',
    method: 'put',
    data
  })
}

export function delSinglePage(id) {    // 删除单网页
  return fetch({
    url: '/html/' + id,
    method: 'delete',
  })
}

export function addAnnounce(data) {    // 新增公告
  return fetch({
    url: '/community/announcement',
    method: 'POST',
    data
  })
}

export function upadateAnnounce(data) {    // 编辑公告
  return fetch({
    url: '/community/announcement',
    method: 'put',
    data
  })
}

export function delAnnounce(id) {    // 启用禁用公告
  return fetch({
    url: `/community/announcement/${id}`,
    method: 'delete'
  })
}

export function addGoodsAssort(data) {    // 新增商品分类
  return fetch({
    url: '/transaction/goods_type',
    method: 'POST',
    data
  })
}

export function upadateGoodsAssort(data) {    // 编辑商品分类
  return fetch({
    url: '/transaction/goods_type',
    method: 'put',
    data
  })
}
