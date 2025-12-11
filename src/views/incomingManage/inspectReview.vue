<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('incomeCreat.creatInspect')" class="mb-2">
                    <el-input style="width: 140px" v-model="getForm.InspectionNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.creatInspect')" class="mb-2"><el-date-picker
                        :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" size="small" style="width: 200px" :clearable="false" /></el-form-item>
                <el-form-item :label="'检验结果'" class="mb-2">
                    <el-select v-model="getForm.InspectionResult" placeholder="" style="width: 200px">
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
                    <el-button type="warning" size="small" :disabled="selectionList.length === 0"
                        @click="handleSelectionData">
                        {{ $t("publicText.approval") }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" border fit
                highlight-current-row @cell-click="cellClick" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />

                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="IQCNumber" :label="$t('incomeCreat.creatInspect')">
                    <template #default="scope">
                        <span class="underline">{{ scope.row.IQCNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="NotifyDate" :label="$t('incomeCreat.NotifyDate')" />
                <el-table-column prop="Notifier" :label="$t('incomeCreat.NotifyPerson')" />
                <el-table-column prop="NotifyDept" :label="$t('incomeCreat.NotifyDepartment')" />
                <el-table-column prop="ArrivalDate" :label="$t('incomeCreat.incomeDate')" />
                <el-table-column prop="IsAutomotive" :label="$t('incomeCreat.isCarProduct')" />
                <el-table-column prop="InspectStandard" :label="$t('incomeCreat.InspectStandard')" />
                <el-table-column prop="StatusText" :label="$t('incomeCreat.Status')" />
                <el-table-column prop="CreateTime" :label="$t('incomeCreat.creatDate')" width="150" />
                <el-table-column prop="InspectionResult" :label="$t('incomeSheet.result')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.dawnload') + $t('incomeSheet.incomeReport')" placement="top">
                            <el-button type="success" icon="Download" size="small"
                                @click.stop="handleDownload(scope.row)"></el-button>
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
        <el-dialog v-model="detailVisible" align-center title="来料检验单明细" width="85%" @close="detailVisible = false">
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
                <el-table-column prop="SamplingStandards" :label="$t('incomeCreat.InspectStandard')" />
                <el-table-column prop="SupplierReportName" :label="$t('incomeCreat.supplierReport')" />
                <el-table-column prop="StatusText" :label="$t('incomeCreat.Status')" />
                <el-table-column prop="CreateTime" :label="$t('incomeCreat.creatDate')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <!-- <el-tooltip :content="$t('publicText.check')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip> -->
                        <el-tooltip :content="$t('publicText.look')" placement="top">
                            <el-button type="warning" icon="Reading" size="small"
                                @click.stop="handleLook(scope.row)"></el-button>
                        </el-tooltip>
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

        <el-dialog v-model="testVisible" :title="$t('incomeSheet.incomeReport')" width="85%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handletestClose">
            <!-- <el-button type="primary" @click="exportToExcel">导出Excel</el-button> -->
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first"></el-tab-pane>
                <el-tab-pane :label="'计量检验'" name="second">
                    <el-table :data="tableData1" border stripe style="width: 100%" size="small" :height="400">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleSize" size="small" type="number" min="1" max="10"
                                    :disabled="scope.row.StatusText !== ''"
                                    @change="handleSampleSizeChange(scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ scope.row.DefectCount || calculateDefectCount(scope.row) }}
                                <!-- <el-input v-model="scope.row.DefectCount" size="small" :disabled="scope.row.StatusText!==''"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="MeasuredValue" :align="'center'"
                            :label="$t('incomeSheet.MeasurementNumber')">
                            <template #default="scope">
                                <span>{{ formatMeasuredValues(scope.row) }}</span>
                                <el-button type="primary" icon="Plus" :size="'small'"
                                    :disabled="scope.row.StatusText !== ''"
                                    @click="openMeasurementDialog(scope.row, scope.$index)" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'结果'">
                            <template #default="scope">
                                {{ scope.row.StatusText || getResultText(scope.row) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'总和'">
                            <template #default="scope">
                                <span>{{ calculateSum(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'平均数'">
                            <template #default="scope">
                                <span>{{ calculateAverage(scope.row) }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handletestClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="handletestConfirm" :disabled="isDisable">
                        {{ $t("publicText.confirm") }}
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
        <el-dialog v-model="lookVisible" :title="$t('incomeSheet.incomeReport')" width="850px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="lookVisible = false">
            <el-button type="primary" @click="exportToExcel">导出Excel</el-button>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="lookVisible = false">{{
                        $t("publicText.close")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="appVisible" title="审批" width="500" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center @close="appVisible = false">
            <el-form ref="appFormRef" :model="appForm" label-width="auto">
                <el-form-item label="结果" prop="ApprovalResult">
                    <el-select v-model="appForm.ApprovalResult" placeholder="" style="width: 200px">
                        <el-option label="通过" value="通过"> </el-option>
                        <el-option label="不通过" value="不通过"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="ApprovalRemarks">
                    <el-input type="textarea" v-model="appForm.ApprovalRemarks" :rows="4" style="width: 400px" />
                </el-form-item>

            </el-form>
            <template #footer>

                <el-button @click="handleAppClose">{{
                    $t("publicText.cancel")
                }}</el-button>
                <el-button type="primary" @click="handleAppConfirm">
                    {{ $t("publicText.confirm") }}
                </el-button>
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
    GetIQCInspectionDetailQuery,
    AyscIQCInspectionInterface,
    AyscIQCApproval,
    DownloadIQCReportAsync
} from "@/api/incomingManage/iqcApi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import JSZip from 'jszip';
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    h,
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
import { log } from "node:console";

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
const activeName = ref("second");
const detailTableData = ref<any[]>([]);
const detailVisible = ref(false);
const testVisible = ref(false);
const isDisable = ref(false);
const tableData1 = ref<any[]>([]);
const dialogVisible = ref(false);
const currentRow = ref<any>(null);
const currentRowIndex = ref(-1);
const currentSampleSize = ref(0);
const measurementValues = ref<any[]>([]);
const reportFrom = ref({
    recipientDep: "",
    recipientPerson: "",
    incomeType: "",
    samplingQty: "",
    packagingCheck: "",
    appearanceCheck: "",
    dimensionCheck: "",
    materialCheck: "",
    isCarResult: "",
    isQualified: "",
    inspector: "",
    checkDate: "",
    checkNote: "",
});
const selectionList = ref([]);
const appVisible = ref(false);
const appFormRef = ref();
const appForm = ref({
    ApprovalResult: "",
    ApprovalRemarks: "",
});
const lookFormRef = ref();
const lookVisible = ref(false);
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
            getForm.value.EndTime = newVal[1] +' 23:59:59';
            // getForm.value.PageNumber = 1
        }
    }
);

onBeforeMount(() => {
    getScreenHeight();
      let end: string = setTodayDate() + '23:59:59';
    let start: string = setLastDate();
    searchDate.value = [start, end];
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
const handleSelectionChange = (val: any) => {
    selectionList.value = val;
};
const handleSelectionData = () => {
    appVisible.value = true;
    // let data = [];
    // data = selectionList.value.map((item: any) => {
    //     return {
    //         InspectionNo: item.IQCNumber,
    //         ApprovalResult: appForm.value.ApprovalResult,
    //         ApprovalRemarks: appForm.value.ApprovalRemarks,
    //         Approver: userStore.getUserInfo,
    //     };
    // });
    // AyscIQCApproval(data).then((res: any) => {
    //     ElNotification({
    //         title: t("message.tipTitle"),
    //         message: res.msg,
    //         type: res.success ? "success" : "error",
    //     });
    // });
};
const handleAppClose = () => {
    appVisible.value = false;
};
const handleAppConfirm = () => {
    let data = [];
    data = selectionList.value.map((item: any) => {
        return {
            InspectionNo: item.IQCNumber,
            ApprovalResult: appForm.value.ApprovalResult,
            ApprovalRemarks: appForm.value.ApprovalRemarks,
            Approver: userStore.getUserInfo,
        };
    });
    AyscIQCApproval(data).then((res: any) => {
        ElNotification({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        appVisible.value = false;
        appForm.value = {
            ApprovalResult: "",
            ApprovalRemarks: "",
        }
        getData();
    });
};
const cellClick = (row: any) => {
    // detailForm.value.InspectionNo = row.IQCNumber;
    // editdetailForm.value.InspectionNo = row.IQCNumber;
    GetIQCDetailQuery({ InspectionNo: row.IQCNumber }).then((res: any) => {
        detailTableData.value = res.content;
        detailVisible.value = true;
    });
};

// const handleDownload = async (row: any) => {
//   try {
//     const res:any = await DownloadIQCReportAsync(row.IQCNumber);
    
//     if (!res.content || res.content.length === 0) {
//       ElMessage.warning('没有找到可下载的文件');
//       return;
//     }
    
//     // 处理每个文件下载
//     for (const item of res.content) {
//       await downloadFile(item);
//     }
    
//   } catch (error) {
//     console.error('下载失败:', error);
//     ElMessage.error('文件下载失败');
//   }
// };

// const downloadFile = (file: { FileData: string; FileName: string }) => {
//   return new Promise<void>((resolve) => {
//     try {
//       // 处理 Base64 数据
//       const base64Data = file.FileData.startsWith('data:')
//         ? file.FileData
//         : `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${file.FileData}`;
      
//       const link = document.createElement('a');
//       link.href = base64Data;
//       link.download = file.FileName.endsWith('.xlsx') 
//         ? file.FileName 
//         : `${file.FileName}.xlsx`;
      
//       // 添加事件监听确保下载完成后清理
//       link.onload = () => {
//         setTimeout(() => {
//           document.body.removeChild(link);
//           resolve();
//         }, 100);
//       };
      
//       link.onerror = () => {
//         document.body.removeChild(link);
//         resolve();
//       };
      
//       document.body.appendChild(link);
//       link.click();
      
//     } catch (error) {
//       console.error('单个文件下载失败:', error);
//       resolve(); // 继续下载其他文件
//     }
//   });
// };
interface IQCFile {
  FileData: string; // Base64 数据
  FileName: string;
}

interface DownloadResponse {
  content: IQCFile[];
  success: boolean;
  message?: string;
}
const handleDownload = async (row: any) => {
  try {
    const resAny: any = await DownloadIQCReportAsync(row.IQCNumber);
    console.log(resAny);
    
    const payload: DownloadResponse = resAny && resAny.data ? resAny.data : resAny;

    if (!payload.success || !payload.content || payload.content.length === 0) {
      ElMessage.warning('没有找到可下载的文件');
      return;
    }

    const files = payload.content;

    if (files.length > 1) {
      await downloadAsZip(files);
      return;
    }
    
    // 单个文件直接下载
    const file = files[0];
    await downloadSingleFile(file);
    
  } catch (error) {
    console.error('下载失败:', error);
    ElMessage.error('文件下载失败');
  }
};

const downloadSingleFile = async (file: IQCFile) => {
  try {
    // 确保 Base64 数据格式正确
    let base64Data = file.FileData;
    
    // 如果 Base64 数据不包含 data URL 前缀，添加它
    if (!base64Data.startsWith('data:')) {
      base64Data = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
    }
    
    // 使用更可靠的下载方式
    const response = await fetch(base64Data);
    const blob = await response.blob();
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // 设置文件名，确保有 .xlsx 扩展名
    let fileName = file.FileName;
    if (!fileName.toLowerCase().endsWith('.xlsx')) {
      fileName = `${fileName}.xlsx`;
    }
    
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    ElMessage.success('文件下载成功');
    
  } catch (error) {
    console.error('文件下载失败:', error);
    ElMessage.error('文件下载失败');
  }
};

// 可选：多个文件打包下载（需要安装 jszip 库）
// const downloadAsZip = async (files: IQCFile[]) => {
//   try {
//     // 提示用户将下载多个文件
//     const confirm = await ElMessageBox.confirm(
//       `检测到 ${files.length} 个文件，是否打包下载？`,
//       '批量下载',
//       {
//         confirmButtonText: '打包下载',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }
//     ).catch(() => false);
    
//     if (!confirm) return;
    
//     // 如果不需要打包，可以逐个下载，添加延迟避免同时触发太多下载
//     for (let i = 0; i < files.length; i++) {
//       await downloadSingleFile(files[i]);
      
//       // 如果不是最后一个文件，添加短暂延迟
//       if (i < files.length - 1) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }
//     }
    
//   } catch (error) {
//     console.error('批量下载失败:', error);
//     ElMessage.error('批量下载失败');
//   }
// };


const downloadAsZip = async (files: IQCFile[]) => {
  try {
    const zip = new JSZip();
    
    files.forEach((file, index) => {
      // 移除 Base64 前缀（如果有）
      const base64Content = file.FileData.replace(/^data:.*;base64,/, '');
      const fileName = file.FileName.endsWith('.xlsx') 
        ? file.FileName 
        : `${file.FileName}.xlsx`;
      
      zip.file(fileName, base64Content, { base64: true });
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `IQC报告_${new Date().getTime()}.zip`);
    
    ElMessage.success('文件打包下载成功');
  } catch (error) {
    console.error('打包下载失败:', error);
    ElMessage.error('打包下载失败');
  }
};

const openMeasurementDialog = (row: any, index: any) => {
    currentRow.value = row;
    currentRowIndex.value = index;
    currentSampleSize.value = parseInt(row.SampleSize) || 0;
    measurementValues.value = [];
    for (let i = 0; i < currentSampleSize.value; i++) {
        measurementValues.value.push(row[`MeasuredValue${i + 1}`] || "");
    }

    dialogVisible.value = true;
};

const saveMeasurements = () => {
    for (let i = 0; i < currentSampleSize.value; i++) {
        currentRow.value[`MeasuredValue${i + 1}`] = measurementValues.value[i];
    }

    dialogVisible.value = false;
};

const calculateDefectCount = (row: any) => {
    // 获取MinValue和MaxValue的数值
    const minValue = parseFloat(row.MinValue);
    const maxValue = parseFloat(row.MaxValue);

    // 检查MinValue和MaxValue是否有效
    if (isNaN(minValue) || isNaN(maxValue)) {
        return 0; // 范围无效时返回0
    }

    let defectCount = 0;

    // 检查所有测量值
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value === null || value === undefined || value === "") {
            continue;
        }

        // 转换为数字
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            continue; // 非数字值不计入缺陷
        }

        // 检查是否不在范围内
        if (numValue < minValue || numValue > maxValue) {
            defectCount++;
        }
    }

    return defectCount;
};
const getResultText = (row: any) => {
    // 获取MinValue和MaxValue的数值
    const minValue = parseFloat(row.MinValue);
    const maxValue = parseFloat(row.MaxValue);

    // 检查MinValue和MaxValue是否有效
    if (isNaN(minValue) || isNaN(maxValue)) {
        return "范围无效";
    }

    // 检查所有测量值
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value === null || value === undefined || value === "") {
            continue;
        }

        // 转换为数字
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return "数据异常"; // 如果有非数字值，返回异常
        }

        // 检查是否在范围内
        if (numValue < minValue || numValue > maxValue) {
            row.Status = "不合格";
            return "不合格";
        }
    }

    // 检查是否有至少一个测量值
    const hasValues = Array.from({ length: 10 }, (_, i) => i + 1).some(
        (i) =>
            row[`MeasuredValue${i}`] !== null &&
            row[`MeasuredValue${i}`] !== undefined &&
            row[`MeasuredValue${i}`] !== ""
    );
    row.Status = hasValues ? "合格" : "无数据";
    return hasValues ? "合格" : "无数据";
};
const handleSampleSizeChange = (row: any) => {
    const newSize = parseInt(row.SampleSize) || 0;
    // 清空多余的测量值
    for (let i = newSize; i < 10; i++) {
        row[`MeasuredValue${i + 1}`] = null;
    }
};
const calculateSum = (row: any) => {
    let sum = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            sum += Number(value);
        }
    }
    return sum;
};
const calculateAverage = (row: any) => {
    let sum = 0;
    let count = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            sum += Number(value);
            count++;
        }
    }
    return count > 0 ? (sum / count).toFixed(2) : 0;
};
const formatMeasuredValues = (row: any) => {
    const values = [];
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            values.push(value);
        }
    }
    return values.join(", ");
};

