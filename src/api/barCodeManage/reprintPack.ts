import request from "@/request/barRequest";
import request1 from "@/request/packageRequest";
//
export function SmallOuterBoxPrintQuery(data: any) {
    return request1({
        url: "/api/SmallBoxController/SmallOuterBoxPrintQuery",
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
//重印
export function SmallOuterBoxPrintSubmit(data: any) {
    return request1({
        url: "/api/SmallBoxController/SmallOuterBoxPrintSubmit",
        method: "post",
        data,
    });
}

