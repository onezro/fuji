<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
            <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="tabChange">
                <el-tab-pane :label="$t('inventInquiry.rawMaterialInvent')" name="raw">
                    <el-form ref="formRawRef" :model="getRawForm" :inline="true" size="small" @submit.native.prevent
                        label-width="auto">
                        <el-form-item :label="$t('inventInquiry.materialName')" class="mb-2" prop="ProductName">
                            <el-input v-model.trim="getRawForm.ProductName" style="width: 200px" placeholder=""
                                @keyup.enter.native="getRawData" />
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.incomingBatch')" class="mb-2" prop="CustomerLotNumber">
                            <el-input v-model.trim="getRawForm.CustomerLotNumber" style="width: 200px" placeholder=""
                                @keyup.enter.native="getRawData" />
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.materialSource')" class="mb-2" prop="MaterialSource">
                            <el-select v-model="getRawForm.MaterialSource" filterable style="width: 200px">
                                <el-option v-for="item in sourceList" :key="item.VendorId" :label="item.VendorName"
                                    :value="item.VendorName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.materialType')" class="mb-2" prop="ProductFmaily">
                            <el-select v-model="getRawForm.ProductFmaily" filterable style="width: 200px">
                                <el-option v-for="item in typeRawList" :key="item.ProductFamilyId"
                                    :label="item.ProductFamilyName" :value="item.ProductFamilyName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.materialID')" class="mb-2" prop="ContainerName">
                            <el-input v-model.trim="getRawForm.ContainerName" style="width: 200px" placeholder=""
                                @keyup.enter.native="getRawData" />
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.isCar')" class="mb-2" prop="entryTime">
                            <el-select v-model="getRawForm.IsItAnAutomotiveProduct"  placeholder="" style="width: 200px">
                                <el-option
                                    :label="$t('publicText.is')"
                                    :value="true">
                                </el-option>
                                <el-option
                                    :label="$t('publicText.no')"
                                    :value="false">
                                </el-option>
                            </el-select>
                            
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.entryTime')" class="mb-2" prop="entryTime">
                            <el-date-picker :shortcuts="shortcuts" v-model="searchRawDate" value-format="YYYY-MM-DD"
                                type="daterange" range-separator="-" size="small" style="width: 200px"
                                :clearable="false" />
                        </el-form-item>

                        <el-form-item class="mb-2">
                            <el-button type="primary" @click="getRawData">{{
                                $t("publicText.query")
                                }}</el-button>
                            <el-button type="" @click="handleRawReset">{{
                                $t("publicText.reset")
                                }}</el-button>
                            <el-button type="success" size="small" :disabled="tableData.length == 0"
                                @click="exportList">{{ $t("publicText.export") }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="text-xl mb-1 font-bold">
                        {{ $t("inventInquiry.totalQtyInvent") + "：" }}
                        <span class="">6666</span>
                    </div>
                    <el-table :data="tableData.slice(
                        (pageObj.currentPage - 1) * pageObj.pageSize,
                        pageObj.currentPage * pageObj.pageSize
                    )
                        " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" :tooltip-effect="'light'"
                        border fit :row-class-name="tableRowClassName">
                        <!-- <el-table-column type="selection" width="55" align="center" /> -->
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj.pageSize * (pageObj.currentPage - 1) +
                                    1
                                    }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ProductName" :label="$t('inventInquiry.materialName')" />
                        <el-table-column prop="CustomerLotNumber" :label="$t('inventInquiry.incomingBatch')" />
                        <el-table-column prop="MaterialSource" :label="$t('inventInquiry.materialSource')" />
                        <el-table-column prop="ProductFamilyName" :label="$t('inventInquiry.materialType')" />
                        <el-table-column prop="ContainerName" :label="$t('inventInquiry.materialID')" />
                        <el-table-column prop="TotalInventoryByProductBase" :label="$t('inventInquiry.CurrentInventory')" />
                        <el-table-column prop="TotalOutboundQty" :label="$t('inventInquiry.TotalOutboundQty')" />
                        <el-table-column prop="OriginalStartDate" :label="$t('inventInquiry.entryTime')" />
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
                </el-tab-pane>
                <el-tab-pane :label="$t('inventInquiry.finishGoodsInvent')" name="finish">
                    <el-form ref="formFinishRef" :model="getFinishForm" :inline="true" size="small"
                        @submit.native.prevent label-width="auto">
                        <el-form-item :label="$t('inventInquiry.order')" class="mb-2" prop="MfgOrderName">
                            <el-input v-model.trim="getFinishForm.MfgOrderName" style="width: 200px" placeholder=""
                                @keyup.enter.native="getFinishData" />
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.productModel')" class="mb-2" prop="ProductName">
                            <el-input v-model.trim="getFinishForm.ProductName" style="width: 200px" placeholder=""
                                @keyup.enter.native="getFinishData" />
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.boxNumber')" class="mb-2" prop="BoxOuterContainerName">
                            <el-input v-model.trim="getFinishForm.BoxOuterContainerName" style="width: 200px"
                                placeholder="" @keyup.enter.native="getFinishData" />
                        </el-form-item>
                        <el-form-item :label="$t('inventInquiry.boxOrderNum')" class="mb-2" prop="PackingContainerName">
                            <el-input v-model.trim="getFinishForm.PackingContainerName" style="width: 200px"
                                placeholder="" @keyup.enter.native="getFinishData" />
                        </el-form-item>

                        <el-form-item :label="$t('inventInquiry.entryTime')" class="mb-2" prop="entryTime">
                            <el-date-picker :shortcuts="shortcuts" v-model="searchFinishDate" value-format="YYYY-MM-DD"
                                type="daterange" range-separator="-" size="small" style="width: 200px"
                                :clearable="false" />
                        </el-form-item>
                        <el-form-item class="mb-2">
                            <el-button type="primary" @click="getFinishData">{{
                                $t("publicText.query")
                                }}</el-button>
                            <el-button type="" @click="handleFinishReset">{{
                                $t("publicText.reset")
                                }}</el-button>
                            <el-button type="success" size="small" :disabled="tableData.length == 0"
                                @click="exportFinishList">{{
                                $t("publicText.export") }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="text-xl mb-1 font-bold flex gap-11">
                        <div>
                            {{ $t("inventInquiry.productTotal") + "：" }}
                            <span class="">6666</span>
                        </div>
                        <div>
                            {{ $t("inventInquiry.totalBoxNum") + "：" }}
                            <span class="">123456</span>
                        </div>
                    </div>
                    <el-table :data="tableData2.slice(
                        (pageObj2.currentPage - 1) * pageObj2.pageSize,
                        pageObj2.currentPage * pageObj2.pageSize
                    )
                        " size="small" :style="{ width: '100%' }" ref="finishRef" :height="tableHeight" :tooltip-effect="'light'"
                        border fit>
                        <!-- <el-table-column type="selection" width="55" align="center" /> -->
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj2.pageSize * (pageObj2.currentPage - 1) +
                                    1
                                    }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ProductName" :label="$t('inventInquiry.productName')" />
                        <el-table-column prop="MfgOrderName" :label="$t('inventInquiry.order')" />
                        <el-table-column prop="CustomerPO" :label="$t('inventInquiry.customerPO')" />
                        <el-table-column prop="CustomerProduct" :label="$t('inventInquiry.customerPN')" />
                        <el-table-column prop="ProductionQty" :label="$t('inventInquiry.productQty')" width="100" />
                        <el-table-column prop="MfgOrderQty" :label="$t('inventInquiry.orderQty')" width="100" />

                        <el-table-column prop="BoxOuterContainerName" :label="$t('inventInquiry.boxNumber')" />
                        <el-table-column prop="PackingContainerName" :label="$t('inventInquiry.boxOrderNum')" />
                        <el-table-column prop="BoxOuterQty" :label="$t('inventInquiry.boxNum')" width="100" />
                        <el-table-column prop="MoveStdDate" :label="$t('inventInquiry.entryTime')" width="150" />
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
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    getVendorQuery,
    getProductFamilyQuery,
    GetRawMaterialInventoryQuery,
    GetFinishedProductInventoryQuery,
} from "@/api/warehouseManage/inventInquiry";
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
import { ElNotification, ElMessageBox } from "element-plus";
import { shortcuts, disabledDate } from "@/utils/dataMenu";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const formRawRef = ref();
const formFinishRef = ref();
const rawRef = ref();
const finishRef = ref();
const tableHeight = ref(0);
const tableData = ref([]);
const tableHeight2 = ref(0);
const tableData2 = ref([]);
const activeName = ref("raw");

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const pageObj2 = reactive({
    currentPage: 1,
    pageSize: 50,
});
const getRawForm = ref({
    ProductName: "",
    CustomerLotNumber: "",
    MaterialSource: "",
    ProductFmaily: "",
    ContainerName: "",
    IsItAnAutomotiveProduct: '',
    StartDate: "",
    EndDate: "",
});
const sourceList = ref<any[]>([]);
const typeRawList = ref<any[]>([]);
const searchRawDate = ref<any[]>([]);
const getFinishForm = ref({
    MfgOrderName: "",
    ProductName: "",
    BoxOuterContainerName: "",
    PackingContainerName: "",
    StartDate: "",
    EndDate: "",
});
const searchFinishDate = ref<any[]>([]);

