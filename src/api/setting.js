import request from "@/utils/request";
const modelCode = 'setting'

export function getCollection (data) {
  return request({
    url: `/${modelCode}/collection`,
    method: 'post',
    data
  })
}

export function handleDelete (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'delete'
  })
}

export function getDetail (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'get'
  })
}

export function addData (data) {
  return request({
    url: `/${modelCode}`,
    method: 'post',
    data: data
  })
}

export function saveData (data) {
  return request({
    url: `/${modelCode}`,
    method: 'put',
    data: data
  })
}

