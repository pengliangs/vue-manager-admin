/**
 * 用户管理相关操作
 */
import request from '@/utils/request'

//用户管理列表
export function getBackUsers(params) {
    return request({
      url: '/users',
      method: 'get',
      params
    })
}
  
//修改用户状态
export function switchBackUserStatus(id,status) {
    return request({
      url: `/users/${id}/status`,
      method: 'put',
      data:{status}
    })
}
  
//重置密码
export function restBoackPassword(id) {
  return request({
    url: `/users/${id}/password`,
    method: 'put'
  })
}