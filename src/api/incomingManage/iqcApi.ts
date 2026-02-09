import request from "@/request/packageRequest";

//查询所有部门/车间
export function GetWorkCenterQuery(data: any) {
    return request({
        url: "/api/IQCController/GetWorkCenterQuery",
        method: "post",
        data,
    });
}

//查询员工信息
export function GetEmployeeQuery(data: any) {
    return request({
        url: "/api/IQCController/GetEmployeeQuery",
        method: "post",
        data,
    });
}

//查询来料单位
export function GetIncomingUnitQuery(data: any) {
    return request({
        url: "/api/IQCController/GetIncomingUnitQuery",
        method: "post",
        data,
    });
}
//
export function GetProductQuery(data: any) {
    return request({
        url: "/api/IQCController/GetProductQuery",
        method: "post",
        params: {
            ProductFamilyName: data
        }
    });
}
//查询材料名称
export function GetProductFamilyQuery(data: any) {
    return request({
        url: "/api/IQCController/GetProductFamilyQuery",
        method: "post",
        data,
    });
}


//查询供应商
export function GetVendorQuery(data: any) {
    return request({
        url: "/api/IQCController/GetVendorQuery",
        method: "post",
        data,
    });
}
//AQL

export function GetAQLLevelQuery(data: any) {
    return request({
        url: "/api/IQCController/GetAQLLevelQuery",
        method: "post",
        data,
    });
}

//查询表头
export function GetIQCHeaderQuery(data: any) {
    return request({
        url: "/api/IQCController/GetIQCHeaderQuery",
        method: "post",
        data,
    });
}


//查询明细详情
export function GetIQCDetailQuery(data: any) {
    return request({
        url: "/api/IQCController/GetIQCDetailQuery",
        method: "post",
        data,
    });
}
//查询检验明细
export function GetIQCInspectionDetailQuery(data: any) {
    return request({
        url: "/api/IQCController/GetIQCInspectionDetailQuery",
        method: "post",
        data,
    });
}

//单据创建
export function AyscIQCAdd(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCAdd",
        method: "post",
        data,
    });
}
//单据修改
export function AyscIQCUpdate(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCUpdate",
        method: "post",
        data,
    });
}

//单据物料行添加
export function AyscIQCDetailAdd(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCDetailAdd",
        method: "post",
        data,
    });
}

//单据物料行修改
export function AyscIQCDetailUpdate(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCDetailUpdate",
        method: "post",
        data,
    });
}

//单据审批
export function AyscIQCApproval(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCApproval",
        method: "post",
        data,
    });
}

//检验
export function AyscIQCInspectionInterface(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCInspectionInterface",
        method: "post",
        data,
    });
}

//下载供应商报告
export function LabelPrintDownloadFtp(data: any) {
    return request({
        url: "/api/IQCController/LabelPrintDownloadFtp",
        method: "post",
        params: {
            fileName: data
        }
    });
}
//根据IQC名称下载IQC进料检验报告
export function DownloadIQCReportAsync(data: any) {
    return request({
        url: "/api/IQCController/DownloadIQCReportAsync",
        method: "post",
        params: {
            IQCName: data
        }
    });
}

export function AyscIQCTemporaryStorage(data: any) {
    return request({
        url: "/api/IQCController/AyscIQCTemporaryStorage",
        method: "post",
        data
    });
}
//物料行审批
export function AsynIQCMaterialApproval(data: any) {
    return request({
        url: "/api/IQCController/AsynIQCMaterialApproval",
        method: "post",
        data
    });
}


export function GetPriorityCodeQuery(data: any) {
    return request({
        url: "/api/IQCController/GetPriorityCodeQuery",
        method: "post",
        data
    });
}

export function IQCModeSpecLabel(data: any) {
    return request({
        url: "/api/IQCController/IQCModeSpecLabel",
        method: "post",
        params: {
            IQCDetailName: data
        }
    });
}