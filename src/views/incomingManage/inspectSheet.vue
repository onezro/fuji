<template>
    <div class="p-2">

        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('incomeSheet.creatInspect')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.creatInspect" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item :label="$t('incomeSheet.NotifyDate')" class="mb-2"><el-date-picker :shortcuts="shortcuts"
                        v-model="searchDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-" size="small"
                        style="width: 200px" :clearable="false" />
                </el-form-item>
                <el-form-item :label="$t('incomeSheet.Status')" class="mb-2">
                    <el-select v-model="getForm.Status" placeholder="" style="width: 200px">
                        <el-option :label="t('incomeSheet.status1')" :value="t('incomeSheet.status1')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status2')" :value="t('incomeSheet.status2')">
                        </el-option>
                        <el-option :label="t('incomeSheet.status3')" :value="t('incomeSheet.status3')">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('incomeSheet.modelRules')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.modelRules" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="'Lot No'" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.lotNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="'T-Code'" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.tCode" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('incomeSheet.isCarProduct')" class="mb-2">
                    <el-select v-model="getForm.isCarProduct" placeholder="" style="width: 200px">
                        <el-option :label="$t('publicText.is')" :value="true">
                        </el-option>
                        <el-option :label="$t('publicText.no')" :value="false">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small">
                        {{ $t("publicText.reset") }}
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
                <el-table-column prop="creatInspect" :label="$t('incomeSheet.creatInspect')" />
                <el-table-column prop="NotifyDate" :label="$t('incomeSheet.NotifyDate')" />
                <el-table-column prop="NotifyPerson" :label="$t('incomeSheet.NotifyPerson')" />
                <el-table-column prop="NotifyDepartment" :label="$t('incomeSheet.NotifyDepartment')" />
                <el-table-column prop="incomeDate" :label="$t('incomeSheet.incomeDate')" />
                <el-table-column prop="isCarProduct" :label="$t('incomeSheet.isCarProduct')" />
                <el-table-column prop="modelRules" :label="$t('incomeSheet.modelRules')" />
                <el-table-column prop="lotno" label="Lot No" />
                <el-table-column prop="tCode" label="T-Code" />
                <el-table-column prop="InspectStandard" :label="$t('incomeSheet.InspectStandard')" />
                <el-table-column prop="Status" :label="$t('incomeSheet.Status')" />
                <el-table-column prop="creatDate" :label="$t('incomeSheet.creatDate')" />
                <el-table-column prop="result" :label="$t('incomeSheet.result')" />
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
        <el-dialog v-model="lookVisible" :title="$t('incomeSheet.incomeReport')" width="850px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleLookClose">
            <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
            <div class="container">

                <div class="info-row">
                    <!-- <div class="info-box">
                        <div class="info-box-title">通知日期</div>
                        <div>25.06.19</div>
                    </div> -->
                    <div class="info-box">
                        <div class="info-box-title">进料检验通知部门</div>
                        <div>事务部</div>
                    </div>
                    <div class="info-box">
                        <div class="info-box-title">受理部门</div>
                        <div>{{ reportFrom.recipientDep }}</div>
                    </div>
                    <div class="info-box">
                        <div class="info-box-title">通知日期</div>
                        <div>25.06.19</div>
                    </div>
                </div>

                <div class="info-row">
                    <div class="info-box">
                        <div class="info-box-title">通知人签名</div>
                        <div>周丽琛</div>
                    </div>
                    <div class="info-box">
                        <div class="info-box-title">受理人签名</div>
                        <div>{{ reportFrom.recipientPerson }}</div>
                    </div>
                    <div class="info-box">
                        <div class="info-box-title">页次</div>
                        <div>1</div>
                    </div>
                </div>

                <div class="info-row">
                    <div class="info-box">
                        <div class="info-box-title">来料日期</div>
                        <div>251014</div>
                    </div>
                    <div class="info-box">
                        <div class="info-box-title">受理日期</div>
                        <div>{{ reportFrom.checkDate }}</div>
                    </div>
                    <div class="info-box">
                        <div class="info-box-title">来料种类数</div>
                        <div>{{ reportFrom.incomeType }}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-box">
                        <div class="info-box-title">检验</div>
                        <div>外观检査 AQL Level II 1.0 IS0 2859 *(汽车产品 C=0)</div>
                    </div>

                </div>

                <div class="table-container">
                    <el-table :data="tableData1" border style="width: 100%" size="small"
                        :header-row-class-name="() => 'header-row'" :show-header="false">
                        <!-- 第一列：表头 -->
                        <el-table-column width="200" align="right">
                            <template #default="scope">
                                <div class="header-cell">{{ scope.row.header }}</div>
                            </template>
                        </el-table-column>

                        <!-- 第二列：内容 -->
                        <el-table-column>
                            <template #default="scope">
                                <el-input v-model="scope.row.content" placeholder="" :disabled="scope.row.isdisable"
                                    style="width: 250px;" />
                                <!-- <div class="content-cell">{{ scope.row.isdisable }}</div> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleLookClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleLookConfirm"> {{ $t('publicText.confirm') }} </el-button>
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
    creatInspect: "",
    NotifyDate: "",
    modelRules: "",
    lotNo: '',
    tCode: '',
    isCarProduct: true,
    Status: "",
    SchedulingStartDate: "",
    SchedulingEndDate: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([
    {
        creatInspect: "INSPECT20230601001",
        NotifyDate: "2023-06-01",
        NotifyPerson: "John Doe",
        NotifyDepartment: "Quality Control",
        incomeDate: "2023-06-02",
        isCarProduct: "Yes",
        modelRules: "Model X - Rule A",
        lotno: "LOT12345",
        tCode: "T001",
        InspectStandard: "Standard A",
        Status: "Pending",
        creatDate: "2023-06-01",
        result: "不合格"
    },
    {
        creatInspect: "INSPECT20230601002",
        NotifyDate: "2023-06-01",
        NotifyPerson: "Jane Smith",
        NotifyDepartment: "Quality Control",
        incomeDate: "2023-06-03",
        isCarProduct: "No",
        modelRules: "Model Y - Rule B",
        lotno: "LOT67890",
        tCode: "T002",
        InspectStandard: "Standard B",
        Status: "Completed",
        creatDate: "2023-06-01",
        result: "合格"
    }
]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const lookVisible = ref(false);
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

    lookVisible.value = true;
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('publicText.confirm') + t('publicText.delete'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {

    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('message.tipTitle'),
            message: t('publicText.cancel'),
            type: "info",
        });
    });
};
const handleLookClose = () => {
    lookVisible.value = false;
};
const handleLookConfirm = () => {
    lookVisible.value = false;
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
        tableHeight.value = window.innerHeight - 210;

    });
};
const headerRowStyle = (row: any) => {
    console.log(row);

};
const exportToExcel = async () => {
    try {
        // 创建工作簿
        const workbook = new ExcelJS.Workbook();
        workbook.creator = '进料检验系统';
        workbook.created = new Date();

        // 添加工作表
        const worksheet = workbook.addWorksheet('进料检验报告');

        // 设置默认字体（Worksheet 无 font 属性，使用单元格样式设置字体）

        // 定义通用样式
        const borderStyle: Partial<ExcelJS.Borders> = {
            top: { style: 'thin' as ExcelJS.BorderStyle },
            left: { style: 'thin' as ExcelJS.BorderStyle },
            bottom: { style: 'thin' as ExcelJS.BorderStyle },
            right: { style: 'thin' as ExcelJS.BorderStyle }
        };

        const headerCellStyle = {
            font: { bold: true, name: 'Microsoft YaHei' },
            alignment: {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            },
            border: borderStyle,
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F9FF' }
            }
        } as Partial<ExcelJS.Style>;

        const contentCellStyle = {
            alignment: {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            },
            border: borderStyle
        } as Partial<ExcelJS.Style>;

        // 添加标题行
        const titleRow = worksheet.addRow(['进料检验报告']);
        titleRow.font = { bold: true, size: 16, name: 'Microsoft YaHei' };
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells('A1:S1');
        titleRow.height = 30;

        // 第一行信息
        worksheet.addRow([
            '进料检验通知部门', '', '事务部', '受理部门', '自动线物料部品科.质量部', '',
            '外观检查 AQL Level II 1.0 *汽车产品 (C=0)', '', '', '页次', '', '1/1', '备注', '', '', '', '', ''
        ]);
        // 合并单元格
        worksheet.mergeCells('A2:B2');
        worksheet.mergeCells('E2:F2');
        worksheet.mergeCells('J2:K2');
        worksheet.mergeCells('M2:S2');

        // 第三行信息
        worksheet.addRow([
            '通知人签名', '', '周丽琛', '受理人签名', '自动线当麻林 检查长', '', '', '', '', '来料种类数', '', '11', '测试备注', '', '', '', '', ''
        ]);
        worksheet.mergeCells('A3:B3');
        worksheet.mergeCells('E3:F3');
        worksheet.addRow([
            '来料日期', '', '251002', '受理日期', '251105', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ]);
        worksheet.mergeCells('A4:B4');
        worksheet.mergeCells('E4:F4');
        // 外观检查 AQL Level II 1.0 *汽车产品 (C=0) 纵向合并 G2:I4
        worksheet.mergeCells('G2:I4');
        worksheet.mergeCells('J3:K4');
        worksheet.mergeCells('L3:L4');
        worksheet.mergeCells('M3:S4');
        // 设置前行样式
        for (let row = 2; row <= 4; row++) {
            worksheet.getRow(row).eachCell((cell, col) => {
                cell.style = contentCellStyle;
                // 标题单元格加粗
                if ((row === 2 && [1, 3, 5, 7, 9, 12].includes(col)) ||
                    (row === 4 && [1, 3, 5].includes(col)) ||
                    (row === 5 && [1, 3, 5].includes(col))) {
                    cell.font = { bold: true };
                }
            });
            worksheet.getRow(row).height = 25;
        }

        // 表格标题行
        const tableHeader = [
            '*汽车产品 (是/否)', '材料名称', '型号规格', '供应商', '订单号', 'Lot No',
            '来料数量/箱', '抽检箱数', '包装', '外观', '规格', '特性1', '特性2', '特性...',
            '*C=0 (是/否)', '判定', '检验员', '批准', 'T-Code'
        ];
        const headerRow = worksheet.addRow(tableHeader);
        headerRow.eachCell(cell => {
            cell.style = headerCellStyle;
        });
        headerRow.height = 30;

        // 添加数据行
        tableData1.value.forEach(data => {
            const rowData = [
                data.autoProduct, data.materialName, data.spec, data.supplier,
                data.orderNo, data.lotNo, data.quantity, data.sampleBoxes,
                data.packaging, data.appearance, data.specification, data.feature1,
                data.feature2, data.otherFeatures, data.cZero, data.judgment,
                data.inspector, data.approver, data.tcode
            ];

            const row = worksheet.addRow(rowData);
            row.eachCell(cell => {
                cell.style = contentCellStyle;
            });
            row.height = 25;
        });

        // 设置列宽
        const columnWidths = [
            10, 10, 10, 10, 10, 10, 12, 20, 8, 8, 8, 8, 8, 8, 12, 12, 12, 15, 10
        ];
        worksheet.columns.forEach((col, index) => {
            col.width = columnWidths[index];
        });

        // 生成Excel文件并下载
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const date = new Date();
        const fileName = `进料检验报告_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.xlsx`;
        saveAs(blob, fileName);

        ElMessage.success('导出成功！');
    } catch (error) {
        console.error('导出Excel时出错:', error);
        ElMessage.error('导出失败，请重试');
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