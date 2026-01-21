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
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight" border stripe>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column prop="OutBoxContainerName" :label="$t('finishProduct.boxCode')" :min-width="getColumnWidth('OutBoxContainerName')" />
                <el-table-column prop="PackingContainerName" :label="$t('finishProduct.boxOrderNum')" :min-width="getColumnWidth('PackingContainerName')" />
                <el-table-column prop="MfgOrderName" :label="$t('finishProduct.order')" :min-width="getColumnWidth('MfgOrderName')" />
                <el-table-column prop="OutBoxProductDescription" :label="$t('finishProduct.productMsg')" :min-width="getColumnWidth('OutBoxProductDescription')" />
                <el-table-column prop="CustomerName" :label="$t('oqcInspection.customerName')" :min-width="getColumnWidth('CustomerName')" />
                <el-table-column prop="ES_CustomerPO" :label="$t('oqcInspection.customerPO')" :min-width="getColumnWidth('ES_CustomerPO')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('oqcInspection.customerPN')" :min-width="getColumnWidth('ES_CustomerProduct')" />
                <el-table-column prop="OutBoxQty" :label="$t('finishProduct.number')" width="100"  :min-width="getColumnWidth('OutBoxQty')" />
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
import {
    GetCompletedInventoryQuery,
    SubmitForCompletionAndWarehousing
} from "@/api/warehouseManage/finishProduct";
import {
    getWarehouseStorageLocationQuery
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
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { calculateColumnsWidth, clearTextWidthCache } from '@/utils/tableminWidth'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const formRef = ref()
const getForm = ref({
    OuterBoxContainerName: '',
    PackingBoxContainerName: ''
})
const tableHeight = ref(0)
const tableData = ref([])
const locationDsc = ref('')
const posRawList = ref<any[]>([]);
const dialogVisible = ref(false);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getMaterialPos()
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache()
});
const getData = () => {
    if (getForm.value.OuterBoxContainerName != '' || getForm.value.PackingBoxContainerName != '') {
        GetCompletedInventoryQuery(getForm.value).then((res: any) => {
            if (res.success) {
                tableData.value = res.content == null ? [] : res.content
            } else {
                tableData.value = []
                ElNotification({
                    title: t('message.tipTitle'),
                    message: res.msg,
                    type: 'error',
                });
            }
        })
    } else {
        ElMessage({
            title: t('message.tipTitle'),
            message: '请至少输入一个条件',
            type: 'error',
        });
        return
    }

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
            OuterBoxContainerName: item.OutBoxContainerName,
            PackingBoxContainerName: item.PackingContainerName,
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
        tableHeight.value = (window.innerHeight - 200)

    });
};
const columnWidths = computed(() => {
    const columns = [
        { label: '客户名称', prop: 'CustomerName' },
        { label: '客户PO', prop: 'ES_CustomerPO' },
        { label: '客户PN', prop: 'ES_CustomerProduct' },
        { label: '数量', prop: 'OutBoxQty' },
        { label: '箱码', prop: 'OutBoxContainerName' },
        { label: '包装箱码', prop: 'PackingContainerName' },
        { label: '订单', prop: 'MfgOrderName' },
        { label: '产品信息', prop: 'OutBoxProductDescription' },
        // 添加其他需要自适应宽度的列
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13
    });
});

// 在模板中使用
const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || 'auto';
};
</script>

<style lang="scss" scoped></style>