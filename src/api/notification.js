import request from "@/utils/request";

const modelCode = "notification";

export function handleDelete(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "delete",
  });
}

export function getForId(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "get",
  });
}

export function saveNotification(data) {
  return request({
    url: `/${modelCode}`,
    method: "post",
    data,
  });
}

