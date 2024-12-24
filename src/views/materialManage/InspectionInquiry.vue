<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div>
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          size="small"
          label-width="85px"
        >
          <el-form-item label="工单">
            <el-input
              v-model="order"
              class="input-with-select"
              @keyup.enter.native="getData(order)"
            >
            </el-input>
            <!-- <el-select-v2
      v-model="value"
      :options="options"
      placeholder="Please select"
      size="large"
      style="width: 240px"
    /> -->
            <!-- <el-select-v2 v-model="form.MfgOrderName" :options="orderList" filterable
                :props="orderProps" style="width: 180px"  @change="orderChange"/> -->
          </el-form-item>
          <el-form-item label="产品机型">
            <el-input
              v-model="selectForm.ProductModel"
              style="width: 152px"
              disabled
            >
            </el-input>
          </el-form-item>
          <el-form-item label="产品编码">
            <el-input
              v-model="selectForm.ProductName"
              style="width: 152px"
              disabled
            >
            </el-input>
          </el-form-item>
          <el-form-item label="计划数量">
            <el-input
              v-model="selectForm.QTY"
              style="width: 152px"
              disabled
            >
            </el-input>
          </el-form-item>
          <el-form-item label="产品描述">
            <el-input
              style="width: 420px"
              type="textarea"
              v-model="selectForm.ProductDesc"
              disabled
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <div class="flex justify-between">
          <div></div>
          <div class="flex items-center">
            <el-button size="small" type="" class="mr-4" @click="inStore"
              >入库</el-button
            >
            <el-checkbox v-model="IsPrint">是否打印</el-checkbox>
          </div>
        </div>
        <el-table
          size="small"
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          :height="tableHeight"
          row-key="step1"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="45"
            label="选择"
            align="center"
            :selectable="selectable"
          />
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column
            prop="InspectionOrder"
            label="送检单号"
            width="180"
            align="center"
            :min-width="flexColumnWidth('送检单号', 'InspectionOrder')"
          >
            <template #default="scope">
              <div
                class="underline font-bold text-[#006487] cursor-pointer"
                @click="getDetail(scope.row.InspectionOrder)"
              >
                {{ scope.row.InspectionOrder }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="PackagingBoxNumber"
            label="包装箱号"
            align="center"
            :min-width="flexColumnWidth('包装箱号', 'PackagingBoxNumber')"
          >
          </el-table-column>
          <!-- <el-table-column prop="StorageQty" label="包装箱数量" align="center":min-width="flexColumnWidth('包装箱数量', 'StorageQty')"> </el-table-column> -->
          <el-table-column
            prop="Quantity"
            label="MES产品数量"
            align="center"
            :min-width="flexColumnWidth('MES产品数量', 'Quantity')"
          >
          </el-table-column>
          <el-table-column
            prop="InspectionTime"
            label="时间"
            align="center"
            :min-width="flexColumnWidth('时间', 'InspectionTime')"
          >
          </el-table-column>
          <el-table-column
            prop="QAResult"
            label="送检结果"
            align="center"
            :min-width="flexColumnWidth('送检结果', 'QAResult')"
          >
            <template #default="scope">
              <div v-if="scope.row.QAResult === 'Y'">合格</div>
              <div v-if="scope.row.QAResult === 'N'">不合格</div>
              <div v-if="scope.row.QAResult === null">送检中</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="StorageSta"
            label="入库状况"
            align="center"
            :min-width="flexColumnWidth('入库状况', 'StorageSta')"
          >
            <template #default="scope">
              <div v-if="scope.row.StorageSta === 'TreatStorage'">待入库</div>
              <div v-if="scope.row.StorageSta === 'StoragePart'">
                {{
                  `已入库（${scope.row.StorageQty}/${scope.row.QuantityOfBoxs}）`
                }}
              </div>
              <div v-if="scope.row.StorageSta === 'StorageHalfway'">
                {{
                  `入库中（${scope.row.StorageQty}/${scope.row.QuantityOfBoxs}）`
                }}
              </div>
              <div v-if="scope.row.StorageSta === 'Storage'">入库完成</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            align="center"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      width="70%"
      title="未入库的成品信息"
      align-center
      @close="filterTableData = []"
    >
      <div class="w-full">
        <div class="table_container">
          <el-table
            :data="filterTableData"
            size="small"
            stripe
            border
            fit
            :tooltip-effect="'dark'"
            :height="400"
            ref="tableRef"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
              fixed
            />
            <el-table-column
              prop="ContainerName"
              label="成品条码"
              :min-width="150"
            >
            </el-table-column>
            <el-table-column prop="InspectionOrder" label="送检单">
            </el-table-column>

            <el-table-column
              prop="PackagingBoxNumber"
              label="箱条码"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button type="" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="applyFor">申请</el-button>
        </div>
      </template> -->
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { shortcuts } from "@/utils/dataMenu";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  ProductInspectDetailsHistory,
  QueryPartNotStorageInfo,
  FinishedProductStorage,
  MfgOrderDetail,
} from "@/api/asyApi";
import type { InspectionResult } from "@/typing";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const order = ref("");
const choiceList = ref<any[]>([]);
const filterTableData = ref<any[]>([]);
const IsPrint = ref(false);
const getDataText = reactive({
  inspectType: "",
  inspect: "",
  dateStart: "",
  dateEnd: "",
});
const selectForm = ref({
  MfgOrderName: "",
  ProductModel: "",
  ProductName: "",
  ProductDesc: "",
  QTY: null,
});
const orderNumber = ref("order");
const orderList = ref([
  {
    lable: "单号",
    value: "order",
  },
  {
    lable: "时间",
    value: "times",
  },
]);
const value1 = ref([]);
const dialogVisible = ref(false);

watch(
  () => value1.value,
  (data) => {
    console.log(data);
    getDataText.dateStart = data[0];
    getDataText.dateEnd = data[1];
  }
);

// watch(() => inquire.value, (newData, oldData) => {
//   if (newData == "times") {
//     getDataText.inspect = "*";
//   } else {
//     getDataText.inspect = "";
//   }
//   if (newData != oldData) {
//     getDataText.inspectType = "";
//   }
// })
onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const handleSelectionChange = (data: any) => {
  choiceList.value = data;
};

const getData = (str: any) => {
  ProductInspectDetailsHistory({ MfgOrderName: str }).then((res: any) => {
    if (res.success) {
      tableData.value = res.content;
    }
  });
  MfgOrderDetail(str).then((res: any) => {
    if (res.success) {
      selectForm.value = res.content[0];
    }
  });
};

const getDetail = (order: any) => {
  QueryPartNotStorageInfo(order).then((res: any) => {
    if (res.success) {
      dialogVisible.value = true;
      filterTableData.value = res.content;
    } else {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "error",
      });
    }
  });
};

const selectable = (row: any) => {
  if (row.QAResult === "N") {
    return false;
  }
  if (row.StorageSta === "StorageHalfway" || row.StorageSta === "Storage") {
    console.log(1);

    return false;
  }
  return true;
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
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const inStore = () => {
  FinishedProductStorage({
    userAccount: loginName,
    Remark: "",
    IsPrint: IsPrint.value,
    items: choiceList.value,
  }).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getData(order.value);
    } else {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "warning",
      });
    }
  });
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 280;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
