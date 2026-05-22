<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" @submit.native.prevent :size="'small'">
                <el-form-item :label="$t('finishProduct.boxCode')" class="mb-2" prop="OuterBoxContainerName">
                    <el-input v-model.trim="getForm.OuterBoxContainerName" clearable style="width: 200px" placeholder=""
                        @keyup.enter.native="getData" />
                </el-form-item>

                <el-form-item :label="$t('finishProduct.boxOrderNum')" class="mb-2" prop="PackingBoxContainerName">
                    <el-input v-model.trim="getForm.PackingBoxContainerName" clearable style="width: 200px"
                        placeholder="" @keyup.enter.native="getData" />
                </el-form-item>
                <el-form-item :label="$t('finishProduct.LotNumber')" class="mb-2" prop="OuterBoxContainerName">
                    <el-input v-model.trim="getForm.LotNumber" clearable style="width: 200px" placeholder=""
                        @keyup.enter.native="getData" />
                </el-form-item>
                <el-form-item :label="$t('processInspect.creatTime')" class="mb-2"><el-date-picker
                        :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" size="small" style="width: 200px" :clearable="false" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="getData">{{
                        $t("publicText.query")
                        }}</el-button>
                    <el-button type="" @click="handleReset">{{
                        $t("publicText.reset")
                        }}</el-button>
                    <el-button type="success" @click="handleExcel" :disabled="tableData.length==0">{{
                        $t("publicText.export")
                        }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" size="small" ref="excelTableRef" :style="{ width: '100%' }"
                :height="tableHeight" border stripe>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column prop="ParentContainerName" :label="$t('finishProduct.boxOrderNum')"
                    :min-width="getColumnWidth('ParentContainerName')" />
                <el-table-column prop="ContainerName" :label="$t('finishProduct.boxCode')"
                    :min-width="getColumnWidth('ContainerName')" />
                <el-table-column prop="MfgOrderName" :label="$t('finishProduct.order')"
                    :min-width="getColumnWidth('MfgOrderName')" />
                <el-table-column prop="OriginalStartDate" :label="$t('finishProduct.OriginalStartDate')"
                    :min-width="getColumnWidth('OriginalStartDate')" />
                <el-table-column prop="CustomerName" :label="$t('listGeneration.customer')"
                    :min-width="getColumnWidth('CustomerName')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('listGeneration.productName')"
                    :min-width="getColumnWidth('ES_CustomerProduct')" />
                <el-table-column prop="ES_CustomerPO" :label="$t('listGeneration.productPO')"
                    :min-width="getColumnWidth('ES_CustomerPO')" />
                <el-table-column prop="ProductName" :label="$t('listGeneration.productPN')"
                    :min-width="getColumnWidth('ProductName')" />
                <el-table-column prop="ES_LotNumber" :label="$t('listGeneration.lotNo')"
                    :min-width="getColumnWidth('ES_LotNumber')" />
                <el-table-column prop="Qty" :label="$t('listGeneration.productionQty')"
                    :min-width="getColumnWidth('Qty')" />
                <el-table-column prop="Qty2" :label="$t('listGeneration.orderNum')"
                    :min-width="getColumnWidth('Qty2')" />
                <el-table-column prop="QuantityInFullContainers" :label="$t('listGeneration.boxNum')"
                    :min-width="getColumnWidth('QuantityInFullContainers')" />
                <el-table-column prop="NumberOfFullContainers" :label="$t('listGeneration.totalNumBox')"
                    :min-width="getColumnWidth('NumberOfFullContainers')" />
                <el-table-column prop="BreakBulkQuantity" :label="$t('listGeneration.trunkNum')"
                    :min-width="getColumnWidth('BreakBulkQuantity')" />
                <el-table-column prop="BreakBulkCartonCount" :label="$t('listGeneration.totalNumTrunk')"
                    :min-width="getColumnWidth('BreakBulkCartonCount')" />
                <el-table-column prop="OuterBoxModelName" :label="$t('listGeneration.packType')"
                    :min-width="getColumnWidth('OuterBoxModelName')" />
                <el-table-column prop="FullContainerNetWeight" :label="$t('listGeneration.boxNetWeight')"
                    :min-width="getColumnWidth('FullContainerNetWeight')" />
                <el-table-column prop="FullContainerGrossWeight" :label="$t('listGeneration.boxGrossWeight')"
                    :min-width="getColumnWidth('FullContainerGrossWeight')" />
                <el-table-column prop="BreakBulkNetWeight" :label="$t('listGeneration.trunkNetWeightw')"
                    :min-width="getColumnWidth('BreakBulkNetWeight')" />
                <el-table-column prop="BreakBulkGrossWeight" :label="$t('listGeneration.trunkGrossWeight')"
                    :min-width="getColumnWidth('BreakBulkGrossWeight')" />
                <el-table-column prop="TotalNetWeight" :label="$t('listGeneration.totalNetWeightw') + '(kg)'"
                    :min-width="getColumnWidth('TotalNetWeight')" />
                <el-table-column prop="TotalGrossWeight" :label="$t('listGeneration.totalGrossWeightw') + '(kg)'"
                    :min-width="getColumnWidth('TotalGrossWeight')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2 mb-1 flex justify-end">
                <el-button type="" :disabled="tableData.length == 0" @click="handleClean">{{
                    $t("publicText.reset")
                    }}</el-button>
                <el-button type="primary" :disabled="tableData.length == 0" @click="dialogVisible = true">{{
                    $t("publicText.submit") + $t("publicText.inStorage")
                    }}</el-button>
            </div>
        </el-card>
        <el-dialog v-model="dialogVisible" :title="$t('finishProduct.materialPos')" width="300" @close="handleClose">
            <el-form-item :label="$t('finishProduct.materialPos')" class="mb-2" prop="Location">
                <el-select v-model="locationDsc" filterable style="width: 180px">
                    <el-option v-for="item in posRawList" :key="item.ES_WarehouseStorageLocationId"
                        :label="item.ES_WarehouseStorageLocatioName" :value="item.ES_WarehouseStorageLocatioName">
                    </el-option>
                </el-select>
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleSubmit"> {{ $t('publicText.confirm') }} </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { exportTableByRef } from "@/utils/generalExportExcel"
import { useExport } from '@/utils/loadingExcel';
import {
    GetCompletedInventoryQuery,
    SubmitForCompletionAndWarehousing,
    GetCompletedInventoryNewQuery
} from "@/api/warehouseManage/finishProduct";
import {
    getWarehouseStorageLocationQuery
} from "@/api/warehouseManage/inventInquiry";
import {
    shortcuts
} from "@/utils/dataMenu";
import dayjs from "dayjs";
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { calculateColumnsWidth, clearTextWidthCache } from '@/utils/tableminWidth'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const formRef = ref()
const getForm = ref({
    OuterBoxContainerName: '',
    PackingBoxContainerName: '',
    LotNumber: "",
    StartTime: "",
    EndTime: ""
})
const tableHeight = ref(0)
const tableData = ref([])
const locationDsc = ref('')
const posRawList = ref<any[]>([]);
const dialogVisible = ref(false);
const searchDate = ref<any[]>([]);
const palletList = ref<any[]>();
const getDetailForm = ref({
    PackingContainerName: "",
    HSCodeName: "",
})
const listData = ref<any>({
    ContainerName: '',
    ES_CardAreaName: '',
    InnerBoxesTareWeight: 0,
    OriginalStartDate: '',
    OuterBoxesNetWeight: 0,
    OuterBoxesTareWeight: 0,
    TotalBoxCount: 0,
    TotalGrossWeight: 0,
    TotalNetWeight: 0,
});
const previewVisible = ref(false);
const tableData2 = ref([])
const tableHeight2 = ref(0)
const excelTableRef = ref()
const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport();
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getMaterialPos()
    getData()
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache()
});
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.StartTime = "";
            getForm.value.EndTime = "";
            // getForm.value.PageNumber = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.StartTime = newVal[0] + ' 00:00:00';
            getForm.value.EndTime = newVal[1] + ' 23:59:59';
            // getForm.value.PageNumber = 1
        }
    }
);
const handleExcel = async () => {
    showLoading('正在导出表格数据...');
    console.log(excelTableRef.value.columns);

    try {
        await exportTableByRef(
            excelTableRef.value,  // ref 值
            tableData.value,
            {
                fileName: '成品入库',
                sheetName: 'Sheet1',
                // 排除 index 和 operation 列（label 使用国际化后的内容）
                excludeProps: ['publicText.index', 'publicText.operation'],
                i18nT: t,  // 传入翻译函数，以便匹配翻译后的列标题
            }

        );
        handleExportSuccess('成品入库');
    } catch (err) {
        handleExportError(err);
    } finally {
        hideLoading();
    }
}
const getData = () => {

    GetCompletedInventoryNewQuery(getForm.value).then((res: any) => {
        if (res.success) {
            tableData.value = res.content == null ? [] : res.content.map((v: any) => {
                return {
                    ...v,
                    OriginalStartDate: dayjs(v.OriginalStartDate).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        } else {
            tableData.value = []
            // ElNotification({
            //     title: t('message.tipTitle'),
            //     message: res.msg,
            //     type: 'error',
            // });
        }
    })
}
//获取存放位置
const getMaterialPos = () => {

    getWarehouseStorageLocationQuery({}).then((res: any) => {
        posRawList.value = res.content;
    });
};
const handleReset = () => {
    formRef.value.resetFields()
    tableData.value = []
}
const handleClean = () => {
    tableData.value = []
}
const handleClose = () => {
    dialogVisible.value = false
}

const handleSubmit = () => {
    let data = tableData.value.map((item: any) => {
        return {
            OuterBoxContainerName: item.ContainerName,
            PackingBoxContainerName: item.ParentContainerName,
            Location: locationDsc.value,
            MfgOrderName: item.MfgOrderName
        }
    })
    SubmitForCompletionAndWarehousing(data).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: 'success',
            });
            getData()
        } else {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: 'error',
            });
        }
    })
}
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = (window.innerHeight - 210)

    });
};
// 需要自适应宽度的列配置
const dynamicColumns = [
    { label: t('finishProduct.boxOrderNum'), prop: 'ParentContainerName' },
    { label: t('finishProduct.boxCode'), prop: 'ContainerName' },
    { label: t('finishProduct.order'), prop: 'MfgOrderName' },
    { label: t('finishProduct.OriginalStartDate'), prop: 'OriginalStartDate' },
    { label: t('listGeneration.customer'), prop: 'CustomerName' },
    { label: t('listGeneration.productName'), prop: 'ES_CustomerProduct' },
    { label: t('listGeneration.productPO'), prop: 'ES_CustomerPO' },
    { label: t('listGeneration.productPN'), prop: 'ProductName' },
    { label: t('listGeneration.lotNo'), prop: 'ES_LotNumber' },
    { label: t('listGeneration.productionQty'), prop: 'Qty' },
    { label: t('listGeneration.orderNum'), prop: 'Qty2' },
    { label: t('listGeneration.boxNum'), prop: 'QuantityInFullContainers' },
    { label: t('listGeneration.totalNumBox'), prop: 'NumberOfFullContainers' },
    { label: t('listGeneration.trunkNum'), prop: 'BreakBulkQuantity' },
    { label: t('listGeneration.totalNumTrunk'), prop: 'BreakBulkCartonCount' },
    { label: t('listGeneration.packType'), prop: 'OuterBoxModelName' },
    { label: t('listGeneration.boxNetWeight'), prop: 'FullContainerNetWeight' },
    { label: t('listGeneration.boxGrossWeight'), prop: 'FullContainerGrossWeight' },
    { label: t('listGeneration.trunkNetWeightw'), prop: 'BreakBulkNetWeight' },
    { label: t('listGeneration.trunkGrossWeight'), prop: 'BreakBulkGrossWeight' },
    { label: t('listGeneration.totalNetWeightw') + '(kg)', prop: 'TotalNetWeight' },
    { label: t('listGeneration.totalGrossWeightw') + '(kg)', prop: 'TotalGrossWeight' }
];

const columnWidths = computed(() => {
    // 批量计算列宽，可根据实际需要调整 padding 和 fontSize
    return calculateColumnsWidth(dynamicColumns, tableData.value, {
        padding: 25,      // 单元格内边距总和
        fontSize: 13      // 字体大小
    });
});

const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || 'auto';
};
</script>

<style lang="scss" scoped></style>