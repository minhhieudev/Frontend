import request from "@/utils/request";
const modelCode = 'consultant'

export function getCollection(data) {
  return request({
    url: `/${modelCode}/collection`,
    method: "post",
    data: {
      ...data,
      role: data.role, // Truyền vai trò từ frontend lên API
    },
  });
}


export function getAll () {
  return request({
    url: `/${modelCode}`,
    method: 'get'
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

export function saveData (data) {
  return request({
    url: `/${modelCode}`,
    method: 'post',
    data,
  })
}

