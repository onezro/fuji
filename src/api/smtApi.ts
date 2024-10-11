import request from "@/utils/smtMessage";
import requestNoMessage from "@/utils/smtNoMessage";

//镭雕
export function getLaserWorkOrder(data: any) {
  return request({
    url: "/api/LaserCarving/OrderQuery",
    method: "post",
    data,
  });
}

export function OrderSNQuery(data: any) {
  return request({
    url: "api/LaserCarving/OrderSNQuery",
    method: "post",
    data,
  });
}

//报错不主动提示
export function getMaterialInformation(data: any) {
  return requestNoMessage({
    url: "/api/LaserCarving/CreateSNOrderNumber",
    method: "post",
    data,
  });
}

//返修
export function QuerySN(SN: any, OperationType: any) {
  return request({
    url: "/api/Maintenance/QuerySN",
    method: "post",
    params: { SN, OperationType },
  });
}
//
export function MaintenanceAdd(data: any) {
  return request({
    url: "/api/Maintenance/Add",
    method: "post",
    data,
  });
}
//
export function QueryMaintenance(InternalSN: any, Position: any) {
  return request({
    url: "/api/Maintenance/QueryMaintenance",
    method: "post",
    params: { InternalSN, Position },
  });
}
//查询周转箱列表
export function QueryCarrierList(data: any) {
  return request({
    url: "/api/packing/QueryCarrierList",
    method: "post",
    params: data,
  });
}
//扫描装箱
export function SubmitPcbToPacking(data: any) {
  return requestNoMessage({
    url: "/api/packing/SubmitPcbToPacking",
    method: "post",
    data,
  });
}
//不满箱提交
export function TrunkDeal(data: any) {
  return request({
    url: "/api/packing/TrunkDeal",
    method: "post",
    data,
  });
}
//查询烧录打印数据
export function QueryBurnPrintData(data: any) {
  return request({
    url: "/api/Burn/QueryBurnPrintData",
    method: "post",
    data,
  });
}

//烧录标签打印
export function PrintBurnModel(data: any) {
  return request({
    url: "/api/Burn/PrintBurnLabel",
    method: "post",
    data,
  });
}
//烧录工单
// export function OrderQuery() {
//     return request({
//         url: "/api/Burn/OrderQuery",
//         method: "post",
//         data:{
//             orderID:''
//         }
//     })
// }

//获取装箱信息
export function QueryPackListByCarrier(data: any) {
  return requestNoMessage({
    url: "/api/packing/QueryPackingListByCarrierName",
    method: "post",
    params: data,
  });
}

//物料上料
export function LoadMaterialQueue(data: any) {
  return requestNoMessage({
    url: "/api/workstation/LoadMaterialQueue",
    method: "post",
    data,
  });
}
//物料下料
export function UnLoadMaterialQueue(data: any) {
  return request({
    url: "/api/workstation/UnLoadMaterialQueue",
    method: "post",
    data,
  });
}
//物料需求
export function QueryOrderMaterialRequired(data: any) {
  return requestNoMessage({
    url: "/api/workstation/QueryOrderMaterialRequired",
    method: "post",
    data,
  });
}
//物料明细
export function QueryMaterialQueueDetails(data: any) {
  return requestNoMessage({
    url: "/api/workstation/QueryMaterialQueueDetails",
    method: "post",
    data,
  });
}
//不良品登记
export function isDefects(data: any) {
  return request({
    url: "/api/workstation/isDefects",
    method: "post",
    data,
  });
}
//工单查询
export function OrderQuery(data: any) {
  return request({
    url: "/api/workstation/OrderQuery",
    method: "post",
    data,
  });
}
//返修登记
export function QuerySMTDefectRecordDetail(data: any) {
  return request({
    url: "/api/repair/QuerySMTDefectRecordDetail",
    method: "post",
    params: {
      ContainerName: data,
    },
  });
}
//返修工序
export function QueryWorkflowList(data: any) {
  return request({
    url: "/api/repair/QueryWorkflowList",
    method: "post",
    params: {
      workflowName: data,
    },
  });
}
//提交返修登记
export function SaveRepairRecord(data: any) {
  return request({
    url: "/api/repair/SaveRepairRecord",
    method: "post",
    data,
  });
}
//查询返修修操作
export function QueryRepairAction(data: any) {
  return request({
    url: "/api/repair/QueryRepairAction",
    method: "post",
    params: {
      operationName: data,
    },
  });
}
//根据工序查询不良记录
export function QueryRepairRecord(data: any) {
  return request({
    url: "/api/repair/QueryRepairRecord",
    method: "post",
    params: {
      workStaion: data,
    },
  });
}
//获取SMT工单数据
// export function GetSMTPreparationOrderList(data:any) {
//     return request({
//         url: "/api/smtpreparation/GetSMTPreparationOrderList",
//         method: "post",
//        data
//     })
// }
//获取SMT备料产线
export function GetSMTLineList() {
  return request({
    url: "/api/smtreadymaterial/GetSMTLineList",
    method: "post",
  });
}
//获取SMT工单数据
export function GetSMTPreparationOrderList(data: any) {
  return request({
    url: "/api/smtreadymaterial/GetSMTPreparationOrderList",
    method: "post",
    data,
  });
}
//获取SMT工单BoM数据
export function GetOrderSMTBom(data: any) {
    return request({
      url: "/api/smtreadymaterial/GetOrderSMTBom",
      method: "post",
      data,
    });
  }
//查询货架
export function findShelf() {
    return request({
      url: "/api/smtreadymaterial/findShelf",
      method: "post",
    });
  }
//提交备料
  export function SubmitSMTPreparation(data: any) {
    return request({
      url: "/api/smtreadymaterial/SubmitSMTPreparation",
      method: "post",
      data,
    });
  }
//首套亮灯
export function SendFirstSet(data: any) {
    return request({
      url: "/api/smtreadymaterial/SendFirstSet",
      method: "post",
      data,
    });
  }

  //取消首套亮灯
export function CancelFirstSet(data: any) {
    return request({
      url: "/api/smtreadymaterial/CancelFirstSet",
      method: "post",
      data,
    });
  }

  