<template>
  <div class="flex flex-col w-full h-full">
    <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div>
        <el-button type="warning" @click="opendetail">上料明细</el-button>
        <el-button type="primary" @click="openOver">波峰焊设置</el-button>
      </div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">工装治具</span>
          </div>
          <div class="p-3 overflow-auto" :style="{ height: leftBoxH + 'px' }">
            <el-checkbox-group v-model="checked">
              <el-card shadow="always" class="mb-2" :body-style="{ padding: '8px' }" v-for="t in toolList"
                :key="t.ToolName">
                <el-form ref="formRef" :model="t" label-width="auto">
                  <!-- <el-form-item class="mb-[5px]"> -->
                  <div class="flex justify-between items-center">
                    <div class="checked">
                      <el-checkbox :value="t.ToolName" @change="changeCheck(t.ToolName)" />
                    </div>
                    <el-tooltip effect="dark" content="上移" placement="top-start">
                      <el-button icon="Top" circle :disabled="t.sort == 1" @click="moveUp(t)" />
                    </el-tooltip>
                  </div>
                  <!-- </el-form-item> -->
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="类型" class="mb-[5px]">
                        <span>{{ t.MaterialName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="序号" class="mb-[5px]">
                        <el-tag type="warning" class="pl-3 pr-3 text-sm" effect="dark"
                          v-if="t.ToolName == checked[0]">{{ t.sort }}</el-tag>
                        <el-tag type="primary" class="pl-3 pr-3" v-if="t.ToolName !== checked[0]">{{ t.sort }}</el-tag>
                        <!-- <span class="text-base">{{ t.sort }}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-form-item label="治具编码" class="mb-[5px]">
                    <span>{{ t.ToolName }}</span>
                  </el-form-item>

                  <!-- <el-row :gutter="20">
                    
                    <el-col :span="12">
                      <el-form-item label="类型编号" class="mb-[5px]">
                        <span class="text-base">{{ t.CompName }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row> -->
                </el-form>
                <div class="flex justify-end">
                  <!-- <el-tooltip
                    effect="dark"
                    content="上移"
                    placement="top-start"
                  >
                    <el-button
                      icon="Top"
                      circle
                      :disabled="t.sort == 1"
                      @click="moveUp(t)"
                    />
                  </el-tooltip> -->

                  <!-- <el-icon :size="20" @click="moveUp(t)"><Top /></el-icon> -->
                  <!-- <el-button type="primary" :disabled="t.sort==1" @click="moveUp(t)">上移</el-button> -->
                </div>
              </el-card>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[100px] pt-3 pr-5 pl-5">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                @submit.native.prevent>
                <el-form-item label="扫描条码">
                  <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                    placeholder="请扫描条码" @keyup.enter.native="getChange" />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描PCB条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
              </div>
            </div>
          </div>
          <div class="p-2">
            <el-form class="inbound" size="default" ref="formRef" :model="form" :inline="true" label-width="auto">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="工单" class="mb-[5px] flex">
                    <selectTa ref="selectTable" :table="orderTable" :selectWidth="160" :columns="orderColumns"
                      :max-height="400" :tableWidth="700" :defaultSelectVal="defaultSelectVal" :keywords="{
                        label: 'MfgOrderName',
                        value: 'MfgOrderName',
                      }" @radioChange="(...args: any) => radioChange(args)">
                    </selectTa>
                    <el-tooltip content="刷新" placement="top">
                      <el-icon class="ml-2" color="#777777" :class="isLoding" size="24" @click="getOrderData">
                        <RefreshRight />
                      </el-icon>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="mb-[5px]" label="产品编码">
                    <el-input v-model="form.ProductName" style="width: 160px" disabled /> </el-form-item></el-col>
                <el-col :span="10">
                  <el-form-item class="mb-[5px]" label="产品描述">
                    <el-input v-model="form.ProductDesc" style="width: 320px" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item class="mb-[5px]" label="计划开始时间">
                    <el-input v-model="form.PlannedStartDate" style="width: 160px" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="mb-[5px]" label="计划完成时间">
                    <el-input v-model="form.PlannedCompletionDate" style="width: 160px" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item class="mb-[5px]" label="工单数量">
                    <el-input v-model="form.Qty" style="width: 160px" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">历史过站记录</span>
            </div>
            <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight" :columnData="columnData1"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem> 
            <!-- <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs" @tab-click="tabClick">
              <el-tab-pane label="历史过站记录" name="history">
                <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                  :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"></table-tem>
              </el-tab-pane>
              <el-tab-pane label="物料上料明细" name="details">
                <table-tem :showIndex="true" :tableData="detailsData" :tableHeight="tableHeight"
                  :columnData="detailsColumn" :pageObj="detailsPageObj" @handleSizeChange="detailsSizeChange"
                  @handleCurrentChange="detailsCurrentChange"></table-tem>
              </el-tab-pane>
            </el-tabs> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <badInfoTem
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
    /> -->
    <formTem ref="addOverRef" :width="'400px'" :visible="overAddVisible" :title="'波峰焊过序设置'" :form="overAddForm"
      :formHeader="overHeader" @formCancel="addOverCancel" @onSubmit="addOveronSubmit"></formTem>
    <!-- <el-dialog
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
      <feedTemp :form="feedForm" :form-header="FeedHeader" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedCancel">关闭</el-button>
        </span>
      </template>
</el-dialog> -->
    <el-dialog
      v-model="detailVisible"
      title="上料明细"
      width="70%"
      align-center
      draggable
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <table-tem :showIndex="true" size="small" :tableData="detailsData" :tableHeight="400"
                  :columnData="detailsColumn" :pageObj="detailsPageObj" @handleSizeChange="detailsSizeChange"
                  @handleCurrentChange="detailsCurrentChange"></table-tem>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible=false">关闭</el-button>
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
  OrderQuery,
  PluginStationMoveOut,
  FindAllDevice,
  UpdateDevice,
  QueryMoveHistory,
  QueryOrderMaterialRequired
} from "@/api/dipApi";
import { QueryToolInfo, SortTools } from "@/api/operate";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { CollectionTag } from "@element-plus/icons-vue";
interface StopsForm {
  tools: string;
  ContainerName: string;
  OrderNumber: string;
  workstationName: string;
  userAccount: string;
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
  tools: "",
  ContainerName: "",
  OrderNumber: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
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
    prop: "ContainerName",
    label: "PCB条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "BD_Tools",
    label: "工装治具",
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
const msgType = ref(true);
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
const toolList = ref<ToolList[]>([]);
const getToolForm = ref({
  ToolName: "",
  OrderNumber: "",
  OperateType: "",
  CompName: "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const defaultSelectVal = ref<string[]>([]);
const checked = ref<string[]>([]);
const leftBoxH = ref(0);
const detailsData = ref([])
const detailsPageObj = ref({
  pageSize: 10,
  currentPage: 1,
})

const detailsColumn = ref([
  {
    text: true,
    prop: "MaterialName",
    label: "物料编码",
    width: "",
    align: "1",
    min:true
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "250",
    min:true,
    align: "1",
  },
  {
    text: true,
    prop: "QtyRequired",
    label: "单量用量",
    width: "",
    min:true,
    align: "1",
  },
  {
    text: true,
    prop: "LoadQueueQty",
    label: "上料数量",
    width: "",
    min:true,
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "已使用数量",
    width: "",
    min:true,
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "剩余数量",
    width: "",
    min:true,
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "最后上料时间",
    width: "",
    min:true,
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "最后上料人",
    width: "",
    min:true,
    align: "1",
  },
])
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station
})
const detailVisible=ref(false)
const getFeedForm=ref({
  MfgOrder: '',
		workstationName: opui.station,
		SpecName: "DIP-PlugIn",
})

const changeCheck = (val: any) => {
  // console.log(val, checked.value);
  if (checked.value.length == 0) {
    checked.value = [];
    stopsForm.value.tools = "";
  } else {
    checked.value = [];
    checked.value[0] = val;
    stopsForm.value.tools = val;
  }
};
const openOver = () => {
  overAddVisible.value = true;
  getOverData();
};
const opendetail=()=>{
  detailVisible.value=true
  QueryOrderMaterialRequired(getFeedForm.value).then((res:any)=>{
    detailsData.value=res.content
  })
}
//获取过序
const getOverData = () => {
  FindAllDevice({ WorkStation: opui.station }).then((res: any) => {
    if (res.success) {
      let data = res.content;
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
const feedForm = ref({
  order: "208310182",
  type: "3A4621-01C",
  productCode: "240106000131",
  productDes: "0402封装贴片电容100DF+5%50V MURATAGRM1555C1H101JA01D",
  orderNum: "100",
  eqInfo: "自动烧录机",
});

const FeedHeader = reactive([
  {
    label: "工单号",
    prop: "order",
  },
  {
    label: "机型",
    prop: "type",
  },
  {
    label: "产品编码",
    prop: "productCode",
  },
  {
    label: "产品描述",
    prop: "productDes",
  },
  {
    label: "工单数量",
    prop: "orderNum",
  },
  {
    label: "机台",
    prop: "eqInfo",
  },
]);
const isLoding = ref("");
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
  isLoding.value = "is-loading";
  OrderQuery({ lineName: opui.line, OrderTypeName: 'DIP' }).then((res: any) => {
    let data = res.content;
    orderTable.value.data[0] = data[0];
    let timer = setTimeout(() => {
      isLoding.value = "";
      clearTimeout(timer);
    }, 2000);
    if (data.length == 1) {
      // console.log(2111);
      let a = data[0].MfgOrderName;
      defaultSelectVal.value[0] = a;
    }
   
  });
};
//历史过站记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content
  })
}


//治具上移
const moveUp = (val: any) => {
  let data = {
    ToolName: val.ToolName,
    OrderNumber: "",
    OperateType: "",
    CompName: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
  };
  SortTools(data).then((res: any) => {
    getToolData();
  });
};
//获取治具
const getToolData = () => {
  QueryToolInfo(getToolForm.value).then((res: any) => {
    if (res.content == null || res.content.length == 0) {
      toolList.value = [];
      return;
    }
    toolList.value = res.content;
    stopsForm.value.tools = res.content[0].ToolName;
    checked.value[0] = res.content[0].ToolName;
  });
};
//获取光标
const getFocus = () => {
  inputFocus.value = false;
  setTimeout(() => {
    inputFocus.value = true;
  }, 100);
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};
const radioChange = (args: any) => {
  if (args[1] == null) {
    form.MfgOrderName = "";
    form.ProductName = "";
    form.ProductDesc = "";
    form.PlannedStartDate = "";
    form.BD_ProductModel = "";
    form.BD_SoftVersion = "";
    form.PlannedCompletionDate = "";
    form.Qty = "";
  } else {
    // orderTable.value.data.forEach((v: any) => {
    //   if (v.MfgOrderName == args[1]) {
    form.MfgOrderName = args[0].MfgOrderName;
    form.ProductName = args[0].ProductName;
    form.ProductDesc = args[0].ProductDesc;
    form.BD_ProductModel = args[0].BD_ProductModel;
    form.BD_SoftVersion = args[0].BD_SoftVersion;
    form.PlannedStartDate = args[0].PlannedStartDate;
    form.PlannedCompletionDate = args[0].PlannedCompletionDate;
    form.Qty = args[0].Qty;
    hisForm.value.MfgOrderName=args[0].MfgOrderName
    // console.log(args[0].MfgOrderName);
    getFeedForm.value.MfgOrder=args[0].MfgOrderName
  
    if (getToolForm.value.OrderNumber == args[0].MfgOrderName) {
      return;
    } else {
      getToolForm.value.OrderNumber = args[0].MfgOrderName; //'24072350'
      getHisData()
      getToolData();
    }
    
  }
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
const tabClick = (pane: any) => {
  console.log(pane.props.name);
};
//过站
const getChange = (val: any) => {
  if (form.MfgOrderName.trim() == "") {
    ElNotification({
      title: "请选择工单",
      type: "error",
    });
    // stopsForm.value.ContainerName = "";
    return;
  }
  let barCodeVal = barCode.value;
  if (toolList.value.length != 0) {
    let toolData = toolList.value.findIndex(
      (t: any) => t.ToolName == barCode.value
    );
    if (toolData != -1) {
      // moveUp(toolList.value[toolData])
      stopsForm.value.tools = toolList.value[toolData].ToolName;
      checked.value[0] = toolList.value[toolData].ToolName;
      barCode.value = "";
      return;
    } else {
      // stopsForm.value.ContainerName = barCodeVal;
      // PluginStationMoveOut(stopsForm.value).then((res: any) => {
      //   msgTitle.value = res.msg;
      //   msgType.value = res.success;
      //   stopsForm.value.ContainerName = "";
      //   barCode.value = "";
      //   getToolData();
      //   getFocus();
      // });
    }
  }
  stopsForm.value.ContainerName = barCodeVal;
  PluginStationMoveOut(stopsForm.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    stopsForm.value.ContainerName = "";
    barCode.value = "";
    getToolData();
    getHisData()
    getFocus();
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
const detailsSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const detailsCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    leftBoxH.value = window.innerHeight - 155;
    tableHeight.value = window.innerHeight - 428; //428
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
  --el-tabs-header-height: 35px;
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 0px;
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
