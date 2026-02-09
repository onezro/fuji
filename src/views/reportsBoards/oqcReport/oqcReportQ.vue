<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between">
        <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" :size="'small'"
          @submit.native.prevent>
          <el-form-item :label="'时间'" class="mb-2"><el-date-picker :shortcuts="shortcuts" v-model="searchDate"
              value-format="YYYY-MM-DD" type="daterange" range-separator="-" size="small" style="width: 190px"
              :clearable="false" :disabled-date="disabledDate" />
          </el-form-item>
          <el-form-item label="客户" prop="CustomerName" class="mb-2">
            <el-select v-model="getForm.CustomerName" @change="getData" placeholder="请选择" clearable filterable
              size="small" style="width: 180px">
              <el-option :label="p.CustomerName" :value="p.CustomerName" :key="p.CustomerId"
                v-for="p in customerList" />
            </el-select>
          </el-form-item>

          <el-form-item label="客户PN" prop="CustomerPN" class="mb-2">
            <el-input v-model="getForm.CustomerPN" placeholder="" clearable @clear="getData"
              @keyup.enter.native="getData" style="width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('oqcInspection.LOtNO')" class="mb-2">
            <el-input style="width: 180px" v-model="getForm.LotNo" placeholder="" clearable
              @keyup.enter.native="getData"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="Desc" class="mb-2">
            <el-input v-model="getForm.Desc" placeholder="" clearable @clear="getData" @keyup.enter.native="getData"
              style="width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('oqcInspection.workerOrder')" class="mb-2">
            <el-input style="width: 190px" v-model="getForm.MfgOrderName" placeholder="" clearable
              @keyup.enter.native="getData"></el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button :type="'primary'" @click="getData">查询</el-button>
            <el-button :type="'info'" @click="resetGetForm">重置</el-button>
             <el-button type="success" :disabled="tableData.length == 0" size="small" @click="exportTable">
                        导出Excel
                    </el-button>
            <!-- <el-button type="warning" size="small" @click="openAdd">添加</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.slice(
        (pageObj.currentPage - 1) * pageObj.pageSize,
        pageObj.currentPage * pageObj.pageSize,
      )
        " size="small" ref="oqcReportRef" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'dark'" border>
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
          <template #default="scope">
            <span>{{
              scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Date" fixed :label="'Date'" :min-width="getColumnWidth('Date')" />
        <el-table-column prop="CUST" fixed :label="'CUST'" :min-width="getColumnWidth('CUST')" />
        <el-table-column prop="CUST_PN" fixed :label="'CUST_PN'" :min-width="getColumnWidth('CUST_PN')" />
        <el-table-column prop="Desc" :label="'Desc'" :min-width="getColumnWidth('Desc')" />
        <el-table-column prop="Lot_No" :label="'Lot_No'" :min-width="getColumnWidth('Lot_No')" />
        <el-table-column prop="Lot_Qty" :label="'Lot_Qty'" width="90" />
        <el-table-column prop="Inspn_Qty" :label="'Inspn_Qty'" width="90" />
        <el-table-column prop="Rej_Qty" :label="'Rej_Qty'" width="90" />
        <el-table-column prop="CPKMinL" :label="'CPKMinL'" width="90" />
        <el-table-column prop="CPKMinW" :label="'CPKMinW'" width="90" />
        <el-table-column prop="CPKMinThk" :label="'CPKMinThk'" width="90" />
        <el-table-column prop="ProdQty" :label="'ProdQty'" width="90" />
        <el-table-column prop="total_defect_qty" :label="'NGQty'" width="90" />
        <el-table-column prop="indentation" :label="'压痕'" width="90" />
        <el-table-column prop="uneven" :label="'凹凸'" width="90" />
        <el-table-column prop="burr" :label="'毛边'" width="90" />
        <el-table-column prop="crack" :label="'开裂'" width="90" />
        <el-table-column prop="foreign_matter" :label="'异物'" width="90" />
        <el-table-column prop="red_dot" :label="'红点'" width="90" />
        <el-table-column prop="over_cut" :label="'多切'" width="90" />
        <el-table-column prop="deformation" :label="'变形'" width="90" />
        <el-table-column prop="punch_break" :label="'冲断'" width="90" />
        <el-table-column prop="other" :label="'其他'" width="90"></el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <div class="mt-2">
        <el-pagination :size="'small'" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :pager-count="5" :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
          :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import {
  GetCustomerQuery
} from "@/api/incomingManage/aqlrules";
import {
  GetOQCDataSummaryQuery
} from "@/api/reportsBoards/index";
import {
  ref,
  reactive,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import {
  calculateColumnsWidth,
  clearTextWidthCache,
} from "@/utils/tableminWidth";
import {
  shortcuts,
  setTodayDate,
  setLastDate,
  disabledDate,
} from "@/utils/dataMenu";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const getForm = ref({
  MfgOrderName: "",
  CustomerName: "",
  CustomerPN: "",
  StartTime: "",
  EndTime: "",
  Desc: "",
  LotNo: "",
});
const tableHeight = ref(0);
const tableData = ref([]);

const pageObj = reactive({
  currentPage: 1,
  pageSize: 50,
});
const searchDate = ref<any[]>([])
const customerList = ref<any[]>([]);
const oqcReportRef=ref()
watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      getForm.value.StartTime = "";
      getForm.value.EndTime = "";
      // getForm.value.PageNumber = 1

      return;
    }
    if (newVal !== oldVal) {
      getForm.value.StartTime = newVal[0];
      getForm.value.EndTime = newVal[1] + " 23:59:59";
      // getForm.value.PageNumber = 1
    }
  },
);

