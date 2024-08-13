<template>
    <div class="p-[5px]">
        <div class="mb-2">
            <el-button icon="Printer" type="primary">打印</el-button>
        </div>
        <div>
            <div>
                <el-form ref="formRef" :inline="true" size="default" :model="form" label-width="auto">
                    <el-form-item label="创建时间" prop="startTime">
                        <el-date-picker v-model="form.startTime" type="daterange" range-separator="~"
                            start-placeholder="开始时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                            end-placeholder="结束时间" />
                    </el-form-item>
                    <el-form-item label="产线" prop="line">
                        <el-select v-model="form.line" placeholder="请选择" style="width: 150px;">
                            <el-option v-for="l in lineOption" :key="l.value" :label="l.label" :value="l.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工单号" prop="workOrder"><el-input style="width: 200px;" v-model="form.workOrder"
                            placeholder="请输入工单号" /></el-form-item>
                    <el-form-item label="条码" prop="barCode"><el-input style="width: 200px;" v-model="form.barCode"
                            placeholder="请输入条码" /></el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <tableTem :showIndex="true" :size="'small'" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange">
            </tableTem>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import tableTem from '@/components/tableTem/index.vue'
const form = ref({
    line: '',
    workOrder: '',
    barCode: '',
    startTime: '',
    endTime: ''
})
const lineOption = ref([
    {
        label: 'line1',
        value: 'line1'
    },
    {
        label: 'line2',
        value: 'line2'
    }
])
const tableData = ref([
    {
        quantity: '10000',
        rawMaterial: 'A240812000083',
        semiFinished: 'A240813000024',
        itemNumber: '2400617001074',
        itemName: '核心模块组件委外锐CS199MAP_MT8666MV_AB_V3.0_PCB45.8*45.8*4.3mm23106010001773A5321CS199MAF(C211MCArr)软件',
        orderWork: '24072404',
        time: '2024-08-13 07:31:46'
    }
])
const columnData = reactive([
    {
        text: true,
        prop: "quantity",
        label: "数量",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "rawMaterial",
        label: "原材料码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "semiFinished",
        label: "半成品码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "itemNumber",
        label: "物料编号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "itemName",
        label: "物料名称",
        width: "600",
        align: "1",
    },
    {
        text: true,
        prop: "orderWork",
        label: "工单号",
        width: "",
        min: true,
        align: "1",

    },
    {
        text: true,
        prop: "time",
        label: "创建时间",
        width: "",
        min: true,
        align: "1",
    }
])
const tableHeight = ref(0)
const pageObj = ref({
    pageSize: 50,
    currentPage: 1
})
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const onSubmit = () => {
    console.log(form.value)
}

const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 230;
    });
};
</script>

<style scoped></style>