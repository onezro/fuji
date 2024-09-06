<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form ref="formRef" class="form" :inline="true" size="small" label-width="auto">
          <!-- <div>
            </div> -->
          <el-form-item label="日期" class="mb-[5px]">
            <el-date-picker v-model="searchDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              size="small" style="width: 200px" />
          </el-form-item>
          <el-form-item label="产线" class="mb-[5px]">
            <el-select v-model="searchForm.lineName" placeholder="" clearable style="width: 150px">
              <el-option v-for="item in lineNameList" :key="item" :label="item.Desc" :value="item.Name" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品编码" class="mb-[5px]">
            <el-input v-model="searchForm.productName" clearable style="width: 150px" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="工单号" class="mb-[5px]">
            <el-input v-model="searchForm.orderNmae" clearable style="width: 150px" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="状态" class="mb-[5px]">
            <el-select v-model="searchForm.Status" placeholder="" clearable style="width: 150px">
              <el-option v-for="item in statusList" :key="item" :label="item.Description"
                :value="item.OrderStatusName" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="">清空条件</el-button>
          </el-form-item> -->
          <el-form-item class="mb-[5px]">
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
        <table-tem size="small" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
          :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
          @rowClick="rowClick"></table-tem>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" width="80%"  align-center>
      <div class="w-full">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="tabChange">
          <el-tab-pane label="物料清单明细" name="物料清单明细" :stretch="true">
            <div class="flex-1" ref="tablebox">
              <el-table :data="feedTableData" size="small" stripe border fit :tooltip-effect="'dark'" :height="400"
                row-key="MaterialName" :tree-props="{ children: 'children' }">
                <el-table-column type="index" align="center" fixed label="序号" width="60" />
                <el-table-column prop="MaterialName" fixed label="物料编码" :min-width="150" width="150">
                </el-table-column>
                <el-table-column prop="MaterialDesc" label="物料描述" :show-overflow-tooltip="true" width="200">
                </el-table-column>

                <el-table-column prop="isMater" label="主料" width="150" :min-width="150">
                  <template #default="scope">
                    <span v-if="scope.row.isMater === 1">是</span>
                    <span v-if="scope.row.isMater === 0">否{{ `(${scope.row.originalMaterialName})` }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="SpecName" label="工序编码" align="center"
                  :min-width="flexColumnWidth('使用工序', 'SpecDesc')">
                </el-table-column>
                <el-table-column prop="SpecDesc" label="工序名称" align="center"
                  :min-width="flexColumnWidth('使用工序', 'SpecDesc')">
                </el-table-column>

                <el-table-column prop="isLoadQueue" align="center" label="允许上料" :min-width="flexColumnWidth('允许上料：（是否）', 'isLoadoueue')
                  ">
                  <template #default="scope">
                    <span v-if="scope.row.isLoadQueue === 1">是</span>
                    <span v-if="scope.row.isLoadQueue === 0">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="QtyRequired" align="center" label="单件用量"
                  :min-width="flexColumnWidth('单件用量', 'QtyRequired')">
                </el-table-column>
                <el-table-column prop="TotalQtyRequired" align="center" label="需求量"
                  :min-width="flexColumnWidth('需求量', 'TotalQtyRequired')">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工艺流程" name="工艺流程">
            <el-form ref="formRef" label-position="left" label-width="auto" size="small" :inline="true">
              <el-form-item label="工艺流程名称" prop="compid" class="mb-[5px]">
                <el-input disabled v-model.trim="productObj.WorkflowName" style="width: 240px"></el-input>
              </el-form-item>
              <el-form-item label="工艺流程描述" prop="compid" class="mb-[5px]">
                <el-input disabled v-model.trim="productObj.WorkflowDesc" style="width: 240px"></el-input>
              </el-form-item>
            </el-form>
            <el-table style="width: auto" :data="productTableData" size="small" stripe border fit
              :tooltip-effect="'dark'" :height="400">
              <el-table-column type="index" align="center" fixed label="序号" width="60" />
              <el-table-column prop="SpecName" label="工序编码" :min-width="180" width="180">
              </el-table-column>
              <el-table-column prop="SpecDesc" label="工序描述" :min-width="180" width="180">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="工治具明细" name="工治具明细">
            <el-table :data="toolTableData" size="small" stripe border fit :tooltip-effect="'dark'" :height="400">
              <el-table-column type="index" align="center" fixed label="序号" width="60" />

              <el-table-column prop="MfgLineName" label="产线" :min-width="180" align="center">
              </el-table-column>
              <el-table-column prop="WorkStationName" label="工作站" :min-width="180" align="center">
              </el-table-column>
              <!-- <el-table-column prop="OrderNumber" label="工单" :min-width="180" align="center">
                </el-table-column> -->
              <el-table-column prop="ToolName" label="工治具编码" :min-width="180" align="center">
              </el-table-column>
              <el-table-column prop="compName" label="工治具型号" :min-width="180" align="center">
              </el-table-column>
              <el-table-column prop="OperatorID" label="操作人" :min-width="180" align="center">
              </el-table-column>
              <el-table-column prop="Timestamp" label="操作时间" :min-width="180" align="center">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { OrganData } from "@/utils/dataMenu";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import { cloneDeep } from "lodash-es";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  GetFactoryModelList,
  findOrderStatus,
  findOrder,
  QueryOrderMaterialRequired,
  findProductSpec,
  QueryOrderToolsData,
} from "@/api/operate";
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
const tableHeight2 = ref(0);
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
const orderChoice = ref("");
const productChoice = ref("");
const productTableData = ref<any>();
const toolTableData = ref<any>();
const dialogVisible = ref(false);

