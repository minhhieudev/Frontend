import request from "@/utils/request";
const modelCode = 'student'

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
export function getClassList() {
  return request({
    url: `/${modelCode}/class-list`,
    method: 'get'
  })
}
export function getClasses() {
  return request({
    url: `/${modelCode}/getStudentForClass`,
    method: 'get'
  })
}


export function getKhoaList () {
  return request({
    url: `/${modelCode}/khoaList`,
    method: 'get'
  })
}
export function getNghanhList () {
  return request({
    url: `/${modelCode}/nganhList`,
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

export function getFullNameSV({ email }) {
  return request({
    url: `/${modelCode}/get-fullName/${encodeURIComponent(email)}`,
    method: 'get',
  });
}

export function setIsComplete (id) {
  return request({
    url: `/${modelCode}/updateIsCompleteId/${id}`,
    method: 'post',
    params:{
      id:id
    }
  })
}
export function updateStatus(id, result) {
  return request({
    url: `/detailTrainingPoint/status/${id}`, // Địa chỉ API để cập nhật lượt thích
    method: "post",
    data: {
      result: result, // Thêm answersCount vào dữ liệu gửi đi
    },
  });
}


export function updateIsComplete() {
  return request({
    url: `/${modelCode}/updateComplete`, 
    method: "post",
  });
}

