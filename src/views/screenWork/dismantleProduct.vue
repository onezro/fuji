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
                <el-input v-model="form.ContainerName" placeholder="" />
              </el-form-item>
              <el-form-item label="生产计划号" prop="order">
                <el-input v-model="form.MfgOrderName" placeholder="" />
              </el-form-item>
              <el-form-item label="机型" prop="productCode">
                <el-input v-model="form.productmodel" placeholder="" />
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
                <el-select
                  v-model="form.WorkStation"
                  placeholder="选择工位"
                  clearable
                >
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
                    ref="inputRef"
                    style="width: 500px"
                    placeholder="请扫描条码"
                    @keyup.enter.native="getChange"
                  />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]">
                请扫描MES屏条码
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div
                class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
              >
                <span class="ml-5">不良品拆解</span>
              </div>
              <div class="flex-1" ref="tablebox">
                <!-- <table-tem
                  :showIndex="true"
                  :tableData="tableData"
                  :tableHeight="tableHeight"
                  :columnData="columnData"
                  :pageObj="pageObj"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-tem> -->
                <el-table
                  ref="taskTableRef"
                  class="test"
                  stripe
                  border
                  :data="
                    tableData.slice(
                      (pageObj.currentPage - 1) * pageObj.pageSize,
                      pageObj.currentPage * pageObj.pageSize
                    )
                  "
                  style="width: 100%"
                  :height="tableHeight"
                >
                  <el-table-column
                    prop="ContainerName"
                    align="center"
                    label="MES屏条码"
                    :min-width="flexColumnWidth('MES屏条码', 'ContainerName')"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="mfgorderName"
                    align="center"
                    label="生产计划号"
                    :min-width="flexColumnWidth('生产计划号', 'mfgorderName')"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="TxnDate"
                    align="center"
                    label="不良录入时间"
                    :min-width="flexColumnWidth('不良录入时间', 'TxnDate')"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="DismantlestartTime"
                    align="center"
                    label="拆解开始时间"
                    :min-width="
                      flexColumnWidth('拆解开始时间', 'DismantlestartTime')
                    "
                  >
                  </el-table-column>
                  <el-table-column
                    prop="DismantleEndTime"
                    align="center"
                    label="拆解完成时间"
                    :min-width="
                      flexColumnWidth('拆解完成时间', 'DismantleEndTime')
                    "
                  >
                  </el-table-column>
                  <el-table-column
                    prop="DismantleStatus"
                    align="center"
                    label="状态"
                    :min-width="flexColumnWidth('状态状态', 'DismantleStatus')"
                  >
                    <template #default="scope">
                      <div v-if="!scope.row.DismantlestartTime">
                        <div>未开始</div>
                      </div>
                      <div
                        v-if="
                          scope.row.DismantlestartTime &&
                          !scope.row.DismantleEndTime
                        "
                        @click="openVisible(scope.row.ContainerName)"
                      >
                        <div>拆解中</div>
                      </div>
                      <div v-if="scope.row.DismantleEndTime">
                        <div>拆解完成</div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="w-full mt-3 flex justify-around">
                  <el-pagination
                    size="large"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize"
                    :page-sizes="[100, 300, 500, 1000]"
                    layout="total,sizes, prev, pager, next, jumper"
                    :total="tableData.length"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
            <el-dialog
              v-model="qtyVisible"
              width="80%"
              title="不良品拆解"
              :append-to-body="true"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              align-center
            >
              <div>
                <div
                  class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
                >
                  <span class="ml-5">基本信息</span>
                </div>
                <el-form
                  class="pt-2"
                  ref="formRef"
                  :inline="true"
                  :model="qtyForm"
                  label-width="auto"
                >
                  <el-form-item label="MES屏条码" prop="scrBarCode">
                    <el-input
                      v-model="qtyForm.ContainerName"
                      placeholder="请输入"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="生产计划号" prop="order">
                    <el-input
                      v-model="qtyForm.MfgOrderName"
                      placeholder="请输入"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="产品编码" prop="productCode">
                    <el-input
                      v-model="qtyForm.ProductName"
                      placeholder="请输入"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="产品描述" prop="productDec">
                    <el-input
                      v-model="qtyForm.Description"
                      type="textarea"
                      style="width: 500px"
                      placeholder="请输入"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="返修类型" prop="productCode">
                    <el-select v-model="unbindType" style="width: 100px">
                      <el-option
                        v-for="item in [
                          { value: 'R' },
                          { value: 'L' },
                          { value: 'S' },
                          { value: 'Z' },
                        ]"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="order">
                    <el-button @click="unbind" type="primary">解绑</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <div
                  class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
                >
                  <span class="ml-5">不良品拆解</span>
                </div>
                <table-tem
                  :showIndex="true"
                  :tableData="qtytableData"
                  :tableHeight="'300'"
                  :columnData="qtycolumnData"
                  :pageObj="qtypageObj"
                  @handleSizeChange="handleSizeChange1"
                  @handleCurrentChange="handleCurrentChange1"
                ></table-tem>
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="qtyCancel">关闭</el-button>
                </span>
              </template>
            </el-dialog>
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
import { useProjectStoreWithOut } from "@/stores/modules/projectData";
import {
  DefectiveDisposalList,
  DefectiveComponentBindHistory,
  DefectiveScrap,
  DefectiveUnbinding,
  DefectiveDismantle,
} from "@/api/scrApi";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const tabsValue = ref("history");
const qtyVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgTitle = ref("");
const unbindType = ref("R");
const projectStore: any = useProjectStoreWithOut();
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
const tableData = ref([]);

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
    prop: "TxnDate",
    label: "不良录入时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DismantlestartTime",
    label: "拆解开始时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DismantleEndTime",
    label: "拆解完成时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DismantleStatus",
    label: "状态",
    width: "",
    min: true,
    align: "1",
  },
]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const qtyForm = ref({
  ContainerName: "",
  MfgOrderName: "",
  ProductName: "",
  Description: "",
});
const qtytableData = ref([
  {
    order: "1232",
    scrBarCode: "23432",
    productCode: "234234",
    time: "241243",
    station: "234234",
  },
  {
    order: "1232",
    scrBarCode: "23432",
    productCode: "234234",
    time: "241243",
    station: "234234",
  },
]);

const qtypageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  getToData();
  window.addEventListener("resize", getScreenHeight);
  // console.log(appStore.getOpuiData.stationDec);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//获得选择数据
const getToData = () => {
  if (projectStore.getFectivekList.length === 0) {
    return;
  }
  let arr: any = [];
  projectStore.getFectivekList.forEach((item: any) => {
    arr.push(item.ContainerName);
  });
  DefectiveDisposalList({ ContainerName: arr }).then((res: any) => {
    tableData.value = res.content;
  });
};

//打开不良品拆解页面
const openVisible = (code: any) => {
  DefectiveComponentBindHistory(code).then((res: any) => {
    qtyForm.value.ContainerName = code;
    qtyForm.value.Description = res.content2[0].Description;
    qtyForm.value.MfgOrderName = res.content2[0].MfgOrderName;
    qtyForm.value.ProductName = res.content2[0].ProductName;
    qtytableData.value = res.content;
    qtyVisible.value = true;
  });
  barCode.value = "";
};

//报废
const scrap = (row: any) => {
  ElMessageBox.confirm("确认快修", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DefectiveScrap({
        containerName: row.ContainerName,
        BindContainerName: row.BindContainerName,
        MaterialName: row.MaterialName,
        MfgOrderName: row.MfgOrderName,
      }).then((data: any) => {
        if (!data) {
          return;
        }
        if (data.success) {
          ElNotification({
            type: "success",
            title: "提示信息",
            message: data.msg,
          });
          qtyVisible.value = false;
        }
        onSubmit();
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });
};

//查询
const onSubmit = () => {
  let arr = [];
  if (form.value.ContainerName !== "") {
    arr.push(form.value.ContainerName);
  }
  DefectiveDisposalList({
    ...form.value,
    ContainerName: arr,
  }).then((res: any) => {
    if (res.content) {
      tableData.value = res.content;
      projectStore.setFectivekList([]);
    }
  });
};

//解绑
const unbind = () => {
  DefectiveUnbinding({
    containerName: qtyForm.value.ContainerName,
    containerType: unbindType.value,
    productName: qtyForm.value.ProductName,
  }).then((res: any) => {
    if (res.success) {
      ElNotification({
        type: "success",
        title: "提示信息",
        message: res.msg,
      });
    }
    DefectiveDisposalList({
      ContainerName: qtyForm.value.ContainerName,
    }).then((res: any) => {
      if (res.content) {
        tableData.value = res.content;
        projectStore.setFectivekList([]);
      }
    });
    qtyVisible.value = false;
    // if (projectStore.getFectivekList.length === 0) {
    //   onSubmit();
    // } else {
    //   getToData();
    // }
  });
};

//拆解
const getChange = () => {
  DefectiveDismantle({ ContainerName: barCode.value }).then((res: any) => {
    // if (projectStore.getFectivekList.length === 0) {
    //   onSubmit();
    // } else {
    //   getToData();
    // }
    DefectiveDisposalList({
      ContainerName: qtyForm.value.ContainerName,
    }).then((res: any) => {
      if (res.content) {
        tableData.value = res.content;
        projectStore.setFectivekList([]);
      }
    });
    openVisible(barCode.value);
  });
};

const qtyCancel = () => {
  qtyVisible.value = false;
};

const qtycolumnData = reactive([
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
    prop: "MfgOrderName",
    label: "生产计划号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BindContainerName",
    label: "供应商条码",
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
      // {
      //   type: "primary",
      //   label: "解绑",
      //   icon: "DocumentRemove",
      // },
      {
        type: "danger",
        label: "报废",
        icon: "Delete",
        buttonClick: scrap,
      },
    ],
  },
]);

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
    tableHeight.value = window.innerHeight - 365;
  });
};
const handleSizeChange1 = (val: any) => {
  qtypageObj.value.currentPage = 1;
  qtypageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  qtypageObj.value.currentPage = val;
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
