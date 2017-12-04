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

export function banAdmin(id) {    // 启用禁用管理员
  return fetch({
    url: `/basis/user/${id}/status`,
    method: 'put'
  })
}

export function accountToBlacklist(data) {    // 添加帐号到黑名单
  return fetch({
    url: '/account/black/Account',
    method: 'post',
    data
  })
}

export function phoneToBlacklist(data) {    // 添加手机到黑名单
  return fetch({
    url: '/account/black/imei',
    method: 'post',
    data
  })
}

export function createImage(data) {    // 增加新的图片文件
  return fetch({
    url: '/basis/image',
    method: 'post',
    data
  })
}

export function updateImage(data) {    // 编辑图片文件
  return fetch({
    url: '/basis/image',
    method: 'put',
    data
  })
}

export function createVer(data) {    // 新建版本
  return fetch({
    url: '/basis/version',
    method: 'post',
    data
  })
}

export function updateVer(data) {    // 编辑版本
  return fetch({
    url: '/basis/version',
    method: 'put',
    data
  })
}

export function delVer(id) {    // 删除版本
  return fetch({
    url: '/basis/version/' + id,
    method: 'delete'
  })
}

export function createWhiteList(data) {    // 新建白名单
  return fetch({
    url: '/basis/white_list',
    method: 'post',
    data
  })
}

export function updateWhiteList(data) {    // 编辑白名单
  return fetch({
    url: '/basis/white_list',
    method: 'put',
    data
  })
}

export function cancelWhiteList(id) {    // 取消白名单
  return fetch({
    url: `/basis/white_list/${id}/status`,
    method: 'put'
  })
}

export function getNickName(params) {    // 获取table列表,通用
  return fetch({
    url: '/basis/user/nick_name',
    method: 'get',
    params
  })
}
