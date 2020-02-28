/**
 * 菜单管理相关操作
 */
import request from '@/utils/request'

//用户管理列表
export function allMenus() {
    return request({
      url: '/menus',
      method: 'get'
    })
}