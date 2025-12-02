<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAdd">添加</el-button>
                </div>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'light'" border fit
                highlight-current-row>
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="ES_INSPECTION_MASTERName" :label="$t('aqlrules.partNumber')" />
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="160">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="handleEdit(row)">
                            {{ $t("publicText.detail") }}
                        </el-button>
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
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" size="normal">
                <el-form-item :label="$t('aqlrules.partNumber')" prop="partNumber">
                    <el-select v-model="addForm.InspectionMasterName" placeholder="请选择" filterable>
                        <el-option :label="p.productname" :value="p.productname" v-for="p in productList" />
                    </el-select>
                </el-form-item>
                 <el-form-item :label="$t('aqlrules.DBType')" prop="DBType">
                    <el-select v-model="addForm.InspectionType" placeholder="请选择" filterable >
                        <el-option :label="p.InspectionType" :value="p.InspectionType" v-for="p in typetList" />
                    </el-select>
                </el-form-item>

                <el-table :data="addForm.iQC_InspectionDetails" style="width: 100%" :height="300" size="small" border
                    stripe>
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
                            <el-select v-model="scope.row.MeasurementType" placeholder="请选择" filterable size="small">
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
                                <el-option :label="p.ResourceName" :value="p.ResourceName" v-for="p in resourceList" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        <template #default="scope">
                            <el-input v-model="scope.row.InspectionBasis" size="small"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('publicText.operation')" width="150px">
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="addInspectionDetails">{{ $t("publicText.add")
                                }}</el-button>
                            <el-button size="small" type="danger"
                                @click="addForm.iQC_InspectionDetails.splice(scope.$index, 1)"
                                :disabled="addForm.iQC_InspectionDetails.length == 1">{{ $t("publicText.delete")
                                }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{
                    $t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="85%" @close="editCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false" size="normal">
                <el-form-item :label="$t('aqlrules.partNumber')" prop="partNumber">
                    <el-select v-model="editForm.InspectionMasterName" placeholder="请选择" filterable :disabled="true">
                        <el-option :label="p.productname" :value="p.productname" v-for="p in productList" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('aqlrules.DBType')" prop="DBType">
                    <el-select v-model="getDetailForm.InspectionType" placeholder="请选择" filterable @change="getDetailData">
                        <el-option :label="p.InspectionType" :value="p.InspectionType" v-for="p in typetList" />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="editForm.iQC_InspectionDetails" style="width: 100%" :height="300" size="small" border
                stripe>
                <el-table-column prop="InspectionType" :label="$t('aqlrules.ProjectCategoryName')">
                    <template #default="scope">
                        <!-- <el-input v-model="scope.row.InspectionType" size="small"></el-input> -->
                        <el-select v-model="scope.row.ProjectCategoryName" placeholder="请选择" filterable size="small">
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
                        <el-select v-model="scope.row.MeasurementType" placeholder="请选择" filterable size="small">
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
                            <el-option :label="p.ResourceName" :value="p.ResourceName" v-for="p in resourceList" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                    <template #default="scope">
                        <el-input v-model="scope.row.InspectionBasis" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" width="150">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="editInspectionDetails">{{ $t("publicText.add")
                            }}</el-button>
                        <el-button size="small" type="danger" @click="deleteDetail(scope.row)">{{
                            $t("publicText.delete")
                            }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

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
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const getForm = ref({
    InspectionMasterName: "",
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
    InspectionType:'',
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
            InspectionType: "",
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
            InspectionType: "",
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
onBeforeMount(() => {
    getScreenHeight();
    getProduct();
    getType();
    getCategory();
    GetResource();
    getProject();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    GetInspectionMasterQuery(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
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
const openAdd = () => {
    addVisible.value = true;
};
const addCancel = () => {
    addFormRef.value.resetFields();
    addVisible.value = false;
    addForm.value.InspectionMasterName = "";
    addForm.value.DBType = "";
    addForm.value.InspectionType=''
    addForm.value.iQC_InspectionDetails = [
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
            InspectionType: "",
            MeasurementType: "",
            CreateUser: "",
            UpdateUser: "",
        },
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
        InspectionType: "",
        MeasurementType: "",
        CreateUser: userStore.getUserInfo,
        UpdateUser: "",
    });
};
// const handletypeChange = (val:any)=>{
//     console.log(val);
//    if(val=='计量'||val=='计数'){
//     addForm.value.iQC_InspectionDetails.forEach((item)=>{
//         if(item.InspectionType==val){
//             item.MeasurementType='ES_Measurement_Type'
//         }
//     })
//    }else{
//     addForm.value.iQC_InspectionDetails.forEach((item)=>{
//         if(item.InspectionType==val){
//             item.MeasurementType='ES_Inspection_Type'
//         }
//     })
//    }
// }
// const handletypeChange1 = (val:any)=>{
//     console.log(val);
//    if(val=='计量'||val=='计数'){
//     editForm.value.iQC_InspectionDetails.forEach((item)=>{
//         if(item.InspectionType==val){
//             item.MeasurementType='ES_Measurement_Type'
//         }
//     })
//    }else{
//     editForm.value.iQC_InspectionDetails.forEach((item)=>{
//         if(item.InspectionType==val){
//             item.MeasurementType='ES_Inspection_Type'
//         }
//     })
//    }
// }
const addSubmit = () => {
    // console.log(addForm.value);
    addForm.value.DBType = "Add";
    addForm.value.iQC_InspectionDetails=addForm.value.iQC_InspectionDetails.map((item:any)=>{
        return {
            ...item,
            InspectionType:addForm.value.InspectionType,
            CreateUser:userStore.getUserInfo,
        }
    })
    AyscInspectionMaster(addForm.value).then((res: any) => {
        ElNotification({
            title: t("publicText.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        addCancel();
        getData();
    });
};

const getDetailData=() => {
    GetInspectionDetailQuery(getDetailForm.value).then((res: any) => {
        editForm.value.iQC_InspectionDetails = res.content;
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
                    InspectionType: "",
                    MeasurementType: "",
                    CreateUser: "",
                    UpdateUser: userStore.getUserInfo,
                },
            ];
        }
    });
};
const handleEdit = (val: any) => {
    editVisible.value = true;
    editForm.value.InspectionMasterName = val.ES_INSPECTION_MASTERName;
    editForm.value.DBType = "Update";
    getDetailForm.value.InspectionMasterName = val.ES_INSPECTION_MASTERName;
   getDetailData()
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
        InspectionType: "",
        MeasurementType: "",
        CreateUser: "",
        UpdateUser: userStore.getUserInfo,
    });
};
const deleteDetail = (val: any) => {
    let data = {
        InspectionMasterName: editForm.value.InspectionMasterName,
        DBType: "Delete",
        iQC_InspectionDetails: [
            {
                ...val,
                UpdateUser: userStore.getUserInfo,
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
                ElNotification({
                    title: t("publicText.tipTitle"),
                    message: res.msg,
                    type: res.success ? "success" : "error",
                });
                // getData();
                GetInspectionDetailQuery({
                    InspectionMasterName: editForm.value.InspectionMasterName,
                    InspectionType: "",
                }).then((res: any) => {
                    editForm.value.iQC_InspectionDetails = res.content;
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
                                InspectionType: "",
                                MeasurementType: "",
                                CreateUser: "",
                                UpdateUser: userStore.getUserInfo,
                            },
                        ];
                    }
                });
            });
        })
        .catch(() => {
            // on cancel
            ElNotification({
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
            ElNotification({
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
            InspectionType: "",
            MeasurementType: "",
            CreateUser: "",
            UpdateUser: "",
        },
    ];
};
const editSubmit = () => {
    const hasEmptyCategory = (editForm.value.iQC_InspectionDetails as any[]).some(
        (d: any) => !d.ProjectCategoryName || d.ProjectCategoryName === ""
    );
    if (hasEmptyCategory) {
        ElNotification({
            title: t("message.tipTitle"),
            message: t("aqlrules.InspectionDetails") + t("publicText.isEmpty"),
            type: "error",
        });
        return;
    }
    editForm.value.iQC_InspectionDetails=editForm.value.iQC_InspectionDetails.map((item:any)=>{
        return {
            ...item,
            InspectionType:getDetailForm.value.InspectionType,
            UpdateUser:userStore.getUserInfo
        }
    })
    AyscInspectionMaster(editForm.value).then((res: any) => {
        ElNotification({
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
