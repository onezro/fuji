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

//备品备件型号维护
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

//备品备件入库
//查询所有入库主表信息
export function GetPartInList(data: any){
    return request({
        url: "/api/PartsIn/GetPartInList",
        method: "post",
        data,
    });
}

//根据入库单号查询详细数据
export function findChkInParameter(chkin_sht: any){
    return request({
        url: "/api/PartsIn/findChkInParameter",
        method: "post",
        params:{
            chkin_sht
        }
    });
}

//更改入库信息
export function updatePartsIn(data: any){
    return request({
        url: "/api/PartsIn/updatePartsIn",
        method: "post",
        data
    });
}

//删除入库信息
export function deletePartsInData(chkin_sht:any,username: any){
    return request({
        url: "/api/PartsIn/deletePartsInData",
        method: "post",
        params:{
            chkin_sht,
            username
        }
    });
}

//创建入库单
export function PartsInAdd(data: any){
    return request({
        url: "/api/PartsIn/PartsInAdd",
        method: "post",
        data
    });
}

//开始入库
export function StartPartsIn(data: any){
    return request({
        url: "/api/PartsIn/StartPartsIn",
        method: "post",
        data,
    });
}

//入库已完成
export function EndPartsIn(data: any){
    return request({
        url: "/api/PartsIn/EndPartsIn",
        method: "post",
        data,
    });
}