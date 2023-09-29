import request from "@/utils/request";
const modelCode = "training_point";

export function getAll() {
  return request({
    url: `/${modelCode}`, // Đã thay đổi địa chỉ API để lấy tất cả dữ liệu điểm rèn luyện
    method: "get",
  });
}
