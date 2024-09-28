<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <!-- <el-button @click="detailsVisible=true">明细</el-button> -->
      <div class="flex justify-between">
        <div>
          <el-form ref="formRef" :inline="true" :model="formData">
            <el-form-item label="ECN编码" class="mb-2" prop="ECN_NUMBER">
              <el-input
                v-model="formData.ECN_NUMBER"
                placeholder="ECN编码"
                @clear="getData"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="项目编码" class="mb-2" prop="TGIECOAttribute3">
              <el-input
                v-model="formData.TGIECOAttribute3"
                placeholder="项目编码"
                @clear="getData"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="更改时间区间" class="mb-2">
              <el-date-picker
                v-model="searchDate"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                style="width: 240px"
              />
            </el-form-item>
            <!-- <el-form-item label="面号" class="mb-2">
                            <el-select v-model="getDataText.Side" placeholder="请选择" @clear="getData" clearable
                                style="width: 180px">
                                <el-option v-for="s in sideList" :label="s.label" :value="s.value" />
                            </el-select>
                        </el-form-item>

                        -->
            <el-form-item class="mb-2">
              <el-button type="primary" @click="getData">查询</el-button>
              <el-button @click="restData">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div>
          <el-input v-model="searchName" placeholder="请输入">
            <template #append>
              <el-button type="primary" icon="Search"></el-button> </template></el-input>
</div> -->
      </div>
      <table-tem
        size="small"
        :show-index="true"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-tem>
    </el-card>
    <el-dialog
      v-model="detailsVisible"
      width="90%"
      title="ECN变更单"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
    >
      <el-form
        ref="formRef"
        :model="addForm"
        label-width="auto"
        size="small"
        :inline="true"
      >
        <el-form-item label="ECN编码" prop="name" class="mb-[5px]">
          <el-input v-model="addForm.ECN_NUMBER" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="ECN类型" prop="zone" class="mb-[5px]">
          <el-input v-model="addForm.ECNType" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="客户名称" prop="time" class="mb-[5px]">
          <el-input v-model="addForm.TGIECOAttribute1" placeholder="请输入"  disabled/>
        </el-form-item>
        <el-form-item label="更改时间" prop="time" class="mb-[5px]">
          <el-input v-model="addForm.modified" placeholder="请输入" disabled/>
        </el-form-item>
        <el-form-item label="ECN变更所处阶段" prop="time" class="mb-[5px]">
          <el-input v-model="addForm.TGIECOAttribute7" placeholder="请输入" disabled/>
        </el-form-item>
        <!-- <el-form-item label="切换方式" prop="time" class="mb-[5px]">
          <el-input v-model="addForm.number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="变更时间点" prop="time" class="mb-[5px]">
          <el-input v-model="addForm.number" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="申请人" prop="time" class="mb-[5px]">
          <el-input v-model="addForm.Owner" placeholder="请输入" disabled/>
        </el-form-item>
        <el-form-item label="受影响的项目和产品" prop="time" class="mb-[5px]">
          <el-input
            v-model="addForm.TGIECOAttribute8"
            style="width: 600px"
            placeholder="请输入"
            disabled
          />
        </el-form-item>
        <el-form-item label="变更原因" prop="time" class="mb-[5px]">
          <el-input
            v-model="addForm.BicvECNChangeReason"
            style="width: 600px"
            placeholder="请输入"
            disabled
          />
        </el-form-item>
        <el-form-item label="变更原因详述" prop="time" class="mb-[5px]">
          <el-input
            v-model="addForm.TGIECOAttribute4"
            style="width: 600px"
            placeholder="请输入"
            disabled
          />
        </el-form-item>
      </el-form>
      <table-tem
        size="small"
        :show-index="true"
        :tableData="detailsData"
        :tableHeight="400"
        :columnData="detailsColumn"
        :pageObj="detailsPageObj"
        @handleSizeChange="detailsSizeChange"
        @handleCurrentChange="detailsCurrentChange"
      ></table-tem>
      <template #footer>
        <span class="dialog-footer">
          <el-button>关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { GetECNorder, GetECNOrderitem } from "@/api/operate";
