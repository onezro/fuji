<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('processInspect.workeOrder')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.MfgorderName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.creatTime')" class="mb-2"><el-date-picker
                        :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" size="small" style="width: 200px" :clearable="false" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productCategory')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.ProductType" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productName')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.ProductName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerName')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.CustomerName" placeholder="" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item :label="$t('oqcInspection.customerPO')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm." placeholder="" clearable></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('oqcInspection.customerPN')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.PartNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.LotNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.SpecName')" class="mb-2">
                    <el-select v-model="getForm.SpecName" placeholder="" clearable style="width: 200px">
                        <el-option label="模切" value="模切" />
                        <el-option label="裁切" value="裁切" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small" @click="resetFormData">
                        {{ $t("publicText.reset") }}
                    </el-button>
                    <el-button type="warning" size="small" @click="addVisible = true">
                        {{ $t("publicText.add") }}
                    </el-button>
                    <el-button type="success" :disabled="tableData.length == 0" size="small" @click="exportTable">
                        导出Excel
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
                " size="small" :style="{ width: '100%' }" ref="firstInspectRef" :height="tableHeight" border fit>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="ES_InspectionNo" :label="$t('processInspect.inspectOrder')" width="180"/> -->
                <el-table-column prop="ES_MfgorderName" :label="$t('processInspect.workeOrder')" width="80" fixed />
                <el-table-column prop="ES_ProductName" :label="$t('processInspect.productName')" width="150" fixed />
                <el-table-column prop="ES_ProductType" :label="$t('processInspect.productType')" width="80" />
                <el-table-column prop="ES_CustomerPO" :label="$t('processInspect.customerPO')" width="100" />
                <el-table-column prop="ES_PartNo" :label="$t('processInspect.customerPN')" width="120" />
                <el-table-column prop="ES_SpecName" :label="'工序'" />
                <el-table-column prop="ES_LotNo" :label="$t('processInspect.LOtNO')" />
                <el-table-column prop="ES_MaterialReQty" :label="'领料张数'" />
                <el-table-column prop="FirstArticleInspectionStatus" :label="$t('processInspect.firstInspectStatus')"
                    width="80" />
                <el-table-column prop="InProcessInspectionStatus" :label="$t('processInspect.patrolInspectStatus')"
                    width="80" />
                <el-table-column prop="FinalInspectionStatus" :label="$t('processInspect.tailInspectStatus')"
                    width="80" />
                <el-table-column prop="ES_SpecificationNo" :label="$t('oqcInspection.SpecificationNo')">
                    <template #default="{ row }">
                        <span class="underline cursor-pointer text-cyan-800"
                            @click="openFile(row.ES_SpecificationNo)">{{
                                row.ES_SpecificationNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ES_FaUrl" :label="'FA'" width="80">
                    <template #default="scope">
                        <span class="underline cursor-pointer text-cyan-800"
                            @click="isDownload(scope.row.ES_FaUrl, 'FA')">{{ scope.row.ES_FaUrl }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ES_CPKUrl" :label="'CPK'" width="80">
                    <template #default="scope">
                        <span class="underline cursor-pointer text-cyan-800"
                            @click="isDownload(scope.row.ES_CPKUrl, 'CPK')">{{ scope.row.ES_CPKUrl }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ES_CreateDate" :label="$t('processInspect.creatTime')" width="150" />
                <el-table-column :label="$t('publicText.operation')" width="250" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="'首检'" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row, '首检')">首</el-button>
                        </el-tooltip>
                        <el-tooltip :content="'巡检'" placement="top">
                            <el-button type="warning" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row, '巡检')">巡</el-button>
                        </el-tooltip>
                        <el-tooltip :content="'尾检'" placement="top">
                            <el-button type="info" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row, '尾检')">尾</el-button>
                        </el-tooltip>
                        <el-tooltip :content="'上传FA/CPK文件'" placement="top">
                            <el-button type="success" icon="Upload" size="small"
                                @click.stop="handleUpload(scope.row)"></el-button>
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
        <el-dialog v-model="editVisible" :title="title" width="80%" draggable :append-to-body="true"
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
                <!-- <el-form-item>
                    <el-button :type="'success'" icon="Download" @click="downloadTemp">导出模板</el-button>


                </el-form-item>
                <el-form-item>
                    <el-upload action="#" multiple :limit="1" v-model:file-list="fileList3" :auto-upload="false"
                        :on-change="fileUpChange2" :on-remove="fileUpRemove2" :before-upload="beforeUpload2"
                        accept=".xlsx" :show-file-list="false">
                        <el-button :type="'warning'" icon="Upload">导入数据</el-button>
                    </el-upload>
                </el-form-item> -->
            </el-form>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first">
                    <el-table :data="editForm.countItem" style="width: 100%" :height="300" size="small" border stripe
                        :span-method="objectSpanMethod2" :tooltip-effect="'dark'">
                        <el-table-column prop="LineNos" :label="'检验序列'" :align="'center'" :fixed="'left'" width="80">
                        </el-table-column>
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>
                        <el-table-column prop="CharaCteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="ToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="SampleNum" :label="$t('incomeSheet.numberOfSample')" width="120">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.SampleNum" :min="1"
                                    :disabled="scope.row.InspectionResult == 'OK'" style="width: 100%;" size="small" />
                                <!-- <el-input v-model="scope.row.SampleNum" size="small" type="number"
                                    :disabled="scope.row.InspectionResult == 'OK'"></el-input> -->
                                <!-- <el-input-number v-model="scope.row.SampleNum" size="small" style="width: 100%;"
                                    :min="0" :disabled="scope.row.InspectionResult == 'OK'" /> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectNum" :label="$t('incomeSheet.numberOfDefect')" width="120">
                            <template #default="scope">
                                <!-- <el-input v-model="scope.row.DefectNum" size="small" type="number"
                                    :disabled="scope.row.InspectionResult == 'OK'"></el-input> -->
                                <el-input-number v-model="scope.row.DefectNum" size="small" style="width: 100%;"
                                    :min="0" :disabled="scope.row.InspectionResult == 'OK'" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectDec" :label="$t('incomeSheet.DefectDec')">
                            <template #default="scope">
                                <el-input v-model="scope.row.DefectDec" size="small"
                                    :disabled="scope.row.InspectionResult == 'OK'"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ResulthandLing" :label="'不良处理结果'" width="150">
                            <template #default="scope">
                                <el-input v-model="scope.row.ResulthandLing" size="small"
                                    :disabled="scope.row.InspectionResult == 'OK'"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'计量检验'" name="second">
                    <div class="flex justify-end gap-2">
                        <el-form-item class="mb-2">
                            <el-button :size="'small'" :type="'success'" icon="Download"
                                @click="downloadTemp">导出模板</el-button>
                        </el-form-item>
                        <el-form-item class="mb-2">
                            <el-upload action="#" multiple :limit="1" v-model:file-list="fileList3" :auto-upload="false"
                                :on-change="fileUpChange2" :on-remove="fileUpRemove2" :before-upload="beforeUpload2"
                                accept=".xlsx" :show-file-list="false">
                                <el-button :size="'small'" :type="'warning'" icon="Upload">导入数据</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <el-table ref="tempMeasureRef" :data="editForm.listItem" style="width: 100%" :height="300"
                        size="small" border stripe :span-method="objectSpanMethod" :tooltip-effect="'dark'">
                        <el-table-column prop="LineNos" :label="'检验序列'" :align="'center'" :fixed="'left'" width="80">
                        </el-table-column>
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
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="SampleNum" :label="$t('incomeSheet.numberOfSample')" width="150">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.SampleNum" :min="1"
                                    @change="handleSampleSizeChange(scope.row)"
                                    :disabled="scope.row.InspectionResult == 'OK'" style="width: 100%;" size="small" />
                                <!-- <el-input v-model="scope.row.SampleNum" size="small" type="number" min="1" max="10"
                                    @change="handleSampleSizeChange(scope.row)"
                                    :disabled="scope.row.InspectionResult == 'OK'"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectNum" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ scope.row.DefectCount || calculateDefectCount(scope.row) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="ObservedValue" width="150" :label="$t('incomeSheet.MeasurementNumber')">
                            <template #default="scope">
                                <span>{{ scope.row.ObservedValue }}</span>
                                <el-button type="primary" icon="Plus" :size="'small'"
                                    :disabled="scope.row.InspectionResult == 'OK'"
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
                                {{ getResultText2(scope.row) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="ResulthandLing" :label="'不良处理结果'" width="150">
                            <template #default="scope">
                                <el-input v-model="scope.row.ResulthandLing" size="small"
                                    :disabled="scope.row.InspectionResult == 'OK'"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleEditClose">{{
                        $t("publicText.close")
                        }}</el-button>
                    <el-button type="warning" @click="handleEditZQConfirm"
                        :disabled="(editForm.InspectionType == '首检' && editForm.FirstArticleInspectionStatus == '检验完成')">
                        {{ "暂存" }}
                    </el-button>
                    <el-button type="primary" @click="handleEditConfirm"
                        :disabled="(editForm.InspectionType == '首检' && editForm.FirstArticleInspectionStatus == '检验完成')">
                        {{ "提交" }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogVisible" :title="'输入测量值'" width="500px">
            <el-form ref="formRef" label-width="auto" size="small" @submit.native.prevent>
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
        <el-dialog v-model="uploadVisible" :title="'上传FA/CPK文件'" width="500px" draggable :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleUploadClose">
            <el-form ref="uploadFormRef" :model="uploadForm" label-width="auto">
                <el-form-item label="FA文件">
                    <el-upload action="#" multiple :limit="1" v-model:file-list="fileList" :auto-upload="false"
                        :on-change="file1UpChange" :on-remove="file1UpRemove" :before-upload="beforeUpload"
                        accept=".xlsx" ref="upload1" class="upload-area" style="width: 100%">
                        <el-button size="small" type="primary" icon="Upload"></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="CPK名称">
                    <el-input v-model="deleteCPKForm.TemplateName" placeholder="" disabled style="width: 200px;" />
                    <el-button :type="'danger'" @click="handleDeleteCPK" :disabled="deleteCPKForm.TemplateName == ''">{{
                        t('publicText.delete') }}</el-button>
                </el-form-item>
                <el-form-item label="CPK文件">
                    <el-upload action="#" multiple :limit="1" v-model:file-list="fileList2" :auto-upload="false"
                        :on-change="file1UpChange2" :on-remove="file1UpRemove2" :before-upload="beforeUpload"
                        accept=".xlsx" ref="upload1" class="upload-area" style="width: 100%">
                        <el-button size="small" type="primary" icon="Upload"></el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleUploadClose">取消</el-button>
                    <el-button type="primary" @click="handleUploadfirm">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="previewVisible" :title="previewTitle" width="800px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
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
import ExcelJS from 'exceljs';
import JSZip from "jszip";
import dayjs from "dayjs";
import { exportTableToExcel1 } from "@/utils/exportExcel1";
import { exportTableToExcel } from "@/utils/exportExcel";
import { handleExcelUpload } from "@/utils/analysisExcel"
import { saveAs } from "file-saver";
import {
    GetInspectionQuery,
    GetInspectionDelQuery,
    CreateInspectionNO,
    InspectionNOInfoSync,
    FAUploadFtpServer,
    CPKUploadFtpServer,
    FACPKDownloadFtpServer,
    UploadFtpServer,
    DelFtpServer
} from "@/api/smtSpotCheck/processFisrt";
import {
    GetProjectCategoryQuery,
    GetProjectQuery,
    GetResourceQuery,
    GetInspectionTypeQuery,
    GetProductQuery,
} from "@/api/incomingManage/aqlrules";
import {
    FTPSearchAndDownloadSpecificationDocumentFile
} from "@/api/smtSpotCheck/oqc";
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
import { de } from 'element-plus/es/locale/index.mjs';

const userStore = useUserStoreWithOut();
const getForm = ref({
    InspectionNO: "",
    InspectionType: "",
    MfgorderName: "",
    ProductName: "",
    PartNo: "",
    CustomerName: "",
    LotNo: "",
    ProductType: "",
    DocumentStatus: "",
    StartTime: "",
    EndTime: "",
    SpecName: '',
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
    InspectionType: "",
    MfgorderName: "",
});
const editVisible = ref(false);
const editFormRef = ref();
const editForm = ref<any>({
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
    listItem: [],
    countItem: [],
});
const dialogVisible = ref(false);
const currentRow = ref<any>(null);
const currentRowIndex = ref<any>(-1);
const currentSampleSize = ref(0);
const measurementValues = ref<any[]>([]);
const title = ref("");
const spanArr = ref<any[]>([]);
const spanArr2 = ref<any[]>([]);
const uploadForm = ref({
    InspectionNO: "",
    TemplateName: "",
    FileType: "FA",
    TemplateFile: "",
});
const uploadVisible = ref(false);
const uploadFormRef = ref();
const fileList = ref<any[]>([]);
const uploadForm2 = ref({
    InspectionNO: "",
    TemplateName: "",
    FileType: "CPK",
    TemplateFile: "",
});
const fileList2 = ref<any[]>([]);
const firstInspectRef = ref()
const tempMeasureRef = ref()
const fileList3 = ref<any[]>([]);
const previewVisible = ref(false);
const previewUrl = ref("");
const previewTitle = ref("");

const deleteCPKForm = ref({
    InspectionNO: "",
    TemplateName: "",
    FileType: "CPK",
    TemplateFile: "",
})
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
            getForm.value.EndTime = newVal[1] + ' 23:59:59';
            // getForm.value.PageNumber = 1
        }
    }
);

