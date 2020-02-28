/**
 * 用户管理相关操作
 */
import Mock from 'mockjs'


const userTable = Mock.mock({
  'items|30': [{
    id: '@id',
    loginName: '@sentence(5, 10)',
    'status|1': ['published', 'draft', 'deleted'],
    nickname:  '@sentence(3, 8)',
    'status|1': ['published', 'draft', 'deleted'],
    phone: '@id',
    email:'@email',
    ip:"127.0.0.1",
    status:0,
    createTime: '@datetime',
    updateTime: '@datetime',
    userRoles: [{ roleId: 9, uid: 26, roleName: "超级管理员" }]
  }]
})
export default [
    //获取用户列表
    {
      url: "/users",
      type: "get",
      response: config => {
        return {
          status: 200,
          result: {
            records: userTable.items,
            total: 30,
            size: 30,
            current: 1,
            searchCount: true,
            pages: 3
          }
        }
      }
    },
  //修改用户状态
  {
    url: "/users/\.*/status",
    type: "put",
    response: config => {
      return {status: 200}
    }
  },
  //重置密码
  {
    url:'/users/\.*/password',
    type:'put',
    response: config => {
      return {status: 200}
    }
  }
]