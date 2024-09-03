<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          size="small"
          label-width="auto"
        >
          <!-- <div>
            </div> -->
          <el-form-item label="工单号">
            <el-input v-model="searchForm.orderNmae" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="产品编码">
            <el-input
              v-model="searchForm.productName"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="产线">
            <el-select
              v-model="searchForm.lineName"
              placeholder=""
              style="width: 152.4px"
            >
              <el-option
                v-for="item in lineNameList"
                :key="item"
                :label="item.Name"
                :value="item.Name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.Status"
              placeholder=""
              style="width: 152.4px"
            >
              <el-option
                v-for="item in statusList"
                :key="item"
                :label="item.Description"
                :value="item.OrderStatusName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchDate"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="To"
              size="small"
              style="width: 230px"
            />
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="">清空条件</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="addNewVisible = true"
              >新建</el-button
            >
          </el-form-item> -->
        </el-form>
      </div>
      <div class="table_container">
        <!-- <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          size="small"
          :height="tableHeight"
          row-key="step1"
          style="width: 100%"
          ><el-table-column
            type="index"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column prop="BD_ProductModel" label="机型"> </el-table-column>
          <el-table-column prop="MfgLineDesc" label="产线"> </el-table-column>
          <el-table-column prop="MfgLineName" label="产线编号"> </el-table-column>
          <el-table-column prop="MfgOrderName" label="工单"> </el-table-column>
          <el-table-column prop="OrderStatusName" label="状态"> </el-table-column>
          <el-table-column prop="PlannedCompletionDate" label="计划完成时间"> </el-table-column>
          <el-table-column prop="PlannedStartDate" label="计划开始时间"> </el-table-column>
          <el-table-column prop="ProductDesc" label="产品描述"> </el-table-column>
          <el-table-column prop="ProductName" label="产品编码"> </el-table-column>
          <el-table-column prop="QTY" label="数量"> </el-table-column>
          <el-table-column prop="wcDescription" label="车间"> </el-table-column>

        </el-table> -->

        <table-tem
          size="small"
          :tableData="tableData"
          :tableHeight="tableHeight"
          :columnData="columnData"
          :pageObj="pageObj"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @rowClick="rowClick"
        ></table-tem>
        <!-- <div class="block flex justify-between" style="margin: 15px 0">
          <div>
            <el-radio-group v-model="radio">
              <el-radio :value="3">物料清单明细</el-radio>
              <el-radio :value="6">工艺流程</el-radio>
              <el-radio :value="9">工治具明细</el-radio>
            </el-radio-group>
          </div>
          <el-pagination
            background
            size="small"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
          <div></div>
        </div> -->
        <!-- <el-table
          :data="tableData1"
          border
          size="small"
          :height="tableHeight1"
          row-key="step1"
          style="width: 100%"
        >
          <el-table-column prop="BarCode" label="工单" width="180">
          </el-table-column>
          <el-table-column prop="PadID" label="物料编码"> </el-table-column>
          <el-table-column prop="Result" label="物料描述"> </el-table-column>
          <el-table-column prop="Result" label="主料"> </el-table-column>
          <el-table-column prop="Result" label="单件用量"> </el-table-column>
          <el-table-column prop="Result" label="需求量"> </el-table-column>
          <el-table-column prop="Result" label="上料总量"> </el-table-column>
        </el-table> -->
        <div class="w-full">
          <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
            <el-tab-pane label="物料清单明细" name="物料清单明细" :stretch="true">
          <div class="flex-1" ref="tablebox">
            <el-table
              :data="
                feedTableData
              "
              stripe
              border
              fit
              :tooltip-effect="'dark'"
              :height="tableHeight1"
              row-key="MaterialName"
              :tree-props="{ children: 'children' }"
            >
              <el-table-column
                type="index"
                align="center"
                fixed
                label="序号"
                width="60"
              />
              <el-table-column
                prop="MaterialName"
                label="物料编码"
                :min-width="180"
                width="180"
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
                width="160"
                :min-width="160"
              >
                <template #default="scope">
                  <span v-if="scope.row.isMater === 1">是</span>
                  <span v-if="scope.row.isMater === 0"
                    >否{{ `(${scope.row.originalMaterialName})` }}</span
                  >
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
              <!-- <el-table-column
                label="上料总量"
                fixed="right"
                :min-width="flexColumnWidth('上料总量', 'LoadQueueQty')"
                align="center"
              >
                <template #default="scope">
                  <el-button
                    type="warning"
                    text
                    bg
                    :disabled="scope.row.isLoadQueue!=1||scope.row.LoadQueueQty==0"
                     @click="handleEdit(scope.row)"
                  >
                    {{ scope.row.LoadQueueQty==0?'':scope.row.LoadQueueQty }}
                  </el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
            </el-tab-pane>
            <el-tab-pane label="工艺流程" name="工艺流程">
              fixtures
            </el-tab-pane>
            <el-tab-pane label="工治具明细" name="工治具明细">
              fixtures
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getCheckResults } from "@/api/permiss";
import { OrganData } from "@/utils/dataMenu";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import { cloneDeep } from "lodash-es";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { GetFactoryModelList, findOrderStatus, findOrder, QueryOrderMaterialRequired } from "@/api/permiss";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { get } from "lodash-es";
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const tableData1 = ref<any>([]);
const tableHeight1 = ref(0);
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const addNewVisible = ref(false);
const testValue = ref("");
const headerRef = ref();
const lineNameList = ref<any>([]);
const statusList = ref<any>([]);
const radio = ref();
const searchDate = ref([]);
const activeName = ref("物料清单明细");
const feedTableData = ref<any>([]);

