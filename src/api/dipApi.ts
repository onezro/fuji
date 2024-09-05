import request from "@/utils/dipRequest";

//获取插件工单信息
export function QueryWorkOrderInfo() {
    return request({
        url: "/api/plugin/QueryWorkOrderInfo",
        method: "post",
    });
}

//获取设备
export function FindAllDevice(data: { WorkStation: string; }) {
    return request({
        url: "/api/plugin/FindAllDevice",
        method: "post",
        data,
    });
}

//修改设备
export function UpdateDevice(data: any) {
    return request({
        url: "/api/plugin/UpdateDevice",
        method: "post",
        data,
    });
}
//插件过站
export function DIPStationMoveOut(data: any) {
    return request({
        url: "/api/plugin/DIPStationMoveOut",
        method: "post",
        data,
    });
}

export function SplitStationMoveOut(data: any) {
    return request({
        url: "/api/pcbasplit/DIPStationMoveOut",
        method: "post",
        data,
    });
}