onBeforeMount(() => {
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
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
const resetFormData = () => {
    getForm.value = {
        InspectionNO: "",
        InspectionType: "",
        MfgorderName: "",
        ProductName: "",
        PartNo: "",
        CustomerName: "",
        LotNo: "",
        ProductType: "",
        DocumentStatus: "",
        StartTime: "",
        EndTime: "",
        SpecName: '',
    }
}
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
const exportTable = () => {
    exportTableToExcel({
        tableRef: firstInspectRef.value,
        fetchAllData: fetchFinishAllData,
        fileName: `${'PQC过程检'}_${dayjs().format(
            "YYYYMMDDHHmmss"
        )}`,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
    });
}
const fetchFinishAllData = async () => {
    let data = await GetInspectionQuery(getForm.value).then(
        (res: any) => {
            return res.content.map((item: any) => {
                item.UpdateTime = dayjs(item.UpdateTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                return item;
            });
        }
    );
    return data;
};
const handleUpload = (row: any) => {
    uploadForm.value.InspectionNO = row.FirstArticleInspectionNo;
    uploadForm2.value.InspectionNO = row.FirstArticleInspectionNo;
    deleteCPKForm.value.InspectionNO = row.FirstArticleInspectionNo
    deleteCPKForm.value.TemplateName = row.ES_CPKUrl
    uploadVisible.value = true;
};

const openFile = (val: any) => {
    console.log(val);

    FTPSearchAndDownloadSpecificationDocumentFile(val).then((res: any) => {
        if (res.success) {
            const base64Data = 'data:application/pdf;base64,' + res.content.FileData;
            previewUrl.value = base64Data
            previewTitle.value = res.content.FileName
            previewVisible.value = true
        } else {
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
            // ElNotification({
            //          title: t("message.tipTitle"),
            //     message: res.msg,
            //     type: "error",
            // })
        }
    })
}
const isDownload = (val: any, type: any) => {
    ElMessageBox.confirm(`是否下载${val}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            let data = {
                fileName: val,
                fileType: type,
            };

            FACPKDownloadFtpServer(data).then((res: any) => {
                downloadSingleFile(res.content);
            });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "已取消下载",
            });
        });
};
const file1UpChange = (file: any, fileList1: any) => {
    if (file.raw) {
        convertToBase64(file.raw, 1);
    }
};
const file1UpRemove = (file: any, fileList1: any) => {
    uploadForm.value.TemplateFile = "";
    uploadForm.value.TemplateName = "";
    fileList.value = [];
};
const beforeUpload = (file: any) => {
    const isPDF = file.type === "application/xlsx";
    const isLt10M = file.size / 1024 / 1024 < 5;

    if (!isPDF) {
        console.error("只能上传 xlsx 文件");
        return false;
    }

    if (!isLt10M) {
        console.error("文件大小不能超过 10MB");
        return false;
    }

    return true;
};
const file1UpChange2 = (file: any, fileList1: any) => {
    if (file.raw) {
        convertToBase64(file.raw, 2);
    }
};
const file1UpRemove2 = (file: any, fileList1: any) => {
    uploadForm2.value.TemplateFile = "";
    uploadForm2.value.TemplateName = "";
    fileList2.value = [];
};

const convertToBase64 = (file: any, index: any) => {
    const reader = new FileReader();

    reader.onload = (event: any) => {
        const fullBase64 = event.target.result;
        if (index == 2) {
            uploadForm2.value.TemplateName = file.name;
            uploadForm2.value.TemplateFile = fullBase64.replace(
                /^data:application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,/,
                ""
            );
        } else {
            uploadForm.value.TemplateName = file.name;
            uploadForm.value.TemplateFile = fullBase64.replace(
                /^data:application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,/,
                ""
            );
        }
    };

    reader.onerror = (error) => {
        console.error("文件读取错误:", error);
    };
    reader.readAsDataURL(file);
};
const handleUploadClose = () => {
    uploadForm.value = {
        InspectionNO: "",
        TemplateName: "",
        FileType: "FA",
        TemplateFile: "",
    };
    fileList.value = [];
    uploadForm2.value = {
        InspectionNO: "",
        TemplateName: "",
        FileType: "CPK",
        TemplateFile: "",
    };
    fileList2.value = [];
    deleteCPKForm.value = {
        InspectionNO: "",
        TemplateName: "",
        FileType: "CPK",
        TemplateFile: "",
    }
    uploadVisible.value = false;
};
const handleUploadfirm = () => {
    let data = [];
    if (uploadForm.value.TemplateName !== "") {
        data.push(uploadForm.value);
    }
    if (uploadForm2.value.TemplateName !== "") {
        data.push(uploadForm2.value);
    }
    UploadFtpServer(data).then((res: any) => {
        ElMessage({
            title: t("publicText.success"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        uploadVisible.value = false;
        uploadForm.value = {
            InspectionNO: "",
            TemplateName: "",
            FileType: "FA",
            TemplateFile: "",
        };
        fileList.value = [];
        uploadForm2.value = {
            InspectionNO: "",
            TemplateName: "",
            FileType: "CPK",
            TemplateFile: "",
        };
        fileList2.value = [];
        getData();
    });
};

const handleAddClose = () => {
    addVisible.value = false;
    addForm.value = {
        InspectionType: "首检",
        MfgorderName: "",
    };
};
const handleAddConfirm = () => {
    CreateInspectionNO(addForm.value).then((res: any) => {
        ElMessage({
            title: t("publicText.success"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        addVisible.value = false;
        addForm.value = {
            InspectionType: "首检",
            MfgorderName: "",
        };
        getData();
    });
};

const saveMeasurements = () => {
    if (currentRowIndex.value === null) return;

    const row = editForm.value.listItem[currentRowIndex.value];

    // 过滤空值并连接为字符串
    const validValues = measurementValues.value
        .filter((v) => v !== "" && v !== null && v !== undefined)
        .map((v) => v.toString().trim());

    row.ObservedValue = validValues.join(",");

    // 重新计算相关数值
    //   calculateRowValues(row)

    dialogVisible.value = false;
    measurementValues.value = [];
    currentRowIndex.value = null;
};
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
    if (columnIndex === 0) {
        const _row = spanArr.value[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
    }
};
const objectSpanMethod2 = ({ row, column, rowIndex, columnIndex }: any) => {
    if (columnIndex === 0) {
        const _row = spanArr2.value[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
    }
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
        listItem: [],
        countItem: [],
    };
    activeName.value = "first";
};
const handleEditZQConfirm = () => {
    // console.log(editForm.value);
    let data = {
        InspectionNO: editForm.value.InspectionNO,
        InspectionType: editForm.value.InspectionType,
        MfgorderName: editForm.value.MfgorderName,
        InspectionResult: "",
        DocumentStatus: "检验中",
        listItem: [...editForm.value.listItem],
    };
    data.listItem = editForm.value.listItem.map((item: any) => {
        return {
            LineNos: item.LineNos,
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
            InspectionResult: "",
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            ResulthandLing: item.ResulthandLing,
        };
    });
    editForm.value.countItem.forEach((item: any) => {
        data.listItem.push({
            LineNos: item.LineNos,
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
            InspectionResult: "",
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            ResulthandLing: item.ResulthandLing,
        });
    });

    // console.log(data);

    InspectionNOInfoSync(data).then((res: any) => {
        ElMessage({
            title: t("publicText.success"),
            message: res.success ? '暂存成功' : res.msg,
            type: res.success ? "success" : "error",
        });

        getData();
    });
};
const handleEditConfirm = () => {
    let data = {
        InspectionNO: editForm.value.InspectionNO,
        InspectionType: editForm.value.InspectionType,
        MfgorderName: editForm.value.MfgorderName,
        InspectionResult: "合格",
        DocumentStatus: "检验完成",
        listItem: [...editForm.value.listItem],
    };

    data.listItem = editForm.value.listItem.map((item: any) => {
        return {
            LineNos: item.LineNos,
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
            InspectionBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            ResulthandLing: item.ResulthandLing,
        };
    });

    editForm.value.countItem.forEach((item: any) => {
        data.listItem.push({
            LineNos: item.LineNos,
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
            InspectionResult: item.SampleNum !== 0 && (item.DefectNum == 0 || item.DefectNum == '') ? "OK" : "NG",
            InspectionDate: "",
            InspectionBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            InspectionUpdateBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
            ResulthandLing: item.ResulthandLing,
        });
    });
    console.log(data);
    let isEixt = data.listItem.findIndex((item: any) => {
        return item.InspectionResult !== "OK";
    });

    if (isEixt !== -1) {
        ElMessage({
            title: t("message.tipTitle"),
            message: "检验结果，不通过！请检查",
            type: "error",
        });

        return;
    }
    // console.log(data);

    InspectionNOInfoSync(data).then((res: any) => {
        ElMessage({
            title: t("publicText.success"),
            message: res.success ? '提交成功' : res.msg,
            type: res.success ? "success" : "error",
        });

        handleEditClose();
        getData();
    });
};
const handleEdit = (row: any, type: any) => {
    editForm.value.MfgorderName = row.ES_MfgorderName;
    editForm.value.ProductName = row.ES_ProductName;
    editForm.value.ProductType = row.ES_ProductType;
    editForm.value.PartNo = row.ES_PartNo;
    editForm.value.LotNo = row.ES_LotNo;
    editForm.value.FirstArticleInspectionStatus = row.FirstArticleInspectionStatus || ''
    title.value = type + "检验";
    editForm.value.InspectionType = type;
    if (type === "首检") {
        editForm.value.InspectionNO = row.FirstArticleInspectionNo;
        editForm.value.InspectionType = "首检";
    } else if (type === "巡检") {
        editForm.value.InspectionNO = row.InProcessInspectionNo;
        editForm.value.InspectionType = "巡检";
    } else if (type === "尾检") {
        editForm.value.InspectionNO = row.FinalInspectionNo;
        editForm.value.InspectionType = "尾检";
    }

    GetInspectionDelQuery({
        MfgorderName: row.ES_MfgorderName,
        InspectionType: type,
    }).then((res: any) => {
        let pos = 0;
        let pos2 = 0;
        spanArr.value = [];
        spanArr2.value = [];
        editForm.value.listItem = res.content
            .filter((item: any) => item && item.MEASUREMENTTYPE === "计量")
            .map((item: any) => {
                return {
                    LineNos: item.LINENOS,
                    MfgorderName: "",
                    ProjectName: item.PROJECTNAME,
                    ProjectCategoryName: item.PROJECTCATEGORYNAME,
                    TargetValue: item.TARGETVALUE,
                    MaxValue: item.MAXVALUE,
                    MinValue: item.MINVALUE,
                    CharaCteristicGrade: item.CHARACTERISTICGRADE,
                    ToolName: item.TOOLNAME,
                    InspectionBasis: item.INSPECTIONBASIS,
                    SampleNum: parseInt(item.SAMPLENUM),
                    MeasurementType: item.MEASUREMENTTYPE,
                    DefectNum: item.DEFECTNUM,
                    ObservedValue: item.OBSERVEDVALUE,
                    ObservedValueSum: item.OBSERVEDVALUESUM,
                    AverageNum: item.AVERAGENUM,
                    DefectDec: item.DEFECTDEC,
                    SpecialCause: item.SPECIALCAUSE,
                    InspectionResult: item.INSPECTIONRESULT,
                    InspectionBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
                    InspectionUpdateBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
                    InspectionDate: "",
                    ResulthandLing: item.RESULTHANDLING,
                };
            })
            .sort((a: any, b: any) => a.LineNos - b.LineNos);

        for (let i = 0; i < editForm.value.listItem.length; i++) {
            if (i === 0) {
                spanArr.value.push(1);
                pos = 0;
            } else {
                // 判断当前元素与上一个元素是否相同
                if (
                    editForm.value.listItem[i].LineNos ===
                    editForm.value.listItem[i - 1].LineNos
                ) {
                    spanArr.value[pos] += 1;
                    spanArr.value.push(0);
                } else {
                    spanArr.value.push(1);
                    pos = i;
                }
            }
        }

        editForm.value.countItem = res.content
            .filter((item: any) => item && item.MEASUREMENTTYPE === "计数")
            .map((item: any) => {
                return {
                    LineNos: item.LINENOS,
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
                    InspectionBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
                    InspectionUpdateBy: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
                    InspectionDate: "",
                    ResulthandLing: item.RESULTHANDLING,
                };
            })
            .sort((a: any, b: any) => a.LineNos - b.LineNos);

        for (let i = 0; i < editForm.value.countItem.length; i++) {
            if (i === 0) {
                spanArr2.value.push(1);
                pos2 = 0;
            } else {
                // 判断当前元素与上一个元素是否相同
                if (
                    editForm.value.countItem[i].LineNos ===
                    editForm.value.countItem[i - 1].LineNos
                ) {
                    spanArr2.value[pos] += 1;
                    spanArr2.value.push(0);
                } else {
                    spanArr2.value.push(1);
                    pos2 = i;
                }
            }
        }
        editVisible.value = true;
        // console.log(res);
        // console.log(editForm.value);
    });
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
        measurementValues.value = row.ObservedValue.split(",").map((v: any) =>
            v.trim()
        );
    } else {
        // 根据样件数初始化数组
        measurementValues.value = Array(currentSampleSize.value).fill("");
    }

    dialogVisible.value = true;
};
const getResultText = (row: any) => {
    const defectCount = calculateDefectCount(row);
    const sampleNum = row.SampleNum || 1;

    if (defectCount === 0 && row.ObservedValue !== "") {
        row.Status = "OK";
        return "OK";
    } else {
        row.Status = "NG";
        return "NG";
    }
};
const getResultText2 = (row: any) => {
    const defectCount = calculateDefectCount(row);
    const sampleNum = row.SampleNum || 1;

    if (defectCount === 0 && row.ObservedValue !== "" && row.ObservedValue !== null) {
        row.Status = "OK";
        return "OK";
    } else {
        row.Status = "NG";
        return "NG";
    }
};
const handleSampleSizeChange = (row: any) => {
    // 确保样件数在1-10之间
    let sampleNum = parseInt(row.SampleNum) || 1;
    sampleNum = Math.max(1, Math.min(10, sampleNum));
    row.SampleNum = sampleNum;

    // 如果已有测量值，需要调整
    if (row.ObservedValue) {
        const values = row.ObservedValue.split(",").map((v: any) => v.trim());
        if (values.length > sampleNum) {
            // 如果新样件数小于原有测量值数量，截断
            row.ObservedValue = values.slice(0, sampleNum).join(",");
        } else if (values.length < sampleNum) {
            // 如果新样件数大于原有测量值数量，补充空值
            while (values.length < sampleNum) {
                values.push("");
            }
            row.ObservedValue = values.join(",");
        }
    }
};
const calculateDefectCount = (row: any) => {
    if (!row.ObservedValue || !row.MinValue || !row.MaxValue) {
        row.DefectNum = 0;
        return 0;
    }

    const min = parseFloat(row.MinValue);
    const max = parseFloat(row.MaxValue);

    if (isNaN(min) || isNaN(max)) {
        row.DefectNum = 0;
        return 0;
    }

    const values = row.ObservedValue.split(",")
        .map((v: any) => parseFloat(v.trim()))
        .filter((v: any) => !isNaN(v));

    const defectCount = values.filter((v: any) => v < min || v > max).length;
    row.DefectNum = defectCount;
    return defectCount;
};

const calculateSum = (row: any) => {
    if (!row.ObservedValue) {
        row.ObservedValueSum = "0";
        return "0";
    }

    const values = row.ObservedValue.split(",")
        .map((v: any) => parseFloat(v.trim()))
        .filter((v: any) => !isNaN(v));

    const sum = values.reduce((total: any, current: any) => total + current, 0);
    row.ObservedValueSum = sum.toFixed(2);
    return sum.toFixed(2);
};
const calculateAverage = (row: any) => {
    if (!row.ObservedValue) {
        row.AverageNum = "0";
        return "0";
    }

    const values = row.ObservedValue.split(",")
        .map((v: any) => parseFloat(v.trim()))
        .filter((v: any) => !isNaN(v));

    if (values.length === 0) {
        row.AverageNum = "0";
        return "0";
    }

    const sum = values.reduce((total: any, current: any) => total + current, 0);
    const avg = sum / values.length;
    row.AverageNum = avg.toFixed(2);
    return avg.toFixed(2);
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
    const values = row.ObservedValue.split(",");
    return values.join(",");
};
const handlePreviewClose = () => {
    previewVisible.value = false
    previewUrl.value = ""
}
const handlePreviewDawnload = () => {
    downloadPDF(previewUrl.value, previewTitle.value)
}
const downloadPDF = (base64Data: any, fileName = '供应商报告.pdf') => {
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
const handleDeleteCPK = () => {
    ElMessageBox.confirm(`是否删除CPK文件？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {

            DelFtpServer(deleteCPKForm.value).then((res: any) => {
                ElMessage({
                    title: t("publicText.success"),
                    message: res.msg,
                    type: res.success ? "success" : "error",
                });
                if (res.success) {
                    getData();
                    deleteCPKForm.value.TemplateName = ''
                }

            });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "已取消删除",
            });
        });
}
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
        tableHeight.value = window.innerHeight - 210;
    });
};
interface IQCFile {
    FileData: string; // Base64 数据
    FileName: string;
}

