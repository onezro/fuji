<template>
  <div class="p-2 flex gap-[10px]">
    <el-card
      shadow="always"
      :body-style="{ padding: '8px' }"
      class="w-[850px] h-[calc(100vh-97px)]"
    >
      <div ref="headerRef">
        <el-form
          ref="formRef"
          :inline="true"
          size="small"
          @submit.native.prevent
        >
          <el-form-item label="MES条码" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="containername"
              placeholder=""
              clearable
              @keyup.enter.native="getData()"
            ></el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()">查询</el-button>
            <el-button class="relative" type="warning"
              >导入
              <input
              ref="fileInput"
                class="absolute top-0 left-0 w-[47.6px] h-[24px] opacity-0"
                type="file"
                @change="fileUpload"
              />
            </el-button>
          </el-form-item>
        </el-form>
        <table-tem
          :show-index="true"
          size="small"
          :tableData="tableData"
          :tableHeight="tableHeight"
          :columnData="columnData"
          :page-size="getForm.pageSize"
          :current-page="getForm.currentPage"
          :total="total1"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @rowClick="rowClick"
        >
        </table-tem>
      </div>
    </el-card>

    <el-card
      shadow="always"
      :body-style="{ padding: '8px 8px 0 8px' }"
      class="flex-1"
    >
      <div>
        <el-form ref="formRef" :inline="true" size="small" label-width="80px">
          <el-form-item label="创建时间:" class="mb-2">
            <div class="w-[150px]">
              {{ form.CreateTime }}
            </div>
          </el-form-item>
          <el-form-item label="条码类型:" class="mb-2">
            <div class="w-[150px]">
              {{ form.ContainerType }}
            </div>
          </el-form-item>
          <el-form-item label="物料编码:" class="mb-2">
            <div class="w-[150px]">
              {{ form.ContainerName }}
            </div>
          </el-form-item>
          <el-form-item label="物料批次码:" class="mb-2">
            <div class="w-[150px]">
              {{ form.MaterialName }}
            </div>
          </el-form-item>
          <el-form-item label="供应商信息:" class="mb-2">
            <div class="w-[150px]">
              {{ form.VendorName }}
            </div>
          </el-form-item>
          <el-form-item label="工单号:" class="mb-2">
            <div class="w-[150px]">
              {{ form.MfgOrderName }}
            </div>
          </el-form-item>
          <el-form-item label="产品编码:" class="mb-2">
            <div class="w-[150px]">
              {{ form.ProductName }}
            </div>
          </el-form-item>
          <el-form-item label="机型:" class="mb-2">
            <div class="w-[150px]">
              {{ form.ProductModel }}
            </div>
          </el-form-item>
          <el-form-item label="装箱条码:" class="mb-2">
            <div class="w-[150px]">
              {{ form.PackingBarcode }}
            </div>
          </el-form-item>
          <el-form-item label="条码状态:" class="mb-2">
            <div class="w-[150px]">
              {{ returnType(form.Status) }}
            </div>
          </el-form-item>
          <el-form-item label="是否烧录:" class="mb-2">
            <div class="w-[150px]">
              {{ form.IsBurn ? '是':'否' }}
            </div>
          </el-form-item>
          <!-- <el-form-item label="是否升级" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.ContainerName"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item> -->
          <el-form-item label="是否测试:" class="mb-2">
            <div class="w-[150px]">
              {{ form.IsBurnTEST ? '是':'否' }}
            </div>
          </el-form-item>
          <!-- <el-form-item label="是否维修" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.ContainerName"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item> -->
          <el-form-item label="是否老化:" class="mb-2">
            <div class="w-[150px]">
              {{ form.IsAging ? '是':'否' }}
            </div>
          </el-form-item>
          <el-form-item label="是否返修:" class="mb-2">
            <div class="w-[150px]">
              {{ form.IsRepair ? '是':'否' }}
            </div>
          </el-form-item>
          <el-form-item label="产品描述:" class="mb-2">
            <div class="w-[300px]">
              {{ form.Description }}
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import { QueryMESContainer } from "@/api/report";
import {
  ref,
  reactive,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import tableTem from "@/components/tableTem/noAuto.vue";
import {
  QueryMESContainer,
  QueryMESBarCode,
  ParseXlsxFile,
} from "@/api/report";

import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
const containername = ref("");
const getForm = ref({
  MfgOrderName: "",
  ContainerName: "",
  MaterialName: "",
  StartTime: "",
  EndTime: "",
  pageSize: 100,
  currentPage: 1,
});
const form = ref({
  CreateTime: "",
  ContainerType: "",
  ContainerName: "",
  Status: 0,
  MaterialName: "",
  MfgOrderName: "",
  ProductModel: "",
  Description: "",
  IsBurn: false,
  IsBurnTEST: false,
  IsAging: false,
  AgingResult: "",
  IsRepair: false,
  RepairResult: "",
  PackingBarcode: "",
  VendorName: "",
  ProductName: "",
});
const searchDate = ref<any[]>([]);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const total1 = ref(1);
const fileInput = ref()
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const columnData = reactive([
  {
    text: true,
    prop: "containername",
    label: "条码信息",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "containerLevelName",
    label: "条码类型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "PlannedStartDate",
    label: "创建时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Status",
    label: "条码状态",
    width: "",
    min: true,
    align: "1",
  },
]);
const detailData = ref([]);
const detailColumn = reactive([
  {
    text: true,
    prop: "Side",
    label: "工序名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ERPOrder",
    label: "生产时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "产线名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料批号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料唯一码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "操作人",
    width: "",
    min: true,
    align: "1",
  },
]);

watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      getForm.value.StartTime = "";
      getForm.value.EndTime = "";
      getForm.value.currentPage = 1;
      getData();
      return;
    }
    if (newVal !== oldVal) {
      getForm.value.StartTime = newVal[0];
      getForm.value.EndTime = newVal[1];
      getForm.value.currentPage = 1;
      // getData();
    }
  }
);
onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const changeForm = () => {
  getForm.value.currentPage = 1;
  // getData();
};

