<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          size="small"
          label-width="85px"
        >
          <el-form-item label="工单">
          <el-input
            v-model="historyForm.orderNmae"
            placeholder=""
          ></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="date"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="到"
              size="small"
              @change="dateChange"
            />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getHistory"
              >查询</el-button
            >
          </el-form-item>
          <br />
          <el-form-item label="">
            <el-button type="primary" @click="dialogVisible = true"
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

    <el-dialog v-model="dialogVisible" width="80%" align-center>
      <div class="w-full">
        <div ref="headerRef">
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            size="small"
            label-width="85px"
          >
            <!-- <div>
              </div> -->
            <el-form-item label="工单号">
              <el-select
                v-model="form.MfgOrderName"
                placeholder=""
                style="width: 152.4px"
                @change="orderChange"
              >
                <el-option
                  v-for="item in orderList"
                  :key="item"
                  :label="item.MfgOrderName"
                  :value="item.MfgOrderName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="机型">
              <el-input
                v-model="form.BD_ProductModel"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input
                v-model="form.ProductName"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="form.Qty" class="input-with-select" disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="单位">
              <el-input
                v-model="form.UOMName"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产线">
              <el-input
                v-model="form.MfgLineDesc"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input
                v-model="form.OrderStatusDesc"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="计划完成时间">
              <el-input
                v-model="form.PlannedCompletionDate"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="计划开始时间">
              <el-input
                v-model="form.PlannedCompletionDate"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="车间">
              <el-input
                v-model="form.wcDescription"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <br />
            <el-form-item label="">
              <el-button type="primary" @click="applyFor">申请</el-button>
            </el-form-item>
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
            :height="tableHeight"
            row-key="MaterialName"
            :tree-props="{ children: 'children' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" :selectable="selectable"/>
            <!-- <el-table-column type="index" align="center" fixed label="序号" width="60" /> -->
            <el-table-column
              prop="MaterialName"
              fixed
              label="物料编码"
              :min-width="150"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="MaterialDesc"
              label="物料描述"
              :show-overflow-tooltip="true"
              width="200"
            >
            </el-table-column>

            <el-table-column
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
            </el-table-column>
            <el-table-column
              prop="SpecName"
              label="工序编码"
              align="center"
              :min-width="flexColumnWidth('使用工序', 'SpecDesc')"
            >
            </el-table-column>
            <el-table-column
              prop="SpecDesc"
              label="工序名称"
              align="center"
              :min-width="flexColumnWidth('使用工序', 'SpecDesc')"
            >
            </el-table-column>

            <el-table-column
              prop="isLoadQueue"
              align="center"
              label="允许上料"
              :min-width="flexColumnWidth('允许上料：（是否）', 'isLoadoueue')"
            >
              <template #default="scope">
                <span v-if="scope.row.isLoadQueue === 1">是</span>
                <span v-if="scope.row.isLoadQueue === 0">否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="QtyRequired"
              align="center"
              label="单件用量"
              :min-width="flexColumnWidth('单件用量', 'QtyRequired')"
            >
            </el-table-column>
            <el-table-column
              prop="TotalQtyRequired"
              align="center"
              label="需求量"
              :min-width="flexColumnWidth('需求量', 'TotalQtyRequired')"
            >
            </el-table-column>
            <el-table-column prop="RequestQty" align="center" label="请求数量">
              <template #default="scope">
                <el-input v-model="scope.row.RequestQty" v-if="scope.row.isLoadQueue === 1"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin: 15px 0">
            <el-pagination
              align="center"
              background
              size="small"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 20, 50, 100]"
              layout="total,sizes, prev, pager, next, jumper"
              :total="feedTableData.length"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  findOrder,
  QueryOrderMaterialRequired,
  SubmitMaterialRequest,
  QueryMaterialRequest,
  QueryMaterialRequestDetail
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
const addNewVisible = ref(false);
const testValue = ref("");
const headerRef = ref();
const orderList = ref<any[]>([]);
const feedTableData = ref<any>([]);
const choiceList = ref<any[]>([]);
const dialogVisible = ref(false);
const historyTable = ref<any>([]);
const date = ref([]);
const detailedTable = ref<any[]>([]);
const detailedHeight = ref(0);
const detailedPageObj = ref({
  pageSize: 10,
  currentPage: 1,
  isShow:-1
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
  MfgOrderName: string;
  PlannedStartDate: string;
  PlannedCompletionDate: string;
  Qty: number;
  ProductName: string;
  BD_ProjectNo: string | null;
  BD_ProductModel: string;
  ProductDesc: string;
  UOMName: string;
  OrderStatusName: string;
  OrderStatusDesc: string;
  MfgLineName: string;
  MfgLineDesc: string;
  WorkCenterName: string;
  wcDescription: string;
}

interface historyFormTS {
  orderNmae: string;
  requestStartDate: string;
  requestEndDate: string;
}

const form = ref<formTS>({
  MfgOrderName: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  Qty: 0,
  ProductName: "",
  BD_ProjectNo: null,
  BD_ProductModel: "",
  ProductDesc: "",
  UOMName: "",
  OrderStatusName: "",
  OrderStatusDesc: "",
  MfgLineName: "",
  MfgLineDesc: "",
  WorkCenterName: "",
  wcDescription: "",
});

const historyForm = ref<historyFormTS>({
  orderNmae: "",
  requestStartDate: "",
  requestEndDate: "",
});

// watch(

// );
onBeforeMount(() => {});

onMounted(() => {
  getHistory();
  getScreenHeight();
  findOrderData();
  window.addEventListener("resize", getScreenHeight);
  nextTick(() => {});
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
//查询工单信息
const findOrderData = () => {
  findOrder(findOrderForm).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      orderList.value = [];
      return;
    }
    orderList.value = res.content;
  });
};
//选中工单
const orderChange = (data: any) => {
  orderList.value.forEach((item: any) => {
    if (item.MfgOrderName === data) {
      form.value.MfgOrderName = item.MfgOrderName;
      form.value.PlannedStartDate = item.PlannedStartDate;
      form.value.PlannedCompletionDate = item.PlannedCompletionDate;
      form.value.Qty = item.Qty;
      form.value.ProductName = item.ProductName;
      form.value.BD_ProjectNo = item.BD_ProjectNo;
      form.value.BD_ProductModel = item.BD_ProductModel;
      form.value.ProductDesc = item.ProductDesc;
      form.value.UOMName = item.UOMName;
      form.value.OrderStatusName = item.OrderStatusName;
      form.value.OrderStatusDesc = item.OrderStatusDesc;
      form.value.MfgLineName = item.MfgLineName;
      form.value.MfgLineDesc = item.MfgLineDesc;
      form.value.WorkCenterName = item.WorkCenterName;
      form.value.wcDescription = item.wcDescription;
      getFeedTableData(data);
    }
  });
};
//获取历史物料申请记录
const getHistory = () => {
  QueryMaterialRequest(historyForm.value).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      historyTable.value = [];
      return;
    }
    historyTable.value = res.content;
  });
};
//根据工单获取物料信息
const getFeedTableData = (order: any) => {
  QueryOrderMaterialRequired({
    MfgOrder: order,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if (res.success) {
      
    if (!res || res.content === null || res.content.length === 0) {
      feedTableData.value = [];
      return;
    }
      let data = cloneDeep(feedOrganData(res.content));
      // console.log(data);

      feedTableData.value = data;

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
  choiceList.value = data.map((item: any) => {
    return {
      MaterialName: item.MaterialName,
      RequestQty: item.RequestQty ? item.RequestQty : "0",
      TotalQtyRequired: item.TotalQtyRequired
    };
  });
  console.log(choiceList.value);
};
//申请物料
const applyFor = () => {
  if (form.value.MfgOrderName === "") {
    return;
  }
  choiceList.value.forEach(element => {
    if (Number(element.RequestQty) > Number(element.TotalQtyRequired)) {
      return;
    }
  });
  SubmitMaterialRequest({
    RequestType: "5",
    MfgOrderName: form.value.MfgOrderName,
    MaterialList: choiceList.value,
    userAccount: loginName,
  }).then((res: any) => {
    console.log(res);
  });
};

const dateChange = () => {
  if (date.value.length != 0) {
    historyForm.value.requestStartDate = date.value[0];
    historyForm.value.requestEndDate = date.value[1];
  }
}

const selectable = (row:any) => {
  if (row.isLoadQueue === 0 || !row.RequestQty) {
    return false;
  } else {
    return true;
  }
}

const rowClick = (val:any) => {
  QueryMaterialRequestDetail(val.isMaterialRequestTxnHistoryId).then((res:any) => {
      
      if (!res || res.content === null || res.content.length === 0) {
        detailedTable.value = [];
        return;
      }
      detailedTable.value = res.content
  })
}

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
  {
    text: true,
    prop: "MfgOrderName",
    label: "工单",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "RequestDate",
    label: "请求时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_RequestNo",
    label: "请求编号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_EmployeeName",
    label: "请求人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "日期",
    width: "",
    min: true,
    align: "center",
  },
]);

const detailedData = reactive([
  {
    text: true,
    prop: "ProductName",
    label: "产品名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Description",
    label: "描述",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UOMName",
    label: "单位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "QtyRequested",
    label: "请求数量",
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