import {
  ref,
  reactive,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import tableTem from "@/components/tableTem/index.vue";
const formData = ref({
  ECN_NUMBER: "",
  ECNType: "",
  TGIECOAttribute3: "",
  startModified: "",
  EndModified: "",
});
const searchDate = ref([]);
const formRef = ref();
const detailsVisible = ref(false);
const addForm = ref({
    ECN_NUMBER: "",
    ECNType:'',
    TGIECOAttribute1:'',
    modified:'',
    TGIECOAttribute7:'',
    Owner:'',
    TGIECOAttribute8:'',
    BicvECNChangeReason:'',
    TGIECOAttribute4:''
});
const searchName = ref("");
const tableData = ref([]);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const editSubmit = (row:any) => {
  detailsVisible.value = true;
  addForm.value={...row}
  GetECNOrderitem(row.id).then((res:any)=>{
    detailsData.value=res.content
  })
};
const columnData = reactive([
  {
    text: true,
    prop: "ECN_NUMBER",
    label: "ECN编码",
    width: "",
    min: true,
    fixed: true,
    align: "1",
  },
  {
    text: true,
    prop: "ECNType",
    label: "ECN类型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TGIECOAttribute1",
    label: "客户名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TGIECOAttribute3",
    label: "项目编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "modified",
    label: "更改时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TGIECOAttribute7",
    label: "ECN变更所处阶段",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BicvAddTGlECOAttribute3",
    label: "切换方式",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BicvAddTGlECOAttribute4",
    label: "变更切换时间点",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Owner",
    label: "申请人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TGIECOAttribute8",
    label: "受影响的项目/产品",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BicvECNChangeReason",
    label: "变更原因",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TGIECOAttribute4",
    label: "变更详述",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "明细",
    width: "80",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "明细",
        icon: "Tickets",
        buttonClick: editSubmit,
      },
    ],
  },
]);
const detailsData = ref([]);
const tableHeight = ref(0);
const detailsPageObj = ref({
  pageSize: 30,
  currentPage: 1,
  isShow: -1,
});

const detailsColumn = ref([
  {
    text: true,
    prop: "Parent",
    label: "父级零件",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Child",
    label: "子件零件",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ChildType",
    label: "子物料类型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ITEM_CODE",
    label: "物料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ChildDescription",
    label: "物料描述",
    width: "200",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "COMPONENT_QUANTITY",
    label: "单位用量",
    width: "",
    min: true,
    align: "1",
  },
//   {
//     text: true,
//     prop: "MaterialName",
//     label: "计量单位代码",
//     width: "",
//     min: true,
//     align: "1",
//   },

  {
    text: true,
    prop: "ITEM_NUM",
    label: "物料序号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "OPERATION_SEQ_NUM",
    label: "工序名称",
    width: "",
    min: true,
    align: "1",
  },
//   {
//     text: true,
//     prop: "MaterialName",
//     label: "基准",
//     width: "",
//     min: true,
//     align: "1",
//   },
  {
    text: true,
    prop: "COMPONENT_YIELD_FACTOR",
    label: "产出率",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SUBSTITUTE_COMP",
    label: "替代组件",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "COMP_REFERENCE",
    label: "参考指标符",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SUPPLY_TYPE",
    label: "供应类型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SUBINVENTORY",
    label: "子库存",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LOCATOR",
    label: "货位",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "COMPONENT_REMARKS",
    label: "备注",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "VPMReferenceRevision",
    label: "数模版本",
    width: "",
    min: true,
    align: "1",
  },
]);
watch(
  () => searchDate.value,
  (newVal: any) => {
    if (newVal === null) {
      formData.value.startModified = "";
      formData.value.EndModified = "";
      return;
    }
    formData.value.startModified = newVal[0];
    formData.value.EndModified = newVal[1];
  }
);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData()
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    console.log(formData.value);
  GetECNorder(formData.value).then((res: any) => {
    tableData.value = res.content;
    // console.log(res.content);
  });
};
const restData = () => {
  searchDate.value = [];
  formRef.value.resetFields();
  console.log(formData.value);
};

const detailsSizeChange = (val: any) => {
  detailsPageObj.value.currentPage = 1;
  detailsPageObj.value.pageSize = val;
};
const detailsCurrentChange = (val: any) => {
  detailsPageObj.value.currentPage = val;
};
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};
</script>

<style scoped></style>
