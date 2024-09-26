<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="pb-2 flex justify-between">
        <el-button
          type="primary"
          @click="clearForm(), (addVisible = true), GetList()"
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
        <el-form-item label="入库单号">
          <el-input
            v-model="EditForm.InstockNo"
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
        <el-form-item label="出库单号">
          <el-input
            v-model="EditForm.OutstockNo"
            style="width: 250px"
            :disabled="EditForm.Type !== '1' && EditForm.Type !== '2'"
          />
        </el-form-item>
        <el-form-item label="归还人">
          <el-input
            v-model="EditForm.ReturnBy"
            style="width: 250px"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="归还日期">
          <el-date-picker
            v-model="EditForm.ReturnOn"
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
        <el-form-item label="采购单号">
          <el-input
            v-model="form.PurchaseNo"
            style="width: 250px"
            :disabled="form.Type !== 0"
          />
        </el-form-item>
        <!-- <el-form-item label="入库单号">
          <el-input
            v-model="form.InstockNo"
            style="width: 250px"
            :disabled="form.Type !== 2"
          />
        </el-form-item> -->
        <el-form-item label="出库单号">
          <el-input
            v-model="form.OutstockNo"
            style="width: 250px"
            :disabled="form.Type !== 1 && form.Type !== 2"
          />
        </el-form-item>
        <el-form-item label="归还人">
          <el-input
            v-model="form.ReturnBy"
            style="width: 250px"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="归还日期">
          <el-date-picker
            v-model="form.ReturnOn"
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
        <el-form-item label="入库数量" prop="Qty">
          <el-input-number v-model="inForm.Qty" :min="1" style="width: 250px" />
        </el-form-item>
        <el-form-item label="批次号" prop="PartNumber">
          <el-input
            v-model="inForm.PartNumber"
            style="width: 250px"
            :disabled="inFormType !== '1'"
          />
        </el-form-item>
        <el-form-item label="到期日期" prop="DueDate">
          <el-date-picker
            v-model="inForm.DueDate"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="inFormType !== '1'"
          />
        </el-form-item>
        <el-form-item label="资产编号" prop="AssetNumber">
          <el-input
            v-model="inForm.AssetNumber"
            style="width: 250px"
            :disabled="inFormType !== '1'"
          />
        </el-form-item>
        <el-form-item label="供应商" prop="Vendor">
          <el-input
            v-model="inForm.Vendor"
            style="width: 250px"
            :disabled="inFormType !== '1'"
          />
        </el-form-item>
        <el-form-item label="制造商" prop="Manufacturer">
          <el-input
            v-model="inForm.Manufacturer"
            style="width: 250px"
            :disabled="inFormType !== '1'"
          />
        </el-form-item>
        <el-form-item label="规格" prop="Specification">
          <el-input
            v-model="inForm.Specification"
            style="width: 250px"
            :disabled="inFormType !== '1'"
          />
        </el-form-item>
        <el-form-item label="库存" prop="StorageLocation">
          <el-input
            v-model="inForm.StorageLocation"
            style="width: 250px"
            :disabled="inFormType !== '1'"
          />
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
  GetPartInList,
  findChkInParameter,
  updatePartsIn,
  deletePartsInData,
  PartsInAdd,
  StartPartsIn,
  EndPartsIn,
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
  InstockNo: string;
  PurchaseNo: string;
  OutstockNo: string;
  ReturnBy: string;
  ReturnOn: string;
  Remark: string;
  CreatedBy: string;
}

interface EditFormTS {
  Chkin_sht: string;
  Type: string;
  InstockNo: string;
  PurchaseNo: string;
  OutstockNo: string;
  ReturnBy: string;
  ReturnOn: string;
  Remark: string;
  UpdateBy: string;
}

