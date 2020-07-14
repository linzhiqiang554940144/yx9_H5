import { http } from '../../common/request.js'
const state = {
  userInfo: [],
}
const mutations = {
  SET_USER_INFO(state, name) {
    state.userInfo = name
  },
  AGAGIN_USER_INFO(state,name){
	state.userInfo = name
	console.log(state.userInfo,'state.userInfo')
  }
}
const actions = {
  // 设置name
  setUserInfo({ commit }, name) {
    commit('SET_USER_INFO', name)
  },
  againUserInfo({ commit },name){
	  http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
		commit('AGAGIN_USER_INFO',res.data.data.data)
	  })
  }
}
export default {
  state,
  mutations,
  actions
}
