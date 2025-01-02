import request from "@/request/reportRequest";
//原材料
export function QueryMaterialCode(data: any) {
    return request({
        url: "/api/BurningData/QueryMaterialCode",
        method: "post",
        data,
    });
}
//原材料
export function QueryContainerDetail(data: any) {
    return request({
        url: "/api/BurningData/QueryContainerDetail",
        method: "post",
        data,
    });
}
//MES条码追溯
export function QueryMESContainer(data: any) {
    return request({
      url: "/api/BurningData/QueryMESContainerTracedBack",
      method: "post",
      data
    });
  }

//过序追溯
export function InsequenceRetraceFirstInfo(data: any) {
    return request({
      url: "/api/BurningData/InsequenceRetraceFirstInfo",
      method: "post",
      data
    });
  }
  //过序追溯
  export function InsequenceRetraceTwoInfo(data: any) {
    return request({
      url: "/api/BurningData/InsequenceRetraceTwoInfo",
      method: "post",
      data
    });
  }

//获取线体
export function QuertAllMfgLineInfo() {
  return request({
    url: "/api/BurningData/QuertAllMfgLineInfo",
    method: "post",
    
  });
}
//获取工序
export function QuertAllSpecNameInfo() {
  return request({
    url: "/api/BurningData/QuertAllSpecNameInfo",
    method: "post",
  });
}

//查询工单类型
export function QueryOrderType() {
  return request({
    url: "/api/PlantProgressQuery/QueryOrderType",
    method: "post"
  });
}

//工单进度查询主数据
export function PlanProgressQuery(data:any) {
  return request({
    url: "/api/PlantProgressQuery/PlanProgressQuery",
    method: "post",
    data
  });
}

//MES条码查询
export function QueryOrderContainer(data: any) {
  return request({
    url: "/api/PlantProgressQuery/QueryOrderContainer",
    method: "post",
    params:{
      containername:data
    }
  });
}

//条码清单
export function QueryMESBarCode(data: any) {
  return request({
    url: "/api/QueryMESContainer/QueryMESBarCode",
    method: "post",
    params:{
      containername:data
    }
  });
}

//XLX文件读取
export function ParseXlsxFile(data: any) {
  return request({
    url: "/api/QueryMESContainer/ParseXlsxFile",
    method: "post",
    data
  });
}

