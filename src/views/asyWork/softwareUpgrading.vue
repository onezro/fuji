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
      <div class="w-[calc(100%-700px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[60px] pt-3 pr-5 pl-5">
              <el-form
                class="inbound"
                ref="formRef"
                :inline="true"
                :model="form"
                label-width="auto"
                @submit.native.prevent
              >
                <el-form-item label="扫描条码" class="mb-2">
                  <el-input
                    v-model.trim="barCode"
                    ref="inputRef"
                    :autofocus="inputFocus"
                    style="width: 500px"
                    placeholder="请扫描MES条码"
                    :disabled="SoftwareStatus === '2'"
                    @keyup.enter.native="scan"
                  />
                </el-form-item>
                <el-form-item label="" class="mb-2">
                  <el-button type="primary" @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
              <!-- <div
                  class="text-xl font-bold text-[#00B400]"
                  v-show="msgType === true || msgTitle === ''"
                >
                  {{ msgTitle === "" ? "请扫描成品SN条码" : msgTitle }}
                </div>
                <div
                  class="text-xl font-bold text-[red]"
                  v-show="msgType === false && msgTitle !== ''"
                >
                  {{ msgTitle }}
                </div> -->
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487] justify-between"
            >
              <span class="ml-5">软件信息</span>
              <el-button type="warning" :disabled="SoftwareStatus === '1'">人工确认提交</el-button>
            </div>
            <table-tem
             class="my-table"
              :show-select="true"
              :tableData="tableData1"
              :tableHeight="tableHeight"
              :columnData="columnData1"
              :pageObj="pageObj"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"
            ></table-tem>
          </div>
        </div>
      </div>
      <div class="setwidth w-[350px] border-l border-solid border-[#cbcbcb]">
        <div class="w-full h-full box">
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">当前MES码</span>
          </div>
          <div class="h-[60px] pt-3 pr-5 pl-5">
            <el-form
              class="inbound"
              ref="formRef"
              :inline="true"
              :model="form"
              label-width="auto"
              @submit.native.prevent
            >
              <el-form-item label="" class="mb-2">
                <el-input
                  class="custom-input custom-input-class"
                  v-model.trim="currentCode"
                  ref="inputRef"
                  style="width: 300px"
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5">检测结果与提示消息</span>
            </div>
            <div class="h-[160px] flex justify-around items-center">
              <div
                class="w-[120px] h-[120px] rounded-full"
                :class="msgType ? 'bg-[#00B400]' : 'bg-[red]'"
              ></div>
            </div>
            <div
              :style="{ height: `${boxHeight}px` }"
              class="m-2 border border-solid border-[#cbcbcb]"
            >
            {{ msgTitle }}
          </div>
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
import { QueryMoveHistory } from "@/api/dipApi";
import { QueryOrderSoftwareInfo } from "@/api/asyApi";
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
const currentCode = ref("12124");
const dialogVisible = ref(false);
const materialTable = ref<any[]>([]);
const boxHeight = ref(0);
const changeList = ref([]);
const btnType = ref(false);
const SoftwareStatus = ref("1")
const stopsForm = ref<StopsForm>({
  containerName: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
  result: "OK",
});

const form = ref<InstanceType<typeof Formspan>>({
  PlanNo: "",
  ProductModel: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  TotalNum: ""
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "生产计划号",
    value: "PlanNo",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品机型",
    value: "ProductModel",
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
    value: "ProductDesc",
    disabled: true,
    type: "textarea",
    width: 300,
  },
  {
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "过站数量",
    value: "TotalNum",
    disabled: true,
    type: "input",
    width: "",
  },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "SoftwareName",
    label: "成品SN条码",
    width: "200px",
    align: "1",
  },

  {
    text: true,
    prop: "SoftwareVersion",
    label: "产品版本二维码",
    width: "",
    align: "1",
  },
]);

const materialColumnData = reactive([
  {
    text: true,
    prop: "SoftwareName",
    label: "版本信息",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "SoftwareVersion",
    label: "对比结果",
    width: "",
    align: "1",
  },
]);

const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
  isShow:-1
});

const materialPageObj = ref({
  pageSize: 100000,
  currentPage: 1,
  isShow: -1,
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

//重置页面
const reset = () => {
  form.value = {
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
  };
  tableData1.value = [];
  currentCode.value = "";
  msgType.value = true;
  msgTitle.value = "";
};

//选中
const handleSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  changeList.value = content;
};

//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};

//扫描条码
const scan = () => {
  if (SoftwareStatus.value === "1") {
    QueryOrderSoftwareInfo({containerName:barCode.value,workstationName:opui.station}).then((res:any) => {
      currentCode.value = barCode.value;
      barCode.value = '';
      SoftwareStatus.value = res.content.SoftwareStatus;
      form.value.PlanNo = res.content.PlanNo;
      form.value.ProductModel = res.content.ProductModel;
      form.value.ProductName = res.content.ProductName;
      form.value.ProductDesc = res.content.ProductDesc;
      form.value.Qty = res.content.Qty;
      form.value.TotalNum = res.content.TotalNum;
      tableData1.value = res.content.SoftwareList
    })
  }else {

  }
}

//过站
const getChange = () => {
  let barCodeData = barCode.value;

  stopsForm.value.containerName = barCodeData;
  
}

  
  
  onBeforeMount(() => {
    getScreenHeight();
  });
  onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // getOrderData();
    getFocus();
    // getHisData();
  });

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
    tableHeight.value = window.innerHeight - 255;
    boxHeight.value = window.innerHeight - 430;
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

.custom-input .el-input__inner {
  font-weight: bold;
}

.custom-input-class.el-input.is-disabled .el-input__wrapper  {
  background-color:rgba($color: #000000, $alpha: 0);
  color: black;
}
.custom-input-class.el-input.is-disabled .el-input__inner {
  color:black;
  -webkit-text-fill-color:black;
  font-size: large;
}

.my-table .el-table__header-wrapper {
  display: none;
}
</style>
