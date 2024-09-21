import request from "@/utils/request";
//备品备件类型
//查询所有备件分类
export function GetPartsClassList(data: any){
    return request({
        url: "/api/PartsClass/GetPartsClassList",
        method: "post",
        data,
    });
}

//增加分类
export function addPartsClassData(data: any){
    return request({
        url: "/api/PartsClass/addPartsClassData",
        method: "post",
        data,
    });
}

//更新分类
export function updatePartsClassData(data: any){
    return request({
        url: "/api/PartsClass/updatePartsClassData",
        method: "post",
        data,
    });
}

//删除分类
export function deletePartsClassData(code: any,username:any){
    return request({
        url: "/api/PartsClass/deletePartsClassData",
        method: "post",
        params:{
            code,
            username
        }
    });
}

//备品备件
//查询所有备件
export function GetPartsList(data: any){
    return request({
        url: "/api/Parts/GetPartsList",
        method: "post",
        data,
    });
}

//更改备件基础信息
export function updatePartsData(data: any){
    return request({
        url: "/api/Parts/updatePartsData",
        method: "post",
        data,
    });
}

//删除备件基础信息
export function deletePartsData(code: any,username:any){
    return request({
        url: "/api/Parts/deletePartsData",
        method: "post",
        params:{
            code,
            username
        }
    });
}

//增加备件基础信息
export function addPartsData(data: any){
    return request({
        url: "/api/Parts/addPartsData",
        method: "post",
        data,
    });
}