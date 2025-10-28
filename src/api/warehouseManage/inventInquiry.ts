import request from "@/request/warehouseRequest";


//物料来源
export function getVendorQuery(data: any) {
    return request({
        url: "/api/warehouse/getVendorQuery",
        method: "post",
        data,
    });
}
//物料类型
export function getProductFamilyQuery(data: any) {
    return request({
        url: "/api/warehouse/getProductFamilyQuery",
        method: "post",
        data,
    });
}
//存放位置
export function getWarehouseStorageLocationQuery(data: any) {
    return request({
        url: "/api/warehouse/getWarehouseStorageLocationQuery",
        method: "post",
        data,
    });
}

//原材料
export function GetRawMaterialInventoryQuery(data: any) {
    return request({
        url: "/api/warehouse/GetRawMaterialInventoryQuery",
        method: "post",
        data,
    });
}
//成品入库
export function GetFinishedProductInventoryQuery(data: any) {
    return request({
        url: "/api/warehouse/GetFinishedProductInventoryQuery",
        method: "post",
        data,
    });
}