import request from "@/utils/dipRequest";

//获取插件工单信息
export function QueryWorkOrderInfo() {
    return request({
        url: "/api/plugin/QueryWorkOrderInfo",
        method: "post",
    });
}
// //工单查询
export function OrderQuery(data:any) {
    return request({
        url: "/api/workstation/OrderQuery",
        method: "post",
        data
    })
}
//历史过站记录
export function QueryMoveHistory(data:any) {
    return request({
        url: "/api/workstation/QueryMoveHistory",
        method: "post",
        data
    })
}

//获取设备
export function FindAllDevice(data:any) {
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

export function PCBASplitMoveStd(data: any) {
    return request({
        url: "/api/pcbasplit/PCBASplitMoveStd",
        method: "post",
        data,
    });
}

//人工目检过站,点胶，
// export function MoveStd(data: any) {
//     return request({
//         url: "/api/workstation/MoveStd",
//         method: "post",
//         data,
//     });
// }
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
//目检过站
export function InspectionStationMoveOut(data: any,result:any) {
    return request({
        url: "/api/inspection/InspectionStationMoveOut",
        method: "post",
        data,
        params:{
            status:result
        }
    });
}
//人工目检过站
export function VIStationMoveOut(data: any) {
    return request({
        url: "/api/visualinspection/VIStationMoveOut",
        method: "post",
        data
    });
}
//人工目检提交不良登记信息
export function VIDefectProductRecord(data: any) {
    return request({
        url: "/api/visualinspection/VIDefectProductRecord",
        method: "post",
        data
    });
}
//人工目检通过PCB条码查询不良原因
export function QueryDefectCode(data: any) {
    return request({
        url: "/api/visualinspection/QueryDefectCode",
        method: "post",
        params: {
            containerName: data
        }
    });
}
//获取上料明细
export function QueryOrderMaterialRequired(data:any) {
    return request({
        url: "/api/workstation/QueryOrderMaterialRequired",
        method: "post",
        data
    })
}