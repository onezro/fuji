<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" class="inbound" :inline="true" size="" @submit.native.prevent label-width="auto">
                <el-form-item :label="$t('listGeneration.pallet')" class="mb-2">
                    <el-select v-model="getForm.CardAreaName" filterable @change="getData" style="width: 200px">
                        <el-option v-for="item in palletList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('listGeneration.boxCode')" class="mb-2">
                    <el-input v-model.trim="getForm.OuterBoxContainerName" ref="inputPackRef" style="width: 300px"
                        placeholder="" @keyup.enter.native="getIsBox" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="" @click="handleReset">{{
                        $t("publicText.reset")
                        }}</el-button>
                    <el-button type="danger" :disabled="selectList.length == 0" @click="handleDelete">{{
                        $t("publicText.delete") }}</el-button>
                    <el-button type="warning" :disabled="selectList.length == 0" @click="handleGenerate">{{
                        $t("listGeneration.GeneratePackList") }}</el-button>
                    <el-button type="primary" :disabled="selectList.length == 0" @click="handlePreview">{{
                        $t("publicText.preview") }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " ref="listGenerRef" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'light'" border fit @selection-change="handleSelectionChange" row-key="ContainerName">
                <el-table-column type="selection" width="55" align="center" reserve-selection />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ContainerName" :label="$t('listGeneration.boxCode')" width="150" />
                <el-table-column prop="ES_HsCodeName" :label="$t('listGeneration.type')" />
                <el-table-column prop="OriginalStartDate" :label="$t('listGeneration.packCompleTime')" width="150" />
                <el-table-column prop="CustomerName" :label="$t('listGeneration.customer')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('listGeneration.productName')" width="150" />
                <el-table-column prop="ES_CustomerPO" :label="$t('listGeneration.productPO')" width="150" />
                <el-table-column prop="ProductName" :label="$t('listGeneration.productPN')" />
                <el-table-column prop="ES_LotNumber" :label="$t('listGeneration.lotNo')" />
                <el-table-column prop="Qty" :label="$t('listGeneration.productionQty')" />
                <el-table-column prop="Qty2" :label="$t('listGeneration.orderNum')" />
                <el-table-column prop="ES_IsLastContainer" :label="$t('listGeneration.isTrunk')">
                    <template #default="scope">
                        <span>{{
                            scope.row.ES_IsLastContainer
                                ? $t("publicText.is")
                                : $t("publicText.no")
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="NetWeightPerFullContainer" :label="$t('listGeneration.boxNetWeight')" />
                <el-table-column prop="GrossWeightPerFullContainer" :label="$t('listGeneration.boxGrossWeight')" />
                <el-table-column prop="NetWeightOfTheLastCarton" :label="$t('listGeneration.trunkNetWeightw')" />
                <el-table-column prop="GrossWeightOfTheLastCarton" :label="$t('listGeneration.trunkGrossWeight')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mb-2 mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
            <el-table :data="tableData2" size="small" :style="{ width: '100%' }" :height="tableHeight2" border
                row-key="CustomerName">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column prop="CustomerName" :label="$t('listGeneration.customer')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('listGeneration.productName')" />
                <el-table-column prop="ES_CustomerPO" :label="$t('listGeneration.productPO')" />
                <el-table-column prop="ProductName" :label="$t('listGeneration.productPN')" />
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
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    GetCardAreaQuery,
    GetPackingCardAreaSerachDetail,
    PackingAdd,
    PackingRemoveOuterBoxSubmit
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
import { ElNotification, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const listGenerRef = ref();
const tableHeight = ref(0);
const getForm = ref({
    CardAreaName: "",
    OuterBoxContainerName: "",
    outerBoxLists: [],
});
const palletList = ref<any[]>();
const tableData = ref<any[]>([]);
const tableHeight2 = ref(0);
const tableData2 = ref<any[]>([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const selectList = ref<any[]>([]);
watch(
    () => getForm.value.CardAreaName,
    (newVal, oldVal) => {
        if (newVal != oldVal) {
            listGenerRef.value.clearSelection();
            tableData2.value = [];
        }
    }
);
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getPallet();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const getData = () => {
    GetPackingCardAreaSerachDetail(getForm.value).then((res: any) => {
        if (res.success) {
            tableData.value = res.content.map((item: any) => {
                return {
                    ...item,
                    OriginalStartDate: item.OriginalStartDate
                        ? dayjs(item.OriginalStartDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )
                        : "",
                };
            });
        } else {
            tableData.value = [];
        }
    });
};
const getPallet = async () => {
    GetCardAreaQuery({}).then((res: any) => {
        if (res.success) {
            palletList.value = res.content.map((item: any) => {
                return {
                    value: item.ES_CardAreaName,
                    label: item.ES_CardAreaName,
                };
            });
        }
    });
};
const getIsBox = () => {
    GetPackingCardAreaSerachDetail({
        CardAreaName: "",
        OuterBoxContainerName: getForm.value.OuterBoxContainerName,
    }).then((res: any) => {
        if (res.success) {
            if (tableData.value.length >= 6) {
                ElMessageBox.confirm(
                    t("listGeneration.PackFull"),
                    t("publicText.confirm") + t("publicText.operation"),
                    {
                        confirmButtonText: t("publicText.confirm"),
                        cancelButtonText: t("publicText.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        tableData.value.unshift(...res.content);
                        ElNotification({
                            title: t("publicText.tip"),
                            message: getForm.value.OuterBoxContainerName + t("publicText.add") + t("publicText.success"),
                            type: "success",
                        });
                        getForm.value.OuterBoxContainerName = "";
                    })
                    .catch(() => {
                        // on cancel
                        ElNotification({
                            title: t("publicText.tip"),
                            message: t("publicText.cancel") + t('publicText.operation'),
                            type: "info",
                        });
                    });
            } else {
                tableData.value.unshift(...res.content);
                ElNotification({
                    title: t("publicText.tip"),
                    message: getForm.value.OuterBoxContainerName + t("publicText.add") + t("publicText.success"),
                    type: "success",
                });
                getForm.value.OuterBoxContainerName = "";
            }
        } else {
            ElNotification({
                title: t("publicText.tip"),
                message: res.msg,
                type: "error",
            });
        }

    });
};
const cellClick = (val: any) => { };
const handleReset = () => {
    getForm.value = {
        CardAreaName: "",
        OuterBoxContainerName: "",
        outerBoxLists: [],
    };
    listGenerRef.value.clearSelection();
    // tableData.value = [];
    // selectList.value = [];
    pageObj.currentPage = 1;

};

const handleDelete = () => {
    ElMessageBox.confirm(t('publicText.confirm') + t('publicText.delete'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
         let data: PackForm = {
        CardAreaName: getForm.value.CardAreaName,

        packingOuterBoxContainers: [],
    };
    data.packingOuterBoxContainers = selectList.value.map((item: any) => {
        return {
            OuterBoxContainerName: item.ContainerName,
        }
    });
        PackingRemoveOuterBoxSubmit(data).then((res: any) => {
                // console.log(res);

                if (res.success) {
                    ElNotification({
                        title: t("publicText.tip"),
                        message: res.msg,
                        type: "success",
                    });
                    // handleReset();
                    listGenerRef.value.clearSelection();
                    getData();
                } else {
                    ElNotification({
                        title: t("publicText.tip"),
                        message: res.msg,
                        type: "error",
                    });
                }
            });
        // selectList.value.forEach((item: any) => {
        //     let index = tableData.value.findIndex(
        //         (i: any) => i.ContainerName == item.ContainerName
        //     );
        //     tableData.value.splice(index, 1);
        // });
        // selectList.value = [];
        // ElNotification({
        //     title: t("publicText.tip"),
        //     message: t("publicText.operationSuccess"),
        //     type: "success",
        // });
    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('publicText.tip'),
            message: t('publicText.cancel') + t('publicText.operation'),
            type: "info",
        });
    });
};
interface PackForm {
    CardAreaName: string;
    packingOuterBoxContainers: Array<any>;
}
const handleGenerate = () => {
    let data: PackForm = {
        CardAreaName: getForm.value.CardAreaName,

        packingOuterBoxContainers: [],
    };
    data.packingOuterBoxContainers = selectList.value.map((item: any) => {
        return {
            OuterBoxContainerName: item.ContainerName,
        }
    });
    let msgText = ''
    if (data.packingOuterBoxContainers.length > 48) {
        msgText = t('listGeneration.msgExceed')
    } else if (data.packingOuterBoxContainers.length == 48) {
        msgText = t('listGeneration.msgEquals')
    } else {
        msgText = t('listGeneration.msgLessThan')
    }
    ElMessageBox.confirm(
        msgText,
        t("publicText.confirm") + t("publicText.operation"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            PackingAdd(data).then((res: any) => {
                // console.log(res);

                if (res.success) {
                    ElNotification({
                        title: t("publicText.tip"),
                        message: res.msg,
                        type: "success",
                    });
                    // handleReset();
                    listGenerRef.value.clearSelection();
                    getData();
                } else {
                    ElNotification({
                        title: t("publicText.tip"),
                        message: res.msg,
                        type: "error",
                    });
                }
            });
        })
        .catch(() => {
            // on cancel
            ElNotification({
                title: t("publicText.tipTitle"),
                message: t("publicText.cancel"),
                type: "info",
            });
        });
    // console.log(data);

};
interface BindForm {
    CardAreaName: string;
    OuterBoxContainerName: string;
    outerBoxLists: Array<any>;
}
const handlePreview = () => {
    let data: BindForm = {
        CardAreaName: "",
        OuterBoxContainerName: "",
        outerBoxLists: [],
    };
    data.outerBoxLists = selectList.value.map((item: any) => {
        return {
            OuterBoxContainerName: item.ContainerName,
        }
    });


    GetPackingCardAreaSerachDetail(data).then((res: any) => {
        console.log(res.content);

        if (res.success) {
            tableData2.value = res.content;
            selectList.value.forEach((item: any) => {
                listGenerRef.value.toggleRowSelection(item, true)
            })

        }
    });
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
        tableHeight.value = (window.innerHeight - 200) * 0.6;
        tableHeight2.value = (window.innerHeight - 200) * 0.4;
    });
};
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
