import request from "@/utils/request4";

//镭雕
export function getMaterialInformation(data: any) {
    return request({
        url: "/api/LaserCarving/CreateSNOrderNumber",
        method: "post",
        data
    });
}

export function OrderSNQuery(data: any) {
    return request({
        url: "api/LaserCarving/OrderSNQuery",
        method: "post",
        data
    });
}