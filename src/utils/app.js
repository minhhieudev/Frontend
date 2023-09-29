const NAMESPACE = process.env.VUE_APP_NAMESPACE || 'wl'

const getName = function (name) {
  return NAMESPACE + '.' + name
}

const save = function (name, data) {
  localStorage.setItem(getName(name), JSON.stringify(data))
}

export function setOne (name, key, value) {
  let data = getAll(name)
  if (data) {
    data[key] = value
  } else {
    data = {}
    data[key] = value
  }
  save(name, data)
}

export function getOne (name, key) {
  let data = getAll(name)
  if (data) {
    return data[key]
  }
  return false
}

export function destroyOne (name, key) {
  let data = getAll(name)
  if (data) {
    delete data[key]
    save(name, data)
  }
}

export function destroyAll (name) {
  localStorage.removeItem(getName(name))
}


export function getAll (name) {
  const q = localStorage.getItem(getName(name))
  if (q !== null) {
    return JSON.parse(q)
  }
  return false
}