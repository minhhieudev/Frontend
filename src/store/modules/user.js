import { getToken, getUser, setToken, setUser, unsetUser, setClient, getClient } from '@/utils/auth'
import { login, logout } from '@/api/login'
//import { lock } from '@/api/user'
const user = {
  state: {
    token: getToken(),
    user: getUser(),
    isLocked: false,
    enableLockMode: true,
    lock: {
      enabled: true,
      period: 15
    },
    client: getClient(),
    clients: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    UNSET_USER: (state) => {
      state.user = null
      state.token = null
    },
    LOCK_SESSION: (state) => {
      state.isLocked = true
    },
    UNLOCK_SESSION: (state) => {
      state.isLocked = false
    },
    LOCK_SETTING: (state, value) => {
      state.lock = value
    },
    SET_CLIENT: (state, value) => {
      state.client = value
      setClient(value)
    },
    SET_CLIENTS: (state, value) => {
      state.clients = value
    },
    SET_USER_FULLNAME: (state, data) => {      
      if(state.user._id == data._id){
        state.user.first_name = data.newUserFirstName;
        state.user.last_name = data.newUserLastName;        
        state.user.user = state.user;
        var toUpdateUser = getUser();
        toUpdateUser.first_name = data.newUserFirstName;
        toUpdateUser.last_name = data.newUserLastName;       
        setUser(toUpdateUser); 
      }       
    } 
  },
  actions: {
    reSetUser ({state}, user) {
      state.user = user
      setUser(user)
    },
    login ({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(({ data }) => {
          let accessToken = data.user.accessToken
          let userData = data.user
          if (data.success) {
            commit('SET_TOKEN', accessToken)
            commit('SET_USER', userData)
            setToken(accessToken)
            setUser(userData)
          }
          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('UNSET_USER')
          unsetUser()
          resolve()
        })
      })
    },
    setLoginData ({ commit }, data) {
      commit('SET_TOKEN', data.token)
      commit('SET_USER', data.user)
      setToken(data.token)
      setUser(data.user)
    },
    tokenNotValid ({commit, dispatch}) {
      commit('UNSET_USER')
      commit('SET_CLIENTS', [])
      commit('SET_CLIENT', '')
      unsetUser()
      return Promise.resolve('true')
    },
    lockSession ({ commit }) {
      // lock().then(({ data }) => {
      //   if (data['success']) {
      //     commit('LOCK_SESSION')
      //   }
      // })
    },
    unlockSession ({ commit }, value) {
      // return unlock(value).then(({ data }) => {
      //   if (data['success']) {
      //     setTimeout(() => {
      //       commit('UNLOCK_SESSION')
      //     }, 1500)
      //     return Promise.resolve()
      //   }
      //   return Promise.reject()
      // })
    },
    setClient ({ commit }, value) {
      commit('SET_CLIENT', value)
    },
    setClients ({ commit }, value) {
      commit('SET_CLIENTS', value)
    },
    setUserFullName({ commit }, data) {
      commit('SET_USER_FULLNAME', data);      
    }
  }
}


export default user
