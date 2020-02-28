import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

const roleTable = Mock.mock({
  'items|30': [{
    id: '@id',
    roleName: '@sentence(5, 10)',
    'status|1': ['published', 'draft', 'deleted'],
    remark:  '@sentence(5, 10)',
    'status|1': ['published', 'draft', 'deleted'],
    createTime: '@datetime',
    updateTime: '@datetime',
    menuIds: [1,2,3,4]
  }]
})

const resoucesTable = Mock.mock({
  'items|30': [{
    id: '@id',
    resourceName: '@sentence(2, 6)',
    'status|1': ['published', 'draft', 'deleted'],
    mapping:  '@sentence(2, 6)',
    'status|1': ['published', 'draft', 'deleted'],
    method:'GET',
    authType: 2,
    perm:"GET:/user/andy/income/expenditure/page",
    updateTime: '@datetime'
  }]
})

export default [
  //资源管理
  {
    url: "/resources",
    type: "get",
    response: config => {
      return {
        status: 200,
        result: {
          records: resoucesTable.items,
          total: 30,
          size: 30,
          current: 1,
          searchCount: true,
          pages: 3
        }
      }
    }
  },
  //角色管理
  {
    url: "/roles",
    type: "get",
    response: config => {
      return {
        status: 200,
        result: {
          records: roleTable.items,
          total: 30,
          size: 30,
          current: 1,
          searchCount: true,
          pages: 3
        }
      }
    }
  },

  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
