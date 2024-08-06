<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
    >
      <span class="text-2xl font-bold text-[#006487]">物料检验-外观</span>
      <div>
        <el-button type="primary" @click="dialogVisible = true"
          >工单开工</el-button
        >
        <el-button type="primary">条码转工单</el-button>
      </div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div
            class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form
              class="inbound"
              ref="formRef"
              :model="form"
              label-width="auto"
            >
              <el-form-item
                size="default"
                v-for="f in formHeader"
                :key="f.value"
                :label="f.lable"
              >
                <span class="font-bold text-[18px] leading-[30px]">
                  {{ formText(f.value) }}</span
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div
              class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]"
            >
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] p-5">
              <el-form
                class="inbound"
                ref="formRef"
                :model="form"
                label-width="auto"
              >
                <el-form-item label="扫描条码">
                  <el-input
                    v-model="barCode"
                    style="width: 500px"
                    placeholder="请扫描条码"
                  />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]">
                请扫描物料批次条码
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div
              class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]"
            >
              <span class="ml-5">物料检验记录</span>
            </div>
            <div class="h-full">
              <table-tem
                :showIndex="showIndex"
                :tableData="tableData"
                :tableHeight="tableHeight"
                :columnData="columnData"
                :pageObj="pageObj"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
              ></table-tem>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="工单开工"
      width="70%"
      align-center
    >
      <el-table
        ref="taskTableRef"
        :data="workOrderList"
        style="width: 100%"
        :height="'50vh'"
        @row-click="selectClick"
      >
        <el-table-column
          v-for="item in formHeader"
          :prop="item.value"
          :label="item.lable"
        />
      </el-table>
      <div class="w-full flex justify-around">
        <el-pagination
          size="large"
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="pageObj.currentPage"
          :page-size="pageObj1.pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="workOrderList.length"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import { getLaserWorkOrder } from "@/api/smt1";
interface Form {
  MfgOrderName: string;
  BD_ProductModel: string;
  ProductName: string;
  ProductDesc: string;
  MfgLineDesc: string;
  OrderStatusDesc: string;
  PlannedStartDate: string;
  PlannedCompletionDate:string;
  Qty: number | string;
  RMANumber: string;
}
interface FormHeader {
  lable: string;
  value: string;
}
interface OrderList {
  MfgOrderName: string;
  PlannedStartDate: string;
  PlannedCompletionDate: string;
  RMANumber: string;
  Qty: number | string;
  ProductName: string;
  BD_ProjectNo: any;
  BD_ProductModel: any;
  ProductDesc: any;
  UOMName: string;
  OrderStatusName: string;
  OrderStatusDesc: string;
  MfgLineName: string;
  MfgLineDesc: string;
}
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const taskTableRef = ref(); // 表格ref
const barCode = ref("");
const activeName = ref("first");
const dialogVisible = ref(false);
const workOrder = ref("");
const choiceRow = ref<any>()

const workOrderList = ref<OrderList[]>([]);
const form = reactive<Form>({
  MfgOrderName: '',
  PlannedStartDate: '',
  PlannedCompletionDate: '',
  RMANumber: '',
  Qty: '',
  ProductName: '',
  BD_ProductModel: '',
  ProductDesc: '',
  OrderStatusDesc: '',
  MfgLineDesc: ''
});
const formHeader = reactive<FormHeader[]>([
  {
    lable: "工单号",
    value: "MfgOrderName",
  },
  {
    lable: "机型",
    value: "BD_ProductModel",
  },
  {
    lable: "产品编码",
    value: "ProductName",
  },
  {
    lable: "产品描述",
    value: "ProductDesc",
  },
  {
    lable: "产线",
    value: "MfgLineDesc",
  },
  {
    lable: "状态",
    value: "OrderStatusDesc",
  },
  {
    lable: "开始时间",
    value: "PlannedStartDate",
  },
  {
    lable: "结束时间",
    value: "PlannedCompletionDate",
  },
  {
    lable: "板面",
    value: "RMANumber",
  },
  {
    lable: "工单数量",
    value: "Qty",
  },
]);
const tableData = ref([]);
const showIndex = ref(true);
const tableHeight = ref(0);
const columnData = reactive([
  {
    text: true,
    prop: "eqty",
    label: "PCB条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "eqName",
    label: "物料包装条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "zcnumber",
    label: "拆包时间",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "包装批次",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "",
    label: "",
    width: "",
    align: "1",
  },
]);

const pageObj = ref({
  pageSize: 10,
  currentPage: 1,
});
const pageObj1 = ref({
  pageSize: 10,
  currentPage: 1,
});

onBeforeMount(() => {
  getScreenHeight();
  getOrderList();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
  pageObj1.value.currentPage = 1;
  pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  pageObj1.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 365;
  });
};
const getOrderList = () => {
  getLaserWorkOrder({ orderID: "" }).then((data: any) => {
    const dataText = JSON.parse(data.content);
    workOrderList.value = dataText
  });
};
const choiceOrder = () => {
  console.log(choiceRow.value);
};
const selectClick = (row: any, column: any, event: Event) => {
    form.MfgOrderName = row.MfgOrderName;
    form.BD_ProductModel = row.BD_ProductModel;
    form.ProductName = row.ProductName;
    form.ProductDesc = row.ProductDesc;
    form.MfgLineDesc = row.MfgLineDesc;
    form.OrderStatusDesc = row.OrderStatusDesc;
    form.PlannedStartDate = row.PlannedStartDate;
    form.PlannedCompletionDate = row.PlannedCompletionDate;
    form.Qty = row.Qty;
    form.RMANumber = row.RMANumber;
}
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 320px;
}

.box {
  border-right: 2px solid #dadbde;
}

// :deep(.el-table th.el-table__cell:nth-child(1) .cell) {
//     visibility: hidden;
// }
</style>
