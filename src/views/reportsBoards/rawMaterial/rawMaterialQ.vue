<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" :inline="true" :size="'small'" @submit.native.prevent>
                    <el-form-item :label="'时间'" class="mb-2">
                        <el-date-picker v-model="getForm.Year" type="year" value-format="YYYY" placeholder="Pick a year"
                            style="width: 190px" />
                    </el-form-item>

                    <el-form-item :label="'原材料名称'" class="mb-2">
                        <el-input style="width: 190px" v-model="getForm.Material" placeholder="" clearable
                            @keyup.enter.native="getData"></el-input>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="getData">查询</el-button>
                        <el-button :type="'info'" @click="resetGetForm">重置</el-button>
                        <el-button type="success" :disabled="tableData.length == 0" size="small" @click="exportTable">
                            导出Excel
                        </el-button>
                        <!-- <el-button type="warning" size="small" @click="openAdd">添加</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize,
            )
                " size="small" ref="rawMaterRef" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border>
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ProductName" fixed :label="'原材料名称'" :min-width="getColumnWidth('ProductName')" />
                <el-table-column prop="January" :label="'一月'" width="80" />
                <el-table-column prop="February" :label="'二月'" width="80" />
                <el-table-column prop="March" :label="'三月'" width="80" />
                <el-table-column prop="April" :label="'四月'" width="80" />
                <el-table-column prop="May" :label="'五月'" width="80" />
                <el-table-column prop="June" :label="'六月'" width="80" />
                <el-table-column prop="July" :label="'七月'" width="80" />
                <el-table-column prop="August" :label="'八月'" width="80" />
                <el-table-column prop="September" :label="'九月'" width="80" />
                <el-table-column prop="October" :label="'十月'" width="80" />
                <el-table-column prop="November" :label="'十一月'" width="80" />
                <el-table-column prop="December" :label="'十二月'" width="80" />
                <el-table-column prop="Total" :label="'合计'" width="80" />
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
        </el-card>

    </div>
</template>

<script setup lang="ts">
// import {
//   GetCustomerQuery
// } from "@/api/incomingManage/aqlrules";
import {
    GetMaterialQuantityIssuedQuery
} from "@/api/reportsBoards/index";
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
    calculateColumnsWidth,
    clearTextWidthCache,
} from "@/utils/tableminWidth";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const getForm = ref({
    Year: "",
    Material: ""
});
const tableHeight = ref(0);
const tableData = ref([]);
const rawMaterRef = ref()
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

onBeforeMount(() => {
    getScreenHeight();
    getForm.value.Year= dayjs().format("YYYY")
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache();
});

const resetGetForm = () => {
    pageObj.currentPage = 1
    getForm.value = {
        Year: dayjs().format("YYYY"),
        Material: ""
    };

    getData();
};
const getData = () => {
    pageObj.currentPage = 1
    GetMaterialQuantityIssuedQuery(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};


const exportTable = () => {
    exportTableToExcel({
        tableRef: rawMaterRef.value,
        fetchAllData: fetchFinishAllData,
        fileName: `${"原材料领用张数"}_${dayjs().format("YYYYMMDDHHmmss")}`,
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
    let data = await GetMaterialQuantityIssuedQuery(getForm.value).then(
        (res: any) => {
            return res.content
        },
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
        tableHeight.value = window.innerHeight - 220;
    });
};
// 使用计算属性缓存列宽计算结果
const columnWidths = computed(() => {

    const columns = [
        { label: "原材料名称", prop: "ProductName" },

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
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>

<style lang="scss" scoped></style>