interface wmsType {
  phase_code: string;
  pt_code: string;
  pl_code: string;
}

interface bsMnStore {
  store_code: string;
  remark: string;
}

interface bsMnMtrl {
  mtrl_code: string;
  is_main: string;
  main_code: string;
  dosage: string;
  nn_qty: string;
  tn_qty: string;
  so_id: string;
  thrid_rwn: string;
  bs_mn_mtrl_ex1: string;
  remark: string;
}

interface RuleForm {
  org_id: string;
  pmn_code: string;
  prod_code: string;
  pmn_type: string;
  mn_tb_qty: string;
  mn_plan_qty: string;
  ref_mn_date: string;
  ref_mn_code: string;
  vm_store_code: string;
  cust_pmn_type: string;
  cust_shelf_status: string;
  remark: string;
  wms_mn_elec: Array<wmsType>;
  bs_mn_store: Array<bsMnStore>;
  bs_mn_mtrl: Array<bsMnMtrl>;
}

interface searchFormTS {
  workCenter: string;
  orderNmae: string;
  productName: string;
  lineName: string;
  Status: string;
  PlanStartTime: string;
  PlanEndTime: string;
}

const searchForm = ref<searchFormTS>({
  workCenter: "M08-SMT01",
  orderNmae: "",
  productName: "",
  lineName: "",
  Status: "",
  PlanStartTime: "",
  PlanEndTime: "",
});

watch(
  () => searchDate.value,
  (newVal, oldVal) => {
    searchForm.value.PlanStartTime = newVal[0];
    searchForm.value.PlanEndTime = newVal[1];
  }
);

const requisitionForm = ref<RuleForm>({
  org_id: "",
  pmn_code: "",
  prod_code: "",
  pmn_type: "",
  mn_tb_qty: "",
  mn_plan_qty: "",
  ref_mn_date: "",
  ref_mn_code: "",
  vm_store_code: "",
  cust_pmn_type: "",
  cust_shelf_status: "",
  remark: "",
  wms_mn_elec: [],
  bs_mn_store: [],
  bs_mn_mtrl: [],
});

