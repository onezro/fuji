<template>
    <div class="p-[10px]">
      <el-card shadow="always" :body-style="{ padding: '10px' }">
        <div class="pb-[10px] flex justify-between">
          <el-button type="primary" @click="addVisible = true">添加</el-button>
          <div class="flex">
              
          </div>
        </div>
        <table-tem :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange">  
      <template #tagSlot="slotProps">  
        <!-- 访问子组件传递的item数据 -->  
        <!-- <span>{{ slotProps.item }}</span>   -->
         <div> {{ console.log('1') }} </div>
      </template>  
</table-tem>
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
          <el-form-item label="ID" prop="WorkSection">
            <el-input v-model="EditForm.ID" style="width: 240px" placeholder="请输入"></el-input>
          </el-form-item>
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
          <el-form-item label="ID" prop="WorkSection">
            <el-input v-model="form.ID" style="width: 240px" placeholder="请输入"></el-input>
          </el-form-item>
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
            <el-button @click="addVisible"> 取消 </el-button>
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
    ID: string;
    type: string;
    Des: string;
  }
  
  interface EditFormTS {
    ID: string;
    type: string;
    Des: string;
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
  
  const tableData = ref([{
    number: '1613543154',
    type: 'GD-350',
    consumption: '412',
    process: true,
    Des:'测试'
  },{
    number: '1613543154',
    type: 'GD-350',
    consumption: '412',
    process: false,
    Des:'测试'
  }]);
  
  const form = ref<formTS>({
    ID: "",
    type: "",
    Des: "",
  });
  
  const EditForm = ref<EditFormTS>({
    ID: "",
    type: "",
    Des: "",
  });

  const editSubmit = (data: any) => {
    console.log(data);
    EditForm.value.type = data.type;
    EditForm.value.Des = data.Des;
    EditForm.value.ID = data.number;
    editVisible.value = true
  }

  const deleteSubmit = () => {
  }

  
const columnData = reactive([

{
    text: true,
    prop: "number",
    label: "ID",
    width: "",
    min: true,
    align: "center",
},{
    text: true,
    prop: "type",
    label: "类型",
    width: "",
    min: true,
    align: "center",
},
{
    text: true,
    prop: "consumption",
    label: "储位",
    width: "",
    min: true,
    align: "center",
},

{
    text: false,
    tag:true,
    tagType:'bolean',
    tagItem:[{text:'已发料',type:'primary'},{text:'未发料',type:'warning'}],
    // tagItem:{'已发料':'primary'},
    prop: "process",
    label: "状态",
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
            icon: "Delete",
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
  