const handleEdit = (row: any) => {
    if (row.StatusText == "创建") {
        isDisable.value = false;
    } else {
        isDisable.value = true;
    }
    GetIQCInspectionDetailQuery({ IQC_DetailName: row.IQC_DetailName }).then(
        (res: any) => {
            tableData1.value = res.content;
            if (tableData1.value.length === 0) {
                isDisable.value = true;
            }

            testVisible.value = true;
        }
    );
};

const handleLook = (row: any) => {
    lookVisible.value = true;
};
const handletestClose = () => {
    testVisible.value = false;
};
const handletestConfirm = () => {
    let inspectionDetails = tableData1.value.map((item: any) => {
        return {
            IQCDetailId: item.IQC_DetailName,
            IQC_InspectionDetailsName: item.IQC_InspectionDetailName,
            SampleSize: parseInt(item.SampleSize),
            DefectCount: parseInt(item.DefectCount),
            DefectDescription: "",
            MeasuredValue1: item.MeasuredValue1 || "",
            MeasuredValue2: item.MeasuredValue2 || "",
            MeasuredValue3: item.MeasuredValue3 || "",
            MeasuredValue4: item.MeasuredValue4 || "",
            MeasuredValue5: item.MeasuredValue5 || "",
            MeasuredValue6: item.MeasuredValue6 || "",
            MeasuredValue7: item.MeasuredValue7 || "",
            MeasuredValue8: item.MeasuredValue8 || "",
            MeasuredValue9: item.MeasuredValue9 || "",
            MeasuredValue10: item.MeasuredValue10 || "",
            Inspector: userStore.gretUserInfo,
            Status: item.Status == "合格" ? 1 : 2,
            DataStatus: 0,
        };
    });

    AyscIQCInspectionInterface(inspectionDetails).then((res: any) => {
        ElNotification({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        // testVisible.value = false;
    });
    // console.log(tableData1.value);
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
const headerRowStyle = (row: any) => {
    console.log(row);
};
const objectSpanMethod = (obj: any) => {
    const { row, column, rowIndex, columnIndex } = obj;
    if (columnIndex === 4) {
        // return [2,1];
        if (rowIndex % 3 === 0) {
            return {
                rowspan: 3,
                colspan: 1,
            };
        } else {
            return {
                rowspan: 0,
                colspan: 0,
            };
        }
    }
    if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
        if (rowIndex === 1) {
            return {
                rowspan: 2, // 合并第2行和第3行
                colspan: 1,
            };
        } else if (rowIndex === 2) {
            return {
                rowspan: 0, // 隐藏第3行的单元格
                colspan: 0,
            };
        }
        // 其他行（如第1行）不合并
        return {
            rowspan: 1,
            colspan: 1,
        };
    }
};
const exportToExcel = async () => {
    try {
        // 创建工作簿
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "进料检验系统";
        workbook.created = new Date();

        // 添加工作表
        const worksheet = workbook.addWorksheet("进料检验报告");

        // 设置默认字体（Worksheet 无 font 属性，使用单元格样式设置字体）

        // 定义通用样式
        const borderStyle: Partial<ExcelJS.Borders> = {
            top: { style: "thin" as ExcelJS.BorderStyle },
            left: { style: "thin" as ExcelJS.BorderStyle },
            bottom: { style: "thin" as ExcelJS.BorderStyle },
            right: { style: "thin" as ExcelJS.BorderStyle },
        };

        const headerCellStyle = {
            font: { bold: true, name: "Microsoft YaHei" },
            alignment: {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            },
            border: borderStyle,
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF0F9FF" },
            },
        } as Partial<ExcelJS.Style>;

        const contentCellStyle = {
            alignment: {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            },
            border: borderStyle,
        } as Partial<ExcelJS.Style>;

        // 添加标题行
        const titleRow = worksheet.addRow(["进料检验报告"]);
        titleRow.font = { bold: true, size: 16, name: "Microsoft YaHei" };
        titleRow.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.mergeCells("A1:S1");
        titleRow.height = 30;

        // 第一行信息
        worksheet.addRow([
            "进料检验通知部门",
            "",
            "事务部",
            "受理部门",
            "自动线物料部品科.质量部",
            "",
            "外观检查 AQL Level II 1.0 *汽车产品 (C=0)",
            "",
            "",
            "页次",
            "",
            "1/1",
            "备注",
            "",
            "",
            "",
            "",
            "",
        ]);
        // 合并单元格
        worksheet.mergeCells("A2:B2");
        worksheet.mergeCells("E2:F2");
        worksheet.mergeCells("J2:K2");
        worksheet.mergeCells("M2:S2");

        // 第三行信息
        worksheet.addRow([
            "通知人签名",
            "",
            "周丽琛",
            "受理人签名",
            "自动线当麻林 检查长",
            "",
            "",
            "",
            "",
            "来料种类数",
            "",
            "11",
            "测试备注",
            "",
            "",
            "",
            "",
            "",
        ]);
        worksheet.mergeCells("A3:B3");
        worksheet.mergeCells("E3:F3");
        worksheet.addRow([
            "来料日期",
            "",
            "251002",
            "受理日期",
            "251105",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]);
        worksheet.mergeCells("A4:B4");
        worksheet.mergeCells("E4:F4");
        // 外观检查 AQL Level II 1.0 *汽车产品 (C=0) 纵向合并 G2:I4
        worksheet.mergeCells("G2:I4");
        worksheet.mergeCells("J3:K4");
        worksheet.mergeCells("L3:L4");
        worksheet.mergeCells("M3:S4");
        // 设置前行样式
        for (let row = 2; row <= 4; row++) {
            worksheet.getRow(row).eachCell((cell, col) => {
                cell.style = contentCellStyle;
                // 标题单元格加粗
                if (
                    (row === 2 && [1, 3, 5, 7, 9, 12].includes(col)) ||
                    (row === 4 && [1, 3, 5].includes(col)) ||
                    (row === 5 && [1, 3, 5].includes(col))
                ) {
                    cell.font = { bold: true };
                }
            });
            worksheet.getRow(row).height = 25;
        }

        // 表格标题行
        const tableHeader = [
            "*汽车产品 (是/否)",
            "材料名称",
            "型号规格",
            "供应商",
            "订单号",
            "Lot No",
            "来料数量/箱",
            "抽检箱数",
            "包装",
            "外观",
            "规格",
            "特性1",
            "特性2",
            "特性...",
            "*C=0 (是/否)",
            "判定",
            "检验员",
            "批准",
            "T-Code",
        ];
        const headerRow = worksheet.addRow(tableHeader);
        headerRow.eachCell((cell) => {
            cell.style = headerCellStyle;
        });
        headerRow.height = 30;

        // 添加数据行
        tableData1.value.forEach((data) => {
            const rowData = [
                data.autoProduct,
                data.materialName,
                data.spec,
                data.supplier,
                data.orderNo,
                data.lotNo,
                data.quantity,
                data.sampleBoxes,
                data.packaging,
                data.appearance,
                data.specification,
                data.feature1,
                data.feature2,
                data.otherFeatures,
                data.cZero,
                data.judgment,
                data.inspector,
                data.approver,
                data.tcode,
            ];

            const row = worksheet.addRow(rowData);
            row.eachCell((cell) => {
                cell.style = contentCellStyle;
            });
            row.height = 25;
        });

        // 设置列宽
        const columnWidths = [
            10, 10, 10, 10, 10, 10, 12, 20, 8, 8, 8, 8, 8, 8, 12, 12, 12, 15, 10,
        ];
        worksheet.columns.forEach((col, index) => {
            col.width = columnWidths[index];
        });

        // 生成Excel文件并下载
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const date = new Date();
        const fileName = `进料检验报告_${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}.xlsx`;
        saveAs(blob, fileName);

        ElMessage.success("导出成功！");
    } catch (error) {
        console.error("导出Excel时出错:", error);
        ElMessage.error("导出失败，请重试");
    }
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
