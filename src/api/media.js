import request from "@/utils/request";
const modelCode = 'file'

export function uploadImage (formData, image = {}) {
  return request({
    url: '/file',
    method: 'post',
    data: formData,
    timeout: 0,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (e) => {
      if (image) {
        image.percent = Math.floor(e.loaded * 100 / e.total)
      }
    }
  })
}

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

export function saveData (data, id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'put',
    data: data
  })
}

