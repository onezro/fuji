<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div>
                <el-form ref="formRef" size="small" :model="form" label-width="auto" :inline="true">
                    <el-form-item label="物料编码" prop="MaterialCode" class="mb-2">
                        <el-input v-model="form.MaterialCode" style="width: 160px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="flex gap-2">
                <div class="w-[350px]">
                    <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'dark'" border fit>
                        <el-table-column prop="MaterialCode" label="物料条码" width="120" />
                        <el-table-column prop="MaterialName" label="物料描述" :show-overflow-tooltip="true" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                </div>
                <div class="flex-1">
                    <el-table :data="tableData1" size="small" :height="tableHeight1" :tooltip-effect="'dark'" stripe
                        border fit>
                        <el-table-column type="index" align="center" fixed label="序号" width="50" />
                        <el-table-column prop="MaterialCode" label="工艺名称" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                    <el-pagination class="mt-1 mb-1" align="center" size="small" background
                        @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                        :page-sizes="[30, 100, 200,300,500]" layout="total,sizes, prev, pager, next"
                        :total="tableData1.length">
                    </el-pagination>
                    <div>
                        <div class="mb-1">
                            <el-button type="primary" size="small">增加工序</el-button>
                        </div>
                        <el-table :data="tableData2" size="small" :height="tableHeight1" stripe border fit>
                            <el-table-column type="index" align="center" fixed label="序号" width="50" />
                            <el-table-column prop="MaterialCode" label="工序编码" />
                            <el-table-column prop="MaterialCode" label="工序名称" />
                            <el-table-column prop="MaterialCode" label="加工顺序" />
                            <el-table-column prop="MaterialCode" label="主码类型" />
                            <el-table-column prop="MaterialCode" label="关联条码" />
                            <template #empty>
                                <div class="flex items-center justify-center h-100%">
                                    <el-empty />
                                </div>
                            </template>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
const form = ref({
    MaterialCode: "",
});
const tableData = ref([]);

const tableData1 = ref([]);
const tableData2 = ref([]);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const tableHeight2 = ref(0);
const pageObj = ref({
    pageSize: 30,
    currentPage: 1,
});
onBeforeMount(() => {
    getScreenHeight();
    // onSubmit()
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 145.5;
        tableHeight1.value = (window.innerHeight - 207) * 0.5;
        // tableHeight2.value =( window.innerHeight - 178)*0.5;
    });
};
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
</script>

<style scoped></style>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
