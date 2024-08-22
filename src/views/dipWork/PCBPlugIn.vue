<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
    >
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div>
        <el-button type="primary" @click="openFeed">物料上料</el-button>
        <el-button type="primary" @click="openOver">过序设置</el-button>
          <el-button type="primary" @click="openDialog">不良品登记</el-button>
      </div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form
              class="inbound"
              size="default"
              ref="formRef"
              :model="form"
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
              <el-form-item
                v-for="f in formHeader"
                :key="f.value"
                :label="f.label"
              >
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
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] p-5">
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
                    v-model="barCode"
                    clearable
                    ref="inputRef"
                    style="width: 500px"
                    placeholder="请扫描条码"
                    @keyup.enter.native="getChange"
                  />
                </el-form-item>
                <el-form-item
                  :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']"
                >
                  <el-switch
                    v-model="stopsForm.result"
                    size="large"
                    style="
                      zoom: 1.2;
                      --el-switch-on-color: #ff4949;
                      --el-switch-off-color: #13ce66;
                    "
                    :active-value="'NG'"
                    :inactive-value="'OK'"
                    active-text="NG"
                    inactive-text="OK"
                  />
                </el-form-item>
              </el-form>
              <div
                class="text-xl font-bold text-[#00B400]"
                v-show="msgTitle === '成功' || msgTitle === ''"
              >
                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
              </div>
              <div
                class="text-xl font-bold text-[red]"
                v-show="msgTitle !== '成功' && msgTitle !== ''"
              >
                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1 tabs-css">
            <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
              <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                <table-tem
                  :showIndex="true"
                  :tableData="tableData1"
                  :tableHeight="tableHeight"
                  :columnData="columnData1"
                  :pageObj="pageObj"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-tem>
              </el-tab-pane>
              <!-- <el-tab-pane label="SOP" name="sop"> sop </el-tab-pane> -->
              <el-tab-pane label="工装治具" name="fixtures">
                fixtures
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <badInfoTem
      :visible="editVisible"
      :list="list"
      :formHeader="formHeader1"
      :form="editForm"
      :badForm="badForm"
      :tableData="BadtableData"
      @cancel="editCancel"
      @submit="editSubmit"
      @deleteBad="deleteBad"
      @addBadData="addBadData"
      @openAddBad="openAddBad"
    />
    <formTem
      ref="addOverRef"
      :width="'30%'"
      :visible="overAddVisible"
      :title="'波峰焊过序设置'"
      :form="overAddForm"
      :formHeader="overHeader"
      @formCancel="addOverCancel"
      @onSubmit="addOveronSubmit"
    ></formTem>
    <el-dialog
      v-model="feedVisible"
      title="物料上料"
      width="90%"
      align-center
      draggable
      class="saveAsDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <feedTemp :form="feedForm" :form-header="FeedHeader"/>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedCancel">关闭</el-button>
          <!-- <el-button type="primary" @click="show = false"> Confirm </el-button> -->
        </span>
      </template>
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
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import {
  QueryWorkOrderInfo,
  DIPStationMoveOut,
  FindAllDevice,
  UpdateDevice,
} from "@/api/dipApi";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
interface StopsForm {
  Barcode: Array<Barcode>;
  WorkStationName: string;
  result: string;
  ResourceName: string;
  EmployeeName: string;
}
interface Barcode {
  Barcode: string;
  Status: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const inputRef = ref();
const stopsForm = ref<StopsForm>({
  Barcode: [],
  result: "OK",
  WorkStationName: opui.station,
  ResourceName: opui.station !== null ? opui.station : "",
  EmployeeName: userStore.getUserInfo || "",
});
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const form = reactive<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
});
const editForm = ref({
  order: "1213434",
  models: "3A4621-01C",
  productCode: "24010606000131",
  productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
  // orderNum: '100',
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
const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "工单号",
    value: "order",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "机型",
    value: "models",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "productCode",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "productDes",
    disabled: true,
    type: "textarea",
    width: 300,
  },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "eqty",
    label: "MES屏条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "eqName",
    label: "CG/TP条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "zcnumber",
    label: "LCM条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "扫描时间",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "扫描人",
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
const badForm = ref({
  badCode: "",
  badCodeDec: "",
  backProcess: "",
  remark: "",
});
//不良信息table
const BadtableData = ref([
  {
    badCode: "E208711",
    badCodeDec: "切料刀缺口",
    backProcess: "总成外观",
    remark: "Test",
  },
  {
    badCode: "E208711",
    badCodeDec: "切料刀缺口",
    backProcess: "总成外观",
    remark: "测试",
  },
]);
const list = ref([
  {
    key: "切料刀缺口",
    value: "E208711",
  },
  {
    key: "划痕",
    value: "E208715",
  },
]);
const msgTitle = ref("");
//过序设置
const overVisible = ref(false);
//过序table
// const overTableData = ref([]);
//
const addOverRef = ref();
// const editOverRef = ref();
//过序添加
const overAddVisible = ref(false);
//过序编辑
// const overEditVisible = ref(false);
//过序添加form
const overAddForm = ref({
  ID: "",
  Line: opui.line,
  WorkStation: opui.station,
  LineDec: opui.lineDec,
  WorkStationDec: opui.stationDec,
  NextWorkStation: "",
  NextDevice: "",
  InDeviceLength: 0,
  InDeviceSpeed: 0,
  OutDeviceLength: 0,
  OutDeviceSpeed: 0,
  UpdataDate: "2024-08-09T02:15:38.582Z",
  UpdateBy: userStore.getUserInfo || "",
});
//过序formHeader
const overHeader = reactive([
  {
    label: "产线",
    value: "LineDec",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工位",
    value: "WorkStationDec",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "进炉距离(cm)",
    value: "InDeviceLength",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
  {
    label: "进炉轨道速度(s/cm)",
    value: "InDeviceSpeed",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
  {
    label: "炉子宽度(cm)",
    value: "OutDeviceLength",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
  {
    label: "炉子轨道速度(s/cm)",
    value: "OutDeviceSpeed",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
]);

const openOver = () => {
  overAddVisible.value = true;
  getOverData();
};
//获取过序
const getOverData = () => {
  FindAllDevice({ WorkStation: opui.station }).then((res: any) => {
    if (res.success) {
      let data = JSON.parse(res.content);
      overAddForm.value.InDeviceLength = data[0].InDeviceLength;
      overAddForm.value.InDeviceSpeed = data[0].InDeviceSpeed;
      overAddForm.value.OutDeviceLength = data[0].OutDeviceLength;
      overAddForm.value.OutDeviceSpeed = data[0].OutDeviceSpeed;
    } else {
      ElNotification({
        title: res.msg,
        type: "error",
      });
    }
  });
};

//取消添加
const addOverCancel = () => {
  overAddVisible.value = false;
  addOverRef.value.cleanForm();
};
//确定添加
const addOveronSubmit = () => {
  UpdateDevice(overAddForm.value).then((res: any) => {
    if (res.success) {
      getOverData();
      ElNotification({
        title: "更新成功",
        type: "success",
      });
      overAddVisible.value = false;
    } else {
      ElNotification({
        title: res.msg,
        type: "error",
      });
    }
  });
};
const selectTable = ref();
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
  // { label: "工单号", width: "", prop: "MfgOrderName" },
  // { label: "产品编码", width: "", prop: "ProductName" }
]);
const feedVisible = ref(false);
const feedForm=ref({
  order:'208310182',
  type:'3A4621-01C',
  productCode:'240106000131',
  productDes:'0402封装贴片电容100DF+5%50V MURATAGRM1555C1H101JA01D',
  orderNum:'100',
  eqInfo:'自动烧录机'
})

const FeedHeader=reactive([
    {
        label:'工单号',
        prop:'order'
    },
    {
        label:'机型',
        prop:'type'
    },
    {
        label:'产品编码',
        prop:'productCode'
    },
    {
        label:'产品描述',
        prop:'productDes'
    },
    {
        label:'工单数量',
        prop:'orderNum'
    },
    {
        label:'机台',
        prop:'eqInfo'
    }
])

const change = (val: any) => {
  // console.log(val);
  // orderTable.value.forEach((v: any) => {
  //     if (v.MfgOrderName == val) {
  //        form.MfgOrderName=v.MfgOrderName
  //        form.ProductName=v.ProductName
  //        form.ProductDesc=v.ProductDesc
  //        form.PlannedStartDate=v.PlannedStartDate
  //        form.PlannedCompletionDate=v.PlannedCompletionDate
  //        form.Qty=v.Qty
  //     }
  // });
  // inputRef.value.focus();
};

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getOrderData = () => {
  QueryWorkOrderInfo().then((res: any) => {
    let data = JSON.parse(res.content);
    orderTable.value.data[0] = data[0];
  });
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};
const radioChange = (args: any) => {
  // console.log(args);
  orderTable.value.data.forEach((v: any) => {
    if (v.MfgOrderName == args[1]) {
      form.MfgOrderName = v.MfgOrderName;
      form.ProductName = v.ProductName;
      form.ProductDesc = v.ProductDesc;
      form.PlannedStartDate = v.PlannedStartDate;
      form.PlannedCompletionDate = v.PlannedCompletionDate;
      form.Qty = v.Qty;
    }
  });
  inputRef.value.focus();
};

//打开物料上料
const openFeed = () => {
  feedVisible.value = true;
};
//关闭物料上料
const feedCancel = () => {
  feedVisible.value = false;
};

//打开不良登记
const openDialog = () => {
  editVisible.value = true;
};

//关闭不良登记
const editCancel = () => {
  BadtableData.value = [];
  // console.log(BadtableData.value);
  editVisible.value = false;
};
//提交不良信息
const editSubmit = () => {
  // console.log(BadtableData.value);
  editVisible.value = false;
};
//删除不良信息
const deleteBad = (data: any) => {
  BadtableData.value = BadtableData.value.filter((v: any) => {
    return data[0].badCode != v.badCode;
  });
};
//打开不良登记
const openAddBad = () => {
  badVisible.value = true;
};
//增加不良信息
const addBadData = (data: any) => {
  BadtableData.value.push(data);
  // console.log(data);
};

//关闭过序
const overCancel = () => {
  overVisible.value = false;
};
//过站
const getChange = (val: any) => {
  if (form.MfgOrderName.trim() == "") {
    ElNotification({
      title: "请选择工单",
      type: "error",
    });
    barCode.value = "";
    return;
  }
  let data = {
    Barcode: barCode.value,
    Status: "0",
  };
  stopsForm.value.Barcode.push(data);
  DIPStationMoveOut(stopsForm.value).then((res: any) => {
    if (res.succes) {
      msgTitle.value = "成功";
      barCode.value = "";
      inputRef.value.focus();
      if (stopsForm.value.Barcode.length == 2) {
        stopsForm.value.Barcode = [];
        msgTitle.value = "";
      }
    } else {
      inputRef.value.select();
      stopsForm.value.Barcode = stopsForm.value.Barcode.filter(
        (b: any) => b.Barcode != barCode.value
      );
      msgTitle.value = res.msg;
      // console.log(stopsForm.value)
    }
  });
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
    tableHeight.value = window.innerHeight - 373.5;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 320px;
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
</style>
