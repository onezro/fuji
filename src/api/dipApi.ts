import request from "@/utils/dipRequest";

//获取插件工单信息
export function QueryWorkOrderInfo() {
    return request({
        url: "/api/plugin/QueryWorkOrderInfo",
        method: "post",
    });
}
// //工单查询
// export function OrderQuery() {
//     return request({
//         url: "/api/workstation/OrderQuery",
//         method: "post",
//         data:{}
//     })
// }

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
export function PluginStationMoveOut(data: any) {
    return request({
        url: "/api/plugin/PluginStationMoveOut",
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

//人工目检过站,点胶，
export function MoveStd(data: any) {
    return request({
        url: "/api/workstation/MoveStd",
        method: "post",
        data,
    });
}
//在线点胶过站
export function ODStationMoveOut(data: any) {
    return request({
        url: "/api/onlinedispensing/ODStationMoveOut",
        method: "post",
        data,
    });
}
//选择焊过站
export function CWgStationMoveOut(data: any) {
    return request({
        url: "/api/choosewelding/CWgStationMoveOut",
        method: "post",
        data,
    });
}
