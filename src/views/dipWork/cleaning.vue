<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
    >
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div></div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
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
              <el-form-item label="工单" class="mb-[5px] flex">
                <selectTa
                  ref="selectTable"
                  :table="orderTable"
                  :selectWidth="220"
                  :columns="orderColumns"
                  :max-height="400"
                  :tableWidth="700"
                  :defaultSelectVal="defaultSelectVal"
                  :keywords="{
                    label: 'MfgOrderName',
                    value: 'MfgOrderName',
                  }"
                  @radioChange="(...args: any) => radioChange(args)"
                >
                </selectTa>
                <el-tooltip content="刷新" placement="top">
                  <el-icon
                    class="ml-2"
                    color="#777777"
                    :class="isLoding"
                    size="24"
                    @click="getOrderData"
                  >
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item
                v-for="f in formHeader"
                :key="f.value"
                :label="f.label"
              >
                <span
                  class="font-bold text-lg leading-[30px]"
                  :class="f.value == 'passNum' ? 'text-[#00B400]' : ''"
                >
                  {{ formText(f.value) }}</span
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] pt-3 pr-5 pl-5">
              <el-form
                class="inbound"
                ref="formRef"
                :inline="true"
                :model="form"
                label-width="auto"
                @submit.native.prevent
              >
                <el-form-item label="扫描条码">
                  <el-input
                    v-model.trim="barCode"
                    ref="inputRef"
                    :autofocus="inputFocus"
                    style="width: 500px"
                    placeholder="请扫描条码"
                    @keyup.enter.native="getChange"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :disabled="
                      form.MfgOrderName == '' || tableData1.length == 0
                    "
                    @click="reWash"
                    >重新清洗</el-button
                  >
                </el-form-item>
                <!-- <div> <el-button type="primary" :disabled="form.MfgOrderName == ''" @click="autoPrint">条码打印</el-button>
                                <el-button type="warning" :disabled="form.MfgOrderName == '' "  @click="print">手动打印</el-button>
                            </div> -->
              </el-form>
              <div
                class="text-xl font-bold text-[#00B400]"
                v-show="msgType === true || msgTitle === ''"
              >
                {{ msgTitle === "" ? "请扫描屏材料批次条码" : msgTitle }}
              </div>
              <div
                class="text-xl font-bold text-[red]"
                v-show="msgType === false && msgTitle !== ''"
              >
                {{ msgTitle }}
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5">历史过站记录</span>
            </div>
            <table-tem
              :showIndex="true"
              :tableData="tableData1"
              :tableHeight="tableHeight"
              :columnData="columnData1"
              :pageObj="pageObj"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></table-tem>
          </div>
        </div>
      </div>
    </div>
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
import { OrderQuery } from "@/api/dipApi";
import {
  CleanCodeSave,
  QueryCleanCodeRecord,
  ReloadCleanCode,
} from "@/api/Assembly";

import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { cloneDeep } from "lodash-es";
interface StopsForm {
  //   containerName: string;
  workstationName: string;
  result: string;
  userAccount: string;
  txnDate: string;
  Container: string;
  OrderName: string;
  tools: string;
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
const stopsForm = ref<StopsForm>({
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
  result: "OK",
  Container: "",
  OrderName: "",
  tools: "",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  // {
  //     label: "工单号",
  //     value: "MfgOrderName",
  //     disabled: true,
  //     type: "input",
  //     width: "",
  // },
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
const columnData1 = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "物料批次条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "BD_Tools",
    label: "物料编码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "BD_EmployeeName",
    label: "扫描人",
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
]);
const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 10,
  currentPage: 1,
});

const msgTitle = ref("");
const msgType = ref(true);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [],
});
const orderColumns = ref([
  { label: "工单号", width: "", prop: "MfgOrderName" },
  { label: "产品编码", width: "", prop: "ProductName" },
  { label: "产线", width: "", prop: "MfgLineDesc" },
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);
const defaultSelectVal = ref<string[]>([]);
const isLoding = ref("");

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
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
  QueryCleanCodeRecord(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;
  stopsForm.value.Container = barCodeData;
  if (stopsForm.value.OrderName == "") {
    msgTitle.value = "请先选择工单";
    msgType.value = false;
  } else {
    CleanCodeSave(stopsForm.value).then((res: any) => {
      msgTitle.value = res.msg;
      msgType.value = res.success;
      stopsForm.value.Container = "";
      // form.value = { ...res.content[0] };
      stopsForm.value.result = "OK";
      // hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
      // getFocus();
      getHisData();
    });
  }

  barCode.value = "";
  getFocus();
};
const radioChange = (args: any) => {
  if (args[1] == null) {
    form.value.MfgOrderName = "";
    form.value.ProductName = "";
    form.value.ProductDesc = "";
    form.value.PlannedStartDate = "";
    form.value.BD_ProductModel = "";
    form.value.BD_SoftVersion = "";
    form.value.PlannedCompletionDate = "";
    form.value.Qty = "";
  } else {
    // orderTable.value.data.forEach((v: any) => {
    //   if (v.MfgOrderName == args[1]) {
    form.value.MfgOrderName = args[0].MfgOrderName;
    form.value.ProductName = args[0].ProductName;
    form.value.ProductDesc = args[0].ProductDesc;
    form.value.BD_ProductModel = args[0].BD_ProductModel;
    form.value.BD_SoftVersion = args[0].BD_SoftVersion;
    form.value.PlannedStartDate = args[0].PlannedStartDate;
    form.value.PlannedCompletionDate = args[0].PlannedCompletionDate;
    form.value.Qty = args[0].Qty;
    stopsForm.value.OrderName = args[0].MfgOrderName;
    hisForm.value.MfgOrderName = args[0].MfgOrderName;
    getHisData();
    // console.log(args[0].MfgOrderName);
    // getFeedForm.value.MfgOrder = args[0].MfgOrderName;

    // if (getToolForm.value.OrderNumber == args[0].MfgOrderName) {
    //   return;
    // } else {
    //   getToolForm.value.OrderNumber = args[0].MfgOrderName;
    //   getHisData();
    //   getToolData();
    // }
  }
};
const getOrderData = () => {
  isLoding.value = "is-loading";
  OrderQuery({ lineName: opui.line, OrderTypeName: "Assembly" }).then(
    (res: any) => {
      let data = res.content;
      let timer = setTimeout(() => {
        isLoding.value = "";
        clearTimeout(timer);
      }, 2000);
      if (data.length !== 0) {
        orderTable.value.data[0] = data[0];
      }
      if (data.length == 1) {
        // console.log(2111);
        let a = data[0].MfgOrderName;
        defaultSelectVal.value[0] = a;
      }
    }
  );
};
const reWash = () => {
  let data =cloneDeep(tableData1.value[0])   
  let reWashForm = {
    Container:data.Container,
    OrderName: form.value.MfgOrderName,
    ProductName: data.ProductName,
    workstationName:  opui.station,
    tools: "",
    userAccount:userStore.getUserInfo,
  };
  ReloadCleanCode(reWashForm).then((res:any)=>{
    msgTitle.value = res.msg;
    msgType.value = res.success;
    if(res.success){
        getHisData();
    }
  })

};

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
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

.tabs-css .el-tabs--border-card > .el-tabs__header .el-tabs__item {
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

.tabs-css
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
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