interface inFormTS {
  Chkin_sht: string;
  PartID: string;
  Qty: number;
  PartNumber: string;
  DueDate: string;
  AssetNumber: string;
  Vendor: string;
  Manufacturer: string;
  Specification: string;
  StorageLocation: string;
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
const typeList = ["采购入库", "归还入库", "维修入库"];
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
  InstockNo: "",
  PurchaseNo: "",
  OutstockNo: "",
  ReturnBy: "",
  ReturnOn: "",
  Remark: "",
  CreatedBy: loginName,
});

const EditForm = ref<EditFormTS>({
  Chkin_sht: "",
  Type: "0",
  InstockNo: "",
  PurchaseNo: "",
  OutstockNo: "",
  ReturnBy: "",
  ReturnOn: "",
  Remark: "",
  UpdateBy: loginName,
});

const inForm = ref<inFormTS>({
  Chkin_sht: "",
  PartID: "",
  Qty: 0,
  PartNumber: "",
  DueDate: "",
  AssetNumber: "",
  Vendor: "",
  Manufacturer: "",
  Specification: "",
  StorageLocation: "",
  CreatedBy: loginName,
});

const editSubmit = (data: any) => {
  console.log(data.ReturnOn);
  EditForm.value.Chkin_sht = data.Chkin_sht;
  EditForm.value.Type = data.Type;
  EditForm.value.InstockNo = data.InstockNo;
  EditForm.value.PurchaseNo = data.PurchaseNo;
  EditForm.value.OutstockNo = data.OutstockNo;
  EditForm.value.Remark = data.Remark;
  EditForm.value.ReturnBy = data.ReturnBy;
  EditForm.value.ReturnOn = data.ReturnOn;
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
    InstockNo: "",
    PurchaseNo: "",
    OutstockNo: "",
    ReturnBy: "",
    ReturnOn: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const inFormClose = () => {
  inFormRef.value.resetFields();
  InVisible.value = false;
};

const clearEditForm = () => {
  EditForm.value = {
    Chkin_sht: "",
    Type: "0",
    InstockNo: "",
    PurchaseNo: "",
    OutstockNo: "",
    ReturnBy: "",
    ReturnOn: "",
    Remark: "",
    UpdateBy: loginName,
  };
};

const typeChange = () => {
  form.value = {
    Type: form.value.Type,
    InstockNo: "",
    PurchaseNo: "",
    OutstockNo: "",
    ReturnBy: "",
    ReturnOn: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const showInForm = (data: any) => {
  if (data.Status !== 0) {
    ElNotification({
      title: "该项开始入库已完成",
      // message: "取消操作",
      type: "warning",
    });
    return;
  }
  GetList();
  InVisible.value = true;
  inForm.value.Chkin_sht = data.Chkin_sht;
  inFormType.value = data.Type;
  console.log(inForm.value);
};

const getData = () => {
  GetPartInList({}).then((res: any) => {
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
  StartPartsIn(inForm.value).then((res: any) => {
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
    GetPartInList({"InstockNo": inputValue.value}).then((res: any) => {
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
      deletePartsInData(data.Chkin_sht, loginName).then((data: any) => {
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
  ElMessageBox.confirm("确定入库", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      EndPartsIn(data.Chkin_sht, loginName).then((data: any) => {
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
  PartsInAdd(form.value).then((res: any) => {
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
  updatePartsIn(EditForm.value).then((res: any) => {
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
    prop: "InstockNo",
    label: "入库单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "采购入库", type: "primary", number: "0" },
      { text: "归还入库", type: "primary", number: "1" },
      { text: "维修入库", type: "primary", number: "2" },
    ],
    prop: "Type",
    label: "入库类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PurchaseNo",
    label: "采购单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "OutstockNo",
    label: "归还单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "待入库", type: "primary", number: 0 },
      { text: "入库中", type: "primary", number: 1 },
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
    prop: "LendID",
    label: "借出编号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ReturnBy",
    label: "归还人",
    width: "",
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
        label: "开始入库",
        icon: "VideoPlay",
        buttonClick: showInForm,
      },
      {
        type: "info",
        label: "完成入库",
        icon: "CircleCheck",
        buttonClick: inPartSubmit,
      }
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
