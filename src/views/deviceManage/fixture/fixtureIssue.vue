<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" :inline="true" :model="getDataText">
          <el-form-item label="计划开始时间" class="mb-2">
            <el-date-picker v-model="getDataText.date" format="YYYY-MM-DD" :clearable="true" value-format="YYYY-MM-DD"
              type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
              style="width: 240px" />
          </el-form-item>
          <el-form-item label="面号" class="mb-2">
            <el-select v-model="getDataText.Side" placeholder="请选择" @clear="getData" clearable style="width: 180px">
              <el-option v-for="s in sideList" :label="s.label" :value="s.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="工单号" class="mb-2">
            <el-input v-model="getDataText.OrderNumber" placeholder="请输入工单号" @clear="getData" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button @click="restData">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table :data="tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" style="width: 100%" size="small">
          <el-table-column type="index" align="center" fixed label="序号" width="55" />
          <el-table-column prop="PlannedStart" label="计划开始时间" :min-width="flexColumnWidth('计划开始时间', 'PlannedStart')">
          </el-table-column>
          <el-table-column prop="TaskNo" label="任务单" :min-width="flexColumnWidth('任务单', 'TaskNo')">
          </el-table-column>
          <el-table-column prop="LineName" label="产线" :min-width="flexColumnWidth('产线', 'LineName')">
          </el-table-column>
          <el-table-column prop="OrderNumber" label="工单号" :min-width="flexColumnWidth('工单号', 'OrderNumber')">
          </el-table-column>
          <el-table-column prop="Side" align="center" label="面号" :min-width="flexColumnWidth('面号', 'Side')">
          </el-table-column>
          <el-table-column prop="ProductName" label="产品编码" :min-width="flexColumnWidth('产品编号', 'ProductName')">
          </el-table-column>
          <el-table-column prop="ProcedureDsc" label="工序" :min-width="flexColumnWidth('工序', 'ProcedureDsc')">
          </el-table-column>
          <el-table-column prop="MaterialName" align="center" label="工治具类别"
            :min-width="flexColumnWidth('工治具类别', 'MaterialName')">
          </el-table-column>
          <el-table-column prop="ToolsMold" align="center" label="工治具型号"
            :min-width="flexColumnWidth('工治具型号', 'ToolsMold')">
          </el-table-column>
         

          
          <el-table-column prop="Amount" align="center" label="需求数" :min-width="flexColumnWidth('需求数', 'Amount')">
          </el-table-column>
          <el-table-column prop="IssuedQuantity" align="center" label="出库数"
            :min-width="flexColumnWidth('出库数', 'IssuedQuantity')">
          </el-table-column>
          <el-table-column prop="Status" align="center" label="状态" :min-width="flexColumnWidth('状态', 'Status')">
            <template #default="scope">
              <el-tag type="primary" size="small" v-if="scope.row.Status=='已申请'">{{ scope.row.Status }}</el-tag>
              <el-tag type="warning" size="small" v-if="scope.row.Status=='已接受'">{{ scope.row.Status }}</el-tag>
              <el-tag type="success" size="small" v-if="scope.row.Status=='已完成'">{{ scope.row.Status }}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="Quantity" label="工单数量">
          </el-table-column> -->
         

          <!-- <el-table-column prop="ToolsMold" label="工治具编号">
          </el-table-column> -->

          <!-- <el-table-column prop="PadID" label="PadID"> </el-table-column>
          <el-table-column prop="Result" label="原因"> </el-table-column> -->
        </el-table>
        <div class="block mt-2">
          <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size="pageSize" :page-sizes="[ 15,30, 50, 100,150]"
            layout="total,sizes, prev, pager, next" :total="tableData.length">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { findTaskToolsDetail } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";

import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const tableData = ref<any>([]);
const historyTable = ref<any>([]);
const pageSize = ref(30);
const currentPage = ref(1);
const tableHeight = ref(0);
const ruleFormRef = ref();
const OperationType = ref("");
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const getDataText = ref({
  date: [],
  OrderNumber: "",
  Side: "",
  PlanStartTime: "",
  PlanEndTime: "",
  workstationName: "",
  userAccount: loginName,
});

const sideList = ref([
  {
    value: "TOP",
    label: "TOP",
  },
  {
    value: "BOT",
    label: "BOT",
  },
]);

const columnData = reactive([
  {
    text: true,
    prop: "InternalSN",
    label: "内控SN",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "CurrentBarcode",
    label: "当前SN",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "WorkOrderNumber",
    label: "工单号",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairReason",
    label: "不良原因",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairType",
    label: "维修类别",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Repairlnformation",
    label: "维修备注",
    width: "",
    min: true,
    align: "1",
  },
]);

watch(
  () => getDataText.value.date,
  (newVal) => {
    // console.log(newVal);
    if(newVal==null){
      getDataText.value.PlanStartTime=''
      getDataText.value.PlanEndTime=''
    }else{
      getDataText.value.PlanStartTime=newVal[0]
      getDataText.value.PlanEndTime=newVal[1]
    }
  },
  { deep: true, immediate: true }
);
onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  findTaskToolsDetail(getDataText.value).then((res: any) => {
    // console.log(res.content);
    tableData.value = res.content;
  });
};
const restData=()=>{
  getDataText.value.OrderNumber=''
  getDataText.value.PlanEndTime=''
   getDataText.value.PlanStartTime=''
  getDataText.value.Side=''
  getDataText.value.date=[]
  getData()
}

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const pageObj1 = ref({
  pageSize: 10,
  currentPage: 1,
});

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};
const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

//表单验证
const rules = reactive({
  InternalSN: [{ required: true, message: "不允许为空", trigger: "blur" }],
  WorkOrderNumber: [{ required: true, message: "不允许为空", trigger: "blur" }],
  RepairType: [{ required: true, message: "不允许为空", trigger: "blur" }],
  RepairReason: [{ required: true, message: "不允许为空", trigger: "change" }],
});
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
