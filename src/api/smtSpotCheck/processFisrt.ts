import request from "@/request/packageRequest";


//创建检验单
export function CreateInspectionNO(data: any) {
    return request({
        url: "/api/Inspection/CreateInspectionNO",
        method: "post",
        data,
    });
}
//获取检验单
export function GetInspectionQuery(data: any) {
    return request({
        url: "/api/Inspection/GetInspectionQuery",
        method: "post",
        data,
    });
}
//获取明细
export function GetInspectionDelQuery(data: any) {
    return request({
        url: "/api/Inspection/GetInspectionDelQuery",
        method: "post",
        data,
    });
}

//创建检验单
export function InspectionNOInfoSync(data: any) {
    return request({
        url: "/api/Inspection/InspectionNOInfoSync",
        method: "post",
        data,
    });
}

//定时首检
export function CreateInspectionFJob(data: any) {
    return request({
        url: "/api/Inspection/CreateInspectionFJob",
        method: "post",
        data,
    });
}


//定时巡检
export function CreateInspectionRJob(data: any) {
    return request({
        url: "/api/Inspection/CreateInspectionRJob",
        method: "post",
        data,
    });
}


//定时尾检
export function CreateInspectionLJob(data: any) {
    return request({
        url: "/api/Inspection/CreateInspectionLJob",
        method: "post",
        data,
    });
}
//上传FA
export function FAUploadFtpServer(data: any) {
    return request({
        url: "/api/Inspection/FAUploadFtpServer",
        method: "post",
        data,
    });
}
//上传CPK
export function CPKUploadFtpServer(data: any) {
    return request({
        url: "/api/Inspection/CPKUploadFtpServer",
        method: "post",
        data,
    });
}
export function UploadFtpServer(data: any) {
    return request({
        url: "/api/Inspection/UploadFtpServer",
        method: "post",
        data,
    });
}

//下载
export function FACPKDownloadFtpServer(data: any) {
    return request({
        url: "/api/Inspection/FACPKDownloadFtpServer",
        method: "post",
        params:data
    });
}