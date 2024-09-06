<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div>
        <el-form ref="formRef" :inline="true" :model="getDataText">
          <el-form-item label="时间区间" class="mb-2">
            <el-date-picker
              v-model="getDataText.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 240px"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="面号" class="mb-2">
            <el-select
              v-model="getDataText.side"
              placeholder="请选择"
              style="width: 180px"
            >
              <el-option
                v-for="s in sideList"
                :label="s.label"
                :value="s.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="工单号" class="mb-2">
            <el-input
              v-model="getDataText.orderNum"
              placeholder="请输入工单号"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          :height="tableHeight"
          row-key="step1"
          style="width: 100%"
          :tree-props="{ children: 'stepItemList' }"
        >
          <el-table-column prop="BarCode" label="SN条码" width="180">
          </el-table-column>
          <el-table-column prop="PadID" label="PadID"> </el-table-column>
          <el-table-column prop="Result" label="原因"> </el-table-column>
          <el-table-column prop="Remark" label="操作">
            <template #default="scope">
              <el-button type="primary" @click="maintenance(scope.row)"
                >维修</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            align="center"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { QuerySN, MaintenanceAdd, QueryMaintenance } from "@/api/smtApi";
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
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const ruleFormRef = ref();
const OperationType = ref("");
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const getDataText = ref({
  orderNum: "",
  side: "",
  date:'',
  // OperationType: "",
});
const getHistoryText = reactive({
  InternalSN: "",
  Position: "",
});
const dialogTableVisible = ref(false);
const sideList = ref([
  {
    value: "T",
    label: "TOP",
  },
  {
    value: "B",
    label: "BOT",
  },
]);
const historyTableVisible = ref(false);
const repairList = ref([
  {
    label: "SPI",
    value: "SPI",
  },
  {
    label: "AOI",
    value: "AOI",
  },
  {
    label: "AOII",
    value: "AOII",
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

interface RuleForm {
  FaceType: string;
  InternalSN: string;
  CurrentBarcode: string;
  WorkOrderNumber: string;
  OrderNo: string;
  PlanNumber: string;
  CustomerName: string;
  ProductName: string;
  Processes: string;
  ProcessesNumber: string;
  StayWireName: string;
  StayWireNumber: string;
  RepairProcesses: string;
  RepairProcessesNumber: string;
  Repairlnformation: string;
  RepairType: string;
  RepairReason: string;
  UpdateUser: string;
  OperationType: string;
  Position: string;
}

const maintenanceForm = ref<RuleForm>({
  FaceType: "",
  InternalSN: "",
  CurrentBarcode: "",
  WorkOrderNumber: "",
  OrderNo: "",
  PlanNumber: "",
  CustomerName: "",
  ProductName: "",
  Processes: "",
  ProcessesNumber: "",
  StayWireName: "",
  StayWireNumber: "",
  RepairProcesses: "",
  RepairProcessesNumber: "",
  Repairlnformation: "",
  RepairType: "",
  RepairReason: "",
  UpdateUser: loginName,
  OperationType: "",
  Position: "",
});

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {};

const maintenance = (row: any) => {
  // maintenanceForm.value.InternalSN = row.BarCode;
  maintenanceForm.value.OperationType = OperationType.value;
  maintenanceForm.value.Position = row.PadID;
  dialogTableVisible.value = true;
};

const sureMaintenance = (formEl: any) => {
  if (!formEl) return;
  formEl.validate((valid: any, fields: any) => {
    if (valid) {
      dialogTableVisible.value = false;
      MaintenanceAdd(maintenanceForm.value).then((res: any) => {
        if (!res) {
          return;
        }
        getData();
        ElMessage({
          message: res.msg,
          type: "success",
        });
        maintenanceForm.value = {
          FaceType: "",
          InternalSN: "",
          CurrentBarcode: "",
          WorkOrderNumber: "",
          OrderNo: "",
          PlanNumber: "",
          CustomerName: "",
          ProductName: "",
          Processes: "",
          ProcessesNumber: "",
          StayWireName: "",
          StayWireNumber: "",
          RepairProcesses: "",
          RepairProcessesNumber: "",
          Repairlnformation: "",
          RepairType: "",
          RepairReason: "",
          UpdateUser: loginName,
          OperationType: "",
          Position: "",
        };
      });
    } else {
      ElMessage({
        message: "请输入必要信息",
        type: "warning",
      });
      console.log("error submit!", fields);
    }
  });
};

const getHistory = () => {
  if (getHistoryText.InternalSN === "") {
    ElMessage({
      message: "内控SN不能为空",
      type: "warning",
    });
    return;
  }
  QueryMaintenance(getHistoryText.InternalSN, getHistoryText.Position).then(
    (res: any) => {
      // const dataText = JSON.parse(res.content);
      historyTable.value = res.content;
    }
  );
};

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

const handleSizeChange1 = (val: any) => {
  pageObj1.value.currentPage = 1;
  pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  pageObj1.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
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
