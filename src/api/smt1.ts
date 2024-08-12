import request from "@/utils/request2";

//镭雕
export function getLaserWorkOrder(data: any) {
    return request({
        url: "/api/LaserCarving/OrderQuery",
        method: "post",
        data
    });
}