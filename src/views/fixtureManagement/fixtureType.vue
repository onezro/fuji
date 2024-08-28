<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div class="pb-[10px] flex justify-between">
        <el-button type="primary" @click="addVisible = true">添加</el-button>
        <div class="flex">
          <el-input
            v-model="inputValue"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
          <el-button class="ml-3" type="primary" @click="">查询</el-button>
        </div>
      </div>
      <table-tem
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-tem>
    </el-card>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="editVisible"
      @close=""
      title="编辑"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="EditForm"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="组件料号" prop="WorkSection">
          <el-input
            v-model="EditForm.CompName"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="材料类型">
          <el-input
            v-model="EditForm.MaterialType"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件类型">
          <el-input
            v-model="EditForm.CompType"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="自定义总次数">
          <el-input
            v-model="EditForm.TotalUses"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(生产片数)">
          <el-input
            v-model="EditForm.UsesUntilRealidation"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(暂停时间)">
          <el-input
            v-model="EditForm.TimeUntilRevalidation"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(生产时间)">
          <el-input
            v-model="EditForm.MaterialType"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="editVisible = false"> 取消 </el-button>
          <el-button type="primary" @click=""> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close=""
      title="添加"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="组件料号" prop="WorkSection">
          <el-input
            v-model="form.CompName"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="材料类型">
          <el-input
            v-model="form.MaterialType"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件类型">
          <el-input
            v-model="form.CompType"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="自定义总次数">
          <el-input
            v-model="form.TotalUses"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(生产片数)">
          <el-input
            v-model="form.UsesUntilRealidation"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(暂停时间)">
          <el-input
            v-model="form.RauseUntilRevalidate"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(生产时间)">
          <el-input
            v-model="form.TimeUntilRevalidation"
            style="width: 240px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="addVisible"> 取消 </el-button>
          <el-button type="primary" @click="addSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
    ToolsType
} from "@/api/permiss";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

interface tableDataTS {
  number: string;
  type: string;
  consumption: string;
  process: string;
  FaceType: string;
  Des: string;
}

interface formTS {
  operationtype: string;
  CompName: string;
  MaterialType: string;
  CompType: string;
  TotalUses: string;
  UsesUntilRealidation: string;
  RauseUntilRevalidate: string;
  TimeUntilRevalidation: string;
}

interface EditFormTS {
  operationtype: string;
  CompName: string;
  MaterialType: string;
  CompType: string;
  TotalUses: string;
  UsesUntilRealidation: string;
  RauseUntilRevalidate: string;
  TimeUntilRevalidation: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const inputValue = ref();
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const tableData = ref([]);

const form = ref<formTS>({
  operationtype: "",
  CompName: "",
  MaterialType: "",
  CompType: "",
  TotalUses: "",
  UsesUntilRealidation: "",
  RauseUntilRevalidate: "",
  TimeUntilRevalidation: "",
});

const EditForm = ref<EditFormTS>({
  operationtype: "",
  CompName: "",
  MaterialType: "",
  CompType: "",
  TotalUses: "",
  UsesUntilRealidation: "",
  RauseUntilRevalidate: "",
  TimeUntilRevalidation: "",
});

const editSubmit = (data: any) => {
  console.log(data);
  // EditForm.value.type = data.type;
  // EditForm.value.Des = data.Des;
  editVisible.value = true;
};

const deleteSubmit = () => {};

const addSumbit = () => {
    ToolsType({...form.value,operationtype:'ADD'}).then((data:any) => {
        console.log(data);
    })
}

const getData = () => {
    ToolsType({operationtype:'QAL'}).then((data:any) => {
    const dataText = data.content;
    tableData.value = dataText;
    })
}

const columnData = reactive([
  {
    text: true,
    prop: "CompName",
    label: "组件料号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialType",
    label: "材料类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CompType",
    label: "组件类型",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "TotalUses",
    label: "自定义总次数",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UsesUntilRevalidation",
    label: "停机扫描(生产片数)",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PauseUntilRevalidate",
    label: "停机扫描(暂停时间)",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TimeUntilRevalidation",
    label: "停机扫描(生产时间)",
    width: "",
    min: true,
    align: "center",
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
        label: "编辑",
        icon: "Document",
        buttonClick: editSubmit,
      },
      {
        type: "danger",
        label: "删除",
        icon: "Delete",
        buttonClick: deleteSubmit,
      },
    ],
  },
]);

onBeforeMount(() => {
  getData();
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 215;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
