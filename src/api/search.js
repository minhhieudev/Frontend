import request from "@/utils/request";

const modelCode = "search";

export function getData(id) {
  return request({
    url: `/${modelCode}/resultLearning/${id}`,
    method: "get",
  });
}

