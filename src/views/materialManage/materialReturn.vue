<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          size="small"
          label-width="55px"
        >
          <el-form-item label="工单" class="mb-2">
            <el-input
              v-model="historyForm.MfgOrderName"
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="日期" class="mb-2">
            <el-date-picker
            :shortcuts="shortcuts"
              v-model="date"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="到"
              size="small"
              @change="dateChange"
            />
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button type="primary" @click="getHistory()">查询</el-button>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button
              type="warning"
              @click="(dialogVisible = true), findOrderData()"
              >申请</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <table-tem
          :show-index="true"
          size="small"
          :tableData="historyTable"
          :tableHeight="hisHeight"
          :columnData="columnData"
          :pageObj="pageObjHis"
          @handleSizeChange="handleSizeChangeHis"
          @handleCurrentChange="handleCurrentChangeHis"
          @rowClick="rowClick"
        >
        </table-tem>
      </div>
      <div class="w-full">
        <table-tem
          size="small"
          :show-index="true"
          :tableData="detailedTable"
          :tableHeight="detailedHeight"
          :columnData="detailedData"
          :pageObj="detailedPageObj"
        >
        </table-tem>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      width="80%"
      title="生产退料申请"
      align-center
    >
      <div class="w-full">
        <div ref="headerRef">
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            size="small"
            label-width="85px"
          >
            <el-form-item label="物料条码">
              <el-select
                v-model="form.OrderID"
                placeholder=""
                filterable
                style="width: 152.4px"
                @change="orderChange"
              >
                <el-option
                  v-for="item in orderList"
                  :key="item.OrderID"
                  :label="item.OrderID"
                  :value="item.OrderID"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="物料编码">
                <el-input
                  v-model="form.CompName"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="工单号">
                <el-input
                  v-model="form.OrderID"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="初始数量">
                <el-input v-model="form.Amount" class="input-with-select" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="可退数量">
                <el-input
                  v-model="form.Qty"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="开封时间">
                <el-input
                  v-model="form.OpenTimeStamp"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="到料时间">
                <el-input
                  v-model="form.ReceiveDate"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item> -->
          </el-form>
        </div>
        <div class="table_container">
          <el-table
            :data="
              feedTableData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            size="small"
            stripe
            border
            fit
            :tooltip-effect="'dark'"
            :height="400"
            row-key="MaterialName"
            :tree-props="{ children: 'children' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="selectable"
            />
            <el-table-column
              prop="CompID"
              fixed
              label="物料条码"
              :min-width="150"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="CompName"
              label="物料编码"
              :show-overflow-tooltip="true"
              width="200"
            >
            </el-table-column>

            <!-- <el-table-column
                prop="isMater"
                label="主料"
                width="150"
                :min-width="150"
              >
                <template #default="scope">
                  <span v-if="scope.row.isMater === 1">是</span>
                  <span v-if="scope.row.isMater === 0"
                    >否{{ `(${scope.row.originalMaterialName})` }}</span
                  >
                </template>
              </el-table-column> -->
            <el-table-column
              prop="Amount"
              label="初始数量"
              align="center"
              :min-width="flexColumnWidth('初始数量', 'Amount')"
            >
            </el-table-column>
            <el-table-column
              prop="Qty"
              label="可退数量"
              align="center"
              :min-width="flexColumnWidth('可退数量', 'Qty')"
            >
            </el-table-column>
            <!-- <el-table-column
                prop="isLoadQueue"
                align="center"
                label="允许上料"
                :min-width="flexColumnWidth('允许上料：（是否）', 'isLoadoueue')"
              >
                <template #default="scope">
                  <span v-if="scope.row.isLoadQueue === 1">是</span>
                  <span v-if="scope.row.isLoadQueue === 0">否</span>
                </template>
              </el-table-column> -->
            <el-table-column
              prop="OpenTimeStamp"
              align="center"
              label="开封时间"
              :min-width="flexColumnWidth('开封时间', 'OpenTimeStamp')"
            >
            </el-table-column>
            <el-table-column
              prop="ReceiveDate"
              align="center"
              label="到料时间"
              :min-width="flexColumnWidth('到料时间', 'ReceiveDate')"
            >
            </el-table-column>
            <el-table-column prop="RequestQty" align="center" label="请求数量">
              <template #default="scope">
                <el-input
                  v-model="scope.row.RequestQty"
                  @input="handleInput(scope.row)"
                >
                  <!-- v-if="scope.row.isLoadQueue === 1" -->
                </el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="applyFor">申请</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {shortcuts} from "@/utils/dataMenu"
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  QueryMaterialReturnApply,
  QueryMaterialReturn,
  QueryMaterialReturnDetail,
  OrderGoodMaterials,
  QueryMaterialReturnApplyDetail,
} from "@/api/operate";
import { cloneDeep } from "lodash-es";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const tableData1 = ref<any>([]);
const hisHeight = ref(0);
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const selectOrder = ref("");
const headerRef = ref();
const orderList = ref<any[]>([]);
const feedTableData = ref<any>([]);
const choiceList = ref<any[]>([]);
const dialogVisible = ref(false);
const historyTable = ref<any>([]);
const date = ref<any[]>([]);
const detailedTable = ref<any[]>([]);
const detailedHeight = ref(0);
const detailedPageObj = ref({
  pageSize: 10,
  currentPage: 1,
  isShow: -1,
});

