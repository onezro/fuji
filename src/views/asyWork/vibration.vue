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
              <el-form-item label="过站数量">
                <span class="font-bold text-lg leading-[30px] text-[#00B400]">
                  {{ tableData1.length }}</span
                >
              </el-form-item>
            </el-form>
            <!-- <table-tem
              :showIndex="true"
              :tableData="materialTable"
              :tableHeight="250"
              :columnData="materialColumnData"
              :pageObj="materialPageObj"
              @handleSizeChange="materialSizeChange"
              @handleCurrentChange="materialCurrentChange"
            ></table-tem> -->
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
                <el-form-item label="扫描条码" class="mb-2">
                  <el-input
                    v-model.trim="barCode"
                    ref="inputRef"
                    :autofocus="inputFocus"
                    style="width: 500px"
                    placeholder="请扫描MES成品SN条码"
                    @keyup.enter.native="getChange"
                  />
                </el-form-item>
              </el-form>
              <div
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
import { QueryMoveHistory } from "@/api/dipApi";
import { VibrationDetail } from "@/api/asyApi";
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
const materialTable = ref<any[]>([]);
const loginName = userStore.getUserInfo;
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
});

const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "生产计划号",
    value: "MfgOrderName",
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
    label: "机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "textarea",
    width: 300,
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
    value: "QTY",
    disabled: true,
    type: "textarea",
    width: 300,
  },
]);
const columnData1 = reactive([
  {
    text: true,
    label: "工站",
    prop: "WorkStation",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    label: "MES产品SN条码",
    prop: "SN",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    label: "扫描时间",
    prop: "Date",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    label: "扫描人",
    prop: "userAccount",
    disabled: true,
    width: "",
    min: true,
    align: "center",
  },
]);

const materialColumnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "版本信息",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "BD_EmployeeName",
    label: "对比结果",
    width: "",
    align: "1",
  },
]);

const tableData1 = ref<any[]>([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const materialPageObj = ref({
  pageSize: 1000000,
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

//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;
  const now = new Date();

  const formattedDate =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")} ` +
    `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  stopsForm.value.containerName = barCodeData;
  VibrationDetail({
    WorkStation: opui.station,
    SN: barCode.value,
    userAccount: loginName,
    Date: formattedDate,
  }).then((res: any) => {
    if (res && res.success) {
      msgTitle.value = res.msg;
      msgType.value = res.success;
      form.value = { ...res.content[0] };
      // tableData1.value.push(res.content2);
      tableData1.value.unshift({
        WorkStation: opui.station,
        SN: barCode.value,
        userAccount: loginName,
        Date: formattedDate,
      });
      stopsForm.value.containerName = "";
    } else {
      msgTitle.value = res.msg;
      msgType.value = res.success;
    }
    console.log(tableData1.value);

    // hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
    // getHisData();
  });
  barCode.value = "";
  getFocus();
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
