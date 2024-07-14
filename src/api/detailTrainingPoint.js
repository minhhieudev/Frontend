import request from "@/utils/request";
const modelCode = "training_point";

export function getCondition(semester, schoolYear) {
  return request({
    url: `/detailTrainingPoint/search`, // Đã thay đổi địa chỉ API để lấy tất cả dữ liệu điểm rèn luyện
    method: "get",
    params: {
      semester:semester,
      schoolYear :schoolYear// Thêm answersCount vào dữ liệu gửi đi
    },
  });
}
export function getAll(schoolYear,semester, department, className) {
  return request({
    url: `/detailTrainingPoint/getCondition`, 
    method: "post", // Thay đổi phương thức thành POST
    data: {
      schoolYear: schoolYear,
      semester: semester,
      department: department,
      className: className
    }
  });
}

export function getDetail(id) {
  return request({
    url: `/detailTrainingPoint/${id}`,
    method: "get",
  });
}

export function saveData(data) {
  return request({
    url: `/detailTrainingPoint`,
    method: "post",
    data,
  });
}
export function handleDelete(id) {
  return request({
    url: `/detailTrainingPoint/${id}`,
    method: "delete",
  });
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

export function saveDatas(data) {
  return request({
    url: `/detailTrainingPoint`,
    method: "post",
    data,
  });
}


export function updateQuestion(id, newQuestion) {
  return request({
    url: `/${modelCode}/updateQuestion/${id}`,
    method: "post",
    data: {
      newQuestion: newQuestion, // Thêm answersCount vào dữ liệu gửi đi
    },
  });
}