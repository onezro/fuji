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