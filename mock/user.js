
export default [
  // user login
  {
    url: '/account/token',
    type: 'post',
    response: config => {
      return {
        status: 200,
        result: {
          token: "admin-token",
          uid: 1
        }
      }
    }
  },

  // get user info
  {
    url: '/account/info',
    type: 'get',
    response: config => {
      return {
        status:200,
        result:{
          loginName: "admin",
          nickname: "admin"
        }
      }
    }
  },

  // user logout
  {
    url: '/mock/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  //user menu
  {
    url: '/mock/account/menus',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
