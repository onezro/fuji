<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <div class="flex">
          <!-- <el-input
              v-model="inputValue"
              style="width: 240px"
              placeholder="请输入"
              clearable
            ></el-input> -->
          <el-form ref="formRef" class="form" :inline="true" label-width="">
            <el-form-item label="故障代码" class="mb-2">
              <el-input
                size="small"
                v-model="searchForm.ErrorCode"
                style="width: 180px"
                placeholder=""
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="故障名称" class="mb-2">
              <el-input
                size="small"
                v-model="searchForm.ErrorName"
                style="width: 180px"
                placeholder=""
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="" class="mb-2">
              <el-button
                class="ml-3"
                type="primary"
                @click="searchData"
                size="small"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <!-- <el-input v-model="inputValue" placeholder="请输入">
                          <template #append>
                              <el-button type="primary" icon="Search" @click="serachData"></el-button> </template></el-input> -->
        </div>
        <el-button
          class="mb-2"
          type="primary"
          @click="clearForm(), (addVisible = true)"
          size="small"
          >新增故障代码</el-button
        >
      </div>
      <!-- <table-tem
          size="small"
          :show-index="true"
          :tableData="tableData"
          :tableHeight="tableHeight"
          :columnData="columnData"
          :pageObj="pageObj"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-tem> -->
      <el-table
        border
        size="small"
        :data="
          tableData?.slice(
            (pageObj.currentPage - 1) * pageObj.pageSize,
            pageObj.currentPage * pageObj.pageSize
          )
        "
        :height="tableHeight"
        center
        stripe
      >
        <el-table-column
          prop="ErrorCode"
          align="center"
          label="故障代码"
          :min-width="flexColumnWidth('故障代码', 'ErrorCode')"
        >
        </el-table-column>
        <el-table-column
          prop="ErrorName"
          align="center"
          label="故障名称"
          :min-width="flexColumnWidth('故障名称', 'ErrorName')"
        >
        </el-table-column>
        <el-table-column
          prop="RepairMethod"
          align="center"
          label="修复方法"
          :min-width="flexColumnWidth('修复方法', 'RepairMethod')"
        >
        </el-table-column>
        <el-table-column
          prop="ErrorDesc"
          align="center"
          label="故障描述"
          :min-width="flexColumnWidth('故障描述', 'ErrorDesc')"
        >
        </el-table-column>
        <!-- <el-table-column prop="LendID" align="center" label="借出编号"> </el-table-column> -->
        <el-table-column
          prop="ErrorNote"
          align="center"
          label="故障记录"
          :min-width="flexColumnWidth('归还人', 'ErrorNote')"
        >
        </el-table-column>
        <el-table-column
          prop="CreatedBy"
          align="center"
          label="创建人"
          :min-width="flexColumnWidth('创建人', 'CreatedBy')"
        >
        </el-table-column>
        <el-table-column
          prop="CreatedOn"
          align="center"
          label="创建时间"
          :min-width="flexColumnWidth('创建时间', 'CreatedOn')"
        >
        </el-table-column>
        <el-table-column
          prop="ReturnDate"
          fixed="right"
          align="center"
          label="操作"
          width="180"
        >
          <template #default="scope">
            <div class="w-full">
              <el-tooltip content="开始" placement="top">
                <el-button
                  type="success"
                  icon="CaretRight"
                  size="small"
                  @click="startSubmit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="结束" placement="top">
                <el-button
                  type="warning"
                  icon="VideoPause"
                  size="small"
                  @click="startSubmit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="确认维修" placement="top">
                <el-button
                  type="primary"
                  icon="Check"
                  size="small"
                  @click="editSubmit(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize"
          :page-sizes="[10, 30, 50, 100, 150]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData?.length"
        >
        </el-pagination>
      </div>
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
        <el-form-item label="故障代码类型">
          <el-select
            v-model="EditForm.ErrorTypeCode"
            placeholder=""
            style="width: 250px"
          >
            <el-option
              v-for="item in faultCodeType"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="故障名称类型">
          <el-select
            v-model="EditForm.ErrorTypeName"
            placeholder=""
            style="width: 250px"
          >
            <el-option
              v-for="item in faultNameType"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="故障代码">
          <el-input v-model="EditForm.ErrorCode" style="width: 250px" />
        </el-form-item>
        <el-form-item label="故障名称">
          <el-input v-model="EditForm.ErrorName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="故障记录">
          <el-input v-model="EditForm.ErrorNote" style="width: 250px" />
        </el-form-item>
        <el-form-item label="修复方法">
          <el-input v-model="EditForm.RepairMethod" style="width: 250px" />
        </el-form-item>
        <el-form-item label="故障描述">
          <el-input v-model="EditForm.ErrorDesc" style="width: 250px" />
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
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close=""
      title="添加维修记录"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
        :inline="true"
      >
        <!-- <el-form-item label="故障代码类型">
          <el-select
            v-model="form.ErrorTypeCode"
            placeholder=""
            style="width: 250px"
          >
            <el-option
              v-for="item in faultCodeType"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="故障单号">
          <el-input v-model="form.ErrorOrder" style="width: 250px" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="form.EquipmentName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="设备标识">
          <el-input v-model="form.EquipmentGuid" style="width: 250px" />
        </el-form-item>
        <el-form-item label="故障代码标识">
          <el-input v-model="form.ErrorCodeGuid" style="width: 250px" />
        </el-form-item>
        <el-form-item label="故障记录">
          <el-input v-model="form.ErrorNote" style="width: 250px" />
        </el-form-item>
        <el-form-item label="故障描述">
          <el-input type="textarea" v-model="form.ErrorDesc" style="width: 250px" />
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
  findEquipmentErrorRecord,
  addEquipmentErrorRecord,
  updateStartRepair,
  updateEndRepair,
  RepairConfirm,
} from "@/api/sparePartsApi";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { GetComboBoxList } from "@/api/operate";
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
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";

const userStore = useUserStoreWithOut();

interface formTS {
  "ErrorOrder": string;
  "EquipmentGuid": string;
  "EquipmentName": string;
  "ErrorCodeGuid": string;
  "ErrorDesc": string;
  "ErrorNote": string;
  "RowDeleted": boolean;
  "CreatedBy": string;
}

interface EditFormTS {
  ErrorTypeCode: string;
  ErrorTypeName: string;
  ErrorCode: string;
  ErrorName: string;
  ErrorDesc: string;
  RepairMethod: string;
  ErrorNote: string;
  CreatedBy: string;
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

interface SearchFormTS {
  ErrorCode: string;
  ErrorName: string;
}

interface detailFormTS {
  TypeName: string;
  InstockNo: string;
  PurhaseNo: string;
  OutstockNo: string;
  ReturnBy: string;
  InStockStatus: string;
  CreatedBy: string;
  CreatedOn: string;
  Remark: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const InVisible = ref(false);
const editVisible = ref(false);
const dateValue = ref<any[]>([]);
const detailVisible = ref(false);
const detailTable = ref<any[]>([]);
const deleteChoice = ref("");
const inFormRef = ref();
const inFormType = ref("");
const tableData1 = ref<any[]>([]);
const faultCodeType = ref();
const faultNameType = ref();
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const pageObj1 = ref({
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

const tableData = ref([{}]);
const PartList = ref<any[]>([]);

const form = ref<formTS>({
  ErrorOrder: "",
  EquipmentGuid: "",
  EquipmentName: "",
  ErrorCodeGuid: "",
  ErrorDesc: "",
  ErrorNote: "",
  RowDeleted: true,
  CreatedBy: "",
});

const EditForm = ref<EditFormTS>({
  ErrorTypeCode: "",
  ErrorTypeName: "",
  ErrorCode: "",
  ErrorName: "",
  ErrorDesc: "",
  RepairMethod: "",
  ErrorNote: "",
  CreatedBy: "",
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

const searchForm = ref<SearchFormTS>({
  ErrorCode: "",
  ErrorName: "",
});

const detailForm = ref<detailFormTS>({
  TypeName: "",
  InstockNo: "",
  PurhaseNo: "",
  OutstockNo: "",
  ReturnBy: "",
  InStockStatus: "",
  CreatedBy: "",
  CreatedOn: "",
  Remark: "",
});

const editSubmit = (data: any) => {
  console.log(data.ReturnOn);
  EditForm.value.CreatedBy = loginName;
  EditForm.value.ErrorCode = data.ErrorCode;
  EditForm.value.ErrorDesc = data.ErrorDesc;
  EditForm.value.ErrorName = data.ErrorName;
  EditForm.value.ErrorNote = data.ErrorNote;
  EditForm.value.ErrorTypeCode = data.ErrorTypeCode;
  EditForm.value.ErrorTypeName = data.ErrorTypeName;
  EditForm.value.RepairMethod = data.RepairMethod;
  editVisible.value = true;
};

interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
  ErrorOrder: "",
  EquipmentGuid: "",
  EquipmentName: "",
  ErrorCodeGuid: "",
  ErrorDesc: "",
  ErrorNote: "",
  RowDeleted: true,
  CreatedBy: "",
};
};

const inFormClose = () => {
  inFormRef.value.resetFields();
  InVisible.value = false;
};

const clearEditForm = () => {
  EditForm.value = {
    ErrorTypeCode: "",
    ErrorTypeName: "",
    ErrorCode: "",
    ErrorName: "",
    ErrorDesc: "",
    RepairMethod: "",
    ErrorNote: "",
    CreatedBy: "",
  };
};

const typeChange = () => {
  form.value = {
  ErrorOrder: "",
  EquipmentGuid: "",
  EquipmentName: "",
  ErrorCodeGuid: "",
  ErrorDesc: "",
  ErrorNote: "",
  RowDeleted: true,
  CreatedBy: "",
};
};

const getData = () => {
  findEquipmentErrorRecord({}).then((res: any) => {
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

//根据名称获取配置值
const getTypeList = () => {
  GetComboBoxList("ReturnType").then((res: any) => {
    faultCodeType.value = res.content;
    faultNameType.value = res.content;
  });
};

// const dateChange = (data: any) => {
//   if (data !== null && data !== "") {
//     searchForm.value.StartDate = data[0];
//     searchForm.value.EndDate = data[1];
//   } else {
//     searchForm.value.StartDate = "";
//     searchForm.value.EndDate = "";
//   }
// };

const searchData = () => {
  findEquipmentErrorRecord(searchForm.value).then((res: any) => {
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

const startSubmit = (data: any) => {
  //   deleteVisible.value = true;
  // deleteChoice.value = data.EquipmentErrorRecordGuid;
  ElMessageBox.confirm("确定开始维修", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      updateStartRepair({
        EquipmentErrorRecordGuid: data.EquipmentErrorRecordGuid,
      }).then((res: any) => {
        if (!res) {
          return;
        }
        ElNotification({
          type: "success",
          message: res.msg,
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
  addEquipmentErrorRecord(form.value).then((res: any) => {
    if (res && res.success) {
      addVisible.value = false;
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
    }
    getData();
  });
};

const columnData = reactive([
  {
    text: true,
    prop: "PartName",
    label: "备件名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PartDesc",
    label: "备件描述",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ClassName",
    label: "类型名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "InstockNo",
    label: "入库单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PartNumber",
    label: "批次号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "库存数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "DueDate",
    label: "到期日期",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "AssetNumber",
    label: "资产编号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Vendor",
    label: "供应商",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Manufacturer",
    label: "制造商",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Specification",
    label: "规格型号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "StorageLocation",
    label: "库存位置",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "入库人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "入库时间",
    width: "",
    min: true,
    align: "center",
  },
]);

onBeforeMount(() => {
  getScreenHeight();
  getTypeList();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  dateValue.value = [start, end];
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

const handleSizeChange1 = (val: any) => {
  pageObj1.value.currentPage = 1;
  pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  pageObj1.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};

//el-table自动计算宽度
const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  return getMaxLength(arr) + 25 + "px";
};

const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};
const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
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
