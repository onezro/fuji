<template>
  <div class="p-[5px] flex">
    <div class="w-[350px] border-solid border-r-2 border-[#cbcbcb]">
      <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
        <span class="ml-5">基本信息</span>
      </div>
      <div class="p-[10px]">
        <el-form
          class="inbound"
          size="default"
          ref="formRef"
          :model="OrderForm"
          label-width="auto"
        >
          <el-form-item label="工单">
            <selectTa
              ref="selectTable"
              :table="orderTable"
              :columns="orderColumns"
              :max-height="400"
              :tableWidth="700"
              :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
              @radioChange="(...args: any) => radioChange(args)"
            >
            </selectTa>
          </el-form-item>
          <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
            <span
              class="font-bold text-[18px] leading-[30px]"
              :class="f.value == 'passNum' ? 'text-[#00B400]' : ''"
            >
              {{ formText(f.value) }}</span
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="w-[calc(100%-350px)]">
      <div>
        <div class="ml-2">
          <el-form
            ref="formRef"
            :inline="true"
            size="default"
            :model="form"
            label-width="auto"
          >
            <el-form-item label="创建时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <!-- <el-form-item label="产线" prop="line">
              <el-select
                v-model="form.line"
                placeholder="请选择"
                style="width: 150px"
              >
                <el-option
                  v-for="l in lineOption"
                  :key="l.value"
                  :label="l.label"
                  :value="l.value"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="工单号" prop="workOrder"
              ><el-input
                style="width: 200px"
                v-model="form.workOrder"
                placeholder="请输入工单号"
            /></el-form-item>
            <el-form-item label="条码" prop="barCode"
              ><el-input
                style="width: 150px"
                v-model="form.barCode"
                placeholder="请输入条码"
            /></el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="onSubmit"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="mb-2 ml-2">
          <el-button icon="Printer" type="primary" @click="burnPrint" v-if="BurnTableData.length !== 0"
            >打印</el-button
          >
          <el-button icon="Printer" v-else="BurnTableData.length === 0"  disabled type="info"
            >打印</el-button
          >
          <el-button icon="Printer" v-if="OrderForm.MfgOrderName === ''"  disabled type="info"
            >原材料上料</el-button
          >
          <el-button icon="Printer" v-else="OrderForm.MfgOrderName !== ''" type="primary" @click="RawmaterialFeeding"
            >原材料上料</el-button
          >
        </div>
        <tableTem
          ref="BurnTableRef"
          :showIndex="true"
          :size="'small'"
          :tableData="tableData"
          :tableHeight="tableHeight"
          :columnData="columnData"
          :pageObj="pageObj"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          showSelect="ture"
          @handleSelectionChange="test"
        >
        </tableTem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import selectTa from "@/components/selectTable/index.vue";
import tableTem from "@/components/tableTem/index.vue";
const form = ref({
  line: "",
  workOrder: "",
  barCode: "",
  startTime: "",
  endTime: "",
});
import { useAppStore } from "@/stores/modules/app";

const appStore = useAppStore();
const opui = appStore.getOPUIReal();

const BurnTableRef = ref();

const BurnTableData = ref([])

const test = (e: any) => {
  console.log(e);
  BurnTableData.value = e
  console.log(BurnTableData.value.length);
  
};

const lineOption = ref([
  {
    label: "line1",
    value: "line1",
  },
  {
    label: "line2",
    value: "line2",
  },
]);

const orderColumns = ref([
  { label: "工单号", width: "", prop: "MfgOrderName" },
  { label: "产品编码", width: "", prop: "ProductName" },
  { label: "产线", width: "", prop: "MfgLineDesc" },
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
  // { label: "工单号", width: "", prop: "MfgOrderName" },
  // { label: "产品编码", width: "", prop: "ProductName" }
]);

const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [
    {
      MfgOrderName: "2330201001988",
      PlannedStartDate: "2024-08-07 00:00:00",
      PlannedCompletionDate: "2024-08-0700:00:00",
      Qty: "2000",
      ProductName: "2330201001988",
      BD_ProjectNo: "string",
      BD_ProductModel: "string",
      ProductDesc: "插件组件 3A4621-01CMB板 DIP",
      UOMName: "string",
      OrderStatusName: "string",
      OrderStatusDesc: "string",
      MfgLineName: "string",
      MfgLineDesc: "string",
    },
  ],
});

const OrderForm = reactive<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
});

const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "产品编码",
    value: "ProductName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "ProductDesc",
    disabled: true,
    type: "textarea",
    width: 300,
  },
  {
    label: "计划开始",
    value: "PlannedStartDate",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划完成",
    value: "PlannedCompletionDate",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工单数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
]);

const tableData = ref([
  {
    quantity: "10000",
    rawMaterial: "A240812000083",
    semiFinished: "A240813000024",
    itemNumber: "2400617001074",
    itemName:
      "核心模块组件委外锐CS199MAP_MT8666MV_AB_V3.0_PCB45.8*45.8*4.3mm23106010001773A5321CS199MAF(C211MCArr)软件",
    orderWork: "24072404",
    time: "2024-08-13 07:31:46",
  },
  {
    quantity: "10000",
    rawMaterial: "A240812000083",
    semiFinished: "A240813000024",
    itemNumber: "2400617001074",
    itemName:
      "核心模块组件委外锐CS199MAP_MT8666MV_AB_V3.0_PCB45.8*45.8*4.3mm23106010001773A5321CS199MAF(C211MCArr)软件",
    orderWork: "24072404",
    time: "2024-08-13 07:31:46",
  },
]);

const formText = (data: string) => {
  let key = data as keyof typeof OrderForm;
  return OrderForm[key];
};

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
    // width: "600",
    // min: true,
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
  },
]);

const burnPrint = () => {
  BurnTableRef.value.toggleSelection();
};

const RawmaterialFeeding = () => {
    if (OrderForm.MfgOrderName === '') {
    ElMessage({
      message: `请选择工单`,
      type: "warning",
    });
    return;
    }
    ElMessage({
      message: `工单:${OrderForm.MfgOrderName},设备码:${opui.station}`,
      type: "success",
    });
}

const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
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

const radioChange = (args: any) => {
  console.log(args[1]);
  orderTable.value.data.forEach((v: any) => {
    if (v.MfgOrderName == args[1]) {
      OrderForm.MfgOrderName = v.MfgOrderName;
      OrderForm.ProductName = v.ProductName;
      OrderForm.ProductDesc = v.ProductDesc;
      OrderForm.PlannedStartDate = v.PlannedStartDate;
      OrderForm.PlannedCompletionDate = v.PlannedCompletionDate;
      OrderForm.Qty = v.Qty;
    }
  });
  //   inputRef.value.focus();
};
const onSubmit = () => {
  console.log(form.value);
};

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
