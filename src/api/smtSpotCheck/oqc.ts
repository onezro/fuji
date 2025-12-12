import request from "@/request/packageRequest";

//主表
export function QueryOQCDocumentNumbersByCriteria(data: any) {
    return request({
        url: "/api/OQCController/QueryOQCDocumentNumbersByCriteria",
        method: "post",
        data,
    });
}

//明细
export function QueryOQCNewWorkOrderDetailsByWorkOrder(data: any) {
    return request({
        url: "/api/OQCController/QueryOQCNewWorkOrderDetailsByWorkOrder",
        method: "post",
        params:{
            MfgOrderName:data
        }
    });
}
//模糊查找并下载FTP文件
export function FTPSearchAndDownloadSpecificationDocumentFile(data: any) {
    return request({
        url: "/api/OQCController/FTPSearchAndDownloadSpecificationDocumentFile",
        method: "post",
        params:{
            fileNameSuffix:data
        }
    });
}

//OQC单据执行(增改审批) OperationType(新增[Add]审批[Approval])
export function OQCDocumentExecution(data: any) {
    return request({
        url: "/api/OQCController/OQCDocumentExecution",
        method: "post",
       data
    });
}
//根据OQC主键信息查询所有明细数据 只需OQCName
export function GetOQCDetailInfo(data: any) {
    return request({
        url: "/api/OQCController/GetOQCDetailInfo",
        method: "post",
       data
    });
}
//暂存/提交方法(主表信息需传OQCName 及 OQCNumber 及InspectionStatus 1检验中(暂存) 2检验完成(提交) 及操作人员)明细字段都需要
export function SaveWithStatus(data: any) {
    return request({
        url: "/api/OQCController/SaveWithStatus",
        method: "post",
       data
    });
}

//根据OQCName信息下载OQC报告
export function DownloadAndFillOQCFile(data: any) {
    return request({
        url: "/api/OQCController/DownloadAndFillOQCFile",
        method: "post",
        params:{
            OQCName:data
        }
    });
}

//根据OQCName信息下载COC报告
export function DownloadAndFillCOCFile(data: any) {
    return request({
        url: "/api/OQCController/DownloadAndFillCOCFile",
        method: "post",
        params:{
            OQCName:data
        }
    });
}

//根据OQCName查看关联的IQC物料行明细ID
export function QueryOQCCorrelationIQCModelSpec(data: any) {
    return request({
        url: "/api/OQCController/QueryOQCCorrelationIQCModelSpec",
        method: "post",
        params:{
            OQCName:data
        }
    });
}

export function GetAQLLevelQuery(data: any) {
    return request({
        url: "/api/IQCController/GetAQLLevelQuery",
        method: "post",
       data
    });
}

export function GetResourceQuery(data: any) {
    return request({
        url: "/api/IQCController/GetResourceQuery",
        method: "post",
       data
    });
}