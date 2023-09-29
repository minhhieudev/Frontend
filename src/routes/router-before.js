import store from './../store'
import { getUser } from '@/utils/auth'

export default function (to, from, next) {
  store.dispatch('setLastRoute', from.fullPath)
  let isAuth = to.matched.some(re => re.meta.authRequired)
  if (to.meta.isRerenderComponent) {
    store.dispatch('reRender')
  }
  const user = getUser()
  if (isAuth && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/')
  } else {
    next()
  }
  next()
}