watch(
    () => searchRawDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getRawForm.value.StartDate = "";
            getRawForm.value.EndDate = "";
            return;
        }
        if (newVal !== oldVal) {
            getRawForm.value.StartDate = newVal[0];
            getRawForm.value.EndDate = newVal[1];
        }
    }
);

watch(
    () => searchFinishDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getFinishForm.value.StartDate = "";
            getFinishForm.value.EndDate = "";
            return;
        }
        if (newVal !== oldVal) {
            getFinishForm.value.StartDate = newVal[0];
            getFinishForm.value.EndDate = newVal[1];
        }
    }
);
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getRawData();
    getMaterialSource();
    getMaterialType();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const tabChange = (val: any) => {
    // console.log(val);
    if (val == "raw") {
        getRawData();
    } else {
        getFinishData();
    }
};
const getMaterialSource = () => {
    getVendorQuery({}).then((res: any) => {
        sourceList.value = res.content;
    });
};
const getMaterialType = () => {
    getProductFamilyQuery({}).then((res: any) => {
        typeRawList.value = res.content;
    });
};
const getRawData = () => {
    GetRawMaterialInventoryQuery(getRawForm.value).then((res: any) => {
        tableData.value = res.content.map((item: any) => {
            item.OriginalStartDate = dayjs(item.OriginalStartDate).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            return item;
        });
    });
};
const tableRowClassName = (val: any) => {
    let row = val.row;
    if (row.TotalOutboundQty > row.TotalInventoryByProductBase) {
        return "danger-row-invent";
    } else {
        return "success-row-invent";
    }
};
const handleRawReset = () => {
    getRawForm.value = {
        ProductName: "",
        CustomerLotNumber: "",
        MaterialSource: "",
        ProductFmaily: "",
        ContainerName: "",
        IsItAnAutomotiveProduct: '',
        StartDate: "",
        EndDate: "",
    };
    searchRawDate.value = [];
};
const exportList = () => {
    exportTableToExcel({
        tableRef: rawRef.value,
        fetchAllData: fetchRowAllData,
        fileName: `${t("inventInquiry.rawMaterialInvent")}_${dayjs().format(
            "YYYYMMDDHHmmss"
        )}`,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
    });
};
const fetchRowAllData = async () => {
    let data = await GetRawMaterialInventoryQuery(getRawForm.value).then(
        (res: any) => {
            return res.content.map((item: any) => {
                item.OriginalStartDate = dayjs(item.OriginalStartDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                return item;
            });
        }
    );
    return data;
};
const getFinishData = () => {
    GetFinishedProductInventoryQuery(getFinishForm.value).then((res: any) => {
        tableData2.value = res.content.map((item: any) => {
            item.MoveStdDate = dayjs(item.MoveStdDate).format("YYYY-MM-DD HH:mm:ss");
            return item;
        });
    });
};
const handleFinishReset = () => {
    getFinishForm.value = {
        MfgOrderName: "",
        ProductName: "",
        BoxOuterContainerName: "",
        PackingContainerName: "",
        StartDate: "",
        EndDate: "",
    };
    searchFinishDate.value = [];
};
const exportFinishList = () => {
    exportTableToExcel({
        tableRef: finishRef.value,
        fetchAllData: fetchFinishAllData,
        fileName: `${t("inventInquiry.finishGoodsInvent")}_${dayjs().format(
            "YYYYMMDDHHmmss"
        )}`,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
    });
};
const fetchFinishAllData = async () => {
    let data = await GetFinishedProductInventoryQuery(getFinishForm.value).then(
        (res: any) => {
            return res.content.map((item: any) => {
                item.MoveStdDate = dayjs(item.MoveStdDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                return item;
            });
        }
    );
    return data;
};
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 300;
        tableHeight2.value = window.innerHeight - 300;
    });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style>
.el-table .danger-row-invent {
    --el-table-tr-bg-color: var(--el-color-danger-light-5);
}

.el-table .success-row-invent {
    --el-table-tr-bg-color: var(--el-color-success-light-5);
}
</style>
