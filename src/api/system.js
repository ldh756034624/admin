
import fetch from '@/utils/fetch';

export function getTemplate(query) {    // 登录
  return fetch({
    url: '/admin/user/manager',
    method: 'get',
    params: query
  });
}

export function getAccessory(query) {     // 附件设置-首页
  return fetch({
    url: '/admin/system/attachment-type',
    method: 'get',
    params: query
  });
}

export function getAccessoryDetail(id) {     // 附件设置-详情
  return fetch({
    url: '/admin/system/attachment-type/' + id,
    method: 'get'
  });
}

export function updateItem(data, id) {     // 附件设置-更新项
  return fetch({
    url: '/admin/system/attachment-type/update-config/' + id,
    method: 'put',
    data: { data }
  });
}

export function updateGroup(data, id) {     // 附件设置-更新组
  return fetch({
    url: '/admin/system/attachment-type/' + id,
    method: 'put',
    data
  });
}

export function newGroup(data) {     // 附件设置-新增组
  return fetch({
    url: '/admin/system/attachment-type',
    method: 'post',
    data: { data }
  });
}

export function addNewItem(data, id) {     // 附件设置-新增项
  return fetch({
    url: '/admin/system/attachment-type/store-config/' + id,
    method: 'post',
    data: { data }
  });
}

export function deleteItem(id) {     // 附件设置-删除项
  return fetch({
    url: '/admin/system/attachment-type/destroy-config/' + id,
    method: 'delete'
  });
}

export function deleteGroup(id) {     // 附件设置-删除组
  return fetch({
    url: '/admin/system/attachment-type/' + id,
    method: 'delete'
  });
}

// 系统用户
export function getUserList(query) {
  return fetch({
    url: '/admin/user/manager',
    method: 'get',
    params: query
  });
}

export function addUser(data) {
  return fetch({
    url: '/admin/user/manager',
    method: 'post',
    data
  });
}

export function updateUser(data, id) {
  return fetch({
    url: '/admin/user/manager/' + id,
    method: 'put',
    data
  });
}

export function modifyStatus(id) {
  return fetch({
    url: '/admin/user/manager/' + id + '/status',
    method: 'get'
  });
}

export function getDatas() {
  return fetch({
    url: '/admin/user/manager/create',
    method: 'get'
  });
}


// 部门管理
export function getDepartmentList() {
  return fetch({
    url: '/admin/user/department',
    method: 'get'
  });
}

export function addDepartment(data) {
  return fetch({
    url: '/admin/user/department',
    method: 'post',
    data
  });
}

export function updateDepartment(data, id) {
  return fetch({
    url: '/admin/user/department/' + id,
    method: 'put',
    data
  });
}

export function deleteDepartment(id) {
  return fetch({
    url: '/admin/user/department/' + id,
    method: 'delete'
  })
}


// 角色管理
export function getRoleList() {
  return fetch({
    url: '/admin/user/role',
    method: 'get'
  });
}

export function getAddRole() {
  return fetch({
    url: '/admin/user/role/create',
    method: 'get'
  });
}

export function StoreAddRole(data) {
  return fetch({
    url: '/admin/user/role',
    method: 'post',
    data
  });
}

export function getEidtRole(id) {
  return fetch({
    url: '/admin/user/role/' + id + '/edit/',
    method: 'get'
  })
}

export function updateRole(data) {
  return fetch({
    url: '/admin/user/role/' + data.id,
    method: 'put',
    data
  });
}

export function deleteRole(id) {
  return fetch({
    url: '/admin/user/role/' + id,
    method: 'delete'
  })
}

export function getPermissions() {     // 获取权限
  return fetch({
    url: '/admin/user/role/create',
    method: 'get'
  })
}

  // ****菜单管理****/
export function getMenusList() {
  return fetch({
    url: '/admin/system/menu',
    method: 'get'
  });
}

export function storeMenus(data) {
  return fetch({
    url: '/admin/system/menu',
    method: 'post',
    data
  });
}

export function updateMenus(data) {
  return fetch({
    url: '/admin/system/menu/' + data.id,
    method: 'put',
    data
  });
}

export function checkStatus(id) {
  return fetch({
    url: '/admin/system/menu/' + id + '/status',
    method: 'get'
  });
}

export function deleteMenus(id) {
  return fetch({
    url: '/admin/system/menu/' + id,
    method: 'delete'
  });
}

// ****菜单绑定动作****/
export function getActionList(id) {
  return fetch({
    url: '/admin/system/menu/' + id + '/action',
    method: 'get'
  })
}

export function updateAction(data, id, action_id) {
  return fetch({
    url: '/admin/system/menu/' + id + '/action/' + action_id,
    method: 'put',
    data
  })
}

export function createAction(data, id) {
  return fetch({
    url: '/admin/system/menu/' + id + '/action/',
    method: 'post',
    data
  })
}

export function deleteAction(id, action_id) {
  return fetch({
    url: '/admin/system/menu/' + id + '/action/' + action_id,
    method: 'delete'
  })
}




// *******系统日志**********/
export function getLogsList(query) {
  return fetch({
    url: '/admin/system/log/data-change',
    method: 'get',
    params: query
  });
}


// *******时间节点**********/
export function getNodeList() {
  return fetch({
    url: '/admin/project/node/',
    method: 'get'
  });
}

export function updateNode(data) {
  return fetch({
    url: '/admin/project/node/update-multi',
    method: 'post',
    data
  })
}