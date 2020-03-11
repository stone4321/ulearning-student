const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  // 实验相关
  experiment: state => state.experiment.experiment,
  experimentMode: state => state.experiment.mode,
  experimentResult: state => state.experiment.experimentResult,
  // 通告相关
  notice: state => state.notice.notice
}
export default getters
