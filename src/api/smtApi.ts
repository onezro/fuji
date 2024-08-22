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
export function QuerySN(SN: any,OperationType:any) {
    return request({
        url: "/api/Maintenance/QuerySN",
        method: "post",
        params: {SN,OperationType},
    });
}

export function MaintenanceAdd(data:any) {
    return request({
        url: "/api/Maintenance/Add",
        method: "post",
        data
    });
}

export function QueryMaintenance(InternalSN: any,Position:any) {
    return request({
        url: "/api/Maintenance/QueryMaintenance",
        method: "post",
        params: {InternalSN,Position},
    });
}