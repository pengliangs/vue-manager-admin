import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/account/token',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/account/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/mock/user/logout',
    method: 'post'
  })
}


export function getMenus() {
  return request({
    url: '/mock/account/menus',
    method: 'get'
  })
}

