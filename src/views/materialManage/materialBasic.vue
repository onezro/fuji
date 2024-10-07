<template>
  <div class="p-2 flex gap-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }" class="w-[300px] h-[calc(100vh-96px)]">
      <!-- <template #header> -->
      <div
        class="card-header flex justify-between items-center pb-2 pr-4 pl-4 border-b-[1px] border-solid border-[#e4e7ed]">
        <div class="flex gap-[5px] items-center">
          <img style="width: 24px; height: 24px" src="../../assets/svgs/or.svg" alt="" />
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
      <el-scrollbar class="h-[calc(100vh-160px)]">
        <el-tree style="max-width: 600px" :data="materialTree" :expand-on-click-node="false" highlight-current :props="{
          children: 'childMenu',
          label: 'ProductFamilyDesc',
        }" @node-click="handleNodeClick" />
      </el-scrollbar>
    </el-card>
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }" class="flex-1">
      <el-form ref="formRef" size="small" :inline="true" :model="form" label-width="auto">
        <el-form-item label="物料编码" prop="MaterialCode" class="mb-2">
          <el-input style="width: 150px" v-model="form.ProductName" placeholder="请输入物料编码" clearable @clear="onSubmit" />
        </el-form-item>
        <el-form-item label="物料描述" prop="MaterialName" class="mb-2">
          <el-input style="width: 150px" v-model="form.ProductDescription" placeholder="请输入物料描述" clearable
            @clear="onSubmit" />
        </el-form-item>
        <el-form-item label="物料类型" prop="QueryType" class="mb-2">
          <el-select v-model="form.QueryType" style="width: 150px" @change="onSubmit">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="warning" @click="onEditSubmit"
            :disabled="selectData.length === 1 ? false : true">修改物料属性</el-button>
          <el-button type="info" @click="onQuerySubmit"
            :disabled="selectData.length === 1 ? false : true">产品BOM</el-button>
        </el-form-item>
      </el-form>
      <tableTem size="small" :showIndex="true" :showSelect="true" :tableData="tableData" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange" @handleSelectionChange="handleSelectionChange">
      </tableTem>
    </el-card>
    <el-dialog v-model="editVisible" title="修改物料属性" width="700px" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center>
      <div>
        <el-form-item label="物料编码" prop="ProductName">
          <el-input v-model="editForm.ProductName" disabled  />
        </el-form-item>
        <el-form-item label="物料描述" prop="ProductDescription">
          <el-input v-model="editForm.ProductDescription" disabled type="textarea" :rows="2" />
        </el-form-item>
      </div>
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
        <el-tab-pane label="物料基本属性" name="base">
          <el-form ref="editFormRef" :model="editForm" label-width="auto"  class="h-[200px]">
            <el-form-item label="芯片类型" prop="BD_ChipType">
              <el-input v-model="editForm.BD_ChipType" style="width: 200px" />
            </el-form-item>
            <el-form-item label="机型" prop="BD_ProductModel">
              <el-input v-model="editForm.BD_ProductModel" style="width: 200px" />
            </el-form-item>
            <el-form-item label="软件版本" prop="BD_SoftVersion">
              <el-input v-model="editForm.BD_SoftVersion" style="width: 200px" />
            </el-form-item>
            <el-form-item label="校验和" prop="BD_CheckSum">
              <el-input v-model="editForm.BD_CheckSum" style="width: 200px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="MSD物料属性" name="msd">
          <el-form ref="editFormRef" :model="msdForm" label-width="auto"  class="h-[200px]">
            <el-form-item label="MSD物料等级" prop="level">
               <el-select v-model="msdForm.level" placeholder="请选择" style="width: 200px">
                   <el-option v-for="l in levelList" :key="l.value"  :label="l.label" :value="l.value" />
                  
               </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="物料包装属性" name="packe">
          <el-form ref="editFormRef" :model="packeForm" label-width="auto" class="h-[200px]">
            <el-form-item label="装箱容量" prop="zxrl">
              <el-input v-model="packeForm.zxrl" style="width: 250px" />
            </el-form-item>
            <el-form-item label="数字类型" prop="numType">
              <el-input v-model="packeForm.numType" style="width: 250px" />
            </el-form-item>
         
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="烧录组件属性" name="burn"> </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" @click="editOnSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <formTem
      ref="editRef"
      :width="'400px'"
      :visible="editVisible"
      :title="'修改物料属性'"
      :form="editForm"
      :formHeader="editFormHeader"
      @formCancel="editCancel"
      @onSubmit="editOnSubmit"
    ></formTem> -->
    <!-- 物料BOM明细 -->
    <el-dialog v-model="bomVisible" width="70%" title="产品BOM" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center>
      <tableTem size="small" :showIndex="true" :tableData="bomtableData" :tableHeight="450" :columnData="bomcolumnData"
        :pageObj="bompageObj" @handleSizeChange="handleSizeChange1" @handleCurrentChange="handleCurrentChange1">
      </tableTem>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bomVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  findAllMaterialTree,
  findProductMaterial,
  UpdateProductMaterial,
  findProductBOM,
} from "@/api/operate";
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
import { values } from "lodash-es";
const isLoding = ref("");
const materialTree = ref([]);
const form = ref({
  FamilyName: "",
  ProductName: "",
  ProductDescription: "",
  QueryType: "0",
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
    rows: 4,
    disabled: true,
  },

  {
    type: "input",
    label: "芯片类型",
    placeholder: "",
    value: "BD_ChipType",
  },
  {
    type: "input",
    label: "软件版本",
    placeholder: "",
    value: "BD_SoftVersion",
  },
  {
    type: "input",
    label: "校验和",
    placeholder: "",
    value: "BD_CheckSum",
  },
]);
const editRef = ref();
const bomVisible = ref(false); //物料BOM弹窗
const bomtableData = ref([]);
const bompageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const bomcolumnData = reactive([
  {
    text: true,
    prop: "MaterialName",
    label: "物料编码",
    width: "",
    min: true,
    fixed: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "258",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SpecName",
    label: "工序",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SpecDesc",
    label: "工序描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "QtyRequired",
    label: "标准用量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UOMName",
    label: "单位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ControlType",
    label: "组件类型",
    width: "",
    min: true,
    align: "center",
  },
]);
const typeList = ref([
  {
    label: "全部",
    value: "0",
  },
  {
    label: "原材料",
    value: "1",
  },
  {
    label: "半成品或成品",
    value: "2",
  },
]);
const activeName = ref("base");
const editFormRef = ref();
const msdForm = ref({
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
  level: "",
});
const levelList=ref([
  {
    label:1,
    value:1,
  }
  ,{
    label:2,
    value:2,
  },
  {
    label:3,
    value:3,
  }
])
const packeForm =ref({
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
  zxrl:'',
  numType:''
})

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
  msdForm.value = {
    ...data,
  };
  msdForm.value.ProductDescription = data.ProductDesc;
  editVisible.value = true;
};
const editCancel = () => {
  editVisible.value = false;
  editFormRef.value.resetFields();
};
const editOnSubmit = () => {
  editFormRef.value.resetFields();
  UpdateProductMaterial(editForm.value).then((res: any) => {
    editVisible.value = false;
    // editRef.value.cleanForm();
    ElNotification({
      title: res.msg,
      // message: "取消操作",
      type: "success",
    });
    onSubmit();
    // console.log(res);
  });
};
const onQuerySubmit = () => {
  let data = cloneDeep(selectData.value[0]);
  // console.log(1010101100099);
  findProductBOM(data.ProductName).then((res: any) => {
    // console.log(res.content);
    if (res.content.length == 0 || res.content == null) {
      bomtableData.value = [];
      // ElNotification({
      //   title: '无数据',
      //   type: "success",
      // });
      return;
    }
    bomtableData.value = res.content;
  });
  bomVisible.value = true;
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
const handleSizeChange1 = (val: any) => {
  bompageObj.value.currentPage = 1;
  bompageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  bompageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 185;
  });
};
</script>

<style lang="scss">
// @import "../../style/tab.css";
.el-tabs--border-card {
  border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
  --el-tabs-header-height: 30px;
  background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
  padding: 5px;
}


.demo-tabs.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  font-size: 0.8rem;
  // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
  font-size: 0.8rem;
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  font-size: 0.8rem;
  color: #006487 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
