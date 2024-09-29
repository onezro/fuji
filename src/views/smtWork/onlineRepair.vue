<template>
  <div class="flex flex-col w-full h-full">
    <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
    </div>
    <div class="w-full flex-1 flex">
      <!-- <div class="w-[calc(100%-350px)]"> -->

      <div class="w-full h-full flex flex-col">
        <div>
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5"> 扫描条码</span>
          </div>
          <div class="h-[120px] p-5">
            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
              @submit.native.prevent>
              <el-form-item label="扫描条码">
                <el-input v-model.trim="form.PcbNumber" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                  placeholder="请扫描条码" @keyup.enter.native="getChange" />
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" disabled @click="">维修</el-button>
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
        <div class="flex flex-col flex-1">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">维修记录</span>
          </div>
          <div class="flex-1">
            <table-tem :showIndex="true" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="badVisible" title="返修">
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div class="">
          <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
            条码信息
          </div>
        </div>
        <div>
          <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>

        </div>

        <div>
          <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
            不良列表
          </div>
          
        </div>
        <div>
          <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
            返修工序
          </div>
        </div>
      </div>
      <template #footer>
        <!-- <span class="dialog-footer">
                  <el-button @click="show = false">取消</el-button>
                  <el-button type="primary" @click="show = false"> 确定 </el-button>
              </span> -->
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  QueryCarrierList,
  SubmitPcbToPacking,
  TrunkDeal,
  QueryPackListByCarrier,
} from "@/api/smtApi";
import tableTem from "@/components/tableTem/index.vue";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
interface Turn {
  CARRIERNAME: string;
  LOADTYPE: string;
  CAPACITY: number;
  QTY: number;
}
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const form = ref({
  PcbNumber: "",
  SpecName: "SMT-BOX",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const msgTitle = ref("");
const msgType = ref(true);
const tableData = ref([]);
const tableHeight = ref(0);
const columnData = reactive([
  {
    text: true,
    prop: "CarrierName",
    label: "周转箱条码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "OrderNumber",
    label: "工单号",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "PCBSerialNumber",
    label: "小板条码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PanelSerialNumber",
    label: "大板条码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductDescription",
    label: "产品描述",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "LoadTimestamp",
    label: "装箱时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "LoadOperatorID",
    label: "装箱人",
    width: "",
    min: true,
    align: "center",
  },
]);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
  // isShow:-1
});
const turnData = ref<Turn[]>([]);
const boxHeight = ref(0);
const inputFocus = ref(true);
const isLoding = ref("");
const badVisible = ref(false);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getChange = () => {
  badVisible.value = true;
  // inputFocus.value = false;
  // SubmitPcbToPacking(form.value).then((res: any) => {
  //   msgTitle.value = res.msg;
  //   msgType.value = res.success;
  //   form.value.PcbNumber = "";
  //   if (res.success) {
  //     tableData.value = res.content;
  //     msgTitle.value = res.msg + "周转箱列表已更新";
  //   } else {
  //     tableData.value = [];
  //   }
  //   inputFocus.value = true;
  // });
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
    boxHeight.value = window.innerHeight - 155;
    tableHeight.value = window.innerHeight - 360;
  });
};
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 350px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.list .el-table__empty-text {
  display: none;
}
</style>
