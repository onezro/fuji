import request from "@/utils/request4";

//镭雕
export function getMaterialInformation(data: any) {
    return request({
        url: "/api/LaserCarving/Submit",
        method: "post",
        data
    });
}