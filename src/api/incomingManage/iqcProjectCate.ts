import request from "@/request/packageRequest";


//项目
export function GetProjectCategoryQuery(data: any) {
    return request({
        url: "/api/IQCController/GetProjectCategoryQuery",
        method: "post",
        data,
    });
}


//添加修改
export function AyscProjectCategory(data: any) {
    return request({
        url: "/api/IQCController/AyscProjectCategory",
        method: "post",
        data,
    });
}