const findOrderForm = {
  workCenter: "",
  orderName: "",
  productName: "",
  lineName: "",
  Status: "",
  PlanStartTime: "",
  PlanEndTime: "",
};

interface formTS {
  CompId: string;
  CompName: string;
  Qty: number;
  amount: string;
  OrderID: string;
  OpenTimeStamp: string;
  ReceiveDate: string;
  Amount: number;
}

interface historyFormTS {
  MfgOrderName: string;
  requestStartDate: string;
  requestEndDate: string;
}

const form = ref<formTS>({
  CompId: "",
  CompName: "",
  Qty: 0,
  amount: "",
  OrderID: "",
  OpenTimeStamp: "",
  ReceiveDate: "",
  Amount: 0,
});

const historyForm = ref<historyFormTS>({
  MfgOrderName: "",
  requestStartDate: "",
  requestEndDate: "",
});

// watch(

// );
onBeforeMount(() => {});

onMounted(() => {
  const today = new Date();
  const dateBefore = new Date(today);
  dateBefore.setDate(today.getDate() - 6); // 减去天数
  // 转换为YYYY-MM-DD格式
  const formattedDate = `${dateBefore.getFullYear()}-${(
    "0" +
    (dateBefore.getMonth() + 1)
  ).slice(-2)}-${("0" + dateBefore.getDate()).slice(-2)}`;
  const formattedTodayDate = `${today.getFullYear()}-${(
    "0" +
    (today.getMonth() + 1)
  ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
  console.log(formattedDate, formattedTodayDate);
  historyForm.value.requestStartDate = formattedDate;
  historyForm.value.requestEndDate = formattedTodayDate;
  date.value = [formattedDate, formattedTodayDate];
  getHistory();
  getScreenHeight();
  findOrderData();
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
//查询工单信息
const findOrderData = () => {
  form.value = {
    CompId: "",
    CompName: "",
    Qty: 0,
    amount: "",
    OrderID: "",
    OpenTimeStamp: "",
    ReceiveDate: "",
    Amount: 0,
  };
  feedTableData.value = [];
  QueryMaterialReturnApply({}).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      orderList.value = [];
      return;
    }
    orderList.value = res.content;
  });
};
//选中工单
const orderChange = (data: any) => {
  // orderList.value.forEach((item: any) => {
  //   if (item.CompID === data) {
  //     form.value.CompName = item.CompName;
  //     form.value.OrderID = item.OrderID;
  //     form.value.Amount = item.Amount;
  //     form.value.Qty = item.Qty;
  //     form.value.OpenTimeStamp = item.OpenTimeStamp;
  //     form.value.ReceiveDate = item.ReceiveDate;
  //   }
  // });
  selectOrder.value = data;

  getFeedTableData(data);
};
//获取历史物料退料申请记录
const getHistory = () => {
  QueryMaterialReturn(historyForm.value).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      historyTable.value = [];
      return;
    }
    historyTable.value = res.content;
  });
};
//根据工单获取物料信息
const getFeedTableData = (order: any) => {
  QueryMaterialReturnApplyDetail({
    MfgOrderName: order,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if (res.success) {
      if (!res || res.content === null || res.content.length === 0) {
        feedTableData.value = [];
        return;
      }
      // let data = cloneDeep(feedOrganData(res.content));
      // console.log(data);

      feedTableData.value = res.content;

      // OrganData(res.content)
    }
  });
};
//处理父子结构
const feedOrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.MaterialName, { ...org, children: [] });
  });
  organizations.forEach((org: any) => {
    if (org.originalMaterialName !== org.MaterialName) {
      const parentOrg = organizationMap.get(org.originalMaterialName);
      if (parentOrg) {
        parentOrg.children.push(organizationMap.get(org.MaterialName));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(
    (org) => org.originalMaterialName == org.MaterialName
  );
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = feedTableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
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
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${16}px; font-family: Arial, sans-serif;`;
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
//选中物料框
const handleSelectionChange = (data: any) => {
  // choiceList.value = data.map((item: any) => {
  //   return {
  //     MaterialName: item.MaterialName,
  //     RequestQty: item.RequestQty ? item.RequestQty : "0",
  //     TotalQtyRequired: item.TotalQtyRequired,
  //     originalMaterialName: item.originalMaterialName,
  //     isMater: item.isMater
  //   };
  // });
  choiceList.value = data
    .filter((item: any) => item.RequestQty && item.RequestQty != 0)
    .map((item: any) => {
      return {
        mfgOrder: item.OrderID,
        Qty: item.RequestQty ? item.RequestQty : 0,
        ContainerName: item.CompID,
        materialName: item.CompName,
        EmployeeName: loginName,
      };
    });
  console.log(choiceList.value);
};
//申请退料
const applyFor = () => {
  if (choiceList.value.length === 0) {
    ElNotification({
      title: "提示信息",
      message: "请选择退料行",
      type: "warning",
    });
    return;
  }
  // if (form.value.CompId === "") {
  //   return;
  // }
  // choiceList.value.forEach((element) => {
  //   if (Number(element.RequestQty) > Number(element.TotalQtyRequired)) {
  //     return;
  //   }
  // });
  OrderGoodMaterials(choiceList.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: '提示信息',
        message: res.msg,
        type: "success",
      });
      // findOrderData();
      getFeedTableData(selectOrder.value);
    }
  });
};

