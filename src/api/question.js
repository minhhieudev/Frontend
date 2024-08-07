import request from "@/utils/request";
const modelCode = "question";

export function getCollection(data) {
  return request({
    url: `/${modelCode}/collection`,
    method: "post",
    data,
  });
}



export function getAll() {
  return request({
    url: `/${modelCode}`,
    method: "get",
  });
}


export function getDetail(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "get",
  });
}

export function saveData(data) {
  return request({
    url: `/${modelCode}`,
    method: "post",
    data,
  });
}
export function handleDelete(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "delete",
  });
}

export function updateLike(id) {
  return request({
    url: `/${modelCode}/${id}`, // Địa chỉ API để cập nhật lượt thích
    method: "post",
  });
}
export function updateStatus(id) {
  return request({
    url: `/${modelCode}/status/${id}`, // Địa chỉ API để cập nhật lượt thích
    method: "post",
  });
}
export function updateComments(id, answersCount) {
  return request({
    url: `/${modelCode}/${id}/count`,
    // Địa chỉ API để cập nhật số câu trả lời
    method: "post",
    data: {
      answersCount: answersCount, // Thêm answersCount vào dữ liệu gửi đi
    },
  });
}


export function updateQuestion(id,newQuestion) {
  return request({
    url: `/${modelCode}/updateQuestion/${id}`, 
    method: "post",
    data: {
      newQuestion: newQuestion, // Thêm answersCount vào dữ liệu gửi đi
    },
  });
}

export function getPaginatedQuestions(page, pageSize) {
  return request({
    url: `/${modelCode}/paginated`,
    method: "get",
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
}