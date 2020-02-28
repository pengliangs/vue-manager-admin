const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  grantRouters: state => state.user.grantRouters,
  routers: state => state.user.routers
}
export default getters
