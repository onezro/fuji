<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div>
                <el-form ref="formRef" size="small" :model="getForm" label-width="auto" :inline="true">
                    <el-form-item label="物料编码" prop="MaterialCode" class="mb-2">
                        <el-input v-model="getForm.ProductName" style="width: 160px" clearable @clear="getData" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="flex gap-2">
                <div class="w-[400px]">
                    <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'dark'" border fit highlight-current-row @cell-click="cellClick">
                        <el-table-column prop="ProductName" label="物料条码" width="120" />
                        <el-table-column prop="ProductDesc" label="物料描述" :show-overflow-tooltip="true" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                </div>
                <div class="flex-1">
                    <div class="mb-1">
                        <el-form ref="formRef" label-position="left" label-width="auto" size="small" :inline="true">
                            <el-form-item label="工艺流程名称" prop="WorkflowName" class="mb-1">
                                <el-input disabled v-model.trim="specWork.WorkflowName" style="width: 160px"></el-input>
                            </el-form-item>
                            <el-form-item label="工艺流程描述" prop="WorkflowDesc" class="mb-1">
                                <el-input disabled v-model.trim="specWork.WorkflowDesc" style="width: 160px"></el-input>
                            </el-form-item>
                            <el-form-item class="mb-1">
                                <el-button type="primary" @click="openSpecWorK"
                                    :disabled="specWorkForm.ProductName == ''">修改工艺路线</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="specWorkData" size="small" :height="tableHeight1" :tooltip-effect="'dark'"
                            stripe border fit>

                            <el-table-column type="index" align="center" fixed label="序号" width="50" />
                            <el-table-column prop="SpecName" label="工序编码" :min-width="180" width="180">
                            </el-table-column>
                            <el-table-column prop="SpecDesc" label="工序描述" :min-width="180" width="180">
                            </el-table-column>
                            <template #empty>
                                <div class="flex items-center justify-center h-100%">
                                    <el-empty />
                                </div>
                            </template>
                        </el-table>
                        <!-- <el-pagination class="mt-1 mb-1" align="center" size="small" background
                        @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                        :page-sizes="[30, 100, 200, 300, 500]" layout="total,sizes, prev, pager, next"
                        :total="tableData1.length">
                    </el-pagination> -->
                    </div>
                    <div>
                        <div class="mb-1">
                            <el-button type="primary" size="small">修改工序</el-button>
                        </div>
                        <el-table :data="productData" size="small" :height="tableHeight1" stripe border fit
                            :tooltip-effect="'dark'" row-key="MaterialName"  
                            :selectable="selectable"  >
                            <el-table-column type="selection" width="50" ></el-table-column>
                         
                            <!-- <el-table-column type="index" align="center" fixed label="序号" width="50" /> -->
                            <el-table-column prop="MaterialName" label="物料编码" fixed width="120" />
                            <el-table-column prop="MaterialDesc" label="物料描述" :show-overflow-tooltip="true"
                                width="250" />
                            <el-table-column prop="SpecName" label="工序编码" flexible>
                            </el-table-column>
                            <el-table-column prop="SpecDesc" label="工序名称" flexible>
                            </el-table-column>
                            <el-table-column prop="QtyRequired" label="单件用量" flexible />
                            <el-table-column prop="UOMName" label="单位" flexible />

                            <!-- <el-table-column prop="MaterialCode" label="主码类型" />
                            <el-table-column prop="MaterialCode" label="关联条码" /> -->
                            <template #empty>
                                <div class="flex items-center justify-center h-100%">
                                    <el-empty />
                                </div>
                            </template>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-card>
        <el-dialog v-model="specWorkVisible" title="修改工艺路线" draggable width="400px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="formRef" :model="specWorkForm" label-width="auto">
                <el-form-item label="工艺路线" prop="WorkflowName">
                    <el-select v-model="specWorkForm.WorkflowName" placeholder="" style="width: 240px">
                        <el-option v-for="w in workFlow" :key="w.WorkflowName" :label="w.WorkflowName"
                            :value="w.WorkflowName" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="specWorkVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateSpecWork"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    findProduct,
    findProductSpecWork,
    findWorkFlow,
    UpdateProductWorkflow,
    findProductBOMMaterialList,
} from "@/api/operate";
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import { ElNotification } from "element-plus";
const form = ref({
    MaterialCode: "",
});
const tableData = ref([]);

const specWorkData = ref([]);
const productData = ref([]);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const tableHeight2 = ref(0);
const pageObj = ref({
    pageSize: 30,
    currentPage: 1,
});
const getForm = ref({
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
    BD_IsICCID: "",
    BD_ICCIDType: "",
    BD_IsActivate: "",
    BD_IsMSD: "",
    BD_MSDLevel: "",
    QueryType: "",
    WorkflowName: "",
});
const specWork = ref({
    WorkflowName: "",
    WorkflowDesc: "",
});
const specWorkVisible = ref(false);
const specWorkForm = ref({
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
    BD_IsICCID: "",
    BD_ICCIDType: "",
    BD_IsActivate: "",
    BD_IsMSD: "",
    BD_MSDLevel: "",
    QueryType: "",
    WorkflowName: "",
});

const workFlow = ref<any[]>([]);
const ProductName = ref("");

onBeforeMount(() => {
    getScreenHeight();
    // onSubmit()
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getWorkFlow();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    findProduct(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const getProductList = () => {
    findProductBOMMaterialList(ProductName.value).then((res: any) => {
        productData.value = res.content;
        // console.log(res.content);
    });
};
const getWorkFlow = () => {
    findWorkFlow({
        WorkflowName: "",
        Revision: "",
        WorkflowDescription: "",
    }).then((res: any) => {
        workFlow.value = res.content;
    });
};
const getSpecWorkData = () => {
    findProductSpecWork(ProductName.value).then((res: any) => {
        if (res.content.length != 0) {
            specWork.value = {
                WorkflowDesc: res.content[0].WorkflowDesc,
                WorkflowName: res.content[0].WorkflowName,
            };
            specWorkData.value = res.content;
        }
    });
};

const cellClick = (val: any) => {
    specWorkForm.value = { ...val };
    ProductName.value = val.ProductName;
    getSpecWorkData();
    getProductList();
};

const openSpecWorK = () => {
    specWorkVisible.value = true;
};

const updateSpecWork = () => {
    UpdateProductWorkflow(specWorkForm.value).then((res: any) => {
        specWorkVisible.value = false;
        ElNotification({
            title: "提示信息",
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (res.success) {
            getSpecWorkData();
        }
    });
};

const selectable=(row:any, selectedRows:any)=>{
    console.log(selectedRows);
    
    return selectedRows.length < 1;
}


const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 145.5;
        tableHeight1.value = (window.innerHeight - 207) * 0.5;
        // tableHeight2.value =( window.innerHeight - 178)*0.5;
    });
};
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
</script>

<style scoped></style>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
