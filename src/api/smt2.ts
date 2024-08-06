import request from "@/utils/request4";

//镭雕
export function getLaserWorkOrder(data: any) {
    return request({
        url: "/api/LaserCarving/Query",
        method: "post",
        data
    });
}