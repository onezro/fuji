<template>
  <div class="p-2 flex gap-2">
    <el-card
      shadow="always"
      :body-style="{ padding: '10px' }"
      class="w-[300px] h-[calc(100vh-97px)]"
    >
      <!-- <template #header> -->
      <div
        class="card-header flex justify-between items-center pb-2 pr-4 pl-4 border-b-[1px] border-solid border-[#e4e7ed]"
      >
        <div class="flex gap-[5px] items-center">
          <img
            style="width: 24px; height: 24px"
            src="../../assets/svgs/or.svg"
            alt=""
          />
          <div class="h-[24px] box-border pt-[3px]">物料分类</div>
        </div>
        <!--<el-tooltip content="重置" placement="right">
          <el-icon
            size="24"
            :class="isLoding"
            color="#006487"
            @click="refreshData"
          >
            <RefreshRight />
          </el-icon>
        </el-tooltip>-->
      </div>
      <!-- </template> -->
      <el-scrollbar class="h-[calc(100vh-175px)]">
        <el-tree
          style="max-width: 600px"
          :data="materialTree"
          :expand-on-click-node="false"
          highlight-current
          :props="{
            children: 'childMenu',
            label: 'ProductFamilyDesc',
          }"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
    </el-card>
    <el-card shadow="always" :body-style="{ padding: '10px 10px 5px 10px' }" class="flex-1">
      <el-form
        ref="formRef"
        size="small"
        :inline="true"
        :model="form"
        label-width="auto"
      >
        <el-form-item label="物料编码" prop="MaterialCode" class="mb-2">
          <el-input
            v-model="form.ProductName"
            placeholder="请输入物料编码"
            clearable
            @clear="onSubmit"
          />
        </el-form-item>
        <el-form-item label="物料描述" prop="MaterialName" class="mb-2">
          <el-input
            v-model="form.ProductDescription"
            placeholder="请输入物料描述"
            clearable
             @clear="onSubmit"
          />
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button
            type="warning"
            @click="onEditSubmit"
            :disabled="selectData.length === 1 ? false : true"
            >修改物料属性</el-button
          >
        </el-form-item>
      </el-form>
      <tableTem
        size="small"
        :showIndex="true"
        :showSelect="true"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
      </tableTem>
    </el-card>
    <formTem
      ref="editRef"
      :width="'400px'"
      :visible="editVisible"
      :title="'修改物料属性'"
      :form="editForm"
      :formHeader="editFormHeader"
      @formCancel="editCancel"
      @onSubmit="editOnSubmit"
    ></formTem>
  </div>
</template>

<script setup lang="ts">
import {
  findAllMaterialTree,
  findProductMaterial,
  UpdateProductMaterial,
} from "@/api/permiss";
import tableTem from "@/components/tableTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import { cloneDeep } from "lodash-es";
import { ElNotification } from "element-plus";
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
  reactive,
} from "vue";
const isLoding = ref("");
const materialTree = ref([]);
const form = ref({
  FamilyName: "",
  ProductName: "",
  ProductDescription: "",
});
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const columnData = reactive([
  {
    text: true,
    prop: "ProductName",
    label: "物料编码",
    width: "",
    min: true,
    fixed: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductDesc",
    label: "物料描述",
    width: "258",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_ProductModel",
    label: "机型名称",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_ChipType",
    label: "芯片类型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_SoftVersion",
    label: "软件版本",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_CheckSum",
    label: "校验和",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "FirstClass",
    label: "一级分类",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SecondClass",
    label: "二级分类",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ThirdClass",
    label: "三级分类",
    width: "",
    min: true,
    align: "1",
  },
]);
const selectData = ref([]);
const editVisible = ref(false);
const editForm = ref({
  ProductName: "",
  Revision: "",
  ProductDescription: "",
  TypeName: "",
  TypeDescription: "",
  FamilyName: "",
  FamilyDescription: "",
  Unit: "",
  UnitDescription: "",
  Factory: "",
  Customer_ProductNumber: "",
  BD_ProductCategory: "",
  BD_ProductModel: "",
  BD_ProjectNo: "",
  BD_CheckSum: "",
  BD_ChipType: "",
  BD_SoftVersion: "",
});
const editFormHeader = reactive([
  {
    type: "input",
    label: "物料编码",
    value: "ProductName",
    disabled: true,
  },
  {
    type: "textarea",
    label: "物料描述",
    value: "ProductDescription",
    rows:4,
    disabled: true,
  },
  {
    type: "input",
    label: "机型名称",
    placeholder:'',
    value: "BD_ProductModel",
  },
  {
    type: "input",
    label: "芯片类型",
    placeholder:'',
    value: "BD_ChipType",
  },
  {
    type: "input",
    label: "软件版本",
    placeholder:'',
    value: "BD_SoftVersion",
  },
  {
    type: "input",
    label: "校验和",
    placeholder:'',
    value: "BD_CheckSum",
  },
]);
const editRef = ref();

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getMaterialTree();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getMaterialTree = () => {
  findAllMaterialTree().then((res: any) => {
    if (res.content == null || res.content.length == 0) {
      materialTree.value = [];
    }
    materialTree.value = res.content;
  });
};
const refreshData = () => {};
const handleNodeClick = (data: any) => {
  form.value.FamilyName = data.ProductFamilyName;
  onSubmit();
  //   console.log();
};
const onSubmit = () => {
  findProductMaterial(form.value).then((res: any) => {
    if (res.content == null || res.content.length == 0) {
      tableData.value = [];
      return;
    }
    tableData.value = res.content;
    // console.log();
  });
};
const onEditSubmit = () => {
  let data = cloneDeep(selectData.value[0]);

  editForm.value = {
    ...data,
  };
  editForm.value.ProductDescription = data.ProductDesc;
  editVisible.value = true;
};
const editCancel = () => {
  editVisible.value = false;
};
const editOnSubmit = () => {
  UpdateProductMaterial(editForm.value).then((res: any) => {
    editVisible.value = false;
    editRef.value.cleanForm();
    ElNotification({
      title: res.msg,
      // message: "取消操作",
      type: "success",
    });
    onSubmit();
    // console.log(res);
  });
};

const handleSelectionChange = (val: any) => {
  let data = cloneDeep(val);
  selectData.value = data;
  //   console.log(selectData.value);
  console.log(data);
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

<style scoped></style>
