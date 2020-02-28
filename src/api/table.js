import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}


//角色管理列表
export function getBackRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}


//资源管理列表
export function getBackResources() {
  return request({
    url: '/resources',
    method: 'get'
  })
}