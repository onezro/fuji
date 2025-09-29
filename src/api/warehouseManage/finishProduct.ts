import request from "@/request/packageRequest";
//获取数据
export function GetCompletedInventoryQuery(data: any) {
    return request({
        url: "/api/CompletionAndWarehouseController/GetCompletedInventoryQuery",
        method: "post",
        data,
    });
}
//提交入库
export function SubmitForCompletionAndWarehousing(data: any) {
    return request({
        url: "/api/CompletionAndWarehouseController/SubmitForCompletionAndWarehousing",
        method: "post",
        data,
    });
}
