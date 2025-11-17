<template>
    <div class="p-2">

        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('processInspect.inspectOrder')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.inspectOrder" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.workeOrder')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.workeOrder" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.creatTime')" class="mb-2"><el-date-picker
                        :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" size="small" style="width: 150px" :clearable="false" />
                </el-form-item>
                <el-form-item :label="$t('processInspect.firstInspectStatus')" class="mb-2">
                    <el-select v-model="getForm.firstInspectStatus" placeholder="" style="width: 150px">
                        <el-option :label="t('incomeSheet.status1')" :value="t('incomeSheet.status1')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status2')" :value="t('incomeSheet.status2')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status3')" :value="t('incomeSheet.status3')">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('processInspect.patrolInspectStatus')" class="mb-2">
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
                </el-form-item>

                <el-form-item :label="$t('processInspect.productType')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.productType" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.productName')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.productName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.customerName')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.customerName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.customerPO')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.customerPO" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.customerPN')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.customerPN" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('processInspect.LOtNO')" class="mb-2">
                    <el-input style="width: 150px" v-model="getForm.LOtNO" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small">
                        {{ $t("publicText.reset") }}
                    </el-button>
                    <el-button type="warning" size="small" @click="testVisible = true">
                        {{ $t("processInspect.orderInterrupt") }}
                    </el-button>
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
                            scope.$index +
                            pageObj.pageSize * (pageObj.currentPage - 1) +
                            1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="inspectOrder" :label="$t('processInspect.inspectOrder')" />
                <el-table-column prop="workeOrder" :label="$t('processInspect.workeOrder')" />
                <el-table-column prop="productName" :label="$t('processInspect.productName')" />
                <el-table-column prop="productType" :label="$t('processInspect.productType')" />
                <el-table-column prop="customerPO" :label="$t('processInspect.customerPO')" />
                <el-table-column prop="customerPN" :label="$t('processInspect.customerPN')" />
                <el-table-column prop="LOtNO" :label="$t('processInspect.LOtNO')" />
                <el-table-column prop="firstInspectStatus" :label="$t('processInspect.firstInspectStatus')" />
                <el-table-column prop="patrolInspectStatus" :label="$t('processInspect.patrolInspectStatus')" />
                <el-table-column prop="tailInspectStatus" :label="$t('processInspect.tailInspectStatus')" />
                <el-table-column prop="creatTime" :label="$t('processInspect.creatTime')" />
                <el-table-column prop="cpk" :label="$t('processInspect.cpk')" />
                <el-table-column prop="FA" :label="$t('processInspect.FA')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.check')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
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
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog v-model="testVisible" :title="$t('processInspect.orderInterrupt')" width="30%"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handletestClose">

            <el-form-item :label="$t('processInspect.firstInspectStatus')" class="mb-2">
                <el-select v-model="getForm.firstInspectStatus" placeholder="" style="width: 200px">
                    <el-option :label="t('incomeSheet.status1')" :value="t('incomeSheet.status1')">
                    </el-option>
                    <el-option :label="t('incomeSheet.status2')" :value="t('incomeSheet.status2')">
                    </el-option>
                    <el-option :label="t('incomeSheet.status3')" :value="t('incomeSheet.status3')">
                    </el-option>
                </el-select>
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handletestClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handletestConfirm"> {{ $t('publicText.confirm') }} </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="lookVisible" :title="$t('incomeSheet.incomeReport')" width="850px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="lookVisible = false">


            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="lookVisible = false">{{ $t('publicText.close') }}</el-button>

                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const getForm = ref({
    inspectOrder: "",
    workeOrder: "",
    creatTime: "",
    firstInspectStatus: "",
    patrolInspectStatus: "",
    tailInspectStatus: "",
    productType: "",
    productName: "",
    customerName: "",
    customerPO: "",
    customerPN: "",
    LOtNO: '',
    SchedulingStartDate: "",
    SchedulingEndDate: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([
    {
        inspectOrder: 'FI-20230619-001',
        workeOrder: 'WO-20230619-001',
        productName: '汽车零部件',
        productType: '类型A',
        customerPO: 'CPO-20230619-001',
        customerPN: 'CPN-20230619-001',
        LOtNO: 'LOT-230619-01',
        firstInspectStatus: '已完成',
        patrolInspectStatus: '未开始',
        tailInspectStatus: '未开始',
        creatTime: '2023-06-19 10:00:00',
        cpk: '1.33',
        FA: '通过'
    }
]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const testVisible = ref(false);
const tableData1 = ref<any[]>([
    { header: '产品名称', content: '汽车零部件', isdisable: true },
    { header: '型号规格', content: 'SAH-2023-001', isdisable: true },
    { header: '供应商', content: 'SRG有限公司', isdisable: true },
    { header: '订单号', content: 'ORD-20230619-001', isdisable: true },
    { header: '批号(Lot No)', content: 'LOT-230619-01', isdisable: true },
    { header: '来料数量', content: '500 件', isdisable: true },
    { header: '抽检数量', content: '', isdisable: false },
    { header: '包装检查结果', content: '', isdisable: false },
    { header: '外观检查结果', content: '', isdisable: false },
    { header: '尺寸检查结果', content: '', isdisable: false },
    { header: '材质检查结果', content: '', isdisable: false },
    { header: '*C=0', content: '', isdisable: false },
    { header: '是否合格', content: '', isdisable: false },
    { header: '检验员', content: '', isdisable: true },
    // { header: '检验日期', content: '2023-06-19' },
    { header: '批准人', content: '', isdisable: true },
    { header: '备注', content: '' }
])
const reportFrom = ref({
    recipientDep: '',
    recipientPerson: '',
    incomeType: '',
    samplingQty: '',
    packagingCheck: '',
    appearanceCheck: '',
    dimensionCheck: '',
    materialCheck: '',
    isCarResult: '',
    isQualified: '',
    inspector: '',
    checkDate: '',
    checkNote: ''
})
const lookFormRef = ref();
const lookVisible = ref(false);
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.SchedulingStartDate = "";
            getForm.value.SchedulingEndDate = "";
            // getForm.value.PageNumber = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.SchedulingStartDate = newVal[0];
            getForm.value.SchedulingEndDate = newVal[1];
            // getForm.value.PageNumber = 1
        }
    }
);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const objectSpanMethod = (obj: any) => {
    const { row, column, rowIndex, columnIndex } = obj;
    if (columnIndex === 4) {
        // return [2,1];
        if (rowIndex % 3 === 0) {
            return {
                rowspan: 3,
                colspan: 1,
            }
        }
        else {
            return {
                rowspan: 0,
                colspan: 0,
            }
        }
    }
    if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
        if (rowIndex === 1) {
            return {
                rowspan: 2,  // 合并第2行和第3行
                colspan: 1,
            };
        } else if (rowIndex === 2) {
            return {
                rowspan: 0,  // 隐藏第3行的单元格
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

const handleEdit = (row: any) => {

    testVisible.value = true;
};

const handleLook = (row: any) => {

    lookVisible.value = true;
};
const handletestClose = () => {
    testVisible.value = false;
};
const handletestConfirm = () => {
    testVisible.value = false;
    console.log(tableData1.value);

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
const headerRowStyle = (row: any) => {
    console.log(row);

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