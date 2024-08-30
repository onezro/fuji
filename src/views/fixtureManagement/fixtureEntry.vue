<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div class="pb-[10px] flex justify-between">
        <el-button type="primary" @click="addVisible = true">添加</el-button>
        <div class="flex"></div>
      </div>
      <table-tem
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </table-tem>
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
        <el-form-item label="工治具编号" prop="compid">
          <el-input
          disabled
            v-model="EditForm.compid"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="工治具类型" prop="compname">
          <el-select
            v-model="EditForm.compname"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in compnameList"
              :key="item.CompName"
              :label="item.CompName"
              :value="item.CompName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库位" prop="location">
          <el-input
            v-model="EditForm.location"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="代应商" prop="Supplier">
          <el-input
            v-model="EditForm.Supplier"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="LotNumber">
          <el-input
            v-model="EditForm.LotNumber"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="到期日期" prop="ExpirationDate">
          <el-date-picker
            style="width: 240px"
            v-model="EditForm.ExpirationDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="供应商料号" prop="ManufacturerPartNumber">
          <el-input
            v-model="EditForm.ManufacturerPartNumber"
            style="width: 240px"
            :rows="1"
            type="textarea"
            class="custom-textarea"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="EditForm.remark"
            style="width: 240px"
            :rows="2"
            type="textarea"
            class="custom-textarea"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="editVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="editConfirm"> 确定 </el-button>
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
        <el-form-item label="工治具编号" prop="compid">
          <el-input
            v-model="form.compid"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="工治具类型" prop="compname">
          <el-select
            v-model="form.compname"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in compnameList"
              :key="item.CompName"
              :label="item.CompName"
              :value="item.CompName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库位" prop="location">
          <el-input
            v-model="form.location"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="代应商" prop="Supplier">
          <el-input
            v-model="form.Supplier"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="LotNumber">
          <el-input
            v-model="form.LotNumber"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="到期日期" prop="ExpirationDate">
          <el-date-picker
            style="width: 240px"
            v-model="form.ExpirationDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="供应商料号" prop="ManufacturerPartNumber">
          <el-input
            v-model="form.ManufacturerPartNumber"
            style="width: 240px"
            :rows="2"
            type="textarea"
            class="custom-textarea"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 240px"
            :rows="2"
            type="textarea"
            class="custom-textarea"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="addSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="deleteVisible" title="Tips" width="500">
      <span>删除确认</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteConfirm"> 删除 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { ToolsDetail, ToolsType } from "@/api/permiss";
import { useUserStoreWithOut } from "@/stores/modules/user";
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
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;

interface tableDataTS {
  number: string;
  type: string;
  consumption: string;
  process: string;
  FaceType: string;
  Des: string;
}

interface formTS {
  compid: string;
  compname: string;
  location: string;
  ManufacturerPartNumber: string;
  Manufacturer: string;
  Supplier: string;
  LotNumber: string;
  remark: string;
  user: string;
  ExpirationDate: string;
}

interface EditFormTS {
  compid: string;
  compname: string;
  location: string;
  ManufacturerPartNumber: string;
  Manufacturer: string;
  Supplier: string;
  LotNumber: string;
  remark: string;
  user: string;
  ExpirationDate: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const inputValue = ref();
const deleteVisible = ref(false);
const deleteChoice = ref("");
const compnameList = ref<any>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const tableData = ref([]);

const form = ref<formTS>({
  compid: "",
  compname: "",
  location: "",
  ManufacturerPartNumber: "",
  Manufacturer: "",
  Supplier: "",
  LotNumber: "",
  remark: "",
  user: loginName,
  ExpirationDate: "",
});

const EditForm = ref<EditFormTS>({
  compid: "",
  compname: "",
  location: "",
  ManufacturerPartNumber: "",
  Manufacturer: "",
  Supplier: "",
  LotNumber: "",
  remark: "",
  user: loginName,
  ExpirationDate: "",
});

const clearForm = () => {
  form.value = {
    compid: "",
    compname: "",
    location: "",
    ManufacturerPartNumber: "",
    Manufacturer: "",
    Supplier: "",
    LotNumber: "",
    remark: "",
    user: loginName,
    ExpirationDate: "",
  };
};

const clearEditForm = () => {
  EditForm.value = {
    compid: "",
    compname: "",
    location: "",
    ManufacturerPartNumber: "",
    Manufacturer: "",
    Supplier: "",
    LotNumber: "",
    remark: "",
    user: loginName,
    ExpirationDate: "",
  };
};

const addSumbit = () => {
  ToolsDetail({
    ...form.value,
    operationtype: "ADD",
  }).then((data: any) => {
    if (!data) {
      return;
    }
    clearForm();
    ElMessage({
      message: data.msg,
      type: "success",
    });
    getData();
    addVisible.value = false;
  });
};

const editSubmit = (data: any) => {
  console.log(data);
  EditForm.value.compid = data.CompID;
  EditForm.value.compname = data.CompName;
  EditForm.value.location = data.Location;
  EditForm.value.ManufacturerPartNumber = data.ManufacturerPartNumber;
  // EditForm.value.Manufacturer = data.Manufacturer;
  EditForm.value.Supplier = data.Supplier;
  EditForm.value.LotNumber = data.LotNumber;
  EditForm.value.remark = data.Remark;
  EditForm.value.ExpirationDate = data.ExpirationDate;
  editVisible.value = true;
};

const editConfirm = () => {
  ToolsDetail({
    ...EditForm.value,
    operationtype: "UPD",
  }).then((data: any) => {
    if (!data) {
      return;
    }
    clearEditForm();
    ElMessage({
      message: data.msg,
      type: "success",
    });
    getData();
    editVisible.value = false;
  });
};

const deleteSubmit = (data: any) => {
  deleteVisible.value = true;
  deleteChoice.value = data.CompID;
};

const deleteConfirm = () => {
  ToolsDetail({ CompID: deleteChoice.value, operationtype: "DEL" }).then(
    (data: any) => {
      if (!data) {
        return;
      }
      ElMessage({
        message: data.msg,
        type: "success",
      });
      getData();
    }
  );
  deleteVisible.value = false;
};

const columnData = reactive([
  {
    text: true,
    prop: "CompID",
    label: "工治具编号",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "CompName",
    label: "工治具类型",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "Location",
    label: "库位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ExpirationDate",
    label: "到期日期",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [{ text: "未清洗", type: "primary", number: 0 },{ text: "已清洗", type: "warning", number: 1 }],
    prop: "CleanStatus",
    label: "库位",
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
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getCompnameList();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  ToolsDetail({ operationtype: "QAL" }).then((data: any) => {
    const dataText = data.content;
    tableData.value = dataText;
  });
};

const getCompnameList = () => {
  ToolsType({ operationtype: "QAL" }).then((data: any) => {
    const dataText = data.content;
    compnameList.value = dataText;
  });
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
    tableHeight.value = window.innerHeight - 215;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
/* 隐藏滚动条，但保持可滚动功能 */
/* .custom-textarea ::-webkit-scrollbar {
  display: none; 
} */
</style>
