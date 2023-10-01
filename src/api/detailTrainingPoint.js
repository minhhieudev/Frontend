import request from "@/utils/request";
const modelCode = "training_point";

export function getAll() {
  return request({
    url: `/detail_TrainingPoint`, // Đã thay đổi địa chỉ API để lấy tất cả dữ liệu điểm rèn luyện
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
    url: `/detail_TrainingPoint`,
    method: "post",
    data,
  });
}