onBeforeMount(() => {
  getScreenHeight();
  getCustomerData()
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
  clearTextWidthCache();
});

const resetGetForm = () => {
 pageObj.currentPage=1
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
  getForm.value = {
    MfgOrderName: "",
    CustomerName: "",
    CustomerPN: "",
    StartTime: setLastDate(),
    EndTime: setTodayDate() + " 23:59:59",
    Desc: "",
    LotNo: "",
  };

  getData();
};
const getData = () => {
  pageObj.currentPage=1
  GetOQCDataSummaryQuery(getForm.value).then((res: any) => {
    tableData.value = res.content;
  });
};
//获取客户名称
const getCustomerData = () => {
  GetCustomerQuery({}).then((res: any) => {
    customerList.value = res.content;
  });
};

const exportTable = () => {
    exportTableToExcel({
        tableRef: oqcReportRef.value,
        fetchAllData: fetchFinishAllData,
        fileName: `${"原材料领用张数"}_${dayjs().format("YYYYMMDDHHmmss")}`,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
    });
};
const fetchFinishAllData = async () => {
    let data = await GetOQCDataSummaryQuery(getForm.value).then(
        (res: any) => {
            return res.content
        },
    );
    return data;
};

const handleSizeChange = (val: any) => {
  pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
};
// 使用计算属性缓存列宽计算结果
const columnWidths = computed(() => {

  const columns = [
    { label: "Date", prop: "Date" },
    { label: "CUST", prop: "CUST" },
    { label: "CUST_PN", prop: "CUST_PN" },
    { label: "Desc", prop: "Desc" },
    { label: "Lot_No", prop: "Lot_No" },
    { label: "Lot_Qty", prop: "Lot_Qty" },
    { label: "Inspn_Qty", prop: "Inspn_Qty" },
    { label: "Rej_Qty", prop: "Rej_Qty" },
    { label: "CPKMinL", prop: "CPKMinL" },
    { label: "CPKMinW", prop: "CPKMinW" },
    { label: "CPKMinThk", prop: "CPKMinThk" },
    { label: "ProdQty", prop: "ProdQty" },
    { label: "NGQty", prop: "total_defect_qty" },
    { label: "压痕", prop: "indentation" },
    { label: "凹凸", prop: "uneven" },
    { label: "毛边", prop: "burr" },
    { label: "开裂", prop: "crack" },
    { label: "异物", prop: "foreign_matter" },
    { label: "红点", prop: "red_dot" },
    { label: "多切", prop: "over_cut" },
    { label: "变形", prop: "deformation" },
    { label: "冲断", prop: "punch_break" },
    { label: "其他", prop: "other" }
  ];


  // 批量计算列宽
  return calculateColumnsWidth(columns, tableData.value, {
    padding: 25,
    fontSize: 13,
  });
});

// 在模板中使用
const getColumnWidth = (prop: string) => {
  return columnWidths.value[prop] || "auto";
};
</script>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>

<style lang="scss" scoped></style>
