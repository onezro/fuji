import request from "@/utils/AssemblyRequest";
//扫码保存
export function CleanCodeSave(data:any) {
    return request({
        url: "/api/clean/CleanCodeSave",
        method: "post",
        data
    });
}
//清洗条码历史记录
export function QueryCleanCodeRecord(data:any) {
    return request({
        url: "/api/clean/QueryCleanCodeRecord",
        method: "post",
        params:{
            workstation:data.workstationName,
            orderNumber:data.MfgOrderName
        }
    });
}
//重新清洗
export function ReloadCleanCode(data:any) {
    return request({
        url: "/api/clean/ReloadCleanCode",
        method: "post",
        data
    });
}

//点胶
export function DispenseStationMoveOut(data:any) {
    return request({
        url: "/api/Dispense/DispenseStationMoveOut",
        method: "post",
        data
    });
}
export function PressingStationMoveOut(data:any) {
    return request({
        url: "/api/clean/PressingStationMoveOut",
        method: "post",
        data
    });
}
export function CoverInstallStationMoveOut(data:any) {
    return request({
        url: "/api/CoverInstall/CoverInstallStationMoveOut",
        method: "post",
        data
    });
}
export function CoverInstallPrint(data:any) {
    return request({
        url: "/api/CoverInstall/CoverInstallPrint",
        method: "post",
        params:{
            orderNumber:data
        }
    });
}