const dateChange = () => {
  if (date.value !== null && date.value.length !== 0) {
    historyForm.value.requestStartDate = date.value[0];
    historyForm.value.requestEndDate = date.value[1];
  } else {
    historyForm.value.requestStartDate = "";
    historyForm.value.requestEndDate = "";
  }
};

const selectable = (row: any) => {
  if (row.isLoadQueue === 0 || !row.RequestQty) {
    return false;
  } else {
    return true;
  }
};

const rowClick = (val: any) => {
  QueryMaterialReturnDetail(val.MaterialReturnHistoryId).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      detailedTable.value = [];
      return;
    }
    detailedTable.value = res.content;
  });
};

//判断请求数量是否大于需求量
const handleInput = (data: any) => {
  if (data.RequestQty !== undefined || data.RequestQty !== "") {
    const num = data.RequestQty.replace(/^0+|[^0-9]/g, "");
    data.RequestQty = num;
    if (num > data.Qty) {
      data.RequestQty = "";
      ElNotification({
        title: '提示信息',
        message: `不得超过可退数量${data.Qty}`,
        type: "error",
      });
    }
  }
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const pageObjHis = ref({
  pageSize: 10,
  currentPage: 1,
});

const columnData = reactive([
  // {
  //   text: true,
  //   prop: "BD_RequestNo",
  //   label: "申请编号",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "RequestTypeName",
  //   label: "申请类型",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  {
    text: true,
    prop: "MfgOrderName",
    label: "工单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_ProductModel",
    label: "机型",
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
    prop: "ProductDesc",
    label: "产品描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "OrderStatusDesc",
    label: "工单状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "工单数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PlannedStartDate",
    label: "计划开始时间",
    width: "",
    min: true,
    align: "center",
  },

  // {
  //   text: true,
  //   prop: "RequestDate",
  //   label: "申请时间",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "BD_EmployeeName",
  //   label: "申请人",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
]);

const detailedData = reactive([
  {
    text: true,
    prop: "materialName",
    label: "物料编码",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "Description",
    label: "物料描述",
    width: "",
    min: true,
    align: "left",
  },
  // {
  //   text: true,
  //   prop: "UOMName",
  //   label: "单位",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  {
    text: true,
    prop: "Qty",
    label: "退料数量",
    width: "",
    min: true,
    align: "center",
  },
]);

const handleSizeChangeHis = (val: any) => {
  pageObjHis.value.currentPage = 1;
  pageObjHis.value.pageSize = val;
};

const handleCurrentChangeHis = (val: any) => {
  pageObjHis.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 250 - headerRef.value.clientHeight;
    hisHeight.value =
      (window.innerHeight - 170 - headerRef.value.clientHeight) * 0.6;
    detailedHeight.value =
      (window.innerHeight - 170 - headerRef.value.clientHeight) * 0.4;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
