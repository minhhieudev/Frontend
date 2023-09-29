
export default {
  state: {
    users: {
      docs: [],
      total: 0
    },
   
    answers: {
      docs: [],
      total: 0
    },
    questions: {
      docs: [],
      total: 0
    },

    allUsers: [],
    allQuestions:[],
    allAnswers:[],
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
