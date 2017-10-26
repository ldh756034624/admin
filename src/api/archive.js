import fetch from '@/utils/fetch'

export function getWaitAchiveList(query) {
  return fetch({
    url: '/admin/archivemanage/archive',  // 获取待归档列表
    method: 'get',
    params: query
  })
}

export function saveWaitAchive(data, id) {
  return fetch({
    url: '/admin/archivemanage/archive/' + id,  // 归档
    method: 'put',
    data
  })
}

export function getAchivedList(query) {
  return fetch({
    url: '/admin/archivemanage/archive-finish',  // 获取已归档列表
    method: 'get',
    params: query
  })
}

export function getAchivedDetail(id) {
  return fetch({
    url: '/admin/archivemanage/archive/' + id + '/edit',  // 获取已归档文件
    method: 'get'
  })
}
