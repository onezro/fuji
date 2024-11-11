<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
    >
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <!-- <el-button type="primary" @click="openDialog">不良品登记</el-button> -->
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
            <el-form ref="formRef" :model="form" label-width="auto">
              <el-form-item label="MES屏条码" prop="scrBarCode">
                <el-input
                  v-model="form.ContainerName"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="生产计划号" prop="order">
                <el-input
                  v-model="form.MfgOrderName"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="机型" prop="productCode">
                <el-input
                  v-model="form.productmodel"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="起始时间" prop="startTime">
                <el-date-picker
                  v-model="form.StartTime"
                  type="date"
                  placeholder=""
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="form.EndTime"
                  type="date"
                  placeholder=""
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="不良工位" prop="station">
                <el-select v-model="form.WorkStation" placeholder="选择工位" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="flex justify-end">
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full flex flex-col">
          <div class="flex flex-col flex-1">
            <div
              class="h-[35px] flex items-center text-xl justify-between text-[#fff] bg-[#006487]"
            >
              <span class="ml-5"> 不良品处置列表</span>
            </div>
            <div class="p-2">
              <el-button type="primary" @click="disassembly">批量拆解</el-button>
            </div>
            <el-table
              :data="tableData"
              :height="tableHeight"
              stripe
              border
              fit
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                v-for="c in columnData"
                :key="c.prop"
                :label="c.label"
                :prop="c.prop"
                :width="c.width"
                :min-width="c.min ? flexColumnWidth(c.label, c.prop) : ''"
                :align="c.align"
              >
                <template #default="scope">
                  <span v-if="c.text">{{ scope.row[c.prop] }}</span>
                  <el-tooltip
                    v-if="c.isOperation"
                    v-for="(o, oi) in c.operation"
                    :key="oi"
                    :content="o.label"
                    placement="top"
                  >
                    <el-button
                      :icon="o.icon"
                      size="small"
                      :type="o.type"
                      @click="handleEdit"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div class="mt-3 bg-white">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageObj.currentPage"
                :page-size="pageObj.pageSize"
                :page-sizes="[10, 30, 50, 100, 150]"
                layout="total,sizes, prev, pager, next, jumper"
                :total="tableData.length"
              >
              </el-pagination>
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
import selectTa from "@/components/selectTable/index.vue";
import { checkStringType } from "@/utils/barcodeFormat";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader } from "@/typing";
import { cloneDeep } from "lodash-es";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { useRouter } from 'vue-router';
import { useProjectStoreWithOut } from '@/stores/modules/projectData'
import { DefectiveDisposalList, DefectiveQuickTest } from "@/api/scrApi";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgTitle = ref("");
const router = useRouter();
const projectStore:any = useProjectStoreWithOut();
const stopsForm = ref({
  ContainerName: "", //PCB
  result: "OK", //工装治具
  WorkStationName: opui.station, //工位
  ResourceName: opui.station !== null ? opui.station : "", //设备
  EmployeeName: userStore.getUserInfo, //用户
});
const form = ref({
  ContainerName: "",
  StartTime: "",
  EndTime: "",
  WorkStation: "",
  MfgOrderName: "",
  productmodel: "",
});

const options = ref([
  {
    value: "12341234",
    label: "贴合外观",
  },
  {
    value: "123461283",
    label: "贴合下料",
  },
]);
const tableData = ref([
]);

const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "生产计划号",
    value: "order",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品机型",
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
  {
    label: "计划数量",
    value: "orderNum",
    disabled: true,
    type: "input",
    width: "",
  },
]);
const columnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "MES屏条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "mfgorderName",
    label: "生产计划号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "不良录入时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SpecDesc",
    label: "不良工位",
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
        label: "快修",
        icon: "Position",
      },
    ],
  },
]);
const selectTable = ref([]);

interface orderArr {
  order: string;
  models: string;
  productCode: string;
  productDes: string;
  orderNum: string;
}

interface OrderData {
  data: Array<orderArr>;
}

const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // console.log(appStore.getOpuiData.stationDec);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//查询
const onSubmit = () => {
    DefectiveDisposalList(({...form.value,ContainerName:[form.value.ContainerName]})).then((res:any) =>{
        if(res.content) {
            tableData.value = res.content
        }
    })
};

//批量拆卸
const disassembly = () => {
    projectStore.setFectivekList(selectTable.value);
    router.push({ name: 'BICV-SCN-0005' });
}

const handleSelectionChange = (val: any) => {
  let data = cloneDeep(val);
  selectTable.value = data;
  console.log(selectTable.value);
};

const handleEdit = () => {};
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
    tableHeight.value = window.innerHeight - 255;
  });
};
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};

const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.innerText = str;
  html.className = "getTextWidth";
  document.body?.appendChild(html);

  // 使用类型断言将 Element 转换为 HTMLElement
  const spanElement = document.querySelector(".getTextWidth") as HTMLElement;
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};
</script>

<style lang="scss" scoped>
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

.tabs-css
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  background-color: #fff;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}
</style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