interface DownloadResponse {
    content: IQCFile[];
    success: boolean;
    message?: string;
}
const downloadSingleFile = async (file: IQCFile) => {
    try {
        // 确保 Base64 数据格式正确
        let base64Data = file.FileData;

        // 如果 Base64 数据不包含 data URL 前缀，添加它
        if (!base64Data.startsWith("data:")) {
            base64Data = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
        }

        // 使用更可靠的下载方式
        const response = await fetch(base64Data);
        const blob = await response.blob();

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        // 设置文件名，确保有 .xlsx 扩展名
        let fileName = file.FileName;
        if (!fileName.toLowerCase().endsWith(".xlsx")) {
            fileName = `${fileName}.xlsx`;
        }

        link.href = url;
        link.download = fileName;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);

        ElMessage.success("文件下载成功");
    } catch (error) {
        console.error("文件下载失败:", error);
        ElMessage.error("文件下载失败");
    }
};
const downloadAsZip = async (files: IQCFile[]) => {
    try {
        const zip = new JSZip();

        files.forEach((file, index) => {
            // 移除 Base64 前缀（如果有）
            const base64Content = file.FileData.replace(/^data:.*;base64,/, "");
            const fileName = file.FileName.endsWith(".xlsx")
                ? file.FileName
                : `${file.FileName}.xlsx`;

            zip.file(fileName, base64Content, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `IQC报告_${new Date().getTime()}.zip`);

        ElMessage.success("文件打包下载成功");
    } catch (error) {
        console.error("打包下载失败:", error);
        ElMessage.error("打包下载失败");
    }
};
const downloadTemp = () => {
    exportTableToExcel1({
        tableRef: tempMeasureRef.value,
        fetchAllData: tempData,
        fileName: editForm.value.InspectionNO,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
        stringColumns: ['ObservedValue']
    });
}
const tempData = async () => {
    console.log(editForm.value.listItem);

    let data = await editForm.value.listItem.filter((item: any) => item.InspectionResult !== 'OK')
    return data
}
const fileUpChange2 = async (file: any, fileList1: any) => {
    // if (file.raw) {
    //     convertToBase64(file.raw, 1);
    // }
    // uploadTemp(file.raw,'11')
    // const result = handleExcelUpload(file.raw)
    // // handleExcelUpload1(file.raw)
    // console.log(result);
    const fileNameList = file.name.split('_')
    //   console.log(fileNameList,editdetailForm.value.IQCNumber);
    if (fileNameList[0] !== editForm.value.InspectionNO) {
        ElMessage.error('导入失败，请导入检验对应的Excel')
        return
    }
    try {
        const result = await handleExcelUpload(file.raw)

        if (result.success) {
            // parsedData.value = result.data
            console.log(result.data);
            assignValuesMulti(result.data, editForm.value.listItem)
            ElNotification.success({
                title: '导入成功',
                message: result.message,
                duration: 3000
            })
            fileList3.value = [];
            // 触发数据更新事件（如果需要传递给父组件）
            // emit('data-parsed', result.data)
        } else {
            ElMessage.error(result.message || '导入失败')
            fileList3.value = [];
        }
    } catch (error: any) {
        ElMessage.error(`导入失败: ${error.message}`)
        fileList3.value = [];
    } finally {
        fileList3.value = [];
    }

};
const fileUpRemove2 = (file: any, fileList1: any) => {

    fileList3.value = [];
};
const beforeUpload2 = (file: any) => {
    const isPDF = file.type === "application/xlsx";
    const isLt10M = file.size / 1024 / 1024 < 5;

    if (!isPDF) {
        console.error("只能上传 xlsx 文件");
        return false;
    }

    if (!isLt10M) {
        console.error("文件大小不能超过 10MB");
        return false;
    }

    return true;
};

const assignValuesMulti = (sourceData: any, targetData: any) => {
    // 创建源数据的查找映射，提高查找效率
    const sourceMap = new Map();

    sourceData.forEach((item: any) => {
        const key = `${item.LineNos}_${item.ProjectName}`;
        sourceMap.set(key, item);
    });

    // 遍历目标数组并赋值
    targetData.forEach((targetItem: any) => {
        const key = `${targetItem.LineNos}_${targetItem.ProjectName}`;
        const sourceItem = sourceMap.get(key);

        if (sourceItem) {
            targetItem.SampleNum = sourceItem.SampleNum;
            targetItem.ObservedValue = sourceItem.ObservedValue;
            let valData = (sourceItem.ObservedValue).split(',')
            if (targetItem.SampleNum < valData.length) {
                targetItem.SampleNum = valData.length
            }
            //   targetItem.ResulthandLing = sourceItem.ResulthandLing;
        }
    });

    return targetData;
}

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
