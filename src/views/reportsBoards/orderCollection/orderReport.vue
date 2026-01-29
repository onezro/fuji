<template>
    <div class="p-2">
         <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="MfgOrderName" label-width="auto" :size="'small'" 
              :inline="true" @submit.native.prevent> 
                <el-form-item label="工单号" prop="MfgOrderName">
                    <el-input v-model="MfgOrderName" style="width: 190px" placeholder="请输入工单号"  @keyup.enter.native="getData"/>
                  
                </el-form-item>
                  <el-form-item>
                     <el-button type="primary" @click="getData">查询</el-button>
                       <el-button type="info" @click="resetForm">重置</el-button>
                  </el-form-item>
                 

            </el-form>
             <el-tabs v-model="activeConName" @tab-change="handleClick" type="border-card">
                <el-tab-pane label="生产调控" name="first">
                    <el-table :data="ProControlTable" border stripe style="width: 100%" size="small" :height="tableHeight">
                        <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="Description" :label="'生产备注'" :min-width="getColumnWidth3('Description')"/>
                        <el-table-column prop="MfgOrderPO" :label="'工单PO'" :min-width="getColumnWidth3('MfgOrderPO')" />
                        <el-table-column prop="Quantity" :label="'生产数量'" />
                        <el-table-column prop="OrderQty" :label="'工单数量'" />
                        <el-table-column prop="ProductName" :label="$t('oqcInspection.productName')" :min-width="getColumnWidth3('ProductName')" />
                        <el-table-column prop="ProductType" :label="$t('oqcInspection.productCategory')" />
                        <el-table-column prop="ProductDescription" :label="'产品描述'" :min-width="getColumnWidth3('ProductDescription')" />
                        <el-table-column prop="CustomerName" :label="$t('oqcInspection.customerName')" />
                        <el-table-column prop="CustomerPO" :label="$t('oqcInspection.customerPO')" width="130" />
                        <el-table-column prop="CustomerPN" :label="$t('oqcInspection.customerPN')" width="130" />
                        <el-table-column prop="SpecName" :label="'工序'" width="130" />
                        <el-table-column prop="SpecificationNo" :label="'规格书编号'" width="130" />
                        <el-table-column prop="Tabulator" :label="$t('oqcInspection.CreateTime')" width="150" />
                        <el-table-column prop="AcceptOrdersDate" :label="'下单日期'" width="150" />
                        <el-table-column prop="PlaceAnOrderDate" :label="'排产日期'" width="150" />
                        <el-table-column prop="ShipmentDate" :label="'出货日期'" width="150" />
                        <el-table-column prop="SchedulingDate" :label="'接单日期'" width="150" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="物料出仓" name="second">
                    <el-table :data="MaterialDisTable" border stripe style="width: 100%" size="small" :height="tableHeight">
                        <el-table-column prop="MfgOrderName" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="MfgOrderPO" :label="'产品分类'" />
                        <el-table-column prop="ProductName" :label="'原料名称'" :min-width="getColumnWidth4('ProductName')"/>
                        <el-table-column prop="MaterialSpecifications" :label="'原料规格'" />
                        <el-table-column prop="MaterialLot" :label="'原料批号'" width="130" />
                        <el-table-column prop="QtyRequired" :label="'申领数量'" />
                        <el-table-column prop="BatchLot" :label="'生产批号'" width="130" />
                        <el-table-column prop="MOSignForConfirmUserName" :label="'MO签收确认'"  width="130"/>
                        <el-table-column prop="MOSignForConfirmDate" :label="'MO签收确认时间'" width="130" />
                        <el-table-column prop="WareHouseConfirmUserName" :label="'仓管确认'" width="130" />
                        <el-table-column prop="WareHouseConfirmDate" :label="'仓管确认时间'" width="130" />
                        <el-table-column prop="LabelProductionConfirmUserName" :label="'标签制作确认'" width="130" />
                        <el-table-column prop="LabelSignForConfirmDate" :label="'标签制作确认时间'" width="150" />
                        <el-table-column prop="LabelSignForConfirmUserName" :label="'标签签收确认'" width="150" />
                        <el-table-column prop="LabelSignForConfirmDate" :label="'标签签收确认时间'" width="150" />
                        <el-table-column prop="CuttingQty" :label="'开料数量'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'领料人'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'领料时间'" width="150" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="生产过程" name="third">
                    <el-table :data="ProLineRealTable" border stripe style="width: 100%" size="small" :height="tableHeight">
                        <el-table-column prop="MfgOrderName" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="ResourceName" :label="'设备编号'" />
                        <el-table-column prop="ProductName" :label="'模具编号'" />
                        <!-- <el-table-column prop="MaterialSpecifications" :label="'一模数'" />
                        <el-table-column prop="MaterialLot" :label="'片数/卷数'" width="130" /> -->
                        <el-table-column prop="MoveInDate" :label="'开始时间'" />
                        <el-table-column prop="TxnDate" :label="'终止时间'" width="130" />
                        <el-table-column prop="TimeDiff" :label="'时长'" />
                        <el-table-column prop="EmployeeName" :label="'工号'" width="130" />
                        <el-table-column prop="FullName" :label="'姓名'" width="130" />
                    </el-table></el-tab-pane>
                <el-tab-pane label="包装数据" name="fourth">
                    <el-table :data="FinishedProTable" border stripe style="width: 100%" size="small" :height="tableHeight">
                        <el-table-column prop="MfgOrderName" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="count_records" :label="'整箱数量'" />
                        <el-table-column prop="avg_NumberOfBoxes" :label="'整箱箱数'" />
                        <el-table-column prop="MaterialSpecifications" :label="'尾箱数量'" />
                        <el-table-column prop="MaterialLot" :label="'尾箱箱数'" width="130" />
                        <el-table-column prop="QtyRequired" :label="'整包数量'" />
                        <el-table-column prop="BatchLot" :label="'整包包数'" width="130" />
                        <el-table-column prop="MOSignForConfirmUserName" :label="'尾箱：包/箱'" width="130" />
                        <el-table-column prop="MOSignForConfirmDate" :label="'整箱净重kg'" width="130" />
                        <el-table-column prop="WareHouseConfirmUserName" :label="'整箱毛重kg'" width="130" />
                        <el-table-column prop="BoxModlName" :label="'整箱外箱型'" width="100" />
                        <el-table-column prop="LabelProductionConfirmUserName" :label="'尾箱净重kg'" width="130" />
                        <el-table-column prop="LabelSignForConfirmDate" :label="'尾箱毛重kg'" width="150" />
                        <el-table-column prop="LabelSignForConfirmUserName" :label="'尾箱外箱型'" width="150" />
                        <el-table-column prop="total_gross_weight" :label="'整包净重kg'" width="150" />
                        <el-table-column prop="total_net_weight" :label="'整包毛重kg'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'尾包数量'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'尾包包数'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'尾包净重kg'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'尾包毛重kg'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'工号'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'姓名'" width="150" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="过程检验" name="five">
                    <el-table :data="ProStageTable" border stripe style="width: 100%" size="small" :height="tableHeight">
                        <el-table-column prop="order_no" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="pass_rate_percent" label="合格率" />
                        <el-table-column prop="total_qty" label="总数量" />
                        <el-table-column prop="good_qty" label="良品数" />
                        <el-table-column prop="defect_qty" label="不良品数" />
                        <el-table-column prop="current_balance" label="本次结余" />
                        <el-table-column prop="process_defect_rate_percent" label="工序不良率" />
                        <el-table-column prop="process_defect_indentation" label="工序-压痕" />
                        <el-table-column prop="process_defect_uneven" label="工序-凹凸" />
                        <el-table-column prop="process_defect_burr" label="工序-毛边" />
                        <el-table-column prop="process_defect_crack" label="工序-开裂" />
                        <el-table-column prop="process_defect_foreign_matter" label="工序-异物" />
                        <el-table-column prop="process_defect_red_dot" label="工序-红点" />
                        <el-table-column prop="process_defect_over_cut" label="工序-多切" />
                        <el-table-column prop="process_defect_deformation" label="工序-变形" />
                        <el-table-column prop="process_defect_punch_break" label="工序-冲断" />
                        <el-table-column prop="raw_defect_bubble" label="工序-气泡" />
                        <el-table-column prop="process_defect_other" label="工序-其他" />
                        <el-table-column prop="raw_material_defect_rate_percent" label="原料不良率" />
                        <el-table-column prop="raw_defect_glue" label="原料-胶水" />
                        <el-table-column prop="raw_defect_scratch" label="原料-刮伤" />
                        <el-table-column prop="raw_defect_pinhole" label="原料-针孔" />
                        <el-table-column prop="raw_defect_stain" label="原料-污点" />
                        <el-table-column prop="raw_defect_bubble" label="原料-气泡" />
                        <el-table-column prop="raw_defect_broken_corner" label="原料-缺角" />
                        <el-table-column prop="raw_defect_uneven" label="原料-凹凸" />
                        <el-table-column prop="raw_defect_tilt" label="原料-倾斜" />
                        <el-table-column prop="process_defect_foreign_matter" label="原料-异物" />
                        <el-table-column prop="process_defect_red_dot" label="原料-红点" />
                        <el-table-column prop="raw_defect_other" label="原料-其他" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="生产备注" name="six">
                    <el-table :data="ManufactureTable" border stripe style="width: 100%" size="small" :height="tableHeight">
                        <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" />
                         <el-table-column prop="DataValue" :label="'备注'"  :min-width="getColumnWidth5('DataValue')" />
                        <el-table-column prop="LotNumber" :label="'出货批号'" />
                        <el-table-column prop="ShippingQty" :label="'送检数量'" />
                        <el-table-column prop="UnitOfMeasure" :label="'单位'" width="130" />
                        <el-table-column prop="FormattedDate" :label="'送检时间'" />
                        <el-table-column prop="SubmitterNo" :label="'送检人工号'" width="130" />
                        <el-table-column prop="Submitter" :label="'送检人'" />

                    </el-table>
                </el-tab-pane>
            </el-tabs>
         </el-card>
    </div>
