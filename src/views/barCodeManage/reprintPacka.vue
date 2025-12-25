<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
            <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="tabChange">
                <el-tab-pane :label="$t('reprintPack.smallBox')" name="first">
                    <div class="flex justify-between items-center">
                        <el-form ref="formSmallRef" :model="getSmallFrom" :inline="true" size="small"
                            @submit.native.prevent label-width="auto">
                            <el-form-item :label="$t('reprintPack.scanOrderNumber')" class="mb-2">
                                <el-input v-model="getSmallFrom.MfgOrderName" clearable style="width: 200px"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('reprintPack.smallBoxNumber')" class="mb-2">
                                <el-input v-model="getSmallFrom.ContainerName" clearable
                                    style="width: 200px"></el-input>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="getSmallData">{{
                                    $t("publicText.query")
                                }}</el-button>
                                <el-button type="" @click="handleSmallReset">{{
                                    $t("publicText.reset")
                                }}</el-button>
                            </el-form-item>
                        </el-form>
                        <div>
                            <el-form :inline="true" size="small">
                                <el-form-item :label="$t('reprintPack.print')" prop="Printer" class="mb-2">
                                    <el-select v-model="PrinterName" placeholder="" filterable style="width: 200px"
                                        clearable>
                                        <el-option v-for="p in printList" :label="p.PrintQueueName"
                                            :value="p.PrintQueueName" :key="p.PrintQueueId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="mb-2">
                                    <el-button type="warning" :size="'small'"
                                        :disabled="selectionList1.length == 0 || PrinterName == ''"
                                        @click="handleSmallPrint">{{ $t("reprintPack.reprintSmallBoxNum") }}</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <el-table :data="tableData.slice(
                        (pageObj.currentPage - 1) * pageObj.pageSize,
                        pageObj.currentPage * pageObj.pageSize
                    )
                        " :height="tableHeight" border stripe style="width: 100%" size="small"
                        @selection-change="handleSelectionChange1">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj.pageSize * (pageObj.currentPage - 1) +
                                    1
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ContainerName" :label="$t('reprintPack.smallBatch')" min-width="150" />
                        <el-table-column prop="Qty" :label="$t('reprintPack.number')" min-width="150" />

                        <el-table-column prop="ProductName" :label="$t('reprintPack.product')" min-width="150" />
                        <el-table-column prop="ProductDsc" :label="$t('reprintPack.productDsc')" min-width="200" />
                        <el-table-column prop="isBindBox" :label="$t('reprintPack.isBindBox')" min-width="200" />
                        <el-table-column prop="STATUS" :label="$t('reprintPack.batchStatus')" min-width="200" />
                        <el-table-column prop="SpecName" :label="$t('reprintPack.currentProcess')"
                            min-width="200" />
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
                <el-tab-pane :label="$t('reprintPack.boxPack')" name="second">
                     <div class="flex justify-between items-center">
                        <el-form ref="formSmallRef" :model="getBoxFrom" :inline="true" size="small"
                            @submit.native.prevent label-width="auto">
                            <el-form-item :label="$t('reprintPack.scanOrderNumber')" class="mb-2">
                                <el-input v-model="getBoxFrom.MfgOrderName" clearable style="width: 200px"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('reprintPack.boxNumber')" class="mb-2">
                                <el-input v-model="getBoxFrom.ContainerName" clearable
                                    style="width: 200px"></el-input>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="getBoxData">{{
                                    $t("publicText.query")
                                }}</el-button>
                                <el-button type="" @click="handleBoxReset">{{
                                    $t("publicText.reset")
                                }}</el-button>
                            </el-form-item>
                        </el-form>
                        <div>
                            <el-form :inline="true" size="small">
                                <el-form-item :label="$t('reprintPack.print')" prop="Printer" class="mb-2">
                                    <el-select v-model="PrinterName1" placeholder="" filterable style="width: 200px"
                                        clearable>
                                        <el-option v-for="p in printList" :label="p.PrintQueueName"
                                            :value="p.PrintQueueName" :key="p.PrintQueueId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="mb-2">
                                    <el-button type="warning" :size="'small'"
                                        :disabled="selectionList2.length == 0 || PrinterName == ''"
                                        @click="handleBoxPrint">{{ $t("reprintPack.reprintBoxNum") }}</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <el-table :data="tableData2.slice(
                        (pageObj2.currentPage - 1) * pageObj2.pageSize,
                        pageObj2.currentPage * pageObj2.pageSize
                    )
                        " :height="tableHeight" border stripe style="width: 100%" size="small"
                        @selection-change="handleSelectionChange2">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj2.pageSize * (pageObj2.currentPage - 1) +
                                    1
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ContainerName" :label="$t('reprintPack.boxBatch')" min-width="150" />
                        <el-table-column prop="Qty" :label="$t('reprintPack.number')" min-width="150" />

                        <el-table-column prop="ProductName" :label="$t('reprintPack.product')" min-width="150" />
                        <el-table-column prop="ProductDsc" :label="$t('reprintPack.productDsc')" min-width="200" />
                        <el-table-column prop="isBindBox" :label="$t('reprintPack.isBindBox')" min-width="200" />
                        <el-table-column prop="STATUS" :label="$t('reprintPack.batchStatus')" min-width="200" />
                        <el-table-column prop="SpecName" :label="$t('reprintPack.currentProcess')"
                            min-width="200" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>

                    <div class="mt-2">
                        <el-pagination :size="'small'" background @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2" :pager-count="5" :current-page="pageObj.currentPage"
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
    SmallOuterBoxPrintQuery,
    getPrintQuery,
    SmallOuterBoxPrintSubmit,
} from "@/api/barCodeManage/reprintPack";

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
import { ElNotification } from "element-plus";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const activeName = ref("first");
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const pageObj2 = reactive({
    currentPage: 1,
    pageSize: 50,
});
const getSmallFrom = ref({
    MfgOrderName: "",
    ContainerName: "",
    ContainerLevelName: "SmallBox",
});
const printList = ref<any[]>([]);
const PrinterName = ref("");
const selectionList1 = ref<any[]>([]);
const getBoxFrom = ref({
    MfgOrderName: "",
    ContainerName: "",
    ContainerLevelName: "OuterBox",
});
const tableData2 = ref([]);
const PrinterName1 = ref("");
const selectionList2 = ref<any[]>([]);
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getPrintList();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const getPrintList = () => {
    getPrintQuery({}).then((res: any) => {
        printList.value = res.content;
    });
};
const getSmallData = () => {
    SmallOuterBoxPrintQuery(getSmallFrom.value).then((res: any) => {
        if(res.content==null)   tableData.value=[]
        tableData.value = res.content;
    });
};
const getBoxData = () => {
    SmallOuterBoxPrintQuery(getBoxFrom.value).then((res: any) => {
         if(res.content==null)   tableData2.value=[]
        tableData2.value = res.content;
       
    });
};
const tabChange = (tab: any, event: any) => {
    console.log(tab, event);
};
const handleSmallReset = () => {
    getSmallFrom.value = {
        MfgOrderName: "",
        ContainerName: "",
        ContainerLevelName: "SmallBox",
    };
    tableData.value = [];
};
const handleSelectionChange1 = (val: any) => {
    selectionList1.value = val;
};

