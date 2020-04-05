const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  userInfo: (state) => state.user.userInfo,
  teachingTask: (state) => state.user.teachingTask,
  teachingTaskId: (state) => state.user.teachingTaskId,
  // 实验相关
  experiment: (state) => state.experiment.experiment,
  experimentMode: (state) => state.experiment.mode,
  experimentResult: (state) => state.experiment.experimentResult,
  // 通告相关
  notice: (state) => state.notice.notice,
  // 测试相关
  examDetail: (state) => state.examDetail.examDetail
}
export default getters
