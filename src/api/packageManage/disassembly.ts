import request from "@/request/packageRequest";
//查询绑定的信息
export function getPackingListOuterBoxListSmallBoxQuery(data: any) {
    return request({
        url: "/api/AssociateAndDisassociateController/getPackingListOuterBoxListSmallBoxQuery",
        method: "post",
        data,
    });
}
//查询是否可包装
export function GetSearchBoxNumberSmallBoxNumberQuery(data: any) {
    return request({
        url: "/api/AssociateAndDisassociateController/GetSearchBoxNumberSmallBoxNumberQuery",
        method: "post",
        data,
    });
}
//解除 添加 箱和小盒
export function AssociateAndDisassociateServices(data: any) {
    return request({
        url: "/api/AssociateAndDisassociateController/AssociateAndDisassociateServices",
        method: "post",
        data,
    });
}
//查找小盒
export function GetSmallBoxQueryMfgOrderContianer(data: any) {
    return request({
        url: "/api/AssociateAndDisassociateController/GetSmallBoxQueryMfgOrderContianer",
        method: "post",
        data,
    });
}
//修改小盒
export function SmallBoxCloseAndChangeMfgOrderContianerQty(data: any) {
    return request({
        url: "/api/AssociateAndDisassociateController/SmallBoxCloseAndChangeMfgOrderContianerQty",
        method: "post",
        data,
    });
}
