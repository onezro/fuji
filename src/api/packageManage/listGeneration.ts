import request from "@/request/packageRequest";
//获取卡板
export function GetCardAreaQuery(data: any) {
    return request({
        url: "/api/PackingController/GetCardAreaQuery",
        method: "post",
        data,
    });
}
//获取产品类型
export function GetHSCodeQuery(data: any) {
    return request({
        url: "/api/PackingController/GetHSCodeQuery",
        method: "post",
        data,
    });
}
//获取预览，托盘，外箱
export function GetPackingCardAreaSerachDetail(data: any) {
    return request({
        url: "/api/PackingController/GetPackingCardAreaSerachDetail",
        method: "post",
        data,
    });
}
//生成装箱单
export function PackingAdd(data: any) {
    return request({
        url: "/api/PackingController/PackingAdd",
        method: "post",
        data,
    });
}
//汇总
export function GetPackingSerachReport(data: any) {
    return request({
        url: "/api/PackingController/GetPackingSerachReport",
        method: "post",
        data,
    });
}
//汇总查询明细
export function GetPackingHSCodeSummaryQuery(data: any) {
    return request({
        url: "/api/PackingController/GetPackingHSCodeSummaryQuery",
        method: "post",
        data,
    });
}


