import request from "@/utils/request";
export function InsertInspect(data: any){
    return request({
        url: "/api/firstinspect/Insert_Inspect_Info",
        method: "post",
        data,
    });
}

export function GetInspectData(data: any){
    return request({
        url: "/api/firstinspect/Query_Inspect_Info",
        method: "post",
        data,
    });
}
///api/firstinspect/Update_Inspect_Info
export function UpdateInspectData(data: any){
    return request({
        url: "/api/firstinspect/Update_Inspect_Info",
        method: "post",
        data,
    });
}

export function DeleteInspectData(data: any){
    return request({
        url: "/api/firstinspect/Delete_Inspect_Info",
        method: "post",
        data,
    });
}

export function getCheckResults(data: any){
    return request({
        url: "/api/firstinspect/Quert_Inspect_History_Info",
        method: "post",
        data,
    });
}

//设备台账  获取设备类型
export function GetEquipmentTypeList(){
    return request({
        url: "/api/resource/GetEquipmentTypeList",
        method: "post",
    });
}
//获取设备台账  
export function GetEquipmentList(data:any){
    return request({
        url: "/api/resource/GetEquipmentList",
        method: "post",
        data
    });
}
//台账获取 车间 产线
export function GetFactoryModelList(){
    return request({
        url: "/api/system/GetFactoryModelList",
        method: "post",
    });
}
//获取物料树
export function findAllMaterialTree() {
    return request({
        url: "/api/product/findProductFamily",
        method: "post",
    })
}
//获取物料详细
export function findProductMaterial(data: any) {
    return request({
        url: "/api/product/findProduct",
        method: "post",
        data
    })
}
//修改物料
export function UpdateProductMaterial(data: any) {
    return request({
        url: "/api/product/UpdateProduct",
        method: "post",
        data
    })
}
//根据治具类型操作
export function ToolsType(data: any) {
    return request({
        url: "/api/Tools/ToolsType",
        method: "post",
        data
    })
}
//单个治具录入删除修改数据
export function ToolsDetail(data: any) {
    return request({
        url: "/api/Tools/ToolsDetail",

        method: "post",
        data
    })
}

//根据产品的治具用量操作
export function ToolsSpec(data: any) {
    return request({
        url: "/api/Tools/ToolsSpec",
        method: "post",
        data
    })
}

//治具上架下架
export function ToolsMove(data: any) {
    return request({
        url: "/api/Tools/ToolsMove",
        method: "post",
        data
    })
}

//查询产品物料信息
export function findPdMaterial() {
    return request({
        url: "/api/Tools/findProduct",
        method: "post"
    })
}

//根据产品查询产品工序
export function findProductSpec(data:any) {
    return request({
        url: "/api/Tools/findProductSpec",
        method: "post",
        params: {
            productName:data
        }
    })
}
//查询产品BOM
export function findProductBOM(data: any) {
    return request({
        url: "/api/product/findProductBOM",
        method: "post",
        data:{
            ProductName:data
        }
    })
}
//查询工单状态
export function findOrderStatus() {
    return request({
        url: "/api/order/findOrderStatus",
        method: "post"
    })
}

//查询工单信息
export function findOrder(data:any) {
    return request({
        url: "/api/order/findOrder",
        method: "post",
        data
    })
}

//查询工单明细
export function QueryOrderMaterialRequired(data:any) {
    return request({
        url: "/api/order/QueryOrderMaterialRequired",
        method: "post",
        data
    })
}

//查询工单明细
export function QueryOrderToolsData(data:any) {
    return request({
        url: "/api/order/QueryOrderToolsData",
        method: "post",
        params: {
            orderNumber:data
        }
    })
}
//查询工治具
export function QueryToolInfo(data: any) {
    return request({
        url: "/api/Tools/QueryToolInfo",
        method: "post",
        data,
    });
}
//工治具上移
export function SortTools(data: any) {
    return request({
        url: "/api/Tools/SortTools",
        method: "post",
        data,
    });
}
//获取工治具型号维护类型
export function GetComboBoxList(data: any) {
    return request({
        url: "/api/system/GetComboBoxList",
        method: "post",
        params: {
            UserConstantName:data
        }
    });
}
//查询工单任务详情
export function findTaskToolsDetail(data: any) {
    return request({
        url: "/api/Tools/findTaskToolsDetail",
        method: "post",
        data,
    });
}