import request from "@/utils/smtMessage";
import requestNoMessage from "@/utils/smtNoMessage";

//镭雕
export function getLaserWorkOrder(data: any) {
    return request({
        url: "/api/LaserCarving/OrderQuery",
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

//报错不主动提示
export function getMaterialInformation(data: any) {
    return requestNoMessage({
        url: "/api/LaserCarving/CreateSNOrderNumber",
        method: "post",
        data
    });
}