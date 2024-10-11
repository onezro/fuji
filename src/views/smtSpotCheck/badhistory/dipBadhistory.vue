<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <el-form ref="getFormRef" :model="getForm" :inline="true">
        <el-form-item label="时间" prop="timePeriod" class="mb-2">
          <el-date-picker
            :shortcuts="shortcuts"
            v-model="getForm.timePeriod"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            style="width: 240px"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item label="工序" prop="Spec" class="mb-2">
          <el-select
            v-model="getForm.Spec"
            placeholder="请选择"
            style="width: 200px"
            clearable
            @clear="getTableData"
          >
            <el-option
              v-for="s in specList"
              :key="s.SpecName"
              :label="s.Description"
              :value="s.SpecName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="PCB条码" prop="cause" class="mb-2">
          <el-input
            v-model="getForm.ContainerName"
            style="width: 200px"
            clearable
            @clear="getTableData"
          />
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
      <table-tem
        size="small"
        :tableData="tableData"
        :show-index="true"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-tem>
    </el-card>
    <el-dialog
      v-model="detailVisible"
      width="60%"
      :title="'PCB编码：' + title"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
    >
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div>
          <div
            class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]"
          >
            基本信息
          </div>
          <el-form ref="formRef" :model="detailForm" label-width="auto" :inline="true" class="pt-2"> 
              <!-- <el-form-item label="PCB编码" prop="ContainerName" class="mb-2">
                <el-input v-model="detailForm.ContainerName" disabled />
              </el-form-item> -->
              <el-form-item label="工序" prop="SpecDesc" class="mb-2">
                <el-input v-model="detailForm.SpecDesc" disabled />
              </el-form-item>
              <el-form-item label="登记人" prop="BD_EmployeeName" class="mb-2">
                <el-input v-model="detailForm.BD_EmployeeName" disabled />
              </el-form-item>
              <el-form-item label="登记时间" prop="TxnDate" class="mb-2">
                <el-input v-model="detailForm.TxnDate" disabled />
              </el-form-item>
          </el-form>
        </div>
        <div>
          <div
            class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]"
          >
            不良列表
          </div>
          <tableTemp
            size="small"
            :showIndex="true"
            :tableData="detailData"
            :tableHeight="200"
            :columnData="detailColumn"
          >
          </tableTemp>
        </div>
        <div>
          <div
            class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]"
          >
            维修记录
          </div>
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
import { shortcuts } from "@/utils/dataMenu";
import {
  ref,
  watch,
  nextTick,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  QueryDefectCode,
  QueryDefectCodeDetail,
  QuerySpec,
} from "@/api/operate";
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";

interface spec {
  SpecName: string;
  Description: string;
}

const getForm = ref({
  timePeriod: "",
  ContainerName: "",
  StartTime: "",
  EndTime: "",
  Spec: "",
  Line: "DIP",
});
const tableData = ref([]);
const detailVisible = ref(false);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const specList = ref<spec[]>([]);
const detailData = ref([]);
const title = ref("");
const handleEdit = (data: any) => {
  detailForm.value={...data}
  title.value = data.ContainerName;
  QueryDefectCodeDetail(data.isDefectHistoryId).then((res: any) => {
    if (res.success) {
      detailVisible.value = true;
      detailData.value = res.content;
    } else {
      detailData.value = [];
    }
  });
};
const columnData = ref([
  {
    text: true,
    prop: "ContainerName",
    label: "PCB编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SpecDesc",
    label: "工序",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_EmployeeName",
    label: "登记人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "登记时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "repairStatus",
    label: "是否已维修",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "repairBy",
    label: "维修人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "repairTime",
    label: "维修时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "不良明细",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "明细",
        icon: "Document",
        buttonClick: handleEdit,
      },
    ],
  },
]);
const detailColumn = ref([
  {
    text: true,
    prop: "isDefectReasonName",
    label: "不良代码",
    width: "",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "Description",
    label: "不良描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ES_Net1",
    label: "不良位号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "isComments",
    label: "备注",
    width: "",
    min: true,
    align: "1",
  },
]);
const detailPageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const detailForm = ref({
  isDefectHistoryId: "",
  ContainerName: "",
  TxnDate: "",
  BD_EmployeeName: "",
  SpecName: "",
  SpecDesc: "",
  repairBy: "",
  repairTime: "",
  repairStatus: "",
});

watch(
  () => getForm.value.timePeriod,
  (newVal: any) => {
    if (newVal === null) {
      getForm.value.StartTime = "";
      getForm.value.EndTime = "";
      getTableData();
      return [];
    }
    getForm.value.StartTime = newVal[0];
    getForm.value.EndTime = newVal[1];
  },
  { deep: true }
);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getSpec();
  getTableData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getSpec = () => {
  QuerySpec("DIP").then((res: any) => {
    specList.value = res.content;
  });
};

const getTableData = () => {
  QueryDefectCode(getForm.value).then((res: any) => {
    tableData.value = res.content;
  });
};

// const getDetailData=()=>{
//   QueryDefectCodeDetail()
// }

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
  detailPageObj.value.currentPage = 1;
  detailPageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  detailPageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};
</script>

<style scoped></style>