const handleSmallPrint = () => {
    let dataList: any[] = [];
    selectionList1.value.forEach((item: any) => {
        dataList.push({
            PrintName: PrinterName.value,
            ContainerName: item.ContainerName,
            ContainerLevelName: "SmallBox",
            CustomerName: item.CustomerName,
        });
    });
    SmallOuterBoxPrintSubmit(dataList).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: "success",
            })
            selectionList1.value = [];
            getSmallData()
        } else {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: "error",
            })
        }
    });
};
const handleBoxReset = () => {
    getBoxFrom.value = {
        MfgOrderName: "",
        ContainerName: "",
        ContainerLevelName: "OuterBox",
    };
    tableData2.value = [];
};
const handleBoxPrint = () => {
    let dataList: any[] = [];
    selectionList2.value.forEach((item: any) => {
        dataList.push({
            PrintName: PrinterName1.value,
            ContainerName: item.ContainerName,
            ContainerLevelName: "OuterBox",
            CustomerName: item.CustomerName,
        });
    });
    SmallOuterBoxPrintSubmit(dataList).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: "success",
            })
            selectionList2.value = [];
            getBoxData()
        } else {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: "error",
            })
        }
    });
};
const handleSelectionChange2 = (val: any) => {
    selectionList2.value = val;
};

const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const handleSizeChange2 = (val: any) => {
    pageObj2.pageSize = val;
};
const handleCurrentChange2 = (val: any) => {
    pageObj2.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 240;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>
