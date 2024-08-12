import request from "@/utils/dipRequest";

//获取工单信息
export function QueryWorkOrderInfo() {
    return request({
        url: "/api/dip/QueryWorkOrderInfo",
        method: "post",
    });
}
//过站
export function DIPStationMoveOut(data: any) {
    return request({
        url: "/api/dip/DIPStationMoveOut",
        method: "post",
        data,
    });
}
//获取设备
export function FindAllDevice() {
    return request({
        url: "/api/dip/FindAllDevice",
        method: "post",
    });
}
//添加设备
export function AddDevice(data: any) {
    return request({
        url: "/api/dip/AddDevice",
        method: "post",
        data,
    });
}

//修改设备
export function UpdateDevice(data: any) {
    return request({
        url: "/api/dip/UpdateDevice",
        method: "post",
        data,
    });
}