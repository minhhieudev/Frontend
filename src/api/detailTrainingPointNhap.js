import request from "@/utils/request";
const modelCode = "detailTrainingPointNhap";


export function getDetail(id) {
  return request({
    url: `/detailTrainingPointNhap/${id}`,
    method: "get",
  });
}

export function saveDataCopy(data) {
  return request({
    url: `/detailTrainingPointNhap`,
    method: "post",
    data,
  });
}
export function handleDeleteCopy(id) {
  return request({
    url: `/detailTrainingPointNhap/${id}`,
    method: "delete",
  });
}

export function getData(userId) {
    return request({
      url: `/detailTrainingPointNhap/${userId}`,
      method: "get",
    });
}