<template>
  <div class="flex flex-col w-full h-full">
    <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div></div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'passNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] pt-3 pr-5 pl-5">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                @submit.native.prevent>
                <el-form-item label="扫描条码" class="mb-2">
                  <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                    placeholder="请扫描条码" @keyup.enter.native="getChange" />
                  <el-button class="ml-4" type="primary" @click="dialogVisible = true">物料信息</el-button>
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描成品SN条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">历史过站记录</span>
            </div>
            <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight" :columnData="columnData1"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="物料信息" v-model="dialogVisible" width="60%" :align-center="true">
      <div class="w-full">
        <div class="w-full h-[32px] mb-2 bg-[#006487] flex items-center">
          <div class="text-white ml-4">基本信息</div>
        </div>
        <el-form :inline="true" label-width="80px">
          <el-form-item label="工单号" class="mb-2">
            <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 180px"
              @keyup.enter.native="getChange" />
          </el-form-item>
          <el-form-item label="需求总量" class="mb-2">
            <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 180px" placeholder=""
              @keyup.enter.native="getChange" />
          </el-form-item>
          <el-form-item label="上料总量" class="mb-2">
            <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 180px" placeholder=""
              @keyup.enter.native="getChange" />
          </el-form-item>
          <el-form-item label="物料编码" class="mb-2">
            <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 180px" placeholder=""
              @keyup.enter.native="getChange" />
          </el-form-item>
          <el-form-item label="物料描述" class="mb-2">
            <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 470px" placeholder=""
              @keyup.enter.native="getChange" />
          </el-form-item>
        </el-form>
        <div class="w-full h-[32px] mb-2 bg-[#006487] flex items-center">
          <div class="text-white ml-4">物料批次明细</div>
        </div>
        <el-button class="bg-sky-400 border-none" type="primary" @click="dialogVisible = true">批量下料</el-button>
        <table-tem :showIndex="true" :tableData="materialTable" :tableHeight="300" :columnData="materialColumnData"
          :pageObj="materialPageObj" @handleSizeChange="materialSizeChange"
          @handleCurrentChange="materialCurrentChange"></table-tem>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { QueryMoveHistory } from "@/api/dipApi";
import { PressingStationMoveOut } from "@/api/asyApi";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
interface StopsForm {
  containerName: string;
  workstationName: string;
  result: string;
  userAccount: string;
  txnDate: string;
}

interface ToolList {
  WorkStationName: string;
  OrderNumber: string;
  ToolName: string;
  sort: number;
  MaterialName: string;
  CompName: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const inputFocus = ref(true);
const barCode = ref("");
const dialogVisible = ref(false);
const materialTable = ref<any[]>([])
const stopsForm = ref<StopsForm>({
  containerName: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
  result: "OK",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
   AllNum:"",
  TodayNum:""
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "工单号",
    value: "MfgOrderName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "ProductName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "Description",
    disabled: true,
    type: "textarea",
    width: 300,
  },
  {
    label: "工单数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "过站数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "过站总数",
    value: "AllNum",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "实时过站",
    value: "TodayNum",
    disabled: true,
    type: "input",
    width: "",
  },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "成品SN条码",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "BD_EmployeeName",
    label: "SMT组件条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "扫描时间",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "扫描人",
    width: "",
    align: "1",
  },
]);

const materialColumnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "物料批次条码",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "BD_EmployeeName",
    label: "批次号",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "数量",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "操作人",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "上料时间",
    width: "",
    align: "1",
  },
  {
    isOperation: true,
    label: "操作",
    width: "80",
    align: "center",
    operation: [
      {
        type: "primary",
        label: "下料",
        icon: "Tickets",
      },
    ],
  },
]);

const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const materialPageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const msgTitle = ref("");
const msgType = ref(true);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // getOrderData();
  getFocus();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//获取光标
const getFocus = () => {
  inputFocus.value = false;
  setTimeout(() => {
    inputFocus.value = true;
  }, 100);
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form.value[key];
};

//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;

  stopsForm.value.containerName = barCodeData;
  PressingStationMoveOut(stopsForm.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    stopsForm.value.containerName = "";
    form.value = { ...res.content[0] };

    // hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
    getFocus();
    // getHisData();
  });
  barCode.value = "";
};

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

//分页
const materialSizeChange = (val: any) => {
  materialPageObj.value.currentPage = 1;
  materialPageObj.value.pageSize = val;
};
const materialCurrentChange = (val: any) => {
  materialPageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 360;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 350px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.tabs-css .el-tabs--border-card {
  border-top: 1px solid #006487;
}

.tabs-css .el-tabs__header {
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 5px 0px;
}

.tabs-css .el-tabs__item {
  font-size: 1.1rem;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-switch__label {
  font-weight: bold;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  // background-color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.8);
}

.saveAsDialog {
  min-width: 954px;
}

// .checked{
//   height: 14px;
// }
.checked .el-checkbox {
  height: 14px;
}
</style>
