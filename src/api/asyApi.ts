import request from "@/utils/asyRequest";
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
//盖板过站
export function CoverInstallStationMoveOut(data:any) {
    return request({
        url: "/api/CoverInstall/CoverInstallStationMoveOut",
        method: "post",
        data
    });
}
//盖板打印
export function CoverInstallPrint(data:any) {
    return request({
        url: "/api/CoverInstall/CoverInstallPrint",
        method: "post",
        params:{
            orderNumber:data
        }
    });
}
//查询关键物料
export function QueryKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/QueryKeyMaterial",
        method: "post",
        data
    });
}
//判断关键物料是否存在
export function JudgeKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/JudgeKeyMaterial",
        method: "post",
        data
    });
}
//过站并扣料
export function ScreeSMTCompBindMoveStd(data:any) {
    return request({
        url: "/api/SMTCompBind/ScreeSMTCompBindMoveStd",
        method: "post",
        data
    });
}
//盖板过站并扣料
export function CoverSMTCompBindMoveStd(data:any) {
    return request({
        url: "/api/SMTCompBind/CoverSMTCompBindMoveStd",
        method: "post",
        data
    });
}
//装配合成查询关键物料
export function QueryAssemblyKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/QueryAssemblyKeyMaterial",
        method: "post",
        data
    });
}
//判断关键物料是否存在
export function JudgeAssemblyKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/JudgeAssemblyKeyMaterial",
        method: "post",
        data
    });
}
//过站并扣料
export function AssemblySynthesisMoveStd(data:any) {
    return request({
        url: "/api/SMTCompBind/AssemblySynthesisMoveStd",
        method: "post",
        data
    });
}


//查询SN条码
export function VibrationDetail(data:any) {
    return request({
        url: "/api/Vibration/VibrationDetail",
        method: "post",
        data
    });
}
