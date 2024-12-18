<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div ref="headerRef">
                <el-form ref="formRef" :inline="true" size="small">
                    <el-form-item label="时间" class="mb-2">
                        <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD"
                            type="daterange" range-separator="-" size="small" style="width: 200px" clearable />
                    </el-form-item>
                    <!-- <el-form-item label="计划单号" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.order" placeholder="" clearable
                            @change="getData"></el-input>
                    </el-form-item> -->
                      <el-form-item label="物料编码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.order" placeholder="" clearable
                            @change="getData"></el-input>
                    </el-form-item>
                    <el-form-item label="物料批次码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.pcb" placeholder="" clearable
                            @change="getData"></el-input>
                    </el-form-item>
                    <el-form-item label="物料唯一码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.pcb" placeholder="" clearable
                            @change="getData"></el-input>
                    </el-form-item>
                  
                    <el-form-item  class="mb-2">
                        <el-button type="primary" @click="getData()">查询</el-button>
                        <el-button type="warning" >导出</el-button>
                    </el-form-item>
                    <!-- <el-form-item  class="mb-2">
                       
                    </el-form-item> -->
                </el-form>
            </div>
            <table-tem :show-index="true" size="small" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange" @rowClick="rowClick">
            </table-tem>
            <table-temp :show-index="true" size="small" :tableData="detailData" :tableHeight="detailHeight"
                :columnData="detailColumn">
            </table-temp>
        </el-card>
    </div>
</template>

<script setup lang="ts">
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
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
const getForm = ref({
    order: "",
    PlanStartTime: "",
    PlanEndTime: "",
   
    pcb:""
});
const searchDate = ref<any[]>([]);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const columnData = reactive([
{
        text: true,
        prop: "Qty",
        label: "物料条码",
        width: "",
        min: true,
        align: "1",
    },
{
        text: true,
        prop: "Qty",
        label: "物料编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "物料唯一码",
        width: "",
        min: true,
        align: "1",
    },
]);
const detailData = ref([])
const detailColumn = reactive([

    {
        text: true,
        prop: "ERPOrder",
        label: "生产时间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ERPOrder",
        label: "车间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "产线",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "工位",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "计划单号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "机型",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "产品编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "工单状态",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "MES条码",
        width: "",
        min: true,
        align: "1",
    },
])


watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.PlanStartTime = "";
            getForm.value.PlanEndTime = "";
            getData();
            return;
        }
        if (newVal !== oldVal) {
            getForm.value.PlanStartTime = newVal[0];
            getForm.value.PlanEndTime = newVal[1];
            getData();
        }
    }
);
onBeforeMount(() => {
    getScreenHeight();
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
});

const getData = () => { };
const rowClick = () => { };
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value =
            (window.innerHeight - 195)*0.6
        detailHeight.value =
            (window.innerHeight - 195) * 0.4;
    });
};
</script>

<style scoped></style>