</template>

<script setup lang="ts">
    import {
    QueryProductionControlParameters,
    QueryMaterialDispatchDetails,
    QueryProductionLineRealTimeData,
    QueryProductionStageQCReports,
    QueryFinishedProductPackingData,
    QueryManufacturingNotesHistory,
} from "@/api/smtSpotCheck/oqc";
import { calculateColumnsWidth, clearTextWidthCache } from '@/utils/tableminWidth'
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    computed,
} from "vue";
const activeConName = ref('first')
const ProControlTable = ref<any[]>([])
const MaterialDisTable = ref<any[]>([])
const ProLineRealTable = ref<any[]>([])
const FinishedProTable = ref<any[]>([])
const ProStageTable = ref<any[]>([])
const ManufactureTable = ref<any[]>([])
const MfgOrderName=ref('')
const tableHeight = ref(0);

onBeforeMount(() => {
    getScreenHeight();
  
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
   
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache()
});
const resetForm = () => {
    MfgOrderName.value = ''
    activeConName.value = 'first'
    ProControlTable.value = []
    MaterialDisTable.value = []
    ProLineRealTable.value = []
    FinishedProTable.value = []
    ProStageTable.value = []
    ManufactureTable.value = []

}
const getData = () => {
    if(!MfgOrderName.value) {
        ElMessage.warning('请输入工单号')
        return
    }
    handleClick(activeConName.value)
}
const handleClick = (val: any) => {
    if(!MfgOrderName.value) {
        ElMessage.warning('请输入工单号')
        return
    }
    console.log(val);
    if (val == "first") {
        QueryProductionControlParameters(MfgOrderName.value).then((res: any) => {
            ProControlTable.value = res.content
        })
    } else if (val == 'second') {
        QueryMaterialDispatchDetails(MfgOrderName.value).then((res: any) => {
            MaterialDisTable.value = res.content
        })
    } else if (val == 'third') {
        QueryProductionLineRealTimeData(MfgOrderName.value).then((res: any) => {
            ProLineRealTable.value = res.content
        })
    } else if (val == 'fourth') {
        QueryFinishedProductPackingData(MfgOrderName.value).then((res: any) => {
            FinishedProTable.value = res.content
        })

    } else if (val == 'five') {
        QueryProductionStageQCReports(MfgOrderName.value).then((res: any) => {

            ProStageTable.value = res.content
        })
    } else {
        QueryManufacturingNotesHistory(MfgOrderName.value).then((res: any) => {
            ManufactureTable.value = res.content
        })
    }

}
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 250;
    });
};
const columnWidths3 = computed(() => {
    const columns = [
        { label: '生产备注', prop: 'Description' },
        { label: '产品名称', prop: 'ProductName' },
        { label: '产品描述', prop: 'ProductDescription' },
        { label: '工单PO', prop: 'MfgOrderPO' }
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, ProControlTable.value, {
        padding: 25,
        fontSize: 13
    });
});

// 在模板中使用
const getColumnWidth3 = (prop: string) => {
    return columnWidths3.value[prop] || 'auto';
};
const columnWidths4= computed(() => {
    const columns = [
        { label: '原材料名称', prop: 'ProductName' },
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, MaterialDisTable.value, {
        padding: 25,
        fontSize: 13
    });
});

// 在模板中使用
const getColumnWidth4= (prop: string) => {
    return columnWidths4.value[prop] || 'auto';
};
const columnWidths5 = computed(() => {
    const columns = [
        { label: '备注', prop: 'DataValue' },
       
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, ManufactureTable.value, {
        padding: 25,
        fontSize: 13
    });
});

// 在模板中使用
const getColumnWidth5 = (prop: string) => {
    return columnWidths5.value[prop] || 'auto';
}; 
</script>

<style lang="scss" scoped>

</style>