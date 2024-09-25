<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="pb-2 flex justify-between">
        <el-button type="primary" @click="clearForm(), (addVisible = true)"
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
        ref="editFormRef"
        :model="EditForm"
        label-position="left"
        label-width="auto"
        :inline="true"
      >
        <el-form-item label="出库单号">
          <el-input
            v-model="EditForm.OutstockNo"
            style="width: 250px"
            disabled
          />
        </el-form-item>
        <!-- <el-form-item label="采购单号">
            <el-input
              v-model="EditForm.PurchaseNo"
              style="width: 250px"
              :disabled="EditForm.Type !== '0'"
            />
          </el-form-item> -->
        <el-form-item label="部门">
          <el-input v-model="EditForm.Department" style="width: 250px" />
        </el-form-item>
        <el-form-item label="借出人">
          <el-input
            v-model="EditForm.LendBy"
            style="width: 250px"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="借出日期">
          <el-date-picker
            v-model="EditForm.LendOn"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="借出原因">
          <el-input
            v-model="EditForm.LendReason"
            style="width: 250px"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="归还日期">
          <el-date-picker
            v-model="EditForm.ReturnDate"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="EditForm.Remark" style="width: 250px" />
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
            v-model="form.Type"
            filterable
            style="width: 250px"
            @change="typeChange()"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="form.Department" style="width: 250px" />
        </el-form-item>
        <el-form-item label="借出人">
          <el-input
            v-model="form.LendBy"
            style="width: 250px"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="借出原因">
          <el-input
            v-model="form.LendReason"
            style="width: 250px"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="借出日期">
          <el-date-picker
            v-model="form.LendOn"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="归还日期">
          <el-date-picker
            v-model="form.ReturnDate"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.Remark" style="width: 250px" />
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
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="InVisible"
      @close="inFormClose"
      title="开始入库"
      width="50%"
    >
      <el-form
        ref="inFormRef"
        :model="inForm"
        label-position="left"
        label-width="100"
        :inline="true"
      >
        <el-form-item label="备品名称" prop="PartID">
          <el-select
            v-model="inForm.PartID"
            filterable
            placeholder=""
            style="width: 250px"
          >
            <el-option
              v-for="item in PartList"
              :key="item.PartID"
              :label="item.PartName"
              :value="item.PartID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出库数量" prop="Qty">
          <el-input-number v-model="inForm.Qty" :min="1" style="width: 250px" />
        </el-form-item>
        <el-form-item label="货架编码" prop="StockID">
          <el-input v-model="inForm.StockID" style="width: 250px" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="inFormClose()"> 取消 </el-button>
          <el-button type="primary" @click="startPartIn"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  GetPartsOutList,
  findChkOutParameter,
  PartsOutAdd,
  deletePartsOut,
  updatePartsOut,
  StartPartsOut,
  EndPartsOut,
  GetPartsList,
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
  Type: number;
  Department: string;
  LendOn: string;
  LendBy: string;
  LendReason: string;
  ReturnDate: string;
  Remark: string;
  CreatedBy: string;
}

interface EditFormTS {
  Chkout_sht: string;
  Type: string;
  OutstockNo: string;
  Department: string;
  LendOn: string;
  LendBy: string;
  LendReason: string;
  ReturnDate: string;
  Remark: string;
  UpdateBy: string;
}

