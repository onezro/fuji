<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
            <el-form ref="getFormRef" :model="getForm" :inline="true" >
                <el-form-item label="时间" prop="timePeriod" class="mb-2">
                    <el-date-picker v-model="getForm.timePeriod" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" style="width: 240px" :clearable="false" />
                </el-form-item>
                <el-form-item label="类型" prop="type" class="mb-2">
                    <el-input v-model="getForm.type" />
                </el-form-item>
                <!-- <el-form-item label="原因" prop="cause" class="mb-2">
                    <el-input v-model="getForm.cause" />
                </el-form-item> -->
                <el-form-item class="mb-2">
                    <el-button type="primary">查询</el-button>
                </el-form-item>
            </el-form>
            <tableTem size="small" :showIndex="true" :tableData="tableData" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange" >
      </tableTem>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref,nextTick,onBeforeMount,onMounted,onBeforeUnmount } from "vue";
import tableTem from "@/components/tableTem/index.vue";
const getForm = ref({
    timePeriod: "",
    cause: "",
    type: "",
});
const tableData=ref([])
const columnData=ref([
{
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "不良编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "不良原因",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "时间",
    width: "",
    min: true,
    align: "1",
  },
 
])
const tableHeight=ref(0)
const pageObj=ref({
    pageSize: 50,
  currentPage: 1,
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


const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};
</script>

<style scoped></style>
