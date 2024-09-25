<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <el-form ref="formRef" class="form" :inline="true"  :model="form">
          <el-form-item label="工单" class="mb-2">
          <el-input v-model="form.orderName" placeholder="请输入工单" />
          </el-form-item>
          <el-form-item label="面别" class="mb-2">
            <el-select
              v-model="form.side"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in sideList"
                :key="item"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" class="mb-2">
            <el-select
              v-model="form.McId"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in McIdList"
                :key="item"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
      
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
          <!-- <el-form-item class="mb-[5px]">
            <el-button type="warning" @click="getTableData">亮灯</el-button>
          </el-form-item> -->
        </el-form>
        <table-tem size="small" :show-index="true" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
    </el-card>
  </div>
</template>

<script setup lang="ts">

import { ref,reactive,nextTick,onBeforeMount,onMounted,onBeforeUnmount } from "vue";
import tableTem from "@/components/tableTem/index.vue";
const form = ref(
  {
    orderName:'',
    side:'',
    McId:'',
    Station:''
  }
);
const orderList=ref([
  {
    value:'24081206'
  }
])
const McIdList=ref([
  {
    value:'101',
    label:'印刷机'
  }
])
const StationList=ref([
{
    value:'101',
    label:'印刷机'
  }
])
const sideList=ref([
  {
    value:'A',
    label:'A面'
  },
  {
    value:'B',
    label:'B面'
  }
])
const tableData = ref([]);
const pageObj = ref({
    pageSize: 50,
    currentPage: 1,
});
const tableHeight=ref(0)
const editSubmit=()=>{

}
const columnData = reactive([
{
    text: true,
    prop: "MfgOrderName",
    label: "工单",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PlannedStartDate",
    label: "计划开始时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PlannedCompletionDate",
    label: "计划完成时间",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "MfgLineDesc",
    label: "产线",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_ProductModel",
    label: "机型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductDesc",
    label: "产品描述",
    width: "250",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UOMName",
    label: "单位",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "OrderStatusDesc",
    label: "状态",
    width: "",
    min: true,
    align: "center",
  },
    {
    isOperation: true,
    label: "操作",
    width: "80",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "亮灯",
        icon: "Sunrise",
        buttonClick: editSubmit,
      },
    ],
  },
]);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});



const getTableData=()=>{

}
const getData=()=>{
  
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
    tableHeight.value = window.innerHeight - 195;
  });
};
</script>

<style scoped lang="scss"></style>
