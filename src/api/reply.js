import request from "@/utils/request";
const modelCode = "reply";

export function getReplyByPostId(id) {
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
