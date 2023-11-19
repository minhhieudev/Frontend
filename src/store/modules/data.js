
export default {
  state: {
    users: {
      docs: [],
      total: 0
    },
   
    khoaList:[],
    nghanhList:[],
    lopList:[],

    allUsers: [],
  },
  mutations: {
    SET_DATA: function(state, payload) {
      state[payload.key] = payload.data
    },
  },
  actions: {
    setData: function({ commit }, payload) {
      commit('SET_DATA', payload)
    }
  }
}
