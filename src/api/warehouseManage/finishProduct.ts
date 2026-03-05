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

//获取出库
export function GetFinishedQuery(data: any) {
    return request({
        url: "/api/FinishedController/GetFinishedQuery",
        method: "post",
        data,
    });
}

//提交出库
export function SubmitForFinished(data: any) {
    return request({
        url: "/api/FinishedController/SubmitForFinished",
        method: "post",
        data,
    });
}