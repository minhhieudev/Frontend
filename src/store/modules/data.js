
export default {
  state: {
    users: {
      docs: [],
      total: 0
    },
    notifications: [],
    khoaList:[],
    nghanhList:[],
    lopList:[],
    currentUer: {},
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