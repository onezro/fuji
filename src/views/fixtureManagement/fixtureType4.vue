<template>
    <div class="p-2">
      <el-card shadow="always" :body-style="{ padding: '8px' }">
        <div class="pb-2 flex justify-between">
          <el-button
            type="primary"
            @click="clearForm(), (addVisible = true), getClassList()"
            >添加</el-button
          >
          <div class="flex">
            <el-input
              v-model="inputValue"
              style="width: 240px"
              placeholder="请输入"
              clearable
            ></el-input>
            <el-button class="ml-3" type="primary" @click="serachData"
              >查询</el-button
            >
          </div>
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
        align-center
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
          :inline="true"
        >
          <el-form-item label="备品名称">
            <el-input v-model="EditForm.PartName" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="备品描述">
            <el-input v-model="EditForm.Description" style="width: 250px" />
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="EditForm.Specification" style="width: 250px" />
          </el-form-item>
          <el-form-item label="设备">
            <el-input v-model="EditForm.Equipment" style="width: 250px" />
          </el-form-item>
          <el-form-item label="供应商代码">
            <el-input v-model="EditForm.VendorCode" style="width: 250px" />
          </el-form-item>
          <el-form-item label="安全库存">
            <el-input-number
              v-model="EditForm.SafetyStock"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="最小库存">
            <el-input-number
              v-model="EditForm.MinStock"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="最大库存">
            <el-input-number
              v-model="EditForm.MaxStock"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="当前数量">
            <el-input-number
              v-model="EditForm.CurrentQty"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="周期">
            <el-input v-model="EditForm.Cycle" style="width: 250px" />
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="EditForm.Unit" style="width: 250px" />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <span class="dialog-footer">
            <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
            <el-button @click="editVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="editData"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        align-center
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
          :inline="true"
        >
          <el-form-item label="类别">
            <el-select
              v-model="form.ClassID"
              filterable
              placeholder=""
              style="width: 250px"
            >
              <el-option
                v-for="item in ClassList"
                :key="item.ClassID"
                :label="item.ClassName"
                :value="item.ClassID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备品名称">
            <el-input v-model="form.PartName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="备品描述">
            <el-input v-model="form.Description" style="width: 250px" />
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="form.Specification" style="width: 250px" />
          </el-form-item>
          <el-form-item label="设备">
            <el-input v-model="form.Equipment" style="width: 250px" />
          </el-form-item>
          <el-form-item label="供应商代码">
            <el-input v-model="form.VendorCode" style="width: 250px" />
          </el-form-item>
          <el-form-item label="安全库存">
            <el-input-number
              v-model="form.SafetyStock"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="最小库存">
            <el-input-number
              v-model="form.MinStock"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="最大库存">
            <el-input-number
              v-model="form.MaxStock"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="当前数量">
            <el-input-number
              v-model="form.CurrentQty"
              :min="1"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="周期">
            <el-input v-model="form.Cycle" style="width: 250px" />
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="form.Unit" style="width: 250px" />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <span class="dialog-footer">
            <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
            <el-button @click="addVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="addData"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
  import tableTem from "@/components/tableTem/index.vue";
  import {
    GetPartsList,
    addPartsData,
    updatePartsData,
    deletePartsData,
    GetPartsClassList,
  } from "@/api/sparePartsApi";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import {
    ref,
    unref,
    nextTick,
    reactive,
    onBeforeMount,
    watch,
    computed,
    onMounted,
    onBeforeUnmount,
  } from "vue";
  
  const userStore = useUserStoreWithOut();
  
  interface formTS {
    ClassID: string;
    PartName: string;
    Description: string;
    Specification: string;
    Equipment: string;
    VendorCode: string;
    Cycle: string;
    SafetyStock: number;
    MinStock: number;
    MaxStock: number;
    CurrentQty: number;
    Unit: string;
    CreatedBy: string;
  }
  
  interface EditFormTS {
    PartID: string;
    ClassID: string;
    PartName: string;
    Description: string;
    Specification: string;
    Equipment: string;
    VendorCode: string;
    Cycle: string;
    SafetyStock: number;
    MinStock: number;
    MaxStock: number;
    CurrentQty: number;
    Unit: string;
    UpdateBy: string;
  }
  
  //   const pageSize = ref(10);
  const currentPage = ref(1);
  const tableHeight = ref(0);
  const addVisible = ref(false);
  const editVisible = ref(false);
  const inputValue = ref("");
  const deleteVisible = ref(false);
  const deleteChoice = ref("");
  const pageObj = ref({
    pageSize: 30,
    currentPage: 1,
  });
  const loginName = userStore.getUserInfo;
  
  const formControl = ref({
    CleanAfterUses: false,
    CleanAfterPause: false,
    CleanAfterTime: false,
  });
  
  const editFormControl = ref({
    CleanAfterUses: false,
    CleanAfterPause: false,
    CleanAfterTime: false,
  });
  
  // watch(formControl, (newVal, oldVal) => {
  //   UsesUntilRevalidation = ''
  //     });
  
  const tableData = ref([]);
  const ClassList = ref<any[]>([]);
  
  const form = ref<formTS>({
    ClassID: "",
    PartName: "",
    Description: "",
    Specification: "",
    Equipment: "",
    VendorCode: "",
    Cycle: "",
    SafetyStock: 1,
    MinStock: 1,
    MaxStock: 1,
    CurrentQty: 1,
    Unit: "",
    CreatedBy: loginName,
  });
  
  const EditForm = ref<EditFormTS>({
    PartID: "",
    ClassID: "",
    PartName: "",
    Description: "",
    Specification: "",
    Equipment: "",
    VendorCode: "",
    Cycle: "",
    SafetyStock: 1,
    MinStock: 1,
    MaxStock: 1,
    CurrentQty: 1,
    Unit: "",
    UpdateBy: loginName,
  });
  
  const editSubmit = (data: any) => {
    EditForm.value.ClassID = data.ClassID;
    EditForm.value.PartID = data.PartID;
    EditForm.value.PartName = data.PartName;
    EditForm.value.Description = data.Description;
    EditForm.value.Specification = data.Specification;
    EditForm.value.Equipment = data.Equipment;
    EditForm.value.VendorCode = data.VendorCode;
    EditForm.value.Cycle = data.Cycle;
    EditForm.value.SafetyStock = data.SafetyStock;
    EditForm.value.MinStock = data.MinStock;
    EditForm.value.MaxStock = data.MaxStock;
    EditForm.value.CurrentQty = data.CurrentQty;
    EditForm.value.Unit = data.Unit;
    editVisible.value = true;
  };
  interface toolType {
    Text: string;
    Value: string;
  }
  
  const MaterialNameList = ref<toolType[]>([]);
  
  const clearForm = () => {
    form.value = {
      ClassID: "",
      PartName: "",
      Description: "",
      Specification: "",
      Equipment: "",
      VendorCode: "",
      Cycle: "",
      SafetyStock: 1,
      MinStock: 1,
      MaxStock: 1,
      CurrentQty: 1,
      Unit: "",
      CreatedBy: loginName,
    };
  
    formControl.value = {
      CleanAfterUses: false,
      CleanAfterPause: false,
      CleanAfterTime: false,
    };
  };
  
  const clearEditForm = () => {
    EditForm.value = {
      PartID: "",
      ClassID: "",
      PartName: "",
      Description: "",
      Specification: "",
      Equipment: "",
      VendorCode: "",
      Cycle: "",
      SafetyStock: 1,
      MinStock: 1,
      MaxStock: 1,
      CurrentQty: 1,
      Unit: "",
      UpdateBy: loginName,
    };
  };
  
  const getData = () => {
    GetPartsList({}).then((res: any) => {
      if (res && res.success && res.content.length !== 0) {
        tableData.value = res.content;
        //   ElNotification({
        //     title: res.msg,
        //     // message: "取消操作",
        //     type: "success",
        //   });
      }
    });
  };
  
  const getClassList = () => {
    GetPartsClassList({}).then((res: any) => {
      if (res && res.success && res.content.length !== 0) {
        ClassList.value = res.content;
        ElNotification({
          title: res.msg,
          // message: "取消操作",
          type: "success",
        });
      }
    });
  };
  
  const serachData = () => {
    if (inputValue.value === "") {
      getData();
    } else {
      GetPartsList({ PartName: inputValue.value }).then((res: any) => {
        if (res && res.success && res.content.length !== 0) {
          tableData.value = res.content;
          ElNotification({
            title: res.msg,
            // message: "取消操作",
            type: "success",
          });
        } else {
          tableData.value = res.content;
        }
      });
    }
  };
  
  const deleteSubmit = (data: any) => {
    //   deleteVisible.value = true;
    deleteChoice.value = data.CompName;
    ElMessageBox.confirm("确定删除", "确认操作", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deletePartsData(data.PartID, loginName).then((data: any) => {
          if (!data) {
            return;
          }
          ElNotification({
            type: "success",
            message: data.msg,
          });
          getData();
        });
      })
      .catch(() => {
        ElNotification({
          type: "info",
          message: "取消操作",
        });
      });
  };
  
  const addData = () => {
    addPartsData(form.value).then((res: any) => {
      if (res && res.success) {
        addVisible.value = false;
        ElNotification({
          title: res.msg,
          // message: "取消操作",
          type: "success",
        });
      }
      getData();
    });
  };
  
  const editData = () => {
    updatePartsData(EditForm.value).then((res: any) => {
      if (res && res.success) {
        editVisible.value = false;
        ElNotification({
          title: res.msg,
          // message: "取消操作",
          type: "success",
        });
      }
      getData();
    });
  };
  
  const columnData = reactive([
    //   {
    //     text: true,
    //     prop: "PartID",
    //     label: "备品编号",
    //     width: "",
    //     min: true,
    //     align: "1",
    //   },
    //   {
    //     text: true,
    //     prop: "ClassID",
    //     label: "类别编号",
    //     width: "",
    //     min: true,
    //     align: "1",
    //   },
    {
      text: true,
      prop: "PartName",
      label: "备品名称",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "Description",
      label: "放置地点",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "Specification",
      label: "品牌",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "Equipment",
      label: "剩余数量",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "VendorCode",
      label: "单位",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "Cycle",
      label: "有效期至",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "SafetyStock",
      label: "类别",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "MinStock",
      label: "状态",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "MaxStock",
      label: "安全库存",
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
          icon: "EditPen",
          buttonClick: editSubmit,
        },
        {
          type: "danger",
          label: "删除",
          icon: "Delete",
          buttonClick: deleteSubmit,
        },
        //   {
        //     type: "warning",
        //     label: "报废",
        //     icon: "Failed",
        //     buttonClick: null,
        //   },
      ],
    },
  ]);
  
  onBeforeMount(() => {
    getScreenHeight();
  });
  onMounted(() => {
    // getData();
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
      tableHeight.value = window.innerHeight - 205;
    });
  };
  </script>
  
  <style scoped>
  .el-pagination {
    justify-content: center;
  }
  
  ::v-deep .no_number input::-webkit-inner-spin-button,
  ::v-deep .no_number input::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
  }
  
  ::v-deep .no_number input[type="number"] {
    appearance: textfield;
  }
  </style>
  