import request from "@/request/barRequest";
//OQC汇总
export function GetOQCDataSummaryQuery(data: any) {
    return request({
        url: "/api/ReportQuery/GetOQCDataSummaryQuery",
        method: "post",
        data,
    });
}
//原材料领用张数统计
export function GetMaterialQuantityIssuedQuery(data: any) {
    return request({
        url: "/api/ReportQuery/GetMaterialQuantityIssuedQuery",
        method: "post",
        data,
    });
}