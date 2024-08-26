<template>
    <div class="p-[10px]">
      <el-card shadow="always" :body-style="{ padding: '10px' }">
        <div class="pb-[10px] flex justify-between">
          <el-button type="primary" @click="addVisible = true">添加</el-button>
          <div class="flex">
              <el-input v-model="form.type" style="width: 240px" placeholder="请输入"></el-input>
              <el-button class="ml-3" type="primary" @click="">查询</el-button>
          </div>
        </div>
        <table-tem :show-index="true" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
                :pageObj="currentPage" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
      </el-card>
      <el-dialog
        :append-to-body="true"
        :close-on-click-modal="false"
        v-model="editVisible"
        @close=""
        title="添加"
        width="50%"
      >
        <el-form
          ref="formRef"
          :model="EditForm"
          label-position="left"
          label-width="auto"
        >
          <el-form-item label="类型" prop="WorkSection">
            <el-input v-model="EditForm.type" style="width: 240px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="EditForm.Des"
              autosize
              type="textarea"
              placeholder=""
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <span class="dialog-footer">
            <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
            <el-button @click=""> 取消 </el-button>
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
          <el-form-item label="类型" prop="WorkSection">
            <el-input v-model="form.type" style="width: 240px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="form.Des"
              autosize
              type="textarea"
              placeholder=""
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <span class="dialog-footer">
            <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
            <el-button @click=""> 取消 </el-button>
            <el-button type="primary" @click=""> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
  import tableTem from "@/components/tableTem/index.vue";
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
    type: string;
    Des: string;
  }
  
  interface EditFormTS {
    type: string;
    Des: string;
  }
  
  const pageSize = ref(10);
  const currentPage = ref(1);
  const tableHeight = ref(0);
  const addVisible = ref(false);
  const editVisible = ref(false);
  const inputValue = ref();
  
  const tableData = ref([{
    number: 'string',
    type: 'string',
    consumption: 'string',
    process: 'string',
    FaceType: 'string',
    Des: 'string'
  }]);
  
  const form = ref<formTS>({
    type: "",
    Des: "",
  });
  
  const EditForm = ref<EditFormTS>({
    type: "",
    Des: "",
  });

  const editSubmit = () => {
    editVisible.value = true
  }

  const deleteSubmit = () => {
  }

  
const columnData = reactive([

{
    text: true,
    prop: "number",
    label: "产品编号",
    width: "",
    min: true,
    align: "center",
},
{
    text: true,
    prop: "consumption",
    label: "消耗量",
    width: "",
    min: true,
    align: "center",
},

{
    text: true,
    prop: "process",
    label: "工序",
    width: "",
    min: true,
    align: "center",
},
{
    text: true,
    prop: "FaceType",
    label: "面别",
    width: "",
    min: true,
    align: "center",
},
{
    text: true,
    prop: "Des",
    label: "描述",
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
        },{
            type: "danger",
            label: "删除",
            icon: "Document",
            buttonClick: deleteSubmit,
        }
    ],
},
]);

  onBeforeMount(() => {
    getScreenHeight();
  });
  onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
  });
  onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
  });
  
  const handleSizeChange = (val: any) => {
    currentPage.value = 1;
    pageSize.value = val;
  };
  const handleCurrentChange = (val: any) => {
    currentPage.value = val;
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
  