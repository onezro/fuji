import request from "@/utils/scrRequest";
//查询屏车间打印数据
export function QueryScreEPrintData(data: any){
    return request({
        url: "/api/Scree/QueryScreEPrintData",
        method: "post",
        data,
    });
}
//打印屏车间标签
export function PrintScreePcbLabel(data: any){
    return request({
        url: "/api/Scree/PrintScreePcbLabel",
        method: "post",
        data,
    });
}

//工治具上线
export function ToolOnline(data: any){
    return request({
        url: "/api/OqcIpTest/ToolOnline",
        method: "post",
        data,
    });
}

//OqcIp 测试过站
export function OqcIpTestOut(data: any){
    return request({
        url: "/api/OqcIpTest/OqcIpTestOut",
        method: "post",
        data,
    });
}

//查询不良代码及工单信息
export function QueryDefectCode(data: any){
    return request({
        url: "/api/OqcIpTest/QueryDefectCode",
        method: "post",
        params:{
            containerName:data
        }
    });
}

//不良品记录
export function OqcIpTefectProductRecord(data: any){
    return request({
        url: "/api/OqcIpTest/OqcIpTefectProductRecord",
        method: "post",
        data,
    });
}