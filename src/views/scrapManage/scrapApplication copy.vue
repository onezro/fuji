<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small"
                @submit.native.prevent>
                <el-form-item :label="'报废单号'" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.ScrapName" placeholder="" clearable
                        @keyup.enter.native="getData"></el-input>
                </el-form-item>
                <el-form-item :label="'创建时间'" class="mb-2"><el-date-picker :shortcuts="shortcuts" v-model="searchDate"
                        value-format="YYYY-MM-DD" type="daterange" range-separator="-" size="small" style="width: 190px"
                        :clearable="false" />
                </el-form-item>

                <el-form-item :label="'状态'" class="mb-2">
                    <el-select v-model="getForm.Status" placeholder="" style="width: 190px" clearable>
                        <el-option label="创建" :value="0" />
                        <el-option label="批准" :value="1" />
                    </el-select>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small" @click="resetGetForm">
                        {{ $t("publicText.reset") }}
                    </el-button>

                  
                    <el-button type="success" size="small" @click="createScrap" >
                        创建报废单
                    </el-button>
                      <el-button type="warning" size="small" :disabled="selectionList.length === 0||selectionList.length!==1||tableData2.length===0"
                        @click="handleSelectionData">
                        {{ $t("publicText.approval") }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-table :data="tableData.slice(
                        (pageObj.currentPage - 1) * pageObj.pageSize,
                        pageObj.currentPage * pageObj.pageSize,
                    )
                        " size="small" :style="{ width: '100%' }" ref="inspectionSheetRef" :height="tableHeight" border
                        fit highlight-current-row @selection-change="handleSelectionChange" :tooltip-effect="'dark'"
                        @row-click="getDetailData">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj.pageSize * (pageObj.currentPage - 1) +
                                    1
                                }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="ScrapName" :label="'报废单号'" fixed width="100">
                            <!-- <template #default="scope">
                                <span class="underline" @click="getDetailData(scope.row)">{{
                                    scope.row.ScrapName
                                    }}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="Remark" :label="'备注'" width="150" />
                        <el-table-column prop="Result" :label="'结果'" width="100" />

                        <!-- <el-table-column prop="Status" :label="'状态'" width="100">
                            <template #default="scope">
                                <span v-if="scope.row.Status === 0">{{'创建' }}</span>
                                <span v-else-if="scope.row.Status === 1">{{'批准' }}</span>
                                <span v-else>{{ scope.row.Status }}</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="ApproveUserName" :label="'批准人'" width="100" />
                        <el-table-column prop="ConfirmUserName" :label="'确认人'" width="100" />
                        <el-table-column prop="CreateUserName" :label="'创建人'" width="100" />
                        <el-table-column prop="CreateTime" :label="'创建时间'" width="150" />
                        <el-table-column :label="$t('publicText.operation')" width="60" fixed="right" align="center">
                            <template #default="scope">
                                <el-tooltip :content="$t('publicText.dawnload') + '报告'
                                    " placement="top">
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
                </el-col>
                <el-col :span="14">
                    <el-table :data="tableData2" size="small" :style="{ width: '100%' }" ref="inspectionSheetRef"
                        :height="tableHeight" border fit :tooltip-effect="'dark'">
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                        </el-table-column>
                        <el-table-column prop="Container" :label="'条码'" fixed width="150">
                        </el-table-column>
                        <el-table-column prop="Material" :label="'物料'" width="150" />
                        <el-table-column prop="LotNumber" :label="'批号'" width="100" />
                        <el-table-column prop="AttachmentName" :label="'附件名称'" width="150">
                            <template #default="scope">
                                <span class="underline cursor-pointer text-cyan-800"
                                    @click="openFile(scope.row.AttachmentId)">{{ scope.row.AttachmentName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Uom" :label="'单位'" width="80" />
                        <el-table-column prop="Qty" :label="'数量'" width="80" />
                        <el-table-column prop="ScrapReason" :label="'报废原因'" width="150" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog v-model="previewVisible" :title="previewTitle" width="80%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <iframe :src="previewUrl" width="100%" height="650px" frameborder="0"></iframe>
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
        <el-dialog v-model="createScrapVisible" :title="'选择报废'" width="90%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <el-form ref="createScrapFormRef" :model="createScrapForm" label-width="auto" :inline="true">
                <el-form-item :label="'物料类别'" prop="ProductFamilyName">
                    <el-select v-model="getSpiltForm.ProductFamilyName" placeholder="" style="width: 200px" filterable
                        @change="changeData">
                        <el-option v-for="n in materialNameList" :label="n.ProductFamilyName"
                            :value="n.ProductFamilyName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="'物料名称'" prop="MaterialName">
                    <el-select v-model="getSpiltForm.MaterialName" placeholder="" style="width: 200px" filterable
                        @change="getSpiltData">
                        <el-option v-for="n in productList" :label="n.productname" :value="n.productname" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="'批号'">
                    <el-input v-model="getSpiltForm.LotNumber" placeholder="" clearable style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item> <el-button type="primary" @click="getSpiltData">{{ '查询可报废物料'
                        }}</el-button></el-form-item>


                <el-table :data="spiltList" size="small" :style="{ width: '100%' }" ref="inspectionSheetRef"
                    :height="300" border fit :tooltip-effect="'dark'" @selection-change="handleSelectionSpiltChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    </el-table-column>
                    <el-table-column prop="ProductFamilyName" :label="'物料类别'" fixed>
                    </el-table-column>
                    <el-table-column prop="MaterialSource" :label="'来源'" fixed>
                    </el-table-column>
                    <el-table-column prop="ProductName" :label="'物料名称'" width="150" />
                    <el-table-column prop="SpecName" :label="'工序'" width="100">
                    </el-table-column>
                    <el-table-column prop="LotNumber" :label="'批号'" width="100" />
                    <el-table-column prop="ContainerName" :label="'规格'" width="150">
                    </el-table-column>
                    <el-table-column prop="Location" :label="'库位'" width="150">
                    </el-table-column>
                    <el-table-column prop="Qty" :label="'数量'" width="80" />
                    <el-table-column prop="UOMName" :label="'单位'" width="80" />
                </el-table>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleCreateScrapClose">{{
                        $t("publicText.close")
                    }}</el-button>
                    <el-button type="primary" @click="handleCreateChoice">
                        {{ '选择报废' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="scrapVisible" :title="'创建报废单'" width="80%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <el-table :data="createScrapForm.scrapMaterials" size="small" :style="{ width: '100%' }"
                ref="inspectionSheetRef" :height="300" border fit :tooltip-effect="'dark'">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column prop="MaterialDetailName" :label="'物料类别'" fixed>
                </el-table-column>
                <el-table-column prop="Material" :label="'物料名称'" width="150" />
                <el-table-column prop="Container" :label="'规格'" width="150">
                </el-table-column>
                <el-table-column prop="LotNumber" :label="'批号'" width="100" />
                <el-table-column prop="UomName" :label="'单位'" width="80" />
                <el-table-column prop="AttachmentName" :label="'附件名称'" width="80" />
                 <el-table-column prop="Qty1" :label="'数量'" width="80">

                </el-table-column>
                <el-table-column prop="Qty" :label="'报废数量'" width="130">
                    <template #default="{ row }">
                        <el-input-number v-model="row.Qty" :min="1" :max="row.Qty1" size="small" />
                    </template>
                </el-table-column>
                <el-table-column prop="ScrapReason" :label="'报废原因'" width="130">
                    <template #default="{ row }">
                        <el-input v-model="row.ScrapReason" placeholder="请输入报废原因" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" width="60" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="'上传附件'" placement="top">
                            <el-upload action="#" multiple :limit="1" v-model:file-list="fileList" :auto-upload="false"
                                :on-change="(file: any, fileList: any) => file2UpChange(file, fileList, scope.row)"
                                :on-remove="(file: any, fileList: any) => file2UpRemove(file, fileList, scope.row)"
                                :before-upload="beforeUpload" accept=".pdf" ref="upload1" class="upload-area">
                                <el-button size="small" type="primary" icon="Upload"></el-button>
                            </el-upload>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleScrapClose">{{
                        $t("publicText.close")
                    }}</el-button>
                    <el-button type="primary" @click="handleCreateScrap">
                        {{ '创建报废单' }}
                    </el-button>
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
    ScrapQuery,
    ScrapMateialDetailQuery,
    ScrapGetProductQuery,
    ScrapExecution,
    LabelPrintDownloadFtpServer,
    DownloadScrapReportAsync,
} from "@/api/scrapManage/index";
import {
    GetProductFamilyQuery,
    GetProductQuery
} from "@/api/incomingManage/iqcApi";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    computed,
} from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
const getForm = ref({
    ScrapName: "",
    Status: 0,
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
const tableData2 = ref([

]);
const selectionList = ref<any[]>([]);

const spiltList = ref([
    // {
    //     ProductFamilyName: "导热胶",
    //     Qty: 124074,
    //     LotNumber: "260102",
    //     ContainerName: "GR130A-00-30GY 300X200",
    //     Location: "香港-L01",
    //     ValidityPeriod: null,
    //     ProductName: "GR130A-00-50GY(300X200)",
    //     SpecName: "原材料库位",
    //     IsAutomotiveProduct: false,
    //     MaterialSource: "其他",
    //     UOMName: "PCS",
    // },
]);
const previewVisible = ref(false);
const previewUrl = ref("");
const previewTitle = ref("");
const getSpiltForm = ref({
    ProductFamilyName: "",
    MaterialName: "",
    LotNumber: "",
});
const materialNameList = ref<any[]>([]);
const productList = ref<any[]>([]);
const createScrapVisible = ref(false);
const spiltSelectionList = ref<any[]>([]);
const createScrapFormRef = ref();
const scrapVisible = ref(false);
const createScrapForm = ref({
    // ScrapName: "string",
    // DataStatus: 0,
    Status: 0,
    // Remark: "string",
    // Result: "string",
    // ApproveUserName: "string",
    // ConfirmUserName: "string",
    CreateUserName: userStore.getUserInfo,
    scrapMaterials: [
        {
            MaterialDetailName: "",
            Container: "",
            Material: "",
            LotNumber: "",
            Qty: 0,
            UomName: "",
            ScrapReason: "",
            AttachmentId: "",
            AttachmentName: "",
            Template_File: "",
        },
    ],
});
const fileList = ref<any[]>([]);
const appVisible = ref(false);
const appFormRef = ref();
const appForm = ref({
    ApprovalResult: "",
    ApprovalRemarks: "",
});
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
            getForm.value.StartTime = newVal[0] + ' 00:00:00';
            getForm.value.EndTime = newVal[1] + " 23:59:59";
            // getForm.value.PageNumber = 1
        }
    },
);

