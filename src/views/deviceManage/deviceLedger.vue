<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <div class="flex">
        <el-form ref="formRef" :model="form" :inline="true">
          <el-form-item label="车间" prop="WorkCenterName" class="mb-2">
            <el-select v-model="form.WorkCenterName" clearable placeholder="" style="width: 180px"
              @change="meunItem">
              <el-option v-for="item in option1" :key="item.Name" :label="item.Desc" :value="item.Name" />
            </el-select>
          </el-form-item>
          <el-form-item label="产线" prop="MfgLineName" class="mb-2">
            <el-select v-model="form.MfgLineName" clearable placeholder="" style="width: 180px">
              <el-option v-for="item in option2" :key="item.Name" :label="item.Desc" :value="item.Name" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="EquipmentTypeName" class="mb-2">
            <el-select v-model="form.EquipmentTypeName" clearable placeholder="" style="width: 180px">
              <el-option v-for="item in option3" :key="item.EquipmentTypeName" :label="item.EquipmentTypeDesc"
                :value="item.EquipmentTypeName" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2"> <el-button type="primary" @click="submit"> 查询 </el-button></el-form-item>
          <el-form-item class="mb-2">   <el-button @click="rest"> 重置 </el-button></el-form-item>
        </el-form>
        <div>

          
        </div>
      </div>
      <table-tem :show-index="true" size="small" :tableData="tableData" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"></table-tem>
    </el-card>
    <el-dialog v-model="editVisible" width="85%" title="履历明细" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center>
      <el-tabs type="border-card" class="tabs-css" v-model="tabValue">
        <el-tab-pane label="设备点检记录" name="inspection">设备点检记录开发维护中~</el-tab-pane>
        <el-tab-pane label="设备保养记录" name="maintain">设备保养记录开发维护中~</el-tab-pane>
        <el-tab-pane label="设备维修记录" name="repair">设备维修记录开发维护中~</el-tab-pane>
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click.stop="editVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { OrganData } from "@/utils/dataMenu";
import tableTem from "@/components/tableTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import { cloneDeep } from "lodash-es";
import { ElMessage, ElMessageBox } from "element-plus";
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
import {
  GetFactoryModelList,
  GetEquipmentTypeList,
  GetEquipmentList,
} from "@/api/operate";
interface Option {
  Desc: string;
  FID: string;
  ID: string;
  Level: string;
  Name: string;
  sortId: string;
}
interface Option3 {
  EquipmentTypeDesc: string;
  EquipmentTypeName: string;
}
const tableData = ref([]);
const tableHeight = ref(0);

const editVisible = ref(false);

const form = ref({
  EquipmentName: "",
  EquipmentDesc: "",
  EquipmentTypeName: "",
  EquipmentTypeDesc: "",
  MfgLineName: "",
  MfgLineDesc: "",
  WorkCenterName: "",
  WorkCenterDesc: "",
  WorkStationName: "",
  WorkStationDesc: "",
  VendorAndModel: "",
  VendorSerialNumber: "",
});

const option1 = ref<Option[]>([]);
const option2 = ref<Option[]>([]);
const option3 = ref<Option3[]>([]);
const tabValue = ref("inspection");
const formRef = ref();
const handleEdit = (data: any) => {
  // console.log(data);
  editVisible.value = true;
};
const columnData = reactive([
  {
    text: true,
    prop: "WorkCenterDesc",
    label: "车间名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MfgLineDesc",
    label: "产线名称",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "EquipmentName",
    label: "设备编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EquipmentDesc",
    label: "设备名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EquipmentTypeName",
    label: "设备类型编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EquipmentTypeDesc",
    label: "设备类型名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    isOperation: true,
    label: "履历明细",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "履历",
        icon: "Document",
        buttonClick: handleEdit,
      },
    ],
  },
]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const formHeader = ref([
  {
    label: "设备型号",
    value: "account",
    type: "input",
  },
]);
const rules = reactive({
  account: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getModeList();
  getTypeList();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  GetEquipmentList(form.value).then((res: any) => {
    if (res.content == null) {
      tableData.value = [];
    } else {
      tableData.value = res.content;
    }
  });
};

const getModeList = () => {
  GetFactoryModelList().then((res: any) => {
    option1.value = OrganData(res.content);
  });
};
const getTypeList = () => {
  GetEquipmentTypeList().then((res: any) => {
    option3.value = res.content;
  });
};
const meunItem = (value: any) => {
  option2.value = [];
  form.value.MfgLineName = "";
  let data = option1.value.filter((v: any) => v.Name === value);
  let data1 = cloneDeep(data);
  option2.value = data1[0].childMenu;
};
const submit = () => {
  getData();
};
const rest = () => {
  formRef.value.resetFields();
  getData();
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
    tableHeight.value = window.innerHeight - 195;
  });
};
</script>
<style lang="scss">
@import '../../style//tab.css';

.el-pagination {
  justify-content: center;
}
</style>
<!-- <style scoped lang="scss"></style> -->
