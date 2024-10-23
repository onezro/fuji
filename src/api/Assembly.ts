import request from "@/utils/AssemblyRequest";
export function CleanCodeSave(data:any) {
    return request({
        url: "/api/clean/CleanCodeSave",
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
