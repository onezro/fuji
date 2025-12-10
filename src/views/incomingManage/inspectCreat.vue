<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                    <el-form-item :label="$t('incomeCreat.creatInspect')" class="mb-2">
                        <el-input style="width: 140px" v-model="getForm.InspectionNo" placeholder=""
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('incomeCreat.creatInspect')" class="mb-2"><el-date-picker
                            :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                            range-separator="-" size="small" style="width: 200px" :clearable="false" /></el-form-item>
                     <el-form-item :label="'检验结果'" class="mb-2">
                      <el-select v-model="getForm.InspectionResult" placeholder=""  style="width: 200px">
                          <el-option label="合格" value="合格" />
                          <el-option label="不合格" value="不合格" />
                      </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" size="small" @click="getData">
                            {{ $t("publicText.query") }}
                        </el-button>
                        <el-button type="info" size="small" @click="resetGetForm">
                            {{ $t("publicText.reset") }}
                        </el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="handleCreat">
                        {{ $t("incomeCreat.creatInspectCode") }}
                    </el-button>
                </div>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" border fit
                highlight-current-row @cell-click="cellClick">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="IQCNumber" :label="$t('incomeCreat.creatInspect')">
                    <template #default="scope">
                        <span class="underline">{{
                            scope.row.IQCNumber
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="NotifyDate" :label="$t('incomeCreat.NotifyDate')" />
                <el-table-column prop="Notifier" :label="$t('incomeCreat.NotifyPerson')" />
                <el-table-column prop="NotifyDept" :label="$t('incomeCreat.NotifyDepartment')" />
                <el-table-column prop="ArrivalDate" :label="$t('incomeCreat.incomeDate')" />
                <el-table-column prop="IsAutomotive" :label="$t('incomeCreat.isCarProduct')" />
                <el-table-column prop="SamplingStandards" :label="$t('incomeCreat.InspectStandard')" />
                <el-table-column prop="StatusText" :label="$t('incomeCreat.Status')" />
                 <el-table-column prop="Status" :label="$t('incomeCreat.Status')" />
                 
                <el-table-column prop="CreateTime" :label="$t('incomeCreat.creatDate')" width="150" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button type="danger" icon="Delete" size="small"
                                @click.stop="handleDelete(scope.row)"></el-button>
                        </el-tooltip>
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
        <el-dialog v-model="creatVisible" :title="$t('incomeCreat.creatInspectCode')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleClose">
            <el-form ref="creatFormRef" :model="creatForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('incomeCreat.NotifyDepartment')" prop="NotifyDept">
                    <el-select v-model="creatForm.NotifyDept" placeholder="" style="width: 200px">
                        <el-option v-for="n in notifyDeptList" :label="n.WorkCenterName" :value="n.WorkCenterName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyPerson')" prop="Notifier">
                    <el-select v-model="creatForm.Notifier" placeholder="" style="width: 200px">
                        <el-option v-for="n in notifierList" :label="n.FullName" :value="n.FullName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeDate')" prop="ArrivalDate">
                    <el-date-picker v-model="creatForm.ArrivalDate" type="date" value-format="YYYY-MM-DD  HH:mm:ss"
                        placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyDate')" prop="NotifyDate">
                    <el-date-picker v-model="creatForm.NotifyDate" type="date" value-format="YYYY-MM-DD  HH:mm:ss"
                        placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.isCarProduct')" prop="IsAutomotive">
                    <el-select v-model="creatForm.IsAutomotive" placeholder="" style="width: 200px">
                        <el-option label="是" :value="1" />
                        <el-option label="否" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeUnit')" prop="IncomingUnit">
                    <el-select v-model="creatForm.IncomingUnit" placeholder="" style="width: 200px">
                        <el-option v-for="n in incomeUnitList" :label="n.IncomingUnit" :value="n.IncomingUnit" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="handleConfirm">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="creatEditVisible" :title="$t('incomeCreat.creatInspectCode')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleEditClose">
            <el-form ref="editCreatFormRef" :model="editCreateForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('incomeCreat.NotifyDepartment')" prop="NotifyDept">
                    <el-select v-model="editCreateForm.NotifyDept" placeholder="" style="width: 200px">
                        <el-option v-for="n in notifyDeptList" :label="n.WorkCenterName" :value="n.WorkCenterName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyPerson')" prop="Notifier">
                    <el-select v-model="editCreateForm.Notifier" placeholder="" style="width: 200px">
                        <el-option v-for="n in notifierList" :label="n.FullName" :value="n.FullName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeDate')" prop="ArrivalDate">
                    <el-date-picker v-model="editCreateForm.ArrivalDate" type="date" value-format="YYYY-MM-DD"
                        placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyDate')" prop="NotifyDate">
                    <el-date-picker v-model="editCreateForm.NotifyDate" type="date" value-format="YYYY-MM-DD"
                        placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.isCarProduct')" prop="IsAutomotive">
                    <el-select v-model="editCreateForm.IsAutomotive" placeholder="" style="width: 200px">
                        <el-option label="是" :value="1" />
                        <el-option label="否" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeUnit')" prop="IncomingUnit">
                    <el-select v-model="editCreateForm.IncomingUnit" placeholder="" style="width: 200px">
                        <el-option v-for="n in incomeUnitList" :label="n.IncomingUnit" :value="n.IncomingUnit" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleEditClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="handleEditConfirm">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="detailVisible" align-center title="来料检验单明细" width="85%" @close="detailVisible = false">
            <div class="mb-2 flex justify-end">
                <el-button type="warning" size="small" @click="addDetailVisible = true">
                    {{ $t("publicText.add") + $t("incomeCreat.incomeDetail") }}
                </el-button>
            </div>
            <el-table :data="detailTableData" size="small" :style="{ width: '100%' }" ref="rawRef" :height="450" border
                fit>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MaterialName" :label="$t('incomeCreat.materialName')" />
                <el-table-column prop="ModelSpec" :label="$t('incomeCreat.modelRules')" />
                <el-table-column prop="Supplier" :label="$t('incomeCreat.supplier')" />
                <el-table-column prop="OrderNo" :label="$t('incomeCreat.orderNumber')" />
                <el-table-column prop="LotNo" label="Lot No" />
                <el-table-column prop="TCode" label="T-Code" />
                <el-table-column prop="QuantityPerBox" :label="$t('incomeCreat.qtyIncomeMaterial')" />
                <el-table-column prop="SampledBoxes" :label="$t('incomeSheet.SampledBoxes')" />
                <el-table-column prop="SamplingStandards" :label="$t('incomeCreat.InspectStandard')" />
                <el-table-column prop="SupplierReportName" :label="$t('incomeCreat.supplierReport')" >

                    <template #default="scope">
                        <span v-if="scope.row.SupplierReportName" class="underline cursor-pointer text-cyan-800" @click="openFile(scope.row.SupplierReportGuid)">
                        
                                {{ scope.row.SupplierReportName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="StatusText" :label="$t('incomeCreat.Status')" />
                   <el-table-column prop="Status" :label="$t('incomeCreat.Status')" />
                <el-table-column prop="CreateTime" :label="$t('incomeCreat.creatDate')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEditDetail(scope.row)"></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button type="danger" icon="Delete" size="small"
                                @click.stop="handleDeleteDetail(scope.row)"></el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="detailVisible = false">{{
                        $t("publicText.close")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="addDetailVisible" :title="$t('incomeCreat.incomeDetail')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleAddDetailClose">
            <el-form ref="detailFormRef" :model="detailForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('incomeCreat.materialName')" prop="materialName">
                    <el-select v-model="detailForm.MaterialName" placeholder="" style="width: 200px"
                        @change="changeData">
                        <el-option v-for="n in materialNameList" :label="n.ProductFamilyName"
                            :value="n.ProductFamilyName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.modelRules')" prop="modelRules">
                    <el-select v-model="detailForm.ModelSpec" placeholder="" style="width: 200px">
                        <el-option v-for="n in productList" :label="n.productname" :value="n.productname" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.supplier')" prop="supplier">
                    <el-select v-model="detailForm.Supplier" placeholder="" style="width: 200px">
                        <el-option v-for="n in vendorList" :label="n.Vendorname" :value="n.Vendorname" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.orderNumber')" prop="orderNumber">
                    <el-input v-model="detailForm.OrderNo" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="Lot No" prop="lotno">
                    <el-input v-model="detailForm.LotNo" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="T-Code" prop="T-Code">
                    <el-input v-model="detailForm.TCode" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.qtyIncomeMaterial')" prop="qtyIncomeMaterial">
                    <el-input v-model="detailForm.QuantityPerBox" style="width: 200px" placeholder="" />
                </el-form-item>

                <!-- <el-form-item :label="$t('incomeCreat.supplierReport')" prop="supplierReport">
                    <el-input v-model="detailForm.SupplierReportName" style="width: 200px" placeholder="" />

                </el-form-item> -->
                <el-form-item label="上传供应商报告">
                    <el-upload action="#" multiple :limit="1" v-model:file-list="fileList" :auto-upload="false"
                        :on-change="file1UpChange" :on-remove="file1UpRemove" :before-upload="beforeUpload"
                        accept=".pdf" ref="upload1" class="upload-area">
                        <el-button size="small" type="primary" icon="Upload"></el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleAddDetailClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="handleAddDetailConfirm">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="editDetailVisible" :title="$t('publicText.edit') + $t('incomeCreat.incomeDetail')"
            width="750px" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false"
            align-center @close="handleEditDetailClose">
            <el-form ref="editdetailFormRef" :model="editdetailForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('incomeCreat.materialName')" prop="materialName">
                    <el-select v-model="editdetailForm.MaterialName" placeholder="" style="width: 200px"
                        @change="changeData" disabled>
                        <el-option v-for="n in materialNameList" :label="n.ProductFamilyName"
                            :value="n.ProductFamilyName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.modelRules')" prop="modelRules">
                    <el-select v-model="editdetailForm.ModelSpec" placeholder="" style="width: 200px" disabled>
                        <el-option v-for="n in productList" :label="n.productname" :value="n.productname" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.supplier')" prop="supplier">
                    <el-select v-model="editdetailForm.Supplier" placeholder="" style="width: 200px">
                        <el-option v-for="n in vendorList" :label="n.Vendorname" :value="n.Vendorname" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.orderNumber')" prop="orderNumber">
                    <el-input v-model="editdetailForm.OrderNo" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="Lot No" prop="lotno">
                    <el-input v-model="editdetailForm.LotNo" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="T-Code" prop="T-Code">
                    <el-input v-model="editdetailForm.TCode" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.qtyIncomeMaterial')" prop="qtyIncomeMaterial">
                    <el-input v-model="editdetailForm.QuantityPerBox" style="width: 200px" placeholder="" />
                </el-form-item>

                <!-- <el-form-item :label="$t('incomeCreat.supplierReport')" prop="supplierReport">
                    <el-input v-model="editdetailForm.SupplierReportName" style="width: 200px" placeholder="" />
                </el-form-item> -->
                  <el-form-item label="上传供应商报告">
                    <el-upload action="#" multiple :limit="1" v-model:file-list="fileList" :auto-upload="false"
                        :on-change="file2UpChange" :on-remove="file2UpRemove" :before-upload="beforeUpload"
                        accept=".pdf" ref="upload1" class="upload-area">
                        <el-button size="small" type="primary" icon="Upload"></el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleEditDetailClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="handleEditDetailConfirm">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
         <el-dialog v-model="previewVisible" :title="previewTitle"
            width="800px" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false"
            align-center >
            <iframe :src="previewUrl" width="100%" height="550px" frameborder="0"></iframe>
               <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handlePreviewClose">{{
                        $t("publicText.close")
                    }}</el-button>
                    <el-button type="primary" @click="handlePreviewDawnload">
                        {{ $t("publicText.dawnload") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    GetWorkCenterQuery,
    GetEmployeeQuery,
    GetIncomingUnitQuery,
    GetProductFamilyQuery,
    GetIQCHeaderQuery,
    AyscIQCAdd,
    AyscIQCUpdate,
    GetProductQuery,
    GetVendorQuery,
    GetAQLLevelQuery,
    GetIQCDetailQuery,
    AyscIQCDetailAdd,
    AyscIQCDetailUpdate,
    LabelPrintDownloadFtp
} from "@/api/incomingManage/iqcApi";
import dayjs from "dayjs";
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
import { ElNotification, ElMessageBox,ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
import { de } from "element-plus/es/locale/index.mjs";
const userStore = useUserStoreWithOut();
const getForm = ref({
    InspectionNo: "",
    StartTime: "",
    EndTime: "",
    InspectionResult: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const notifyDeptList = ref<any[]>([]);
const notifierList = ref<any[]>([]);
const incomeUnitList = ref<any[]>([]);
const creatVisible = ref(false);
const creatForm = ref({
    NotifyDept: "",
    Notifier: "",
    ArrivalDate: "",
    NotifyDate: "",
    IsAutomotive: 0,
    SamplingStandards: "",
    IncomingUnit: "",
    Approver: "",
});
const creatFormRef = ref("");
const creatEditVisible = ref(false);
const editCreateForm = ref({
    InspectionNo: "",
    NotifyDept: "",
    Notifier: "",
    ArrivalDate: "",
    NotifyDate: "",
    ReceivingDept: "",
    ReceiverName: "",
    ReceiveDate: "",
    IsAutomotive: 0,
    SamplingStandards: "",
    IncomingUnit: "",
    Status: 0,
    DataStatus: 0,
    InspectionResult: "",
    ApprovalResult: "",
    MaterialTypes: 0,
    ApprovalRemarks: "",
    Approver: "",
});
const editCreatFormRef = ref("");
const materialNameList = ref<any[]>([]);
const vendorList = ref<any[]>([]);
const productList = ref<any[]>([]);
const aqlLevelList = ref<any[]>([]);
const detailVisible = ref(false);
const detailTableData = ref([]);
const addDetailVisible = ref(false);
const detailFormRef = ref("");
const detailForm = ref({
    InspectionNo: "",
    MaterialName: "",
    ModelSpec: "",
    Supplier: "",
    OrderNo: "",
    LotNo: "",
    TCode: "",
    QuantityPerBox: "",
    SupplierReportGuid: "",
    SupplierReportName: "",
    Template_File: "",
});
const editDetailVisible = ref(false);
const editdetailFormRef = ref("");
const editdetailForm = ref({
    InspectionNo: "",
    IQC_DetailName: "",
    MaterialName: "",
    ModelSpec: "",
    Supplier: "",
    OrderNo: "",
    LotNo: "",
    TCode: "",
    InspectionResult: "",
    ApprovalResult: "",
    QuantityPerBox: "",
    SupplierReportGuid: "",
    SupplierReportName: "",
    Template_File: "",
    Inspector: "",
    Approver: "",
    SampledBoxes: 0,
    Package: "",
    Appearance: "",
    Specification: "",
    Property: "",
    Status: 0,
    DataStatus: 0,
});
const fileList = ref<any[]>([]);
const previewVisible = ref(false);
const previewUrl = ref("");
const previewTitle = ref("");
const IQCNumber = ref("");
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
            getForm.value.EndTime = newVal[1]+' 23:59:59';
            // getForm.value.PageNumber = 1
        }
    }
);
onBeforeMount(() => {
     let end: string = setTodayDate() +' 23:59:59';
    let start: string = setLastDate();
    searchDate.value = [start, end];
    getScreenHeight();
    getNotifyDept();
    getNotifierList();
    getIncomeUnitList();
    getProductFamilyData();
    GetVendorQueryData();
    getAQLLevelData();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);

    getData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    GetIQCHeaderQuery(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const resetGetForm = () => {
    getForm.value = {
        InspectionNo: "",
        StartTime: setLastDate(),
        EndTime: setTodayDate(),
        InspectionResult: "",
    };
   
    getData();
};
const getNotifyDept = () => {
    GetWorkCenterQuery({}).then((res: any) => {
        notifyDeptList.value = res.content;
    });
};
const getNotifierList = () => {
    GetEmployeeQuery({}).then((res: any) => {
        notifierList.value = res.content;
    });
};
const getIncomeUnitList = () => {
    GetIncomingUnitQuery({}).then((res: any) => {
        incomeUnitList.value = res.content;
    });
};
const getProductFamilyData = () => {
    GetProductFamilyQuery({}).then((res: any) => {
        materialNameList.value = res.content;
    });
};
const GetVendorQueryData = () => {
    GetVendorQuery({}).then((res: any) => {
        vendorList.value = res.content;
    });
};
const getAQLLevelData = () => {
    GetAQLLevelQuery({}).then((res: any) => {
        aqlLevelList.value = res.content;
    });
};

const changeData = (val: any) => {
    console.log(val);
    GetProductQuery(val).then((res: any) => {
        productList.value = res.content;
        console.log(productList.value);
    });
};
const handleEdit = (row: any) => {
    editCreateForm.value = {
        ...row,
        InspectionNo: row.IQCNumber,
        ArrivalDate: dayjs(row.ArrivalDate).format("YYYY-MM-DD"),
        NotifyDate: dayjs(row.NotifyDate).format("YYYY-MM-DD"),
    };
    // console.log(editCreateForm.value);

    creatEditVisible.value = true;
};
const handleDelete = (row: any) => {
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
            let data = {
                InspectionNo: row.IQCNumber,
                DataStatus: 1,
            };
            console.log(data);

            AyscIQCUpdate(data).then((res: any) => {
                ElNotification({
                    title: t("message.tipTitle"),
                    message: t("message.deleteSuccess"),
                    type: "success",
                });
                getData();
            });
        })
        .catch(() => {
            // on cancel
            ElNotification({
                title: t("message.tipTitle"),
                message: t("publicText.cancel"),
                type: "info",
            });
        });
};
const cellClick = (row: any) => {
    // detailVisible.value = true;
    IQCNumber.value = row.IQCNumber;
    detailForm.value.InspectionNo = row.IQCNumber;
    editdetailForm.value.InspectionNo = row.IQCNumber;
    GetIQCDetailQuery({ InspectionNo: row.IQCNumber }).then((res: any) => {
        detailTableData.value = res.content;
        detailVisible.value = true;
    });
};
const handleCreat = () => {
    creatVisible.value = true;
};
const handleClose = () => {
    creatVisible.value = false;
};
const handleConfirm = () => {
    // console.log(creatForm.value);
    AyscIQCAdd(creatForm.value).then((res: any) => {
        ElNotification({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        creatVisible.value = false;
        getData();
    });
};

//
const file1UpChange = (file: any, fileList1: any) => {
    // console.log(file, fileList1);
    // detailForm.value.Template_File = file;
    if (file.raw) {
        convertToBase64(file.raw,1)
    }
};
const file1UpRemove = (file: any, fileList1: any) => {
    // console.log(file, fileList1);
    // detailForm.value.Template_File = "";
    detailForm.value.Template_File = ''
};
const beforeUpload = (file: any) => {
    const isPDF = file.type === 'application/pdf'
    const isLt10M = file.size / 1024 / 1024 < 5

    if (!isPDF) {
        console.error('只能上传 PDF 文件')
        return false
    }

    if (!isLt10M) {
        console.error('文件大小不能超过 10MB')
        return false
    }

    return true
};
const file2UpChange = (file: any, fileList1: any) => {
    if (file.raw) {
        convertToBase64(file.raw,2)
    }
};
const file2UpRemove = (file: any, fileList1: any) => {
  
    editdetailForm.value.Template_File = ''
};
const convertToBase64 = (file: any,index:any) => {
    const reader = new FileReader()

    reader.onload = (event: any) => {
         const fullBase64 = event.target.result
        // 将 base64 数据赋值给 detailForm.Template_File
        if(index===2)
        {
            editdetailForm.value.SupplierReportName = file.name
            editdetailForm.value.Template_File =fullBase64.replace(/^data:application\/pdf;base64,/, '')

           
        }else{
            detailForm.value.SupplierReportName = file.name
             detailForm.value.Template_File = fullBase64.replace(/^data:application\/pdf;base64,/, '')
        }
        console.log('PDF 已转换为 base64:',event.target.result)

        // // 可选：显示文件信息
        // console.log('文件名:', file.name)
        // console.log('文件大小:', file.size)
    }

    reader.onerror = (error) => {
        console.error('文件读取错误:', error)
    }
    // 读取文件为 base64
    reader.readAsDataURL(file)
}

const openFile=(val:any)=>{
    LabelPrintDownloadFtp(val).then((res:any)=>{
        const base64Data = 'data:application/pdf;base64,' + res.content.FileData;
        previewUrl.value=base64Data
        previewTitle.value=res.content.FileName
        previewVisible.value=true
        // downloadPDF(base64Data, res.content.FileName)
    })
}
const handlePreviewClose=()=>{
    previewVisible.value=false
     previewUrl.value=""
}
const handlePreviewDawnload=()=>{
    downloadPDF(previewUrl.value, previewTitle.value)
}

const downloadPDF = (base64Data:any, fileName = '供应商报告.pdf') => {
  try {
    // 创建下载链接
    const link = document.createElement('a')
    
    // 设置下载属性
    link.href = base64Data
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
    
    // 添加到页面（需要添加到页面才能触发下载）
    document.body.appendChild(link)
    
    // 触发点击下载
    link.click()
    
    // 清理 DOM
    document.body.removeChild(link)
    
    ElMessage.success('文件下载成功')
    
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('文件下载失败')
  }
}
const handleEditClose = () => {
    creatEditVisible.value = false;
};
const handleEditConfirm = () => {
    // console.log(editCreateForm.value);
    
    AyscIQCUpdate(editCreateForm.value).then((res: any) => {
        ElNotification({
            title: t("message.tipTitle"),
            message: t("message.editSuccess"),
            type: "success",
        });
        creatEditVisible.value = false;
        getData();
    });
};

const handleEditDetail = (row: any) => {
    editdetailForm.value = {
        ...row,
        InspectionNo: row.IQCNumber
    };
    GetProductQuery(row.MaterialName).then((res: any) => {
        productList.value = res.content;
        // console.log(productList.value);
    });
    editDetailVisible.value = true;
};
const handleDeleteDetail = (row: any) => {
    ElMessageBox.confirm(
        t("publicText.confirm") + t("publicText.delete"),
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
const handleAddDetailClose = () => {
    addDetailVisible.value = false;
    fileList.value=[]
};
const handleAddDetailConfirm = () => {
    AyscIQCDetailAdd(detailForm.value).then((res: any) => {
        ElNotification({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (res.success) {
            addDetailVisible.value = false;
             GetIQCDetailQuery({ InspectionNo: IQCNumber.value }).then((res: any) => {
        detailTableData.value = res.content;
    });
        } else {
            return;
        }

        // getData();
    });
};
const handleEditDetailClose = () => {
    editDetailVisible.value = false;
    fileList.value=[]
};
const handleEditDetailConfirm = () => {
    // console.log(editdetailForm.value);

    AyscIQCDetailUpdate(editdetailForm.value).then((res: any) => {
        ElNotification({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (res.success) {
            addDetailVisible.value = false;
             GetIQCDetailQuery({ InspectionNo: IQCNumber.value }).then((res: any) => {
        detailTableData.value = res.content;
    });
        } else {
            return;
        }
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
