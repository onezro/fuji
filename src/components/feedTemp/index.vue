<template>
  <div class="w-full flex box">
    <div class="setwidth box-border w-[320px]">
      <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
        <span class="ml-5">基本信息</span>
      </div>
      <el-form ref="formRef" :model="form" label-width="auto" class="p-2">
        <div v-for="f in formHeader" :key="f.prop">
          <el-form-item
            :label="f.label"
            :prop="f.prop"
            :class="[f.prop == 'eqInfo' ? 'mb-2' : '']"
          >
            <span class="font-bold text-[1rem] text-wrap break-all">{{
              form[f.prop]
            }}</span>
          </el-form-item>
          <el-divider class="mb-2 mt-2" v-if="f.prop == 'eqInfo'" />
        </div>
      </el-form>
    </div>
    <div class="w-[calc(100%-320px)] min-w-[600px]">
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
              :model="formData"
              label-width="auto"
              @submit.native.prevent
            >
              <el-form-item label="扫描条码">
                <el-input
                  v-model="formData.Container"
                  ref="inputRef"
                  style="width: 500px"
                  placeholder="请扫描条码"
                  @keyup.enter.native="getChange"
                />
              </el-form-item>
            </el-form>
            <div
              class="text-xl font-bold text-[#00B400]"
              v-show="msgType === true || msgTitle === ''"
            >
              {{ msgTitle === "" ? "请扫描PCB条码" : msgTitle }}
            </div>
            <div
              class="text-xl font-bold text-[red]"
              v-show="msgType === false && msgTitle !== ''"
            >
              {{ msgTitle }}
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">工单物料需求清单</span>
          </div>
          <div class="flex-1" ref="tablebox">
            <table-tem
              :showIndex="true"
              :tableData="tableData"
              :tableHeight="300"
              :columnData="columnData"
              :pageObj="pageObj"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></table-tem>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="detailVisible"
      title="物料上料明细"
      width="75%"
      align-center
      @close="detailVisible = false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="box">
        <div
          class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
        >
          <span class="ml-5">基本信息</span>
        </div>
        <el-form
          class="pt-2 pl-2"
          ref="formRef"
          :inline="true"
          :model="detailForm"
          label-width="auto"
        >
          <el-form-item class="mb-2" label="工单号" prop="order">
            <el-input v-model="detailForm.order" disabled
          /></el-form-item>
          <el-form-item class="mb-2" label="需求量" prop="order">
            <el-input v-model="detailForm.requirement" disabled
          /></el-form-item>
          <el-form-item class="mb-2" label="上料总量" prop="order">
            <el-input v-model="detailForm.totalFeed" disabled
          /></el-form-item>
          <el-form-item class="mb-2" label="物料编码" prop="order">
            <el-input v-model="detailForm.materialCode" disabled
          /></el-form-item>
          <el-form-item class="mb-2" label="物料描述" prop="order">
            <el-input v-model="detailForm.materialDes" disabled
          /></el-form-item>
        </el-form>

        <div>
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">物料批次明细</span>
          </div>
          <div class="m-2">
            <el-button
              type="primary"
              :disabled="BlankList.length == 0"
              @click="batchBlank"
              >批量下料</el-button
            >
          </div>
          <table-tem
            :showIndex="false"
            :showSelect="true"
            ref="feedRef"
            :tableData="detailtableData"
            :tableHeight="300"
            :columnData="detailcolumnData"
            :pageObj="detailpageObj"
            @handleSizeChange="handleSizeChange1"
            @handleSelectionChange="handleSelectionChange"
            @handleCurrentChange="handleCurrentChange1"
          ></table-tem>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  LoadMaterialQueue,
  UnLoadMaterialQueue,
  QueryMaterialQueueDetails,
} from "@/api/smtApi";
import tableTem from "@/components/tableTem/index.vue";
import {  toRefs, computed, ref, reactive } from "vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { cloneDeep } from "lodash-es";
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const props = defineProps(["form", "formHeader", "specName"]);
const { form, formHeader, specName } = toRefs(props);
const formData = ref({
  type: "",
  MfgOrder: form?.value.MfgOrderName,
  Container: "",
  SpecName: specName?.value || "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const unformData = ref({
  type: "",
  MfgOrder: form?.value.MfgOrderName,
  Container: "",
  SpecName: specName?.value || "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});

const BlankList = ref([]);
const barCode = ref("");
const msgTitle = ref("");
const msgType = ref(true);
const feedRef = ref();
const inputFocus = ref(true);
const detailVisible = ref(false);
const tableData = ref([
  {
    order: "123123",
    qty: "1000",
    materialCode: "1413423",
    materialDes: "3241234",
    singleUsage: "1231234",
    requirement: "234123423",
    totalFeed: "100",
  },
]);
const handleEdit = (row: any) => {
  detailForm.value = { ...row };
  detailVisible.value = true;
};
const columnData = reactive([
  {
    text: true,
    prop: "order",
    label: "工单号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "qty",
    label: "工单数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "materialCode",
    label: "物料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "materialDes",
    label: "物料描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "singleUsage",
    label: "单件用量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "requirement",
    label: "需求量",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "上料总量",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "上料明细",
        prop: "totalFeed",
        icon: "",
        // isButton:false,
        buttonClick: handleEdit,
      },
    ],
  },
]);
const pageObj = ref({
  pageSize: 10,
  currentPage: 1,
});
const detailForm = ref({
  order: "",
  requirement: "",
  totalFeed: "",
  materialCode: "",
  materialDes: "",
});
const detailtableData = ref([
  {
    barCode: "A2019384001",
    batch: "3A4621-01C",
    qty: "200",
    user: "10019",
    time: "2024-06-12 12:01:34",
  },
]);
const handleDelet = (row: any) => {
  console.log(row);
  unformData.value.Container=row.barCode
    UnLoadMaterialQueue(unformData.value).then((res:any)=>{
    BlankList.value=[]
  })
};
const detailcolumnData = ref([
  {
    text: true,
    prop: "barCode",
    label: "物料批次条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "batch",
    label: "批次号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "qty",
    label: "数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "user",
    label: "操作人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "time",
    label: "上料时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "下料",
        // prop: "totalFeed",
        icon: "",
        // isButton:false,
        buttonClick: handleDelet,
      },
    ],
  },
]);
const detailpageObj = ref({
  pageSize: 10,
  currentPage: 1,
});
const getChange = () => {
  LoadMaterialQueue(formData.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    formData.value.Container = "";
  });
};

const batchBlank = () => {
  let data = "";
  feedRef.value.toggleSelection();
  BlankList.value = [];
  // UnLoadMaterialQueue(data).then((res:any)=>{
  //   BlankList.value=[]
  // })
};
const handleSelectionChange = (val: any) => {
  let data = cloneDeep(val);
  BlankList.value = data;
};
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
  detailpageObj.value.currentPage = 1;
  detailpageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  detailpageObj.value.currentPage = val;
};
</script>
<style lang="scss" scoped>
.box {
  border: 2px solid #cbcbcb;
  .setwidth {
    flex: 0 0 320px;
    border-right: 2px solid #cbcbcb;
  }
}
</style>
