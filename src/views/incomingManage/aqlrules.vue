<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAdd">添加</el-button>
                </div>
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                     <el-form-item label="客户" prop="CustomerName" class="mb-2">
                        <el-select v-model="getForm.CustomerName" @change="getData" placeholder="请选择" clearable filterable size="small" style="width: 200px;">
                            <el-option :label="p.CustomerName" :value="p.CustomerName" :key="p.CustomerId"
                                v-for="p in customerList" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品类型" prop="ProductTypeName" class="mb-2">
                        <el-select v-model="getForm.ProductTypeName" @change="getData" placeholder="请选择" clearable filterable size="small" style="width: 200px;">
                            <el-option :label="p.ProductTypeName" :value="p.ProductTypeName" :key="p.ProductTypeId"
                                v-for="p in produstTypeList" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="家族" prop="ProductFamilyName" class="mb-2">
                        <el-select v-model="getForm.ProductFamilyName" @change="getData" placeholder="请选择"clearable filterable size="small" style="width: 200px;">
                            <el-option :label="p.ProductFamilyName" :value="p.ProductFamilyName" :key="p.ProductFamilyId"
                                v-for="p in familyList" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="方案名称" prop="InspectionMasterName" class="mb-2">
                        <el-input v-model="getForm.InspectionMasterName" placeholder="" clearable @clear="getData"
                            @keyup.enter.native="getData" style="width: 200px;" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="getData">查询</el-button>
                          <el-button :type="'info'" @click="resetGetForm">重置</el-button>
                    </el-form-item>

                </el-form>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'dark'" border fit
                highlight-current-row>
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ES_INSPECTION_MASTERName" :label="'方案名称'" />
                <el-table-column prop="CustomerName" :label="'客户'"  width="120"/>
                <el-table-column prop="Description" :label="'方案描述'" :show-overflow-tooltip="true" />
                <el-table-column prop="ProductTypeName" :label="'类型'" width="120" />
                <el-table-column prop="ProductFamilyName" :label="'家族'" width="120" />
                <el-table-column prop="IQC_Status" :label="'IQC'" width="120" :align="'center'">
                    <template #default="{ row }">
                        <el-tag :type="row.IQC_Status == '未维护' ? 'info' : 'success'">{{ row.IQC_Status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="First_Inspection_Status" :label="'首检'" width="120" :align="'center'">
                    <template #default="{ row }">
                        <el-tag :type="row.First_Inspection_Status == '未维护' ? 'info' : 'success'">{{
                            row.First_Inspection_Status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Routine_Inspection_Status" :label="'巡检'" width="120" :align="'center'">
                    <template #default="{ row }">
                        <el-tag :type="row.Routine_Inspection_Status == '未维护' ? 'info' : 'success'">{{
                            row.Routine_Inspection_Status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Final_Inspection_Status" :label="'尾检'" width="120" :align="'center'">
                    <template #default="{ row }">
                        <el-tag :type="row.Final_Inspection_Status == '未维护' ? 'info' : 'success'">{{
                            row.Final_Inspection_Status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="OQC_Status" :label="'OQC'" width="120" :align="'center'">
                    <template #default="{ row }">
                        <el-tag :type="row.OQC_Status == '未维护' ? 'info' : 'success'">{{ row.OQC_Status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="100">
                    <template #default="{ row }">
                        <el-tooltip :content="'详情'" placement="top">
                            <el-button size="small" type="primary" icon="Tickets" @click="handleEdit(row)">

                            </el-button></el-tooltip>
                        <!-- <el-button size="small" type="danger" @click="handleDelete(row)">
                            {{ $t("publicText.delete") }}
                        </el-button> -->
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="80%" @close="addCancel">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false">
                <el-form-item :label="$t('aqlrules.partNumber')" prop="partNumber">
                    <!-- <el-select v-model="addForm.InspectionMasterName" placeholder="请选择" filterable>
                        <el-option :label="p.productname" :value="p.productname" v-for="p in productList" />
                    </el-select> -->
                    <el-select-v2 v-model="addForm.InspectionMasterName" filterable :options="productList"
                        placeholder="" :props="{ value: 'productname', label: 'product' }" style="width: 100%" />
                </el-form-item>
                <!-- <el-form-item :label="$t('aqlrules.DBType')" prop="DBType">
                    <el-select v-model="addForm.InspectionType" placeholder="请选择" filterable>
                        <el-option :label="p.InspectionType" :value="p.InspectionType" v-for="p in typetList" />
                    </el-select>
                </el-form-item> -->

                <el-tabs :tab-position="'left'" v-model="activeName" style="height: 350px" type="border-card"
                    @tab-change="tabChange">
                    <el-tab-pane v-for="a in addTabList" :label="a.label" :name="a.value" :key="a.label">
                        <el-table :data="addTypeTable" style="width: 100%" :height="320" size="small" border stripe>
                            <el-table-column prop="InspectionType" :label="$t('aqlrules.ProjectCategoryName')">
                                <template #default="scope">

                                    <el-select v-model="scope.row.ProjectCategoryName" placeholder="请选择" filterable
                                        size="small">
                                        <el-option :label="p.ProjectCategoryName" :value="p.ProjectCategoryName"
                                            v-for="p in categoryList" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                                <template #default="scope">
                                    <el-select v-model="scope.row.ProjectName" placeholder="请选择" filterable
                                        size="small">
                                        <el-option :label="p.ProjectName" :value="p.ProjectName"
                                            v-for="p in projectList" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="InspectionType" :label="'操作类型'">
                                <template #default="scope">
                                    <el-select v-model="scope.row.MeasurementType" placeholder="请选择" filterable
                                        size="small">
                                        <el-option :label="'计数'" :value="'计数'" />
                                        <el-option :label="'计量'" :value="'计量'" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="CharaCteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                                <template #default="scope">
                                    <el-input v-model="scope.row.CharaCteristicGrade" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                                <template #default="scope">
                                    <el-input v-model="scope.row.TargetValue" size="small"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                                <template #default="scope">
                                    <el-input v-model="scope.row.MinValue" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                                <template #default="scope">
                                    <el-input v-model="scope.row.MaxValue" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ToolName" :label="$t('aqlrules.ToolName')">
                                <template #default="scope">
                                    <!-- <el-input v-model="scope.row.ToolName"></el-input> -->
                                    <el-select v-model="scope.row.ToolName" placeholder="请选择" filterable size="small">
                                        <el-option :label="p.ResourceName" :value="p.ResourceName"
                                            v-for="p in resourceList" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                                <template #default="scope">
                                    <el-input v-model="scope.row.InspectionBasis" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('publicText.operation')" width="150px">
                                <template #default="{ row, $index }">
                                    <el-button v-if="isLastDetail1($index)" icon="Plus" size="small" type="primary"
                                        @click="addInspectionDetails"></el-button>
                                    <el-button size="small" type="danger" icon="Delete"
                                        @click="addInspectionDelete($index)"
                                        :disabled="addTypeTable.length == 1"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>


            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="85%" @close="editCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false">
                <el-form-item :label="$t('aqlrules.partNumber')" prop="partNumber">
                    <!-- <el-select-v2 v-model="editForm.InspectionMasterName" filterable :options="productList"
                        placeholder="" :props="{ value: 'productname', label: 'product' }" style="width: 100%" /> -->
                    <el-input v-model="editForm.InspectionMasterName" placeholder="请输入" disabled />
                    <!-- <el-select v-model="editForm.InspectionMasterName" placeholder="请选择" filterable :disabled="true">
                        <el-option :label="p.productname" :value="p.productname" v-for="p in productList" />
                    </el-select> -->
                </el-form-item>
                <!-- <el-form-item :label="$t('aqlrules.DBType')" prop="DBType">
                    <el-select v-model="getDetailForm.InspectionType" placeholder="请选择" filterable
                        @change="getDetailData">
                        <el-option :label="p.InspectionType" :value="p.InspectionType" v-for="p in typetList" />
                    </el-select>
                </el-form-item> -->
            </el-form>
            <el-tabs :tab-position="'left'" v-model="activeName2" style="height: 350px" type="border-card"
                @tab-change="tabChange2">
                <el-tab-pane v-for="a in addTabList" :label="a.label" :name="a.value" :key="a.label">
                    <el-table :data="editTypeTable" style="width: 100%" :height="300" size="small" border stripe>
                        <el-table-column prop="InspectionType" :label="$t('aqlrules.ProjectCategoryName')">
                            <template #default="scope">
                                <!-- <el-input v-model="scope.row.InspectionType" size="small"></el-input> -->
                                <el-select v-model="scope.row.ProjectCategoryName" placeholder="请选择" filterable
                                    size="small">
                                    <el-option :label="p.ProjectCategoryName" :value="p.ProjectCategoryName"
                                        v-for="p in categoryList" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                            <template #default="scope">
                                <el-select v-model="scope.row.ProjectName" placeholder="请选择" filterable size="small">
                                    <el-option :label="p.ProjectName" :value="p.ProjectName" v-for="p in projectList" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                    <template #default="scope">
                        <el-select v-model="scope.row.InspectionType" placeholder="请选择" filterable size="small">
                            <el-option :label="p.InspectionType" :value="p.InspectionType" v-for="p in typetList" />
                        </el-select>
                    </template>
                </el-table-column> -->
                        <el-table-column prop="InspectionType" :label="'操作类型'">
                            <template #default="scope">
                                <el-select v-model="scope.row.MeasurementType" placeholder="请选择" filterable
                                    size="small">
                                    <el-option :label="'计数'" :value="'计数'" />
                                    <el-option :label="'计量'" :value="'计量'" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CharaCteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                            <template #default="scope">
                                <el-input v-model="scope.row.CharaCteristicGrade" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                            <template #default="scope">
                                <el-input v-model="scope.row.TargetValue" size="small"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                            <template #default="scope">
                                <el-input v-model="scope.row.MinValue" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                            <template #default="scope">
                                <el-input v-model="scope.row.MaxValue" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ToolName" :label="$t('aqlrules.ToolName')">
                            <template #default="scope">
                                <!-- <el-input v-model="scope.row.ToolName"></el-input> -->
                                <el-select v-model="scope.row.ToolName" placeholder="请选择" filterable size="small">
                                    <el-option :label="p.ResourceName" :value="p.ResourceName"
                                        v-for="p in resourceList" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                            <template #default="scope">
                                <el-input v-model="scope.row.InspectionBasis" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('publicText.operation')" width="120">
                            <template #default="{ row, $index }">
                                <el-button v-if="isLastDetail2($index)" icon="Plus" size="small" type="primary"
                                    @click="editInspectionDetails"></el-button>
                                <el-button icon="Delete" size="small" type="danger"
                                    @click="deleteDetail(row, $index)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    GetProjectCategoryQuery,
    GetProjectQuery,
    GetResourceQuery,
    GetInspectionTypeQuery,
    GetProductQuery,
    GetInspectionMasterQuery,
    GetInspectionDetailQuery,
    AyscInspectionMaster,
    AyscDelInspectionDetail,
    GetProductTypeQuery,
    GetProductFamilyQuery,
    GetCustomerQuery
} from "@/api/incomingManage/aqlrules";
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
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const getForm = ref({
    InspectionMasterName: "",
    ProductTypeName: '',
    ProductFamilyName: '',
    CustomerName: ''
});
const tableHeight = ref(0);
const tableData = ref([]);

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const productList = ref<any[]>([]);
const typetList = ref<any[]>([]);
const categoryList = ref<any[]>([]);
const resourceList = ref<any[]>([]);
const projectList = ref<any[]>([]);
const addVisible = ref(false);
const addForm = ref({
    InspectionMasterName: "",
    DBType: "Add",
    InspectionType: '',
    iQC_InspectionDetails: [
        {
            InspectionDetailName: "",
            ProjectCategoryName: "",
            ProjectName: "",
            TargetValue: "",
            MinValue: "",
            MaxValue: "",
            CharaCteristicGrade: "",
            ToolName: "",
            InspectionBasis: "",
            InspectionType: "IQC",
            MeasurementType: "",
            CreateUser: userStore.getUserInfo,
            UpdateUser: "",
        },
    ],
});
const addFormRef = ref();
const editVisible = ref(false);
const editForm = ref({
    InspectionMasterName: "",
    DBType: "Update",
    iQC_InspectionDetails: [
        {
            InspectionDetailName: "",
            ProjectCategoryName: "",
            ProjectName: "",
            TargetValue: "",
            MinValue: "",
            MaxValue: "",
            CharaCteristicGrade: "",
            ToolName: "",
            InspectionBasis: "",
            InspectionType: "IQC",
            MeasurementType: "",
            CreateUser: "",
            UpdateUser: userStore.getUserInfo,
        },
    ],
});
const editFormRef = ref();
const getDetailForm = ref({
    InspectionMasterName: "",
    InspectionType: "",
});
const activeName = ref('IQC')
const addTabList = ref([
    {
        value: 'IQC',
        label: 'IQC'
    },
    {
        value: '首检',
        label: '首检'
    },
    {
        value: '巡检',
        label: '巡检'
    },
    {
        value: '尾检',
        label: '尾检'
    },
    {
        value: 'OQC',
        label: 'OQC'
    }
])
const activeName2 = ref('IQC')
const produstTypeList=ref<any[]>([])
const familyList=ref<any[]>([])
const customerList=ref<any[]>([])
const isLastDetail1 = computed(() => {
    return (index: number) => {
        return index === addTypeTable.value.length - 1
    }
})
const isLastDetail2 = computed(() => {
    return (index: number) => {
        return index === editTypeTable.value.length - 1
    }
})
const addTypeTable = computed(() => {
    return addForm.value.iQC_InspectionDetails.filter((item: any) => item.InspectionType == activeName.value)
})
const editTypeTable = computed(() => {
    return editForm.value.iQC_InspectionDetails.filter((item: any) => item.InspectionType == activeName2.value)
})
onBeforeMount(() => {
    getScreenHeight();
    getProduct();
    getType();
    getCategory();
    GetResource();
    getProject();
    getProductTypeData()
    getProductFamilyData()
    getCustomerData()
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const resetGetForm=()=>{
    getForm.value={
        InspectionMasterName: "",
    ProductTypeName: '',
    ProductFamilyName: '',
    CustomerName:''
    }
    getData()
}
const getData = () => {
    GetInspectionMasterQuery(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const getCustomerData=()=>{
    GetCustomerQuery({}).then((res:any)=>{
        customerList.value= res.content
    })
}
const getProduct = () => {
    GetProductQuery({}).then((res: any) => {
        productList.value = res.content;
    });
};
const getType = () => {
    GetInspectionTypeQuery({}).then((res: any) => {
        typetList.value = res.content;
    });
};
const getCategory = () => {
    GetProjectCategoryQuery({}).then((res: any) => {
        categoryList.value = res.content;
    });
};
const GetResource = () => {
    GetResourceQuery({}).then((res: any) => {
        resourceList.value = res.content;
    });
};
const getProject = () => {
    GetProjectQuery({}).then((res: any) => {
        projectList.value = res.content;
    });
};
const getProductTypeData=()=>{
    GetProductTypeQuery({}).then((res:any)=>{
         produstTypeList.value = res.content;
    })
}
const getProductFamilyData=()=>{
    GetProductFamilyQuery({}).then((res:any)=>{
        familyList.value= res.content
    })
}
const openAdd = () => {

    activeName.value = 'IQC'
    addForm.value.iQC_InspectionDetails[0] = {
        InspectionDetailName: "",
        ProjectCategoryName: "",
        ProjectName: "",
        TargetValue: "",
        MinValue: "",
        MaxValue: "",
        CharaCteristicGrade: "",
        ToolName: "",
        InspectionBasis: "",
        InspectionType: 'IQC',
        MeasurementType: "",
        CreateUser: "",
        UpdateUser: "",
    }
    addVisible.value = true;
};
const tabChange = (val: any) => {
    const inspectionType = val || 'IQC';
    const exists = addForm.value.iQC_InspectionDetails.some(
        (item: any) => item.InspectionType === inspectionType
    );
    if (!exists) {
        addForm.value.iQC_InspectionDetails.push(
            createInspectionDetail(inspectionType)
        );
    }
}
const createInspectionDetail = (val: any) => {
    return {
        InspectionDetailName: "",
        ProjectCategoryName: "",
        ProjectName: "",
        TargetValue: "",
        MinValue: "",
        MaxValue: "",
        CharaCteristicGrade: "",
        ToolName: "",
        InspectionBasis: "",
        InspectionType: val,
        MeasurementType: "",
        CreateUser: "",
        UpdateUser: "",
    }
}
const addCancel = () => {
    addFormRef.value.resetFields();
    addVisible.value = false;
    addForm.value.InspectionMasterName = "";
    addForm.value.DBType = "Add";
    addForm.value.InspectionType = ''
    addForm.value.iQC_InspectionDetails = [
    ];
};
const addInspectionDetails = () => {
    addForm.value.iQC_InspectionDetails.push({
        InspectionDetailName: "",
        ProjectCategoryName: "",
        ProjectName: "",
        TargetValue: "",
        MinValue: "",
        MaxValue: "",
        CharaCteristicGrade: "",
        ToolName: "",
        InspectionBasis: "",
        InspectionType: activeName.value,
        MeasurementType: "",
        CreateUser: "",
        UpdateUser: "",
    });
};
const addInspectionDelete = (filteredIndex: any) => {
    const currentInspectionType = activeName.value;

    // 方法1：使用reduce计算原始索引
    const originalIndex = addForm.value.iQC_InspectionDetails.reduce((count, item, index) => {
        if (item.InspectionType === currentInspectionType) {
            if (count.count === filteredIndex && count.result === -1) {
                count.result = index;
            }
            count.count++;
        }
        return count;
    }, { count: 0, result: -1 }).result;

    if (originalIndex !== -1) {
        addForm.value.iQC_InspectionDetails.splice(originalIndex, 1);
    }
}
const addSubmit = () => {
    addForm.value.DBType = "Add";

    const filteredDetails = addForm.value.iQC_InspectionDetails.filter(
        (item: any) => item.ProjectCategoryName && item.ProjectCategoryName.trim() !== ""
    );

    // 如果过滤后数组为空，可以给出提示
    if (filteredDetails.length === 0) {
        ElMessage({
            title: t("publicText.tipTitle"),
            message: "请至少填写一个有效的检查项目",
            type: "warning",
        });
        return; // 停止执行
    }
    addForm.value.iQC_InspectionDetails = filteredDetails.map((item: any) => {
        return {
            ...item,
            // InspectionType: addForm.value.InspectionType,
            CreateUser: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
        }
    })
    // console.log(addForm.value);

    AyscInspectionMaster(addForm.value).then((res: any) => {
        ElMessage({
            title: t("publicText.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        addCancel();
        getData();
    });
};
const tabChange2 = (val: any) => {
    // getDetailForm.value.InspectionType = val
    // getDetailData()
    const inspectionType = val || 'IQC';
    const exists = editForm.value.iQC_InspectionDetails.some(
        (item: any) => item.InspectionType === inspectionType
    );
    if (!exists) {
        editForm.value.iQC_InspectionDetails.push(
            createInspectionDetail(inspectionType)
        );
    }
}
const handleEdit = (val: any) => {
    editVisible.value = true;
    editForm.value.InspectionMasterName = val.ES_INSPECTION_MASTERName;
    editForm.value.DBType = "Update";
    getDetailForm.value.InspectionMasterName = val.ES_INSPECTION_MASTERName;
    getDetailForm.value.InspectionType = ''
    getDetailData()
};
const getDetailData = () => {
    GetInspectionDetailQuery(getDetailForm.value).then((res: any) => {
        editForm.value.iQC_InspectionDetails = res.content;
        if (activeName2.value == 'IQC') {
            const exists = editForm.value.iQC_InspectionDetails.some(
                (item: any) => item.InspectionType === 'IQC'
            );
            if (!exists) {
                editForm.value.iQC_InspectionDetails.push(
                    createInspectionDetail('IQC')
                );
            }
        }
        if (editForm.value.iQC_InspectionDetails.length == 0) {
            // editVisible.value = false;
            editForm.value.iQC_InspectionDetails = [
                {
                    InspectionDetailName: "",
                    ProjectCategoryName: "",
                    ProjectName: "",
                    TargetValue: "",
                    MinValue: "",
                    MaxValue: "",
                    CharaCteristicGrade: "",
                    ToolName: "",
                    InspectionBasis: "",
                    InspectionType: activeName2.value,
                    MeasurementType: "",
                    CreateUser: "",
                    UpdateUser: userStore.getUserInfo,
                },
            ];
        }
    });
};


const editInspectionDetails = () => {
    editForm.value.iQC_InspectionDetails.push({
        InspectionDetailName: "",
        ProjectCategoryName: "",
        ProjectName: "",
        TargetValue: "",
        MinValue: "",
        MaxValue: "",
        CharaCteristicGrade: "",
        ToolName: "",
        InspectionBasis: "",
        InspectionType: activeName2.value,
        MeasurementType: "",
        CreateUser: "",
        UpdateUser: userStore.getUserInfo,
    });
};
const deleteDetail = (val: any, filteredIndex: any) => {

    if (val.InspectionDetailName == '') {
        // editForm.value.iQC_InspectionDetails.splice(index, 1)
        const currentInspectionType = activeName2.value;
        // 方法1：使用reduce计算原始索引
        const originalIndex = editForm.value.iQC_InspectionDetails.reduce((count, item, index) => {
            if (item.InspectionType === currentInspectionType) {
                if (count.count === filteredIndex && count.result === -1) {
                    count.result = index;
                }
                count.count++;
            }
            return count;
        }, { count: 0, result: -1 }).result;

        if (originalIndex !== -1) {
            editForm.value.iQC_InspectionDetails.splice(originalIndex, 1);
        }
        return
    }
    let data = {
        InspectionMasterName: editForm.value.InspectionMasterName,
        DBType: "Delete",
        iQC_InspectionDetails: [
            {
                ...val,
                UpdateUser: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            },
        ],
    };
    ElMessageBox.confirm(
        t("publicText.confirm") + t("publicText.delete"),
        t("publicText.confirm") + t("publicText.operation"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            AyscDelInspectionDetail(data).then((res: any) => {
                ElMessage({
                    title: t("message.tipTitle"),
                    message: res.msg,
                    type: res.success ? "success" : "error",
                });
                getDetailData()
                // getData();
                // GetInspectionDetailQuery({
                //     InspectionMasterName: editForm.value.InspectionMasterName,
                //     InspectionType: '',
                // }).then((res: any) => {
                //     editForm.value.iQC_InspectionDetails = res.content;
                //     if (editForm.value.iQC_InspectionDetails.length == 0) {
                //         // editVisible.value = false;
                //         editForm.value.iQC_InspectionDetails = [
                //             {
                //                 InspectionDetailName: "",
                //                 ProjectCategoryName: "",
                //                 ProjectName: "",
                //                 TargetValue: "",
                //                 MinValue: "",
                //                 MaxValue: "",
                //                 CharaCteristicGrade: "",
                //                 ToolName: "",
                //                 InspectionBasis: "",
                //                 InspectionType: "",
                //                 MeasurementType: "",
                //                 CreateUser: "",
                //                 UpdateUser: userStore.getUserInfo,
                //             },
                //         ];
                //     }
                // });
            });
        })
        .catch(() => {
            // on cancel
            ElMessage({
                title: t("publicText.tipTitle"),
                message: t("publicText.cancel"),
                type: "info",
            });
        });
};

const handleDelete = (val: any) => {
    ElMessageBox.confirm(
        t("publicText.confirm") + t("publicText.disassembly"),
        t("publicText.confirm") + t("publicText.operation"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => { })
        .catch(() => {
            // on cancel
            ElMessage({
                title: t("message.tipTitle"),
                message: t("publicText.cancel"),
                type: "info",
            });
        });
};
const editCancel = () => {
    editFormRef.value.resetFields();
    editVisible.value = false;
    editForm.value.InspectionMasterName = "";
    editForm.value.DBType = "Update";
    getDetailForm.value.InspectionType = "";
    editForm.value.iQC_InspectionDetails = [
    ];
    activeName2.value = 'IQC'
};
const editSubmit = () => {
    // const hasEmptyCategory = (editForm.value.iQC_InspectionDetails as any[]).some(
    //     (d: any) => !d.ProjectCategoryName || d.ProjectCategoryName === ""
    // );
    // if (hasEmptyCategory) {
    //     ElMessage({
    //         title: t("message.tipTitle"),
    //         message: t("aqlrules.InspectionDetails") + t("publicText.isEmpty"),
    //         type: "error",
    //     });
    //     return;
    // }
    const filteredDetails = editForm.value.iQC_InspectionDetails.filter(
        (item: any) => item.ProjectCategoryName && item.ProjectCategoryName.trim() !== ""
    );
    editForm.value.iQC_InspectionDetails = filteredDetails.map((item: any) => {
        return {
            ...item,
            UpdateUser: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo
        }
    })
    // console.log(editForm.value);

    AyscInspectionMaster(editForm.value).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        editCancel();
        getData();
    });
};
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>

<style lang="scss" scoped></style>
