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
        <el-form-item label="工治具类型编码" prop="compname">
          <el-select
            v-model="EditForm.compname"
            placeholder="请选择"
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
        <el-form-item label="消耗量" prop="usage">
          <el-input
            v-model="EditForm.usage"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input
            v-model="EditForm.status"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="productname">
          <el-input
            v-model="EditForm.productname"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="产品描述" prop="productdsc">
          <el-input
            v-model="EditForm.productdsc"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="程序代码" prop="procedurecode">
          <el-input
            v-model="EditForm.procedurecode"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="程序描述" prop="proceduredsc">
          <el-input
            v-model="EditForm.proceduredsc"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <!-- <el-form-item label="" prop="compid">
          <el-input
            v-model="form.side"
            style="width: 240px"
            :rows="2"
            type="textarea"
          />
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="EditForm.remark"
            style="width: 240px"
            placeholder="请输入"
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
        <el-form-item label="工治具类型编码" prop="compname">
          <el-select
            v-model="form.compname"
            placeholder="请选择"
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
        <el-form-item label="消耗量" prop="usage">
          <el-input
            v-model="form.usage"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input
            v-model="form.status"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="productname">
          <el-input
            v-model="form.productname"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="产品描述" prop="productdsc">
          <el-input
            v-model="form.productdsc"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="程序代码" prop="procedurecode">
          <el-input
            v-model="form.procedurecode"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="程序描述" prop="proceduredsc">
          <el-input
            v-model="form.proceduredsc"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
        <!-- <el-form-item label="" prop="compid">
          <el-input
            v-model="form.side"
            style="width: 240px"
            :rows="2"
            type="textarea"
          />
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 240px"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible"> 取消 </el-button>
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
import { ToolsDetail, ToolsType, ToolsSpec } from "@/api/permiss";
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

interface formTS {
  usage: number;
  status: number;
  operationtype: string;
  productname: string;
  productdsc: string;
  compname: string;
  procedurecode: string;
  proceduredsc: string;
  side: string;
  remark: string;
  user: string;
}

interface EditFormTS {
  usage: number;
  status: number;
  operationtype: string;
  productname: string;
  productdsc: string;
  compname: string;
  procedurecode: string;
  proceduredsc: string;
  side: string;
  remark: string;
  user: string;
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
  usage: 0,
  status: 0,
  operationtype: "",
  productname: "",
  productdsc: "",
  compname: "",
  procedurecode: "",
  proceduredsc: "",
  side: "",
  remark: "",
  user: loginName,
});

const EditForm = ref<EditFormTS>({
  usage: 0,
  status: 0,
  operationtype: "QAL",
  productname: "string",
  productdsc: "string",
  compname: "string",
  procedurecode: "string",
  proceduredsc: "string",
  side: "string",
  remark: "string",
  user: loginName,
});

const clearForm = () => {
  form.value = {
    usage: 0,
    status: 0,
    operationtype: "QAL",
    productname: "string",
    productdsc: "string",
    compname: "string",
    procedurecode: "string",
    proceduredsc: "string",
    side: "string",
    remark: "string",
    user: loginName,
  };
};

const clearEditForm = () => {
  EditForm.value = {
    usage: 0,
    status: 0,
    operationtype: "QAL",
    productname: "string",
    productdsc: "string",
    compname: "string",
    procedurecode: "string",
    proceduredsc: "string",
    side: "string",
    remark: "string",
    user: loginName,
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
  // EditForm.value.compid = data.CompID;
  // EditForm.value.compname = data.CompName;
  // EditForm.value.location = data.Location;
  // EditForm.value.ManufacturerPartNumber = data.CompID;
  // EditForm.value.Manufacturer = data.ManufacturerPartNumber;
  // EditForm.value.Supplier = data.Supplier;
  // EditForm.value.LotNumber = data.LotNumber;
  // EditForm.value.remark = data.Remark;
  // EditForm.value.ExpirationDate = data.ExpirationDate;
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
    label: "产品名称",
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
    label: "状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Location",
    label: "消耗量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Location",
    label: "产品描述",
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
  getCompnameList();
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  ToolsSpec({ operationtype: "QAL" }).then((data: any) => {
    if (data.content === null) {
      return;
    }
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
</style>
