import fetch from '@/utils/fetch'

export function getTableData(url, params) {    // 获取table列表,通用
  return fetch({
    url,
    method: 'get',
    params
  })
}

export function createParams(data) {    // 创建新的参数
  return fetch({
    url: '/basis/param',
    method: 'post',
    data
  })
}

export function updateParams(data) {    // 编辑参数
  return fetch({
    url: '/basis/param',
    method: 'put',
    data
  })
}

export function delParams(id) {    // 删除参数
  return fetch({
    url: '/basis/param/' + id,
    method: 'delete',
  })
}