const returnType = (number:any) => {
  if (number === 1) {
    return '可使用'
  } else if(number === 2) {
    return'已关闭'
  } else if(number === 3) {
    return'已消耗'
  } else if(number === 4) {
    return'已发货'
  }
  return ''
}

const getData = () => {
  QueryMESBarCode(containername.value).then((res: any) => {
    if (res && res.success) {
      if (res.content === null) {
        tableData.value = [];
        return;
      }
      tableData.value = res.content;
    }
    tableData.value = res.content;
  });
};
const rowClick = (row: any) => {
  QueryMESContainer(row.containername).then((res: any) => {
    if (res && res.success && res.content !== null) {
      form.value = res.content;
    }
  });
};

const fileUpload = (event: any) => {
  let file = event.target.files[0];
  if (file.name.split(".").pop().toLowerCase() === "xlsx") {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      //  this.base64String = e.target.result; // 将Base64编码的字符串赋值给data属性
      ParseXlsxFile({
        BaseString: e.target.result,
        FileName: file.name,
      }).then((res: any) => {
        if (res && res.success) {
          if (res.content === null) {
            tableData.value = [];
            return;
          }
          tableData.value = res.content;
        }
        tableData.value = res.content;
      });
    };

    reader.onerror = (e: any) => {
      console.error("File could not be read! Code " + e.target.error.code);
    };

    reader.readAsDataURL(file); // 读取文件并转换为Data URL（Base64编码）
  }
  fileInput.value.value = '';
};
const handleSizeChange = (val: any) => {
  getForm.value.currentPage = 1;
  getForm.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  getForm.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 195;
    detailHeight.value = (window.innerHeight - 225) * 0.4;
  });
};
</script>

<style scoped></style>
