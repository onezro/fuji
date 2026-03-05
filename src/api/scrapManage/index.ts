import request from "@/request/packageRequest";
//主表查询
export function ScrapQuery(data: any) {
    return request({
        url: "/api/ScrapController/ScrapQuery",
        method: "post",
        data,
    });
}
//明细
export function ScrapMateialDetailQuery(data: any) {
    return request({
        url: "/api/ScrapController/ScrapMateialDetailQuery",
        method: "post",
        data,
    });
}
//查询批次
export function ScrapGetProductQuery(data: any) {
    return request({
        url: "/api/ScrapController/ScrapGetProductQuery",
        method: "post",
        data,
    });
}
//报废申请
export function ScrapExecution(data: any) {
    return request({
        url: "/api/ScrapController/ScrapExecution",
        method: "post",
        data,
    });
}
//导出附件
export function LabelPrintDownloadFtpServer(data: any) {
    return request({
        url: "/api/ScrapController/LabelPrintDownloadFtpServer",
        method: "post",
        params:{
            fileName:data
        }
    });
}

//导出报告
export function DownloadScrapReportAsync(data: any) {
    return request({
        url: "/api/ScrapController/DownloadScrapReportAsync",
        method: "post",
        params:{
            ScrapName:data
        }
    });
}