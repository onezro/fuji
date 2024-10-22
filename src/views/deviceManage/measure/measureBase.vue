<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="pb-2 flex justify-between" ref="headerRef">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
        <!-- <div class="flex">
                    <el-input v-model.trim="searchName" style="width: 300px" clearable placeholder="请输入" size="small">
                        <template #append>
                            <el-button type="primary" icon="Search" size="small"></el-button> </template></el-input>
</div> -->
      </div>
      <!-- <table-tem :show-index="true" size="small" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem> -->
      <el-table
        :data="
          tableData.slice(
            (pageObj.currentPage - 1) * pageObj.pageSize,
            pageObj.currentPage * pageObj.pageSize
          )
        "
        border
        :height="tableHeight"
        style="width: 100%"
        size="small"
        highlight-current-row
        @cell-click="cellClick"
      >
        <el-table-column
          type="index"
          align="center"
          fixed
          label="序号"
          :width="'50'"
        ></el-table-column>
        <el-table-column prop="Name" label="名称" width="150" fixed />
        <el-table-column prop="Description" label="描述" width="150" />
        <el-table-column prop="Type" label="类型">
          <template #default="scope">
            <el-tag
              :type="scope.row.Type == '0' ? 'primary' : 'warning'"
              size="small"
              >{{ scope.row.Type == 0 ? "量具" : "检具" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="Model" label="产品型号" width="150" />
        <el-table-column prop="Specification" label="详细规格" width="150" />
        <el-table-column prop="PrecisionLevel" label="精度等级" width="150" />
        <el-table-column
          prop="NextCalibrationDate"
          label="下次校准时间"
          width="150"
        />
        <el-table-column prop="Department" label="使用部门" width="150" />
        <el-table-column prop="Status" label="状态" width="150" />
        <el-table-column prop="UpdateBy" label="更新人" width="150" />
        <el-table-column prop="UpdateOn" label="更新时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                icon="EditPen"
                size="small"
                @click.prevent="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="校验" placement="top">
              <el-button
                type="warning"
                icon="Document"
                size="small"
                :disabled="computedDate(scope.row.NextCalibrationDate)"
                @click.prevent="handleAdd(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block mt-2 mb-2">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize"
          :page-sizes="[15, 30, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="tableData.length"
        >
        </el-pagination>
      </div>

      <table-temp
        :show-index="true"
        size="small"
        :tableData="tableData1"
        :tableHeight="tableHeight1"
        :columnData="columnData1"
      ></table-temp>
    </el-card>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      title="添加"
      width="400px"
      @close="addCacle"
    >
      <el-form ref="formRef" :model="form" label-width="auto">
        <el-form-item label="类型" prop="Type">
          <el-select v-model="form.Type" placeholder="" style="width: 240px">
            <el-option label="量具" value="0" />
            <el-option label="检具" value="1" />
          </el-select>
          <!-- <el-input v-model="form.Type" style="width: 240px" placeholder="" /> -->
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="form.Name" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input
            v-model="form.Description"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="型号" prop="Model">
          <el-input v-model="form.Model" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="规格" prop="Specification">
          <el-input
            v-model="form.Specification"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="精度等级" prop="PrecisionLevel">
          <el-select v-model="form.PrecisionLevel" style="width: 240px">
            <el-option v-for="i in 6" :label="i" :value="i" />
          </el-select>
          <!-- <el-input v-model="form.PrecisionLevel" style="width: 240px" placeholder="" /> -->
        </el-form-item>
        <el-form-item label="使用部门" prop="Department">
          <el-input
            v-model="form.Department"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="下次校准时间" prop="NextCalibrationDate">
          <el-date-picker
            v-model="form.NextCalibrationDate"
            value-format="YYYY-MM-DD"
            style="width: 240px"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input
            v-model="form.Remark"
            style="width: 240px"
            placeholder=""
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCacle"> 取消 </el-button>
          <el-button type="primary" @click="addSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="editVisible"
      title="修改"
      width="400px"
      @close="editCacle"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="auto">
        <el-form-item label="类型" prop="Type">
          <!-- <el-input v-model="editForm.Type" style="width: 240px" placeholder="" /> -->
          <el-select
            v-model="editForm.Type"
            placeholder=""
            style="width: 240px"
          >
            <el-option label="量具" value="0" />
            <el-option label="检具" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input
            v-model="editForm.Name"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input
            v-model="editForm.Description"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="型号" prop="Model">
          <el-input
            v-model="editForm.Model"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="规格" prop="Specification">
          <el-input
            v-model="editForm.Specification"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="精度等级" prop="PrecisionLevel">
          <el-select v-model="editForm.PrecisionLevel" style="width: 240px">
            <el-option v-for="i in 6" :label="i" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用部门" prop="Department">
          <el-input
            v-model="editForm.PrecisionLevel"
            style="width: 240px"
            placeholder=""
          />
          <!-- <el-input v-model="editForm.Department" style="width: 240px" placeholder="" /> -->
        </el-form-item>
        <el-form-item label="下次校准时间" prop="NextCalibrationDate">
          <el-date-picker
            v-model="editForm.NextCalibrationDate"
            value-format="YYYY-MM-DD"
            style="width: 240px"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input
            v-model="editForm.Remark"
            style="width: 240px"
            placeholder=""
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCacle"> 取消 </el-button>
          <el-button type="primary" @click="editSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="setVisible"
      title="校验"
      width="400px"
      @close="setCacle"
    >
      <el-form ref="setFormRef" :model="setForm" label-width="auto">
        <el-form-item label="结果" prop="Result">
          <el-input
            v-model="setForm.Result"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="描述" prop="Desc">
          <el-input
            v-model="setForm.Desc"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <!-- <el-form-item label="型号" prop="Model">
                    <el-input v-model="setForm.Model" style="width: 240px" placeholder="" />
                </el-form-item> -->
        <el-form-item label="结果数据" prop="ResultData">
          <el-input
            v-model="setForm.ResultData"
            style="width: 240px"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="下次校准时间" prop="NextCalibrationDate">
          <el-date-picker
            v-model="setForm.NextCalibrationDate"
            value-format="YYYY-MM-DD"
            style="width: 240px"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input
            v-model="setForm.Remark"
            style="width: 240px"
            placeholder=""
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setCacle"> 取消 </el-button>
          <el-button type="primary" @click="setSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  GetGaugeToolList,
  addGaugeTool,
  updateGaugeTool,
  GetCalibrationRecordList,
  addCalibrationRecord,
} from "@/api/operate";
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
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
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
const userStore = useUserStoreWithOut();
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const addVisible = ref(false);
const getForm = ref({
  // ID: "",
  // Type: "",
  // Name: "",
  // Description: "",
  // Model: "",
  // Specification: "",
  // PrecisionLevel: 0,
  // NextCalibrationDate: "",
  // Department: "",
  // Status: 0,
  // CreatedOn: "",
  // CreatedBy: "",
  // UpdateOn: "",
  // UpdateBy: "",
  // Remark: "",
});
const form = ref({
  ID: "",
  Type: "",
  Name: "",
  Description: "",
  Model: "",
  Specification: "",
  PrecisionLevel: 0,
  NextCalibrationDate: "",
  Department: "",
  Status: 0,
  CreatedOn: "",
  CreatedBy: userStore.getUserInfo,
  UpdateOn: "",
  UpdateBy: "",
  Remark: "",
});
const editForm = ref({
  ID: "",
  Type: "",
  Name: "",
  Description: "",
  Model: "",
  Specification: "",
  PrecisionLevel: 0,
  NextCalibrationDate: "",
  Department: "",
  Status: 0,
  CreatedOn: "",
  CreatedBy: "",
  UpdateOn: "",
  UpdateBy: userStore.getUserInfo,
  Remark: "",
});
const formRef = ref();
const editFormRef = ref();
const editVisible = ref(false);
const headerRef = ref();
const handleEdit = (row: any) => {
  // console.log(row);
  editForm.value = { ...row };
  editForm.value.UpdateBy = userStore.getUserInfo;
  editForm.value.UpdateOn = "";
  editVisible.value = true;
};

const columnData = reactive([
  {
    text: true,
    prop: "Name",
    label: "名称",
    width: "150",
    min: true,
    align: "1",
    fixed: true,
  },

  {
    text: true,
    prop: "Description",
    label: "描述",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: false,
    prop: "Type",
    label: "类型",
    min: true,
    align: "center",
    width: "80px",
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "量具", type: "primary", number: "0" },
      { text: "检具", type: "warning", number: "1" },
    ],
  },
  {
    text: true,
    prop: "Model",
    label: "产品型号",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Specification",
    label: "详细规格",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "PrecisionLevel",
    label: "精度等级",
    width: "80",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "NextCalibrationDate",
    label: "下次校准时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Department",
    label: "使用部门",
    width: "100",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Status",
    label: "状态",
    width: "100",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "200",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "UpdateBy",
    label: "更新人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "UpdateOn",
    label: "更新时间",
    width: "",
    min: true,
    align: "1",
  },

  {
    isOperation: true,
    label: "操作",
    width: "80",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "编辑",
        icon: "EditPen",
        buttonClick: handleEdit,
      },
    ],
  },
]);
const tableData1 = ref([]);
const tableHeight1 = ref(0);
const columnData1 = reactive([
  {
    text: true,
    prop: "Desc",
    label: "描述",
    width: "",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Result",
    label: "结果",
    width: "",
    // min: true,
    align: "1",
  },

  {
    text: true,
    prop: "ResultData",
    label: "校验数据",
    width: "",
    // min: true,
    align: "center",
  },
  // {
  //     text: true,
  //     prop: "Annex",
  //     label: "测试",
  //     width: "",
  //     // min: true,
  //     align: "center",
  // },
  {
    text: true,
    prop: "NextCalibrationDate",
    label: "校验时间",
    width: "",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "",
    // min: true,
    align: "1",
  },
]);
const getRecordForm = ref({
  GaugeToolID: "",
});
const setFormRef = ref();
const setVisible = ref(false);
const setForm = ref({
  ID: "",
  GaugeToolID: "",
  Result: "",
  Desc: "",
  CreatedOn: "",
  CreatedBy: "",
  Remark: "",
  ResultData: "",
  Annex: "",
  NextCalibrationDate: "",
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  GetGaugeToolList(getForm.value).then((res: any) => {
    tableData.value = res.content;
  });
};
const getRecordData = () => {
  GetCalibrationRecordList(getRecordForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};
const openAdd = () => {
  addVisible.value = true;
};
const addCacle = () => {
  addVisible.value = false;
  formRef.value.resetFields();
};
const addSumbit = () => {
  addGaugeTool(form.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getData();
      addVisible.value = false;
    }
  });
};
const editCacle = () => {
  editVisible.value = false;
  editFormRef.value.resetFields();
};
const editSumbit = () => {
  updateGaugeTool(editForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getData();
      editVisible.value = false;
    }
  });
};
const handleAdd = (row: any) => {
  // console.log(row);
  setForm.value.GaugeToolID = row.ID;
  getRecordForm.value.GaugeToolID = row.ID;
  GetCalibrationRecordList(getRecordForm.value).then((res: any) => {
    tableData1.value = res.content;
    setVisible.value = true;
  });

 
  // getRecordData()
};
const setCacle = () => {
  setVisible.value = false;
  setFormRef.value.resetFields();
};
const setSumbit = () => {
  addCalibrationRecord(setForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getRecordData();
      setVisible.value = false;
    }
  });
};
const cellClick=(val:any)=>{
    getRecordForm.value.GaugeToolID = val.ID;
    getRecordData()
}
const computedDate= (val:any)=>{
    if(val==null||val==""){
        return true
    }else{
        let date=new Date(val)
        let date2=new Date
        // console.log(date);
        return date>date2?true:false
    }


}

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    // tableHeight.value = window.innerHeight - 195;
    tableHeight.value =
      (window.innerHeight - 164 - 35) * 0.6;
    tableHeight1.value =
      (window.innerHeight - 164 - 35) * 0.4;
  });
};
</script>

<style scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