interface inFormTS {
  Chkout_sht: string;
  StockID: string;
  PartID: string;
  Qty: number;
  CreatedBy: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const InVisible = ref(false);
const editVisible = ref(false);
const inputValue = ref("");
const deleteVisible = ref(false);
const deleteChoice = ref("");
const inFormRef = ref();
const inFormType = ref("");
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const typeList = ["领用", "借出"];
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
const PartList = ref<any[]>([]);

const form = ref<formTS>({
  Type: 0,
  Department: "",
  LendOn: "",
  LendBy: "",
  LendReason: "",
  ReturnDate: "",
  Remark: "",
  CreatedBy: loginName,
});

const EditForm = ref<EditFormTS>({
  Chkout_sht: "",
  Type: "",
  OutstockNo: "",
  Department: "",
  LendOn: "",
  LendBy: "",
  LendReason: "",
  ReturnDate: "",
  Remark: "",
  UpdateBy: loginName,
});

const inForm = ref<inFormTS>({
  Chkout_sht: "",
  StockID: "",
  PartID: "",
  Qty: 1,
  CreatedBy: loginName,
});

const editSubmit = (data: any) => {
  console.log(data.ReturnOn);
  EditForm.value.Chkout_sht = data.Chkout_sht;
  EditForm.value.Type = data.Type;
  EditForm.value.OutstockNo = data.OutstockNo;
  EditForm.value.Department = data.Department;
  EditForm.value.LendBy = data.LendBy;
  EditForm.value.LendOn = data.LendOn;
  EditForm.value.LendReason = data.LendReason;
  EditForm.value.ReturnDate = data.ReturnDate;
  EditForm.value.Remark = data.Remark;
  editVisible.value = true;
};

interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
    Type: 0,
    Department: "",
    LendOn: "",
    LendBy: "",
    LendReason: "",
    ReturnDate: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const inFormClose = () => {
  inFormRef.value.resetFields();
  InVisible.value = false;
  inForm.value.CreatedBy = loginName;
};

const clearEditForm = () => {
  EditForm.value = {
    Chkout_sht: "",
    Type: "",
    OutstockNo: "",
    Department: "",
    LendOn: "",
    LendBy: "",
    LendReason: "",
    ReturnDate: "",
    Remark: "",
    UpdateBy: loginName,
  };
};

const typeChange = () => {
  form.value = {
    Type: form.value.Type,
    Department: "",
    LendOn: "",
    LendBy: "",
    LendReason: "",
    ReturnDate: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const showInForm = (data: any) => {
  if (data.Status !== 0) {
    ElNotification({
      title: "该项正在出库",
      // message: "取消操作",
      type: "warning",
    });
    return;
  }
  GetList();
  InVisible.value = true;
  inForm.value.Chkout_sht = data.Chkout_sht;
  inFormType.value = data.Type;
  console.log(inForm.value);
};

//查询所有
const getData = () => {
  GetPartsOutList({}).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.content;
      //   ElNotification({
      //     title: res.msg,
      //     // message: "取消操作",
      //     type: "success",
      //   });
    }
  });
};

const startPartIn = () => {
  InVisible.value = false;
  StartPartsOut(inForm.value).then((res: any) => {
    if (res && res.success) {
      ElNotification({
        title: res.msg,
        // message: "取消操作",
        type: "success",
      });
      getData();
    }
  });
};

const GetList = () => {
  GetPartsList({}).then((res: any) => {
    if (res && res.success && res.content.length !== 0) {
      PartList.value = res.content;
      // ElNotification({
      //   title: res.msg,
      //   // message: "取消操作",
      //   type: "success",
      // });
    }
  });
};

const serachData = () => {
  if (inputValue.value === "") {
    getData();
  } else {
    GetPartsOutList({ InstockNo: inputValue.value }).then((res: any) => {
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
  //   deleteChoice.value = data.CompName;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePartsOut(data.Chkout_sht, loginName).then((data: any) => {
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

const PartIDChoice = (data: any) => {
  PartList.value.forEach((element) => {
    if (data === element.PartID) {
      console.log(element);
    }
  });
};

const inPartSubmit = (data: any) => {
  //   deleteVisible.value = true;
  ElMessageBox.confirm("确定出库", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      EndPartsOut(data.Chkin_sht, loginName).then((data: any) => {
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
  PartsOutAdd(form.value).then((res: any) => {
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
  updatePartsOut(EditForm.value).then((res: any) => {
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
    prop: "OutstockNo",
    label: "出库单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "领用", type: "primary", number: "0" },
      { text: "借出", type: "primary", number: "1" },
    ],
    prop: "Type",
    label: "出库类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "LendBy",
    label: "借出人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "LendOn",
    label: "借出时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "LendReason",
    label: "借出原因",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ReturnDate",
    label: "归还日期",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "待出库", type: "primary", number: 0 },
      { text: "出库中", type: "primary", number: 1 },
      { text: "已完成", type: "primary", number: 2 },
    ],
    prop: "Status",
    label: "状态",
    width: "80",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "创建人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "创建时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Department",
    label: "部门",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "",
    min: true,
    align: "center",
  },
  {
    isOperation: true,
    label: "操作",
    width: "240",
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
      {
        type: "success",
        label: "开始出库",
        icon: "VideoPlay",
        buttonClick: showInForm,
      },
      {
        type: "info",
        label: "完成出库",
        icon: "CircleCheck",
        buttonClick: inPartSubmit,
      },
    ],
  },
]);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  getData();
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
