<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" size="" @submit.native.prevent>
                <el-form-item :label="$t('finishProduct.boxCode')" class="mb-2" prop="OuterBoxContainerName">
                    <el-input v-model.trim="getForm.OuterBoxContainerName" style="width: 300px" placeholder=""
                        @keyup.enter.native="getData" />
                </el-form-item>
                <el-form-item :label="$t('finishProduct.boxOrderNum')" class="mb-2" prop="PackingBoxContainerName">
                    <el-input v-model.trim="getForm.PackingBoxContainerName" style="width: 300px" placeholder=""
                        @keyup.enter.native="getData" />
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
                <el-table-column prop="CustomerName" :label="$t('finishProduct.boxCode')" />
                <el-table-column prop="ES_CustomerProduct" :label="$t('finishProduct.boxOrderNum')" />
                <el-table-column prop="ES_CustomerPO" :label="$t('finishProduct.order')" />
                <el-table-column prop="ProductName" :label="$t('finishProduct.productMsg')" />
                <el-table-column prop="ES_LotNumber" :label="$t('finishProduct.number')" />

                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2 mb-1 flex justify-end">
                <el-button type="" :disabled="tableData.length==0" @click="handleClean">{{
                    $t("publicText.reset")
                }}</el-button>
                <el-button type="primary" :disabled="tableData.length==0" @click="handleSubmit">{{
                    $t("publicText.submit") + $t("publicText.inStorage")
                }}</el-button>
            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import {
    GetCompletedInventoryQuery,
    SubmitForCompletionAndWarehousing
} from "@/api/warehouseManage/finishProduct";
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
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const formRef = ref()
const getForm = ref({
    OuterBoxContainerName: '',
    PackingBoxContainerName: ''
})
const tableHeight = ref(0)
const tableData = ref([])

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const getData = () => {
    GetCompletedInventoryQuery(getForm.value).then((res: any) => {
        if (res.success) {
            tableData.value = res.content
        } else {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: 'error',
            });
        }
    })
}
const handleReset = () => {
    formRef.value.resetFields()
}
const handleClean = () => {
    tableData.value = []
}
const handleSubmit = () => {
    let data = tableData.value.map((item: any) => {
        return {
            OuterBoxContainerName: item.OuterBoxContainerName,
            PackingBoxContainerName: item.PackingBoxContainerName
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
</script>

<style lang="scss" scoped></style>