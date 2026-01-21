<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="formRef" size="small" class="inbound" :inline="true" @submit.native.prevent
                    label-width="auto">
                    <el-form-item :label="$t('listGeneration.packOrder')" class="mb-2">
                        <el-input v-model.trim="getForm.PackingContainerName" ref="inputPackRef" style="width: 200px"
                            placeholder="" @keyup.enter.native="getData" />
                    </el-form-item>
                    <el-form-item :label="$t('listGeneration.packTime')" class="mb-2">
                        <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD"
                            type="daterange" range-separator="-" size="small" style="width: 200px" :clearable="false"
                            :disabledDate="disabledDate" />
                    </el-form-item>

                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">{{
                            $t("publicText.query")
                        }}</el-button>
                        <el-button type="" @click="resetGetForm">{{
                            $t("publicText.reset")
                        }}</el-button>
                    </el-form-item>
                </el-form>
                <el-form-item class="mb-2">
                    <el-button type="success" size="small" :disabled="tableData2.length == 0" @click="exportList">{{
                        $t("publicText.export") }}</el-button>
                </el-form-item>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'light'" border fit
                highlight-current-row @cell-click="cellClick">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="ES_CardAreaName" :label="$t('listGeneration.palletNum')" />

                <el-table-column prop="OriginalStartDate" :label="$t('listGeneration.packCompleTime')" />
                <el-table-column prop="ContainerName" :label="$t('listGeneration.packOrder')" />
                <el-table-column prop="TotalBoxCount" :label="$t('listGeneration.totalBoxNum')" />
                <el-table-column prop="TotalNetWeight" :label="$t('listGeneration.totalNetWeightw')" />
                <el-table-column prop="TotalGrossWeight" :label="$t('listGeneration.totalGrossWeightw')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
            <div class="flex justify-between items-center">
                <el-form ref="formRef" class="inbound" :inline="true" size="small" @submit.native.prevent
                    label-width="auto">
                    <el-form-item :label="$t('listGeneration.productType')" class="mb-2">
                        <el-select v-model="getDetailForm.HSCodeName" filterable @change="getDetailData" style="width: 200px">
                            <el-option v-for="item in palletList" :key="item.ES_HsCodeId" :label="item.ES_HsCodeName"
                                :value="item.ES_HsCodeName">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getDetailData">{{
                            $t("publicText.query")
                        }}</el-button>

                        <el-button @click="resetGetForm2">{{
                            $t("publicText.reset")
                        }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData2" size="small" :style="{ width: '100%' }" :height="tableHeight2"
                :tooltip-effect="'light'" border fit ref="listTableRef">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column prop="CustomerName" :label="$t('listGeneration.customer')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('listGeneration.productName')"  :min-width="getColumnWidth('ES_CustomerProduct')"/>
                <el-table-column prop="ES_CustomerPO" :label="$t('listGeneration.productPO')" width="120" />
                <el-table-column prop="ProductName" :label="$t('listGeneration.productPN')" :min-width="getColumnWidth('ProductName')"  />
                <el-table-column prop="ES_LotNumber" :label="$t('listGeneration.lotNo')" />
                <el-table-column prop="Qty" :label="$t('listGeneration.productionQty')" />
                <el-table-column prop="Qty2" :label="$t('listGeneration.orderNum')" />
                <el-table-column prop="QuantityInFullContainers" :label="$t('listGeneration.boxNum')" />
                <el-table-column prop="NumberOfFullContainers" :label="$t('listGeneration.totalNumBox')" />
                <el-table-column prop="BreakBulkQuantity" :label="$t('listGeneration.trunkNum')" />
                <el-table-column prop="BreakBulkCartonCount" :label="$t('listGeneration.totalNumTrunk')" />
                <el-table-column prop="OuterBoxModelName" :label="$t('listGeneration.packType')" />
                <el-table-column prop="FullContainerNetWeight" :label="$t('listGeneration.boxNetWeight')" />
                <el-table-column prop="FullContainerGrossWeight" :label="$t('listGeneration.boxGrossWeight')" />
                <el-table-column prop="BreakBulkNetWeight" :label="$t('listGeneration.trunkNetWeightw')" />
                <el-table-column prop="BreakBulkGrossWeight" :label="$t('listGeneration.trunkGrossWeight')" />
                <el-table-column prop="TotalNetWeight" :label="$t('listGeneration.totalNetWeightw') + '(kg)'" />
                <el-table-column prop="TotalGrossWeight" :label="$t('listGeneration.totalGrossWeightw') + '(kg)'" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
        </el-card>
           <!-- <el-dialog v-model="previewVisible" :title="'预览'" width="95%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center >
                <VueOfficeExcel :src="excelSrc"></VueOfficeExcel>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts">
// import VueOfficeExcel from '@vue-office/excel';
import {
    GetHSCodeQuery,
    GetPackingSerachReport,
    GetPackingHSCodeSummaryQuery,
    DownloadPackingListReportAsync
} from "@/api/packageManage/listGeneration";
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
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import dayjs from "dayjs";
import { exportTableToExcel } from "@/utils/exportExcel";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { calculateColumnsWidth, clearTextWidthCache } from '@/utils/tableminWidth'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
const listTableRef = ref();
const listDeilTableRef = ref();
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const getForm = ref({
    PackingContainerName: "",
    HSCodeName: "",
    StartTime: "",
    EndTime: ""
});
const getDetailForm=ref({
      PackingContainerName: "",
    HSCodeName: "",
})
const palletList = ref<any[]>();
const tableData = ref<any[]>([]);
const tableHeight2 = ref(0);
const tableData2 = ref<any[]>([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const selectList = ref<any[]>([]);
const productType = ref("");
const ContainerName = ref("");
interface ListData {
    ContainerName: string;
    ES_CardAreaName: string;
    InnerBoxesTareWeight: number;
    OriginalStartDate: string;
    OuterBoxesNetWeight: number;
    OuterBoxesTareWeight: number;
    TotalBoxCount: number;
    TotalGrossWeight: number;
    TotalNetWeight: number;
}
const listData = ref<ListData>({
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
const  previewForm=ref({
    PackingName:'',
    UserName:userStore.getUserInfo
}) 
const excelSrc=ref('')
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
            getForm.value.StartTime = newVal[0];
            getForm.value.EndTime = newVal[1] + ' 23:59:59';
            // getForm.value.PageNumber = 1
        }
    }
);
onBeforeMount(() => {
    getScreenHeight();
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getProductType();
    getData()
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache()
});
const getProductType = () => {
    GetHSCodeQuery({}).then((res: any) => {
        palletList.value = res.content;
    });
};
const getData = () => {
    GetPackingSerachReport(getForm.value).then((res: any) => {
        if (res.success) {
            tableData.value = res.content.map((item: any) => {
                return {
                    ...item,
                    OriginalStartDate: item.OriginalStartDate
                        ? dayjs(item.OriginalStartDate).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                };
            });
        } else {
            tableData.value = [];
        }
    });
};

const cellClick = (val: any) => {
    getDetailForm.value .PackingContainerName= val.ContainerName;
    listData.value = val;
    previewForm.value.PackingName=val.ContainerName
   getDetailData()
};
const getDetailData=()=>{
     GetPackingHSCodeSummaryQuery(getDetailForm.value).then((res: any) => {
        if (res.success) {
            tableData2.value = res.content;
        } else {
            tableData2.value = [];
        }
    });
}
const resetGetForm = () => {
    getForm.value.PackingContainerName = ''
    tableData.value = []
    tableData2.value = []
}
const resetGetForm2 = () => {
    tableData2.value = []
    getDetailForm.value.HSCodeName=''
    // getDetailData()
}
interface IQCFile {
    FileData: string; // Base64 数据
    FileName: string;
}

interface DownloadResponse {
    content: IQCFile[];
    success: boolean;
    message?: string;
}
const exportList =  async() => {
    // DownloadPackingListReportAsync(previewForm.value).then((res:any)=>{
    //     if(res.success){
    //         excelSrc.value= `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.content[0].FileData}`
    //         previewVisible.value=true
    //     }
    // })
    try {
        const resAny: any = await DownloadPackingListReportAsync(previewForm.value);
        console.log(resAny);

        const payload: DownloadResponse = resAny && resAny.data ? resAny.data : resAny;

        if (!payload.success || !payload.content || payload.content.length === 0) {
            ElMessage.warning('没有找到可下载的文件');
            return;
        }

        const files = payload.content;

        // if (files.length > 1) {
        //     await downloadAsZip(files);
        //     return;
        // }

        // 单个文件直接下载
        const file = files[0];
        await downloadSingleFile(file);

    } catch (error) {
        console.error('下载失败:', error);
        ElMessage.error('文件下载失败');
    }
};

const downloadSingleFile = async (file: any) => {
    try {
        // 确保 Base64 数据格式正确
        let base64Data = file.FileData;

        // 如果 Base64 数据不包含 data URL 前缀，添加它
        if (!base64Data.startsWith('data:')) {
            base64Data = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
        }

        // 使用更可靠的下载方式
        const response = await fetch(base64Data);
        const blob = await response.blob();

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        // 设置文件名，确保有 .xlsx 扩展名
        let fileName = file.FileName;
        if (!fileName.toLowerCase().endsWith('.xlsx')) {
            fileName = `${fileName}.xlsx`;
        }

        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        ElMessage.success('文件下载成功');

    } catch (error) {
        console.error('文件下载失败:', error);
        ElMessage.error('文件下载失败');
    }
};
const fetchAllData = async () => {
    let data = await GetPackingHSCodeSummaryQuery(getDetailForm.value).then((res: any) => {
        return res.content;
    });
    return addSummaryDataFunctional(data);
};

const createEmptyObjectFromTemplate = (template: any) =>
    Object.keys(template).reduce(
        (acc, key) => ({
            ...acc,
            [key]: typeof template[key] === "number" ? null : "",
        }),
        {}
    );

const addSummaryDataFunctional = (data: any) => {
    if (data.length === 0) return data;

    const original = data[0];

    const titleObj = {
        ...createEmptyObjectFromTemplate(original),
        BreakBulkGrossWeight: t("listGeneration.totalBoxNum"),
        TotalNetWeight: t("listGeneration.totalNetWeightw") + '(kg)',
        TotalGrossWeight: t("listGeneration.totalGrossWeightw") + '(kg)',
    };

    const dataObj = {
        ...createEmptyObjectFromTemplate(original),
        BreakBulkGrossWeight: listData.value.TotalBoxCount,
        TotalNetWeight: listData.value.TotalNetWeight,
        TotalGrossWeight: listData.value.TotalGrossWeight,
    };

    return [...data, titleObj, dataObj];
};
const handleSelectionChange = (val: any) => {
    selectList.value = val;
};
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;


};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;

};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = (window.innerHeight - 210) * 0.6;
        tableHeight2.value = (window.innerHeight - 210) * 0.4;
    });
};
const columnWidths = computed(() => {
    const columns = [
        { label: '产品PN', prop: 'ProductName' },
        { label: '产品名称', prop: 'ES_CustomerProduct' },
        // { label: 'FA', prop: 'ES_FaUrl' },
        // { label: 'CPK', prop: 'ES_CPKUrl' },
        // 添加其他需要自适应宽度的列
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData2.value, {
        padding: 25,
        fontSize: 13
    });
});

// 在模板中使用
const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || 'auto';
};

</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