const pmnTypeList = reactive([
  {
    value: 1,
    label: "生产出库单",
  },
  {
    value: 2,
    label: "其它出库单",
  },
  {
    value: 3,
    label: "不良品出库申请单",
  },
  {
    value: 4,
    label: "供应商退货申请单",
  },
  {
    value: 5,
    label: "报废申请单",
  },
  {
    value: 6,
    label: "自定义申请单",
  },
  {
    value: 7,
    label: "维修领料申请单",
  },
  {
    value: 8,
    label: "研发领料申请单",
  },
  {
    value: 9,
    label: "生产补料单",
  },
  {
    value: 10,
    label: "工单",
  },
  {
    value: 11,
    label: "产品出货申请单",
  },
]);

const custType = reactive([
  {
    value: 1,
    label: "生产出库",
  },
  {
    value: 2,
    label: "委外出库",
  },
]);

const cuostStatus = reactive([
  {
    value: 1,
    label: "完成",
  },
  {
    value: 2,
    label: "未完成",
  },
]);

const columnData = reactive([
  {
    text: true,
    prop: "BD_ProductModel",
    label: "机型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgLineDesc",
    label: "产线",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgLineName",
    label: "产线编号",
    width: "",
    min: true,
    align: "center",
  },
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
    prop: "OrderStatusName",
    label: "状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PlannedCompletionDate",
    label: "计划完成时间",
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
  {
    text: true,
    prop: "ProductDesc",
    label: "产品描述",
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
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "wcDescription",
    label: "车间",
    width: "",
    min: true,
    align: "center",
  },
]);

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

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  getScreenHeight();
  getModeList();
  getStatusList();
  window.addEventListener("resize", getScreenHeight);
  nextTick(() => {});
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getModeList = () => {
  GetFactoryModelList().then((res: any) => {
    // let data = JSON.parse(res.content);
    // option1.value = OrganData(res.content);
    lineNameList.value = [{ Name: "" }, ...OrganData(res.content)[0].childMenu];
  });
};

const getStatusList = () => {
  findOrderStatus().then((res: any) => {
    if (!res || res.content.length === 0 || res.content === null) {
      return;
    }
    statusList.value = [
      {
        OrderStatusName: "",
        Description: "",
      },
      ...res.content,
    ];
  });
};

const getTableData = () => {
  findOrder(searchForm.value).then((res: any) => {
    console.log(res);
    tableData.value = res.content;
  });
};

const rowClick = (val: any) => {
  QueryOrderMaterialRequired({
    MfgOrder: val.MfgOrderName,
    Container: "",
    SpecName: "SMT-Burn",
    workstationName: '',
    userAccount: userStore.getUserInfo,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if(res.success){
      let data=cloneDeep(OrganData(res.content))   
      feedTableData.value=data
      // OrganData(res.content)
    }
  });
};

const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

const pageObj1 = ref({
  pageSize: 10,
  currentPage: 1,
});

const addWmsTable = () => {
  requisitionForm.value.wms_mn_elec.push({
    phase_code: "",
    pt_code: "",
    pl_code: "",
  });
};

const addStoreTable = () => {
  requisitionForm.value.bs_mn_store.push({
    store_code: "",
    remark: "",
  });
};

const addMtrlTable = () => {
  requisitionForm.value.bs_mn_mtrl.push({
    mtrl_code: "",
    is_main: "",
    main_code: "",
    dosage: "",
    nn_qty: "",
    tn_qty: "",
    so_id: "",
    thrid_rwn: "",
    bs_mn_mtrl_ex1: "",
    remark: "",
  });
};

const handleSizeChange1 = (val: any) => {
  pageObj1.value.currentPage = 1;
  pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  pageObj1.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value =
      (window.innerHeight - 190 - headerRef.value.clientHeight) * 0.5;
    tableHeight1.value =
      (window.innerHeight - 190 - headerRef.value.clientHeight) * 0.5 - 50;
  });
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.el-pagination {
  justify-content: center;
}

.el-tabs--border-card {
  border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
  background-color: #006487 !important;
}

.demo-tabs.el-tabs__content {
  padding: 5px 0px;
}

.demo-tabs .el-tabs__item {
  font-size: 1.1rem;
}

.demo-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #006487 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