onBeforeMount(() => {
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getProductFamilyData()
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});

const resetGetForm = () => {
    getForm.value = {
        ScrapName: "",
        Status: 0,
        StartTime: setLastDate(),
        EndTime: setTodayDate() + " 23:59:59",
    };
};
const getData = () => {
    tableData2.value = [];
    ScrapQuery(getForm.value).then((res: any) => {
        if (res.success) {
            tableData.value = res.content;
        } else {
            tableData.value = [];
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    });
};

const handleSelectionChange = (val: any) => {
    selectionList.value = val;
};
const handleSelectionData = () => {
    appVisible.value = true;
};
const handleAppClose = () => {
    appVisible.value = false;
};
const handleAppConfirm = () => {
    let data = {
        ScrapName: selectionList.value[0].ScrapName,
        // DataStatus: 0,
        Status: 1,
        Remark: appForm.value.ApprovalRemarks,
        Result: appForm.value.ApprovalResult,
        ApproveUserName: userStore.getUserInfo,
        ConfirmUserName: userStore.getUserInfo,
        scrapMaterials: [
            {
                ScrapName:'',
                MaterialDetailName: "",
                Container: "",
                Material: "",
                LotNumber: "",
                Qty: 0,
                UomName: "",
                ScrapReason: "",
                AttachmentId: "",
                AttachmentName: "",
                Template_File: "",
            },
        ],
    }
    data.scrapMaterials = tableData2.value.map((item: any) => ({
        ScrapName: item.ScrapName,
        MaterialDetailName: item.MaterialDetailName,
        Container: item.Container,
        Material: item.Material,
        LotNumber: item.LotNumber,
        Qty: item.Qty,
        UomName: item.Uom,
        ScrapReason: item.ScrapReason,
        AttachmentId: item.AttachmentId,
        AttachmentName: item.AttachmentName,
        Template_File: item.Template_File,
    }))
    ScrapExecution(data).then((res: any) => {
        if (res.success) {
            ElMessage({
                title: t("message.tipTitle"),
                message: "审批成功",
                type: "success",
            });
            appVisible.value = false;
            selectionList.value = [];
            getData();
        } else {
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    })
}
const getDetailData = (val: any) => {
    ScrapMateialDetailQuery({ ScrapName: val.ScrapName }).then((res: any) => {
        if (res.success) {
            tableData2.value = res.content;
        } else {
            tableData2.value = [];
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    });
};

const getSpiltData = () => {
    ScrapGetProductQuery(getSpiltForm.value).then((res: any) => {
        if (res.success) {
            spiltList.value = res.content;
        } else {
            spiltList.value = [];
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    });
};
const getProductFamilyData = () => {
    GetProductFamilyQuery({}).then((res: any) => {
        materialNameList.value = res.content;
    });
};
const changeData = (val: any) => {
    // console.log(val);
    getSpiltForm.value.MaterialName = "";
    GetProductQuery(val).then((res: any) => {
        productList.value = res.content;
        // console.log(productList.value);
    });
};
const createScrap = () => {
    getSpiltData()
    createScrapVisible.value = true;
};
const handleCreateScrapClose = () => {
    createScrapVisible.value = false;
    createScrapForm.value = {
        Status: 0,
        CreateUserName: userStore.getUserInfo,
        scrapMaterials: [
        ],
    };
    getSpiltForm.value = {
        ProductFamilyName: "",
        MaterialName: "",
        LotNumber: "",
    }
    spiltSelectionList.value = [];
}
const handleSelectionSpiltChange = (val: any) => {
    spiltSelectionList.value = val;
}
const handleCreateChoice = () => {
    createScrapForm.value.scrapMaterials = spiltSelectionList.value.map((item: any) => ({
        MaterialDetailName:"",
        Container: item.ContainerName,
        Material: item.ProductName,
        LotNumber: item.LotNumber,
        Qty1: item.Qty,
        Qty: 0,
        UomName: item.UOMName,
        ScrapReason: "",
        AttachmentId: "",
        AttachmentName: "",
        Template_File: "",
    }));
    scrapVisible.value = true;
}
const beforeUpload = (file: any) => {
    const isPDF = file.type === 'application/pdf'
    const isLt10M = file.size / 1024 / 1024 < 5

    if (!isPDF) {
        console.error('只能上传 PDF 文件')
        return false
    }

    if (!isLt10M) {
        console.error('文件大小不能超过 5MB')
        return false
    }

    return true
};
const file2UpChange = (file: any, fileList1: any, row: any) => {
    if (file.raw) {
        convertToBase64(file.raw, row)
    }
};
const file2UpRemove = (file: any, fileList1: any, row: any) => {
    row.AttachmentName = ''
    row.Template_File = ''
};
const convertToBase64 = (file: any, row: any) => {
    const reader = new FileReader()

    reader.onload = (event: any) => {
        const fullBase64 = event.target.result
        row.AttachmentName = file.name
        row.Template_File = fullBase64.replace(/^data:application\/pdf;base64,/, '')
        console.log('PDF 已转换为 base64:', event.target.result)
        fileList.value = []
    }

    reader.onerror = (error) => {
        console.error('文件读取错误:', error)
    }
    // 读取文件为 base64
    reader.readAsDataURL(file)
}
const handleScrapClose = () => {
    scrapVisible.value = false;
    createScrapForm.value = {
        Status: 0,
        CreateUserName: userStore.getUserInfo,
        scrapMaterials: [
        ],
    };
}
const handleCreateScrap = () => {
    console.log(createScrapForm.value);

    ScrapExecution(createScrapForm.value).then((res: any) => {
        if (res.success) {
            ElMessage({
                title: t("message.tipTitle"),
                message: "报废单创建成功",
                type: "success",
            });
            scrapVisible.value = false;
            handleCreateScrapClose();
            getData();
        } else {
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    })
}

interface IQCFile {
    FileData: string; // Base64 数据
    FileName: string;
}

interface DownloadResponse {
    content: IQCFile[];
    success: boolean;
    message?: string;
}
//下载报告
const handleDownload = async (row: any) => {
    try {
        const resAny: any = await DownloadScrapReportAsync(row.ScrapName);
        console.log(resAny);

        const payload: DownloadResponse =
            resAny && resAny.data ? resAny.data : resAny;

        if (!payload.success || !payload.content || payload.content.length === 0) {
            ElMessage.warning("没有找到可下载的文件");
            return;
        }

        const files = payload.content;

        // if (files.length > 1) {
        //     await downloadAsZip(files);
        //     return;
        // }

        // 单个文件直接下载
        const file = files[0];
        await downloadSingleFile(file);
    } catch (error) {
        console.error("下载失败:", error);
        ElMessage.error("文件下载失败");
    }
};

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
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        ElMessage.success("文件下载成功");
    } catch (error) {
        console.error("文件下载失败:", error);
        ElMessage.error("文件下载失败");
    }
};
const openFile = (val: any) => {
    LabelPrintDownloadFtpServer(val).then((res: any) => {
        if (!res.success) {
            ElMessage({
                message: res.msg,
                type: "error",
            });
            return;
        }
        const base64Data = "data:application/pdf;base64," + res.content.FileData;
        previewUrl.value = base64Data;
        previewTitle.value = res.content.FileName;
        previewVisible.value = true;
        // downloadPDF(base64Data, res.content.FileName)
    });
};
const handlePreviewClose = () => {
    previewVisible.value = false;
    previewUrl.value = "";
};
const handlePreviewDawnload = () => {
    downloadPDF(previewUrl.value, previewTitle.value);
};

const downloadPDF = (base64Data: any, fileName = "供应商报告.pdf") => {
    try {
        // 创建下载链接
        const link = document.createElement("a");

        // 设置下载属性
        link.href = base64Data;
        link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

        // 添加到页面（需要添加到页面才能触发下载）
        document.body.appendChild(link);

        // 触发点击下载
        link.click();

        // 清理 DOM
        document.body.removeChild(link);

        ElMessage.success("文件下载成功");
    } catch (error) {
        console.error("下载失败:", error);
        ElMessage.error("文件下载失败");
    }
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

<style lang="scss" scoped></style>
