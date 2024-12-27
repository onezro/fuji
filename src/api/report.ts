import request from "@/request/reportRequest";
export function QueryMaterialCode(data: any) {
    return request({
        url: "/api/BurningData/QueryMaterialCode",
        method: "post",
        data,
    });
}
export function QueryContainerDetail(data: any) {
    return request({
        url: "/api/BurningData/QueryContainerDetail",
        method: "post",
        data,
    });
}
export function QueryMESContainer(data: any) {
    return request({
      url: "/api/BurningData/QueryMESContainer",
      method: "post",
      data
    });
  }

  export function InsequenceRetraceFirstInfo(data: any) {
    return request({
      url: "/api/BurningData/InsequenceRetraceFirstInfo",
      method: "post",
      data
    });
  }