import request from "@/request/barRequest";
//工单类型
export function getOrderTypeQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getOrderTypeQuery",
        method: "post",
        data,
    });
}
//工单状态
export function getOrderStatusQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getOrderStatusQuery",
        method: "post",
        data,
    });
}
//客户
export function getCustomerQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getCustomerQuery",
        method: "post",
        data,
    });
}

//获取查询数据
export function getMfgOrderInformationQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getMfgOrderInformationQuery",
        method: "post",
        data,
    });
}
//获取具体工单数据
export function getMfgOrderContainerQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getMfgOrderContainerQuery",
        method: "post",
        data,
    });
}
//获取打印机
export function getPrintQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getPrintQuery",
        method: "post",
        data,
    });
}
//获取打印模板
export function getPrintTemplateQuery(data: any) {
    return request({
        url: "/api/ModelingDataQuery/getPrintTemplateQuery",
        method: "post",
        data,
    });
}
//生成批次并打印
export function AddMfgOrderContainer(data: any) {
    return request({
        url: "/api/MfgOrderContainerPrint/AddMfgOrderContainer",
        method: "post",
        data,
    });
}
//生成批次并打印
export function ReprintMfgOrderContainer(data: any) {
    return request({
        url: "/api/MfgOrderContainerPrint/ReprintMfgOrderContainer",
        method: "post",
        data,
    });
}