interface productObjTS {
  WorkflowDesc: string;
  WorkflowName: string;
}

const productObj = ref<productObjTS>({
  WorkflowDesc: "",
  WorkflowName: "",
});

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
  (newVal: any, oldVal) => {
    if (newVal === null) {
      searchForm.value.PlanStartTime = "";
      searchForm.value.PlanEndTime = "";
      return [];
    }
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
    prop: "MfgOrderName",
    label: "工单",
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
    prop: "UOMName",
    label: "单位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MfgLineDesc",
    label: "产线",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "OrderStatusDesc",
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
  nextTick(() => { });
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getModeList = () => {
  GetFactoryModelList().then((res: any) => {
    // let data = JSON.parse(res.content);
    // option1.value = OrganData(res.content);
    if (!res || res.content === null) {
      return;
    }
    let data = OrganData(res.content);
    data = data.filter((d: any) => d.Name == "M08-SMT01");
    lineNameList.value = data[0].childMenu;
    // lineNameList.value = [{ Name: "" }, ...OrganData(res.content)[0].childMenu];
  });
};

const getStatusList = () => {
  findOrderStatus().then((res: any) => {
    if (!res || res.content.length === 0 || res.content === null) {
      return;
    }
    statusList.value = res.content;
  });
};

const getTableData = () => {
  findOrder(searchForm.value).then((res: any) => {
    feedTableData.value = [];
    if (!res || res.content === null) {
      tableData.value = [];
      return;
    }
    console.log(res);
    tableData.value = res.content;
  });
};

const rowClick = (val: any) => {
  dialogVisible.value = true;
  if (orderChoice.value === val.MfgOrderName) {
    return;
  }
  orderChoice.value = val.MfgOrderName;
  productChoice.value = val.ProductName;
  activeName.value = "物料清单明细";
  QueryOrderMaterialRequired({
    MfgOrder: val.MfgOrderName,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if (res.success) {
      let data = cloneDeep(feedOrganData(res.content));
      // console.log(data);

      feedTableData.value = data;

      // OrganData(res.content)
    }
  });
};

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

const tabChange = (name: any) => {
  if (orderChoice.value === "") {
    // ElMessage({
    //   message: "请选择工单",
    //   type: "warning",
    // });
    return;
  }
  if (name === "物料清单明细") {
    QueryOrderMaterialRequired({
      MfgOrder: orderChoice.value,
    }).then((res: any) => {
      // console.log(OrganData(res.content));
      if (res.success) {
        let data = cloneDeep(feedOrganData(res.content));
        feedTableData.value = data;
      }
    });
  } else if (name === "工艺流程") {
    findProductSpec(productChoice.value).then((res: any) => {
      if (!res || res.content.lenght === 0) {
        return;
      }
      productObj.value = {
        WorkflowDesc: res.content[0].WorkflowDesc,
        WorkflowName: res.content[0].WorkflowName,
      };
      productTableData.value = res.content;
    });
  } else if (name === "工治具明细") {
    QueryOrderToolsData(orderChoice.value).then((res: any) => {
      if (!res || res.content.lenght === 0) {
        return;
      }
      toolTableData.value = res.content;
    });
  }
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
    tableHeight.value = window.innerHeight - 200 - headerRef.value.clientHeight;
    tableHeight1.value =
      (window.innerHeight - 200 - headerRef.value.clientHeight) * 0.55 - 40;
    tableHeight2.value =
      (window.innerHeight - 200 - headerRef.value.clientHeight) * 0.55 - 85;
  });
};
</script>

<style lang="scss" scoped>
.tab {
  font-size: 10px;
  color: aqua;
}
</style>
<style lang="scss">
.el-pagination {
  justify-content: center;
}

.el-tabs--border-card {
  border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
  --el-tabs-header-height: 30px;
  background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
  padding: 5px;
}

.demo-tabs .el-tabs__item {}

.demo-tabs.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  font-size: 0.8rem;
  // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
  font-size: 0.8rem;
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  font-size: 0.8rem;
  color: #006487 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
