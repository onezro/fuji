<template>
  <div class="flex flex-col w-full h-full">
    <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div></div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[370px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item label="生产计划号" class="mb-[5px] flex">
                <selectTa ref="selectTable" :table="orderTable" :selectWidth="200" :columns="orderColumns"
                  :max-height="400" :tableWidth="700" :defaultSelectVal="defaultSelectVal" :keywords="{
                    label: 'MfgOrderName',
                    value: 'MfgOrderName',
                  }" @radioChange="(...args: any) => radioChange(args)">
                </selectTa>
                <el-tooltip content="刷新" placement="top">
                  <el-icon class="ml-2" color="#006487" :class="isLoding" size="24" @click="getOrderData">
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-370px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[160px] pt-3 pr-5 pl-5 flex justify-between">
              <div>
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                  @submit.native.prevent>
                  <el-form-item label="扫描条码">
                    <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                      placeholder="请扫描条码" @keyup.enter.native="getChange" />
                  </el-form-item>
                  <div></div>
                </el-form>
                <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                  {{ msgTitle === "" ? "请扫描屏材料批次条码" : msgTitle }}
                </div>
                <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                  {{ msgTitle }}
                </div>
              </div>
              <div>
                <el-table :data="barData" size="small" border :row-class-name="tableRowClassName" :height="'100%'">
                  <el-table-column type="index" align="center" fixed label="序号" :width="'60'"></el-table-column>
                  <el-table-column prop="MaterialName" label="物料编码" width="120" />
                  <el-table-column prop="QtyRequired" label="是否关键料" width="80"  align="center">
                    <template #default="scope">
                      <el-tag   effect="plain" :type=" scope.row.IssueControl == 1?'warning':'primary'">{{ scope.row.IssueControl == 1?'是':'否' }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="LoadQueueQty" label="上料总数" width="80" align="center">
                    <template #default="scope">
                      {{scope.row.LoadQueueQty==null?0:scope.row.LoadQueueQty  }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="QtyRequired" label="剩余数量" width="80" align="center">
                    <template  #default="scope">
                      <span>{{ scope.row.LoadQueueQty- scope.row.issueqty}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="MaterialBarCode" label="物料编码" width="150">
                    <template #default="scope">
                      <el-input v-if="scope.row.IssueControl==1" v-model="scope.row.MaterialBarCode" size="small" :ref="createInputRef(scope.$index)"
                        @keyup.enter.native="getChange1(scope.$index,scope.row)">
                      </el-input>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="address" label="Address" /> -->
                </el-table>
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">历史过站记录</span>
              <div class="mr-5">
                <el-checkbox-group v-model="checkedHis" class="laser-table-filter">
                   <el-checkbox v-for="c in checkedHisList" :label="`${c.label}(${changeDataLength(c.value)})`" :value="c.value"
                    @change="changeHis(c.value)">
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <table-tem :showIndex="true" :tableData="changeData" :tableHeight="tableHeight" :columnData="columnData1"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>
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

import {
  OrderQuery,
  QueryMoveHistory,
  QueryKeyMaterial,
  JudgeKeyMaterial,
  CoverSMTCompBindMoveStd,
} from "@/api/asyApi";

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
  // result: string;
  userAccount: string;
  txnDate: string;
  // Container: string;
  OrderName: string;
  tools: string;
  BarCode: string;
  keyMaterialList: Array<KeyMaterial>;
}
interface KeyMaterial {
  MaterialBarCode: string;
  MaterialName: string;
  MfgOrderName:string;
  QtyRequired:number;
  IssueControl:number
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
const inputFocus = ref(false);
const barCode = ref("");
const stopsForm = ref<StopsForm>({
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  BarCode: "",
  OrderName: "",
  keyMaterialList: [],
  tools: "",
  txnDate: "",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  AllNum: "",
  TodayNum: "",
  ERPOrder:"",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  // {
  //     label: "生产计划号",
  //     value: "MfgOrderName",
  //     disabled: true,
  //     type: "input",
  //     width: "",
  // },

  {
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工单号",
    value: "ERPOrder",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划数量",
    value: "Qty",
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
  // {
  //   label: "过站总数",
  //   value: "AllNum",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // },
  // {
  //   label: "实时过站",
  //   value: "TodayNum",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // }
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
  pageSize: 100,
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
  { label: "生产计划号", width: "", prop: "MfgOrderName" },
  { label: "产品编码", width: "", prop: "ProductName" },
  { label: "产线", width: "", prop: "MfgLineDesc" },
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);
const defaultSelectVal = ref<string[]>([]);
const isLoding = ref("");
const barData = ref<KeyMaterial[]>([
 
]);
const keyForm = ref({
  BarCode: "",
  OrderName: "",
  ProductName: "",
  workstationName: opui.station,
  tools: "",
  userAccount: "",
  txnDate: "",
});
const isKeyForm = ref({
  BarCode: "",
  OrderName: "",
  ProductName: "",
  workstationName: opui.station,
  tools: "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
});
const materialRef = ref();
const inputRefs = ref<any[]>([]);
  const checkedHis = ref(["today"]);
const checkedHisList = ref([
  {
    value: "today",
    label: "当日过序",
  },
  {
    value: "all",
    label: "工序汇总",
  },
]);
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
  // getFocus();

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
const changeHis = (val: any) => {
  if (checkedHis.value.length == 0) {
    checkedHis.value = [];
  } else {
    checkedHis.value = [];
    checkedHis.value[0] = val;
  }
};
const changeData = computed(() => {
  if (checkedHis.value[0] == "today") {
    return geTodayData()
  } else {
    return tableData1.value;
  }
});
const changeDataLength =(val: any) => {
  if (val == "today") {
    let dataLength=geTodayData()
    return dataLength.length
  } else {
     return tableData1.value.length
  }
}
const geTodayData = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  function getDateFromDateTimeString(dateTimeString: any) {
    return dateTimeString.split(" ")[0];
  }
  const todayDataArray = tableData1.value.filter((item: any) => {
    return getDateFromDateTimeString(item.TxnDate) === todayString;
  });
  return todayDataArray
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;
  // stopsForm.value.Container = barCodeData;
  if (stopsForm.value.OrderName == "") {
    msgTitle.value = "请先选择生产计划号";
    msgType.value = false;
  } else {
    msgTitle.value = "";
    msgType.value = true;
     // isKeyForm.value.BarCode = barCodeData;
     if (stopsForm.value.keyMaterialList.length !== 0 || barData.value.length !== 0) {
      stopsForm.value.BarCode = barCodeData;
      CoverSMTCompBindMoveStd(stopsForm.value).then((res: any) => {
        msgTitle.value = res.msg;
        msgType.value = res.success;
        stopsForm.value.keyMaterialList = [];
        stopsForm.value.BarCode = "";
        barCode.value = "";
        getHisData()
        getKeyMaterial();
      });
    } else {
      barCode.value = "";
      msgTitle.value = `请扫描关键料或关键为空`
      msgType.value = false
    }
    // }
    // JudgeKeyMaterial(isKeyForm.value).then((res: any) => {
    //   msgTitle.value = res.msg;
    //   msgType.value = res.success;
    //   if (res.success) {
    // const findKeyMaterial = barData.value.find(
    //   (x: any) => x.MaterialBarCode === barCodeData
    // );
    // if (findKeyMaterial !== undefined) {
    //   stopsForm.value.keyMaterialList.push({
    //     MaterialBarCode: findKeyMaterial.MaterialBarCode,
    //     MaterialName: findKeyMaterial.MaterialName,
    //   });
    // }
    //   }
    // });
  }

  // barCode.value = "";
  // getFocus();
 
};

const createInputRef = (val: any) => {
  return (el: any) => {
    if (el) {
      inputRefs.value[val] = el;
      // console.log(val);
      
    }
  };
};
const getChange1 = (val: any,data:any) => {
  if(data.LoadQueueQty-data.issueqty==0){
    msgTitle.value = `关键料剩余为0无法进行绑定`
    msgType.value = false;
    inputRefs.value[val].clear();
    return
  }else{
    let data1 = {
    BarCode: data.MaterialBarCode,
    OrderName: data.MfgOrderName,
    ProductName: data.MaterialName,
    workstationName: opui.station,
  };
  JudgeKeyMaterial(data1).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    if (res.success) {
      if (val + 1 < inputRefs.value.length) {
        inputRefs.value[val + 1].focus();
      } else {
        inputRef.value.focus();
      }
      stopsForm.value.keyMaterialList.push({
        ...data,
        VirtualCode:res.content==null?"":res.content
      });
    } else {
      inputRefs.value[val].clear();
    }
  });
  }
  
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
    form.value.ERPOrder = "";
  } else {
    form.value.MfgOrderName = args[0].MfgOrderName;
    form.value.ProductName = args[0].ProductName;
    form.value.ProductDesc = args[0].ProductDesc;
    form.value.BD_ProductModel = args[0].BD_ProductModel;
    form.value.BD_SoftVersion = args[0].BD_SoftVersion;
    form.value.PlannedStartDate = args[0].PlannedStartDate;
    form.value.PlannedCompletionDate = args[0].PlannedCompletionDate;
    form.value.Qty = args[0].Qty;
    form.value.AllNum = args[0].AllNum;
    form.value.TodayNum = args[0].TodayNum;
    form.value.ERPOrder = args[0].ERPOrder;
    stopsForm.value.OrderName = args[0].MfgOrderName;
    hisForm.value.MfgOrderName = args[0].MfgOrderName;
    isKeyForm.value.OrderName = args[0].MfgOrderName;
    keyForm.value.OrderName = args[0].MfgOrderName;
    keyForm.value.ProductName = args[0].ProductName;
    // nextTick(() => {
    //   if (inputRefs.value.length > 0) {
    //     inputRefs.value[0].focus();
    //   }
    // });
    // getFocus();
    getKeyMaterial();
    getHisData();
  }
};
const getKeyMaterial = () => {
  barData.value=[]
  QueryKeyMaterial(keyForm.value).then((res: any) => {
    // let data: KeyMaterial[]=[]
    // res.content.forEach((c:any)=>{
    //   if(c.QtyRequired==1){
    //     data.push(c)
    //   }else{
    //     for (let i = 0; i < c.QtyRequired; i++) {  
    //       data.push({
    //         MfgOrderName: c.MfgOrderName,
    //         QtyRequired: 1,
    //         MaterialName: c.MaterialName,
    //         MaterialBarCode: ""
    //       });  
    // }  
    //   }
    // })
    // barData.value = data;
    barData.value =res.content
    barData.value.sort((a, b) => a.IssueControl - b.IssueControl);
    nextTick(() => {
      if (inputRefs.value.length > 0) {
        inputRefs.value[0].focus();
      }
    });
  });
};
const tableRowClassName = (val: any) => {
  // console.log(val.row);
  const isExitCode = stopsForm.value.keyMaterialList.findIndex(
    (k: any) => val.row.MaterialBarCode == k.MaterialBarCode
  );
  if (isExitCode !== -1) {
    return "active-table";
  }
  return "";
};
const getOrderData = () => {
  isLoding.value = "is-loading";
  OrderQuery({ lineName: opui.line, OrderTypeName: "Assembly",WorkStationName:opui.station  }).then(
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
// const reWash = () => {
//   let data = cloneDeep(tableData1.value[0]);
//   let reWashForm = {
//     Container: data.Container,
//     OrderName: form.value.MfgOrderName,
//     ProductName: data.ProductName,
//     workstationName: opui.station,
//     tools: "",
//     userAccount: userStore.getUserInfo,
//   };
//   ReloadCleanCode(reWashForm).then((res: any) => {
//     msgTitle.value = res.msg;
//     msgType.value = res.success;
//     if (res.success) {
//       getHisData();
//     }
//   });
// };

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
    tableHeight.value = window.innerHeight - 400;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 370px;
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

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .active-table {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
<style lang="scss" scoped>
::v-deep .laser-table-filter .el-checkbox__inner {
  /* 你的样式 */
  background-color: #409eff !important;
  /* 使用 !important，但请谨慎 */
  color: white !important;
}

::v-deep .laser-table-filter .el-checkbox__label {
  /* 你的样式 */
  color: white !important;
  font-size: 1.1rem;
}
</style>