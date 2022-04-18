import {request} from "@/network/request";

export function getAllMenus() {
  return request({
    url: '/menu/getAllMenus',
    method: 'get'
  })
}

export function getAllPermissions() {
  return request({
    url: '/permission/getAllPermissions',
    method: 'get'
  })
}

export function getAllRoles(pageNum, pageSize, keyword) {
  return request({
    url: '/role/getAllRoles',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      keyword
    }
  })
}

export function getPermissionByRoleId(id) {
  return request({
    url: '/permission/getPermissionByRoleId',
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/deleteRole',
    method: 'get',
    params: {
      id
    }
  })
}

export function addPermissionOfRole(roleId, permissionIds) {
  return request({
    url: '/permission/addPermissionOfRole',
    method: 'post',
    data: {
      roleId,
      permissionIds
    },
  })
}

export function updateRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data,
  })
}

export function addNewRole(data) {
  return request({
    url: '/role/addNewRole',
    method: 'post',
    data
  })
}

export function queryAllUsers(pageSize, pageNum, keyword) {
  return request({
    url: '/user/queryAllUsers',
    method: 'get',
    params: {
      pageSize,
      pageNum,
      keyword
    }
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/deleteUser',
    method: "get",
    params: {
      id
    }
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

export function findRoleByUserId(id) {
  return request({
    url: '/role/findRoleByUserId',
    method: 'get',
    params: {
      id
    }
  })
}

export function addRoleOfUser(userId, roleIds) {
  return request({
    url: '/role/addRoleOfUser',
    method: 'post',
    data: {
      userId,
      roleIds
    },
  })
}
