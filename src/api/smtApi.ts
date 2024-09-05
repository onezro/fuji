import request from "@/utils/smtMessage";
import requestNoMessage from "@/utils/smtNoMessage";

//镭雕
export function getLaserWorkOrder(data: any) {
    return request({
        url: "/api/LaserCarving/OrderQuery",
        method: "post",
        data
    });
}

export function OrderSNQuery(data: any) {
    return request({
        url: "api/LaserCarving/OrderSNQuery",
        method: "post",
        data
    });
}

//报错不主动提示
export function getMaterialInformation(data: any) {
    return requestNoMessage({
        url: "/api/LaserCarving/CreateSNOrderNumber",
        method: "post",
        data
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
        data
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
        data
    });
}
//不满箱提交
export function TrunkDeal(data: any) {
    return request({
        url: "/api/packing/TrunkDeal",
        method: "post",
        data
    });
}
//查询烧录打印数据
export function QueryBurnPrintData(data: any) {
    return request({
        url: "/api/Burn/QueryBurnPrintData",
        method: "post",
        data
    });
}

//烧录标签打印
export function PrintBurnModel(data: any) {
    return request({
        url: "/api/Burn/PrintBurnLabel",
        method: "post",
        data
    })
}
//烧录工单
export function OrderQuery() {
    return request({
        url: "/api/Burn/OrderQuery",
        method: "post",
        data:{
            orderID:''
        }
    })
}

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
        url: "/api/Burn/LoadMaterialQueue",
        method: "post",
        data
    })
}
//物料下料
export function UnLoadMaterialQueue(data: any) {
    return request({
        url: "/api/Burn/UnLoadMaterialQueue",
        method: "post",
        data
    })
}
//物料需求
export function QueryOrderMaterialRequired(data: any) {
    return requestNoMessage({
        url: "/api/workstation/QueryOrderMaterialRequired",
        method: "post",
        data
    })
}
//物料明细
export function QueryMaterialQueueDetails(data: any) {
    return requestNoMessage({
        url: "/api/workstation/QueryMaterialQueueDetails",
        method: "post",
        data
    })
}