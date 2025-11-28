import request from "@/request/packageRequest";
//单位
export function GetUomQuery(data: any) {
    return request({
        url: "/api/IQCController/GetUomQuery",
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


//项目添加修改
export function AyscProject(data: any) {
    return request({
        url: "/api/IQCController/AyscProject",
        method: "post",
        data,
    });
}
