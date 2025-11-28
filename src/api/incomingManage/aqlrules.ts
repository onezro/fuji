//   import request from "@/request/barRequest";
import request from "@/request/packageRequest";


//查询类别项目
export function GetProjectCategoryQuery(data: any) {
    return request({
        url: "/api/IQCController/GetProjectCategoryQuery",
        method: "post",
        data,
    });
}
//查询检验工具
export function GetResourceQuery(data: any) {
    return request({
        url: "/api/IQCController/GetResourceQuery",
        method: "post",
        data,
    });
}
//查询检验类型
export function GetInspectionTypeQuery(data: any) {
    return request({
        url: "/api/IQCController/GetInspectionTypeQuery",
        method: "post",
        data,
    });
}

//查询产品数据
export function GetProductQuery(data: any) {
    return request({
        url: "/api/IQCController/GetProductQuery",
        method: "post",
        data,
    });
}

//查询产品数据
export function GetInspectionMasterQuery(data: any) {
    return request({
        url: "/api/IQCController/GetInspectionMasterQuery",
        method: "post",
        data,
    });
}


//查询所有已经保存的产品检验明细数据
export function GetInspectionDetailQuery(data: any) {
    return request({
        url: "/api/IQCController/GetInspectionDetailQuery",
        method: "post",
        data,
    });
}
//新增/修改 检验记录
export function AyscInspectionMaster(data: any) {
    return request({
        url: "/api/IQCController/AyscInspectionMaster",
        method: "post",
        data,
    });
}
//删除
export function AyscDelInspectionDetail(data: any) {
    return request({
        url: "/api/IQCController/AyscDelInspectionDetail",
        method: "post",
        data,
    });
}
//项目
export function GetProjectQuery(data: any) {
    return request({
        url: "/api/IQCController/GetProjectQuery",
        method: "post",
        data,
    });
}
