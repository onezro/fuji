import request from "@/utils/request";
import request1 from "@/utils/plainTextApi";
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
//获取Combox的list


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
//修改物料属性
export function UpdateProductProperty(data: any) {
    return request({
        url: "/api/product/UpdateProductProperty",
        method: "post",
        data
    })
}
//获取物料MSD等级
export function GetMSDLevel() {
    return request({
        url: "/api/product/GetMSDLevel",
        method: "post",
    })
}
//修改物料MSD属性
export function UpdateMSDMaterialAttribute(data: any) {
    return request({
        url: "/api/product/UpdateMSDMaterialAttribute",
        method: "post",
        data
    })
}

//根据ERPBOMId查询产品BOM物料清单
export function findERPBOMMaterialList(query: any) {
    return request1({
        url: "/api/product/findERPBOMMaterialList",
        method: "post",
        data:query
    })
}
//查询产品BOM
export function findERPBOM(data: any) {
    return request({
        url: "/api/product/findERPBOM",
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
        url: "/api/order/OrderQuery",
        method: "post",
        data
    })
}
//修改工单状态
export function UpdateOrderStatus(data:any) {
    return request({
        url: "/api/order/UpdateOrderStatus",
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
export function QueryTools(data: any) {
    return request({
        url: "/api/Tools/QueryTools",
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

//获取工治具型号维护类型
export function SubmitMaterialRequest(data: any) {
    return request({
        url: "/api/order/SubmitMaterialRequest",
        method: "post",
        data
    });
}

//查询物料申请历史记录
export function QueryMaterialRequest(data: any) {
    return request({
        url: "/api/order/QueryMaterialRequest",
        method: "post",
        data
    });
}

//查询物料申请历史记录明细
export function QueryMaterialRequestDetail(data: any) {
    return request({
        url: "/api/order/QueryMaterialRequestDetail",
        method: "post",
        params: {
            historyId:data
        }
    });
}
//查询亮灯货架
export function findShelf() {
    return request({
        url: "/api/order/findShelf",
        method: "post",
    });
}
//查询上线产线
export function QueryOrderLine(data: any) {
    return request({
        url: "/api/order/QueryOrderLine",
        method: "post",
        params: {
            orderType:data
        }
    });
}
//工单上线
export function OrderOnline(data: any) {
    return request({
        url: "/api/order/OrderOnline",
        method: "post",
        data
    });
}
//ECN查询
export function GetECNorder(data: any) {
    return request({
        url: "/api/ECNOrder/GetECNorder",
        method: "post",
        data
    });
}
//ECN明细
export function GetECNOrderitem(data: any) {
    return request({
        url: "/api/ECNOrder/GetECNOrderItem",
        method: "post",
        params: {
            ECNOrderId:data
        }
    });
}
//不良代码
export function QueryDefectCode(data: any) {
    return request({
        url: "/api/Defect/QueryDefectCode",
        method: "post",
        data
    });
}
//不良明细
export function QueryDefectCodeDetail(data: any) {
    return request({
        url: "/api/Defect/QueryDefectCodeDetail",
        method: "post",
        params:{
            ContainerName:data
           }
    });
}
//查询工序
export function QuerySpec(data: any) {
    return request({
        url: "/api/Defect/QuerySpec",
        method: "post",
       params:{
        spec:data
       }
    });
}

//查询物料退料可申请工单
export function QueryMaterialReturnApply(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturnApply",
        method: "post",
        data
    });
}

//退料单查询
export function QueryMaterialReturn(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturn",
        method: "post",
        data
    });
}

//退料单详情查询
export function QueryMaterialReturnDetail(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturnDetail",
        method: "post",
        params:{
            historyId:data
        }
    });
}

//工单良品退料
export function OrderGoodMaterials(data: any) {
    return request({
        url: "/api/order/OrderGoodMaterials",
        method: "post",
        data
    });
}

//查询物料退料可申请工单
export function QueryMaterialReturnApplyDetail(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturnApplyDetail",
        method: "post",
        data
    });
}

//插件首检检查
//获取检查任务列表
export function GetInspectack(data:any) {
    return request({
        url: "/api/DIPFirstInspect/GetInspectack",
        method: "post",
        data
    })
}

//第一阶段检查
export function FirstStage(data:any) {
    return request({
        url: "/api/DIPFirstInspect/FirstStage",
        method: "post",
        data
    })
}

//第二阶段检查
export function SecondStage(data:any) {
    return request({
        url: "/api/DIPFirstInspect/SecondStage",
        method: "post",
        data
    })
}

//第三阶段检查
export function ThirdStage(data:any) {
    return request({
        url: "/api/DIPFirstInspect/ThirdStage",
        method: "post",
        data
    })
}