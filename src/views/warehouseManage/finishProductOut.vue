<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" @submit.native.prevent :size="'small'">
                <el-form-item :label="$t('finishProduct.boxCode')" class="mb-2" prop="OuterBoxContainerName">
                    <el-input v-model.trim="getForm.OuterBoxContainerName" clearable style="width: 300px" placeholder=""
                        @keyup.enter.native="getData" />
                </el-form-item>
                <el-form-item :label="$t('finishProduct.boxOrderNum')" class="mb-2" prop="PackingBoxContainerName">
                    <el-input v-model.trim="getForm.PackingBoxContainerName" clearable style="width: 300px"
                        placeholder="" @keyup.enter.native="getData" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="getData">{{
                        $t("publicText.query")
                        }}</el-button>
                    <el-button type="" @click="handleReset">{{
                        $t("publicText.reset")
                        }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }"  :height="tableHeight" border stripe>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column prop="OutBoxContainerName" :label="$t('finishProduct.boxCode')"
                    :min-width="getColumnWidth('OutBoxContainerName')" />
                <el-table-column prop="PackingContainerName" :label="$t('finishProduct.boxOrderNum')"
                    :min-width="getColumnWidth('PackingContainerName')" />
                <el-table-column prop="MfgOrderName" :label="$t('finishProduct.order')"
                    :min-width="getColumnWidth('MfgOrderName')" />
                <el-table-column prop="OutBoxProductDescription" :label="$t('finishProduct.productMsg')"
                    :min-width="getColumnWidth('OutBoxProductDescription')" />
                <el-table-column prop="CustomerName" :label="$t('oqcInspection.customerName')"
                    :min-width="getColumnWidth('CustomerName')" />
                <el-table-column prop="ES_CustomerPO" :label="$t('oqcInspection.customerPO')"
                    :min-width="getColumnWidth('ES_CustomerPO')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('oqcInspection.customerPN')"
                    :min-width="getColumnWidth('ES_CustomerProduct')" />
                <el-table-column prop="OutBoxQty" :label="$t('finishProduct.number')" width="100"
                    :min-width="getColumnWidth('OutBoxQty')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2 mb-1 flex justify-end">
                <el-button type="" :disabled="tableData.length == 0" @click="handleClean">{{ $t("publicText.reset")
                    }}</el-button>
                <el-button type="primary" :disabled="tableData.length == 0" @click="handleSubmit">{{
                    $t("publicText.submit")
                    +'出库' }}</el-button>
            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import {
    GetFinishedQuery,
    SubmitForFinished,
} from "@/api/warehouseManage/finishProduct";
import { getWarehouseStorageLocationQuery } from "@/api/warehouseManage/inventInquiry";
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
import {
    calculateColumnsWidth,
    clearTextWidthCache,
} from "@/utils/tableminWidth";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
const formRef = ref();
const getForm = ref({
    OuterBoxContainerName: "",
    PackingBoxContainerName: "",
});
const tableHeight = ref(0);
const tableData = ref([]);
const locationDsc = ref("");
const posRawList = ref<any[]>([]);
const dialogVisible = ref(false);
const selectionList = ref<any[]>([]);
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // getMaterialPos();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache();
});
const getData = () => {
    if (
        getForm.value.OuterBoxContainerName != "" ||
        getForm.value.PackingBoxContainerName != ""
    ) {
        GetFinishedQuery(getForm.value).then((res: any) => {
            if (res.success) {
                tableData.value = res.content == null ? [] : res.content;
            } else {
                tableData.value = [];
                ElNotification({
                    title: t("message.tipTitle"),
                    message: res.msg,
                    type: "error",
                });
            }
        });
    } else {
        ElMessage({
            title: t("message.tipTitle"),
            message: "请至少输入一个条件",
            type: "error",
        });
        return;
    }
};

const handleReset = () => {
    formRef.value.resetFields();
    tableData.value = [];
};
const handleClean = () => {
    tableData.value = [];
};
const handleClose = () => {
    dialogVisible.value = false;
};
const handleSelectionChange = (val: any) => {
    selectionList.value = val;
};
const handleSubmit = () => {
    ElMessageBox.confirm('确定提交出库信息？', t("message.tipTitle"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            let data = tableData.value.map((item: any) => {
                return {
                    OuterBoxContainerName: item.OutBoxContainerName,
                    PackingBoxContainerName: item.PackingContainerName,
                    ShippedBy: userStore.getUserInfo,
                };
            });
            SubmitForFinished(data).then((res: any) => {
                if (res.success) {
                    ElNotification({
                        title: t("message.tipTitle"),
                        message: res.msg,
                        type: "success",
                    });
                    tableData.value = [];
                    // getData();
                } else {
                    ElNotification({
                        title: t("message.tipTitle"),
                        message: res.msg,
                        type: "error",
                    });
                }
            });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: t("message.cancelSubmit"),
            });
        });

};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 200;
    });
};
const columnWidths = computed(() => {
    const columns = [
        { label: "客户名称", prop: "CustomerName" },
        { label: "客户PO", prop: "ES_CustomerPO" },
        { label: "客户PN", prop: "ES_CustomerProduct" },
        { label: "数量", prop: "OutBoxQty" },
        { label: "箱码", prop: "OutBoxContainerName" },
        { label: "包装箱码", prop: "PackingContainerName" },
        { label: "订单", prop: "MfgOrderName" },
        { label: "产品信息", prop: "OutBoxProductDescription" },
        // 添加其他需要自适应宽度的列
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || "auto";
};
</script>

<style lang="scss" scoped></style>
