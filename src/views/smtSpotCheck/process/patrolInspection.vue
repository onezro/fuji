<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('processInspect.inspectOrder')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.InspectionNO" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.workeOrder')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.MfgorderName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.creatTime')" class="mb-2"><el-date-picker
                        :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" size="small" style="width: 150px" :clearable="false" />
                </el-form-item>
                <el-form-item :label="$t('processInspect.firstInspectStatus')" class="mb-2">
                    <el-select v-model="getForm.DocumentStatus" placeholder="" style="width: 150px">
                        <el-option :label="t('processInspect.status1')" :value="t('processInspect.status1')">
                        </el-option>
                        <el-option :label="t('processInspect.status2')" :value="t('processInspect.status2')">
                        </el-option>
                        <el-option :label="t('processInspect.status3')" :value="t('processInspect.status3')">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item :label="$t('processInspect.patrolInspectStatus')" class="mb-2">
                    <el-select v-model="getForm.patrolInspectStatus" placeholder="" style="width: 150px">
                        <el-option :label="t('incomeSheet.status1')" :value="t('incomeSheet.status1')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status2')" :value="t('incomeSheet.status2')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status3')" :value="t('incomeSheet.status3')">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('processInspect.tailInspectStatus')" class="mb-2">
                    <el-select v-model="getForm.tailInspectStatus" placeholder="" style="width: 150px">
                        <el-option :label="t('incomeSheet.status1')" :value="t('incomeSheet.status1')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status2')" :value="t('incomeSheet.status2')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status3')" :value="t('incomeSheet.status3')">
                        </el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item :label="$t('processInspect.productType')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.ProductType" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.productName')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.ProductName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.customerName')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.CustomerName" placeholder="" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item :label="$t('processInspect.customerPO')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.customerPO" placeholder="" clearable></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('processInspect.customerPN')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.PartNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.LOtNO')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.LotNo" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small">
                        {{ $t("publicText.reset") }}
                    </el-button>
                    <el-button type="warning" size="small" @click="addVisible = true">
                        {{ $t("publicText.add") }}
                    </el-button>
                    <!-- <el-button type="Danger" size="small" @click="testVisible = true">
                        {{ $t("processInspect.orderInterrupt") }}
                    </el-button> -->
                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" border fit>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ES_InspectionNo" :label="$t('processInspect.inspectOrder')" />
                <el-table-column prop="ES_MfgorderName" :label="$t('processInspect.workeOrder')" />
                <el-table-column prop="ES_ProductName" :label="$t('processInspect.productName')" />
                <el-table-column prop="ES_ProductType" :label="$t('processInspect.productType')" />
                <el-table-column prop="customerPO" :label="$t('processInspect.customerPO')" />
                <el-table-column prop="ES_PartNo" :label="$t('processInspect.customerPN')" />
                <el-table-column prop="ES_LotNo" :label="$t('processInspect.LOtNO')" />
                <el-table-column prop="ES_DocumentStatus" :label="$t('processInspect.firstInspectStatus')" />

                <el-table-column prop="ES_CreateDate" :label="$t('processInspect.creatTime')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.check')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip :content="$t('publicText.look')" placement="top">
                            <el-button type="primary" icon="Reading" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip> -->
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

        <el-dialog v-model="addVisible" title="添加检验" width="300px" draggable :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleAddClose">
            <el-form ref="formRef" :model="addForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('processInspect.workeOrder')" prop="MfgorderName">
                    <el-input v-model="addForm.MfgorderName" placeholder="请输入" style="width: 200px" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleAddClose">{{
                        $t("publicText.cancel")
                        }}</el-button>
                    <el-button type="primary" @click="handleAddConfirm">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="editVisible" title="检验" width="80%" draggable :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleEditClose">
            <el-form ref="editFormRef" :model="editForm" label-width="auto" :inline="true" :size="'small'">
                <el-form-item :label="$t('processInspect.inspectOrder')" prop="InspectionNO">
                    <el-input v-model="editForm.InspectionNO" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item :label="$t('processInspect.workeOrder')" prop="MfgorderName">
                    <el-input v-model="editForm.MfgorderName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item :label="$t('processInspect.customerPN')" prop="PartNo">
                    <el-input v-model="editForm.PartNo" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item :label="$t('processInspect.LOtNO')" prop="LotNo">
                    <el-input v-model="editForm.LotNo" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item :label="$t('processInspect.productType')" prop="ProductType">
                    <el-input v-model="editForm.ProductType" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item :label="$t('processInspect.productName')" prop="ProductName">
                    <el-input v-model="editForm.ProductName" placeholder="请输入" disabled />
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first">
                    <el-table :data="editForm.countItem" style="width: 100%" :height="300" size="small" border stripe>
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>
                        <el-table-column prop="CharaCteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="ToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleNum" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleNum" size="small" type="number"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectNum" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                <el-input v-model="scope.row.DefectNum" size="small" type="number"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectDec" :label="$t('incomeSheet.DefectDec')">
                            <template #default="scope">
                                <el-input v-model="scope.row.DefectDec" size="small"></el-input>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'计量检验'" name="second">
                    <el-table :data="editForm.listItem" style="width: 100%" :height="300" size="small" border stripe>
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharaCteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>

                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                        </el-table-column>
                        <el-table-column prop="ToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleNum" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleNum" size="small" type="number" min="1" max="10"
                                    @change="handleSampleSizeChange(scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectNum" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ scope.row.DefectCount || calculateDefectCount(scope.row) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="ObservedValue" :align="'center'"
                            :label="$t('incomeSheet.MeasurementNumber')">
                            <template #default="scope">
                                <span>{{ scope.row.ObservedValue }}</span>
                                <el-button type="primary" icon="Plus" :size="'small'"
                                    @click="openMeasurementDialog(scope.row, scope.$index)" />
                            </template>
                        </el-table-column>

                        <el-table-column prop="ObservedValueSum" :label="'总和'">
                            <template #default="scope">
                                <span>{{ calculateSum(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AverageNum" :label="'平均数'">
                            <template #default="scope">
                                <span>{{ calculateAverage(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'结果'">
                            <template #default="scope">
                                {{ scope.row.StatusText || getResultText(scope.row) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleEditClose">{{
                        $t("publicText.cancel")
                        }}</el-button>
                    <el-button type="warning" @click="handleEditZQConfirm">
                        {{ "暂存" }}
                    </el-button>
                    <el-button type="primary" @click="handleEditConfirm">
                        {{ $t('publicText.confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogVisible" :title="'输入测量值'" width="500px">
            <el-form ref="formRef" label-width="auto" size="small">
                <el-form-item :label="'样本值' + i" prop="name" v-for="i in currentSampleSize" :key="i">
                    <el-input v-model="measurementValues[i - 1]" placeholder="请输入测量值" style="width: 200px" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveMeasurements">保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    GetInspectionQuery,
    GetInspectionDelQuery,
    CreateInspectionNO,
    InspectionNOInfoSync,
} from "@/api/smtSpotCheck/processFisrt";
import {
    GetProjectCategoryQuery,
    GetProjectQuery,
    GetResourceQuery,
    GetInspectionTypeQuery,
    GetProductQuery,
} from "@/api/incomingManage/aqlrules";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
const getForm = ref({
    InspectionNO: "",
    InspectionType: "巡检单",
    MfgorderName: "",
    ProductName: "",
    PartNo: "",
    CustomerName: "",
    LotNo: "",
    ProductType: "",
    DocumentStatus: "",
    StartTime: "",
    EndTime: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const testVisible = ref(false);
const activeName = ref("first");
const productList = ref<any[]>([]);
const typetList = ref<any[]>([]);
const categoryList = ref<any[]>([]);
const resourceList = ref<any[]>([]);
const projectList = ref<any[]>([]);
const addVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
    InspectionType: "巡检",
    MfgorderName: "",
});
const editVisible = ref(false);
const editFormRef = ref();
const editForm = ref({
    InspectionNO: "",
    InspectionType: "",
    MfgorderName: "",
    ProductName: "",
    ProductDec: "",
    PartNo: "",
    CustomerName: "",
    LotNo: "",
    MaterialReQty: "",
    DocumentStatus: "待检验",
    ProductType: "",
    InspectionResult: "",
    CreateDate: "",
    listItem: [
        {
            MfgorderName: "",
            ProjectName: "",
            ProjectCategoryName: "",
            TargetValue: "",
            MaxValue: "",
            MinValue: "",
            CharaCteristicGrade: "",
            ToolName: "",
            InspectionBasis: "",
            SampleNum: "",
            DefectNum: "",
            MeasurementType: "",
            ObservedValue: "",
            ObservedValueSum: "",
            AverageNum: "",
            DefectDec: "",
            SpecialCause: "",
            InspectionResult: "",
            InspectionBy: userStore.getUserInfo,
            InspectionUpdateBy: "",
            InspectionDate: "",
        },
    ],
    countItem: []
});
const dialogVisible = ref(false);
const currentRow = ref<any>(null);
const currentRowIndex = ref<any>(-1);
const currentSampleSize = ref(0);
const measurementValues = ref<any[]>([]);
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.StartTime = "";
            getForm.value.EndTime = "";
            // getForm.value.PageNumber = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.StartTime = newVal[0];
            getForm.value.EndTime = newVal[1];
            // getForm.value.PageNumber = 1
        }
    }
);

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
    GetInspectionQuery(getForm.value).then((res: any) => {
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
const handleAddClose = () => {
    addVisible.value = false;
    addForm.value = {
        InspectionType: "巡检",
        MfgorderName: "",
    };
};
const handleAddConfirm = () => {
    CreateInspectionNO(addForm.value).then((res: any) => {
        ElNotification({
            title: t("publicText.success"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        addVisible.value = false;
        addForm.value = {
            InspectionType: "巡检",
            MfgorderName: "",
        };
        getData();
    });
};

const saveMeasurements = () => {
    if (currentRowIndex.value === null) return

    const row = editForm.value.listItem[currentRowIndex.value]

    // 过滤空值并连接为字符串
    const validValues = measurementValues.value
        .filter(v => v !== '' && v !== null && v !== undefined)
        .map(v => v.toString().trim())

    row.ObservedValue = validValues.join(',')

    // 重新计算相关数值
    //   calculateRowValues(row)

    dialogVisible.value = false
    measurementValues.value = []
    currentRowIndex.value = null
};
const handleEditClose = () => {
    editVisible.value = false;
    editForm.value = {
        InspectionNO: "",
        InspectionType: "",
        MfgorderName: "",
        ProductName: "",
        ProductDec: "",
        PartNo: "",
        CustomerName: "",
        LotNo: "",
        MaterialReQty: "",
        DocumentStatus: "",
        ProductType: "",
        InspectionResult: "",
        CreateDate: "",
        listItem: [
            {
                MfgorderName: "",
                ProjectName: "",
                ProjectCategoryName: "",
                TargetValue: "",
                MaxValue: "",
                MinValue: "",
                CharaCteristicGrade: "",
                ToolName: "",
                InspectionBasis: "",
                SampleNum: "",
                DefectNum: "",
                MeasurementType: "",
                ObservedValue: "",
                ObservedValueSum: "",
                AverageNum: "",
                DefectDec: "",
                SpecialCause: "",
                InspectionResult: "",
                InspectionBy: userStore.getUserInfo,
                InspectionUpdateBy: "",
                InspectionDate: "",
            },
        ],
        countItem: []
    };
};
const handleEditZQConfirm = () => {
    console.log(editForm.value);
    let data = {
        InspectionNO: editForm.value.InspectionNO,
        InspectionResult: "",
        DocumentStatus: "检验中",
        listItem: [...editForm.value.listItem],
    };
    data.listItem = editForm.value.listItem.map((item: any) => {
        return {
            MfgorderName: editForm.value.MfgorderName,
            ProjectName: item.ProjectName,
            ProjectCategoryName: item.ProjectCategoryName,
            TargetValue: item.TargetValue,
            MaxValue: item.MaxValue,
            MinValue: item.MinValue,
            CharaCteristicGrade: item.CharaCteristicGrade,
            ToolName: item.ToolName,
            InspectionBasis: item.InspectionBasis,
            SampleNum: item.SampleNum,
            MeasurementType: item.MeasurementType,
            DefectNum: item.DefectNum,
            ObservedValue: item.ObservedValue,
            ObservedValueSum: item.ObservedValueSum,
            AverageNum: item.AverageNum,
            DefectDec: item.DefectDec,
            SpecialCause: item.SpecialCause,
            InspectionResult: item.Status,
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo,
        };
    });
    editForm.value.countItem.forEach((item: any) => {
        data.listItem.push({
            MfgorderName: editForm.value.MfgorderName,
            ProjectName: item.ProjectName,
            ProjectCategoryName: item.ProjectCategoryName,
            TargetValue: item.TargetValue,
            MaxValue: item.MaxValue,
            MinValue: item.MinValue,
            CharaCteristicGrade: item.CharaCteristicGrade,
            ToolName: item.ToolName,
            InspectionBasis: item.InspectionBasis,
            SampleNum: item.SampleNum,
            MeasurementType: item.MeasurementType,
            DefectNum: item.DefectNum,
            ObservedValue: item.ObservedValue,
            ObservedValueSum: item.ObservedValueSum,
            AverageNum: item.AverageNum,
            DefectDec: item.DefectDec,
            SpecialCause: item.SpecialCause,
            InspectionResult: item.Status,
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo,
        })
    });

    // console.log(data);

    InspectionNOInfoSync(data).then((res: any) => {
        ElNotification({
            title: t("publicText.success"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        handleEditClose()
        getData();
    });
};
const handleEditConfirm = () => {

    let data = {
        InspectionNO: editForm.value.InspectionNO,
        "InspectionResult": "合格",
        "DocumentStatus": "检验完成",
        listItem: [...editForm.value.listItem],
    };

    data.listItem = editForm.value.listItem.map((item: any) => {
        return {
            MfgorderName: editForm.value.MfgorderName,
            ProjectName: item.ProjectName,
            ProjectCategoryName: item.ProjectCategoryName,
            TargetValue: item.TargetValue,
            MaxValue: item.MaxValue,
            MinValue: item.MinValue,
            CharaCteristicGrade: item.CharaCteristicGrade,
            ToolName: item.ToolName,
            InspectionBasis: item.InspectionBasis,
            SampleNum: item.SampleNum,
            MeasurementType: item.MeasurementType,
            DefectNum: item.DefectNum,
            ObservedValue: item.ObservedValue,
            ObservedValueSum: item.ObservedValueSum,
            AverageNum: item.AverageNum,
            DefectDec: item.DefectDec,
            SpecialCause: item.SpecialCause,
            InspectionResult: item.Status,
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo,
        };
    });
    let isEixt = data.listItem.findIndex((item: any) => {
        return item.Status !== 'OK'
    })

    if (isEixt !== -1) {
        ElNotification({
            title: t("message.tipTitle"),
            message: '计量结果，不通过！请检查',
            type: "error",
        });

        return
    }

    editForm.value.countItem.forEach((item: any) => {
        data.listItem.push({
            MfgorderName: editForm.value.MfgorderName,
            ProjectName: item.ProjectName,
            ProjectCategoryName: item.ProjectCategoryName,
            TargetValue: item.TargetValue,
            MaxValue: item.MaxValue,
            MinValue: item.MinValue,
            CharaCteristicGrade: item.CharaCteristicGrade,
            ToolName: item.ToolName,
            InspectionBasis: item.InspectionBasis,
            SampleNum: item.SampleNum,
            MeasurementType: item.MeasurementType,
            DefectNum: item.DefectNum,
            ObservedValue: item.ObservedValue,
            ObservedValueSum: item.ObservedValueSum,
            AverageNum: item.AverageNum,
            DefectDec: item.DefectDec,
            SpecialCause: item.SpecialCause,
            InspectionResult: item.Status,
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo,
        })
    });
    // console.log(data);

    InspectionNOInfoSync(data).then((res: any) => {
        ElNotification({
            title: t("publicText.success"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        handleEditClose()
        getData();
    });
}
const handleEdit = (row: any) => {
    // testVisible.value = true;
    editForm.value.InspectionNO = row.ES_InspectionNo;
    editForm.value.MfgorderName = row.ES_MfgorderName;
    editForm.value.ProductName = row.ES_ProductName;
    editForm.value.ProductType = row.ES_ProductType;
    editForm.value.PartNo = row.ES_PartNo;
    editForm.value.LotNo = row.ES_LotNo;

    GetInspectionDelQuery({ InspectionNO: row.ES_InspectionNo, MfgorderName: row.ES_MfgorderName, InspectionType: '巡检' }).then(
        (res: any) => {
            editForm.value.listItem = res.content
                .filter((item: any) => item && item.MEASUREMENTTYPE === '计量')
                .map((item: any) => {
                    return {
                        MfgorderName: "",
                        ProjectName: item.PROJECTNAME,
                        ProjectCategoryName: item.PROJECTCATEGORYNAME,
                        TargetValue: item.TARGETVALUE,
                        MaxValue: item.MAXVALUE,
                        MinValue: item.MINVALUE,
                        CharaCteristicGrade: item.CHARACTERISTICGRADE,
                        ToolName: item.TOOLNAME,
                        InspectionBasis: item.INSPECTIONBASIS,
                        SampleNum: item.SAMPLENUM,
                        MeasurementType: item.MEASUREMENTTYPE,
                        DefectNum: item.DEFECTNUM,
                        ObservedValue: item.OBSERVEDVALUE,
                        ObservedValueSum: item.OBSERVEDVALUESUM,
                        AverageNum: item.AVERAGENUM,
                        DefectDec: item.DEFECTDEC,
                        SpecialCause: item.SPECIALCAUSE,
                        InspectionResult: item.INSPECTIONRESULT,
                        InspectionBy: userStore.getUserInfo,
                        InspectionUpdateBy: userStore.getUserInfo,
                        InspectionDate: "",
                    };
                });
            editForm.value.countItem = res.content
                .filter((item: any) => item && item.MEASUREMENTTYPE === '计数')
                .map((item: any) => {
                    return {
                        MfgorderName: "",
                        ProjectName: item.PROJECTNAME,
                        ProjectCategoryName: item.PROJECTCATEGORYNAME,
                        TargetValue: item.TARGETVALUE,
                        MaxValue: item.MAXVALUE,
                        MinValue: item.MINVALUE,
                        CharaCteristicGrade: item.CHARACTERISTICGRADE,
                        ToolName: item.TOOLNAME,
                        InspectionBasis: item.INSPECTIONBASIS,
                        SampleNum: item.SAMPLENUM,
                        MeasurementType: item.MEASUREMENTTYPE,
                        DefectNum: item.DEFECTNUM,
                        ObservedValue: item.OBSERVEDVALUE,
                        ObservedValueSum: item.OBSERVEDVALUESUM,
                        AverageNum: item.AVERAGENUM,
                        DefectDec: item.DEFECTDEC,
                        SpecialCause: item.SPECIALCAUSE,
                        InspectionResult: item.INSPECTIONRESULT,
                        InspectionBy: userStore.getUserInfo,
                        InspectionUpdateBy: userStore.getUserInfo,
                        InspectionDate: "",
                    };
                });


            editVisible.value = true;
            // console.log(res);
        }
    );
};
const openMeasurementDialog = (row: any, index: any) => {
    currentRow.value = row;
    currentRowIndex.value = index;
    currentSampleSize.value = parseInt(row.SampleNum) || 1;
    measurementValues.value = [];
    // for (let i = 0; i < currentSampleSize.value; i++) {
    //     measurementValues.value.push(row[`MeasuredValue${i + 1}`] || "");
    // }
    // 如果已有测量值，解析到数组中
    if (row.ObservedValue) {
        measurementValues.value = row.ObservedValue.split(',').map((v: any) => v.trim())
    } else {
        // 根据样件数初始化数组
        measurementValues.value = Array(currentSampleSize.value).fill('')
    }

    dialogVisible.value = true;
};
const getResultText = (row: any) => {
    const defectCount = calculateDefectCount(row)
    const sampleNum = row.SampleNum || 1

    if (defectCount === 0 && row.ObservedValue !== "") {
        return 'OK'
    } else {
        return 'NG'
    }
};
const handleSampleSizeChange = (row: any) => {
    // 确保样件数在1-10之间
    let sampleNum = parseInt(row.SampleNum) || 1
    sampleNum = Math.max(1, Math.min(10, sampleNum))
    row.SampleNum = sampleNum

    // 如果已有测量值，需要调整
    if (row.ObservedValue) {
        const values = row.ObservedValue.split(',').map((v: any) => v.trim())
        if (values.length > sampleNum) {
            // 如果新样件数小于原有测量值数量，截断
            row.ObservedValue = values.slice(0, sampleNum).join(',')
        } else if (values.length < sampleNum) {
            // 如果新样件数大于原有测量值数量，补充空值
            while (values.length < sampleNum) {
                values.push('')
            }
            row.ObservedValue = values.join(',')
        }
    }

};
const calculateDefectCount = (row: any) => {
    if (!row.ObservedValue || !row.MinValue || !row.MaxValue) {
        row.DefectNum = 0
        return 0
    }

    const min = parseFloat(row.MinValue)
    const max = parseFloat(row.MaxValue)

    if (isNaN(min) || isNaN(max)) {
        row.DefectNum = 0
        return 0
    }

    const values = row.ObservedValue
        .split(',')
        .map((v: any) => parseFloat(v.trim()))
        .filter((v: any) => !isNaN(v))

    const defectCount = values.filter((v: any) => v < min || v > max).length
    row.DefectNum = defectCount
    return defectCount
};

const calculateSum = (row: any) => {
    if (!row.ObservedValue) {
        row.ObservedValueSum = '0'
        return '0'
    }

    const values = row.ObservedValue
        .split(',')
        .map((v: any) => parseFloat(v.trim()))
        .filter((v: any) => !isNaN(v))

    const sum = values.reduce((total: any, current: any) => total + current, 0)
    row.ObservedValueSum = sum.toFixed(2)
    return sum.toFixed(2)
};
const calculateAverage = (row: any) => {
    if (!row.ObservedValue) {
        row.AverageNum = '0'
        return '0'
    }

    const values = row.ObservedValue
        .split(',')
        .map((v: any) => parseFloat(v.trim()))
        .filter((v: any) => !isNaN(v))

    if (values.length === 0) {
        row.AverageNum = '0'
        return '0'
    }

    const sum = values.reduce((total: any, current: any) => total + current, 0)
    const avg = sum / values.length
    row.AverageNum = avg.toFixed(2)
    return avg.toFixed(2)
};
const formatMeasuredValues = (row: any) => {
    // const values = [];
    // for (let i = 1; i <= 10; i++) {
    //     const value = row[`MeasuredValue${i}`];
    //     if (value !== null && value !== undefined && value !== "") {
    //         values.push(value);
    //     }
    // }
    // row.ObservedValue = values.join(",");
    const values = row.ObservedValue.split(',')
    return values.join(",");
};

const handletestClose = () => {
    testVisible.value = false;
};
const handletestConfirm = () => {
    testVisible.value = false;
};
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 250;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}

.table-container {
    display: flex;
    width: 100%;
    height: 100%;
}

.left {
    flex: 1;
}

.right {
    flex: 1;
}
</style>

<style lang="scss" scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
}

.info-section {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.info-item {
    display: flex;
    margin-right: 30px;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
}

.table-container {
    overflow-x: auto;
}

.export-btn {
    margin-top: 20px;
    text-align: right;
}

.remark {
    margin-top: 15px;
    padding: 8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #606266;
}

.el-table .header-row {
    background-color: #f0f9ff;
}

.el-table .header-row th {
    background-color: #f0f9ff !important;
}

.el-table .cell {
    padding: 4px 8px;
    font-size: 12px;
}

.el-table th {
    padding: 8px 0;
}

.el-table--border {
    border: 1px solid #ebeef5;
}

.el-table--border th,
.el-table--border td {
    border-right: 1px solid #ebeef5;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #ebeef5;
}

.header-cell {
    font-weight: bold;
    background-color: #f5f7fa;
}

.content-cell {
    background-color: #ffffff;
}

.info-row {
    display: flex;
    margin-bottom: 10px;
}

.info-box {
    flex: 1;
    padding: 5px 10px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
}

.info-box:last-child {
    margin-right: 0;
}

.info-box-title {
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
