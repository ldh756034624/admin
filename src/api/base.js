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

export function createBankCard(data) {    // 创建新的银行
  return fetch({
    url: '/basis/bank',
    method: 'post',
    data
  })
}

export function updateBankCard(data) {    // 编辑银行
  return fetch({
    url: '/basis/bank',
    method: 'put',
    data
  })
}

export function changeBankStatus(id) {    // 启用/关闭银行卡
  return fetch({
    url: `/basis/bank/${id}/status`,
    method: 'put'
  })
}

export function createAdmin(data) {    // 创建新的管理员
  return fetch({
    url: '/basis/user',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {    // 编辑管理员
  return fetch({
    url: '/basis/user',
    method: 'put',
    data
  })
}
