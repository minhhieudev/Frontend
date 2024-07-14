import request from "@/utils/request";
const modelCode = "answer";

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

export function updateLike(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "post",
  });
}

export function getAnswersByQuestionId(id) {
  return request({
    url: `/${modelCode}/${id}`, // Đặt đường dẫn API cho việc lấy câu trả lời của câu hỏi
    method: "get",
  });
}


export function handleDeleteAnswer(id) {
  return request({
    url: `/${modelCode}/deleteAnswer/${id}`,
    method: "delete",
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
