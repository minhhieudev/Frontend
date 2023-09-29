const NAMESPACE = process.env.VUE_APP_NAMESPACE || 'wl'

export function getToken () {
  let token = localStorage.getItem(NAMESPACE + '.' + 'token')
  if (token != null) {
    return token
  }
  return null
}

export function setToken (token) {
  if (token) {
    localStorage.setItem(NAMESPACE + '.' + 'token', token)
  }
}

export function getUser () {
  let user = localStorage.getItem(NAMESPACE + '.' + 'user')
  if (user != null) {
    return JSON.parse(user)
  }
  return null
}

export function setUser (user) {
  if (user) {
    localStorage.setItem(NAMESPACE + '.' + 'user', JSON.stringify(user))
  }
}

export function unsetUser () {
  localStorage.removeItem(NAMESPACE + '.' + 'user')
  localStorage.removeItem(NAMESPACE + '.' + 'token')
  localStorage.removeItem(NAMESPACE + '.' + 'auth')
}

export function setClient (clientId) {
  if (clientId) {
    localStorage.setItem(NAMESPACE + '.' + 'client_id', clientId)
  }
}

export function getClient () {
  return localStorage.getItem(NAMESPACE + '.' + 'client_id') || false
}
