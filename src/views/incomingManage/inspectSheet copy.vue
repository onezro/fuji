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
        <el-dialog v-model="lookVisible" :title="$t('incomeSheet.incomeReport')" width="80%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleLookClose">
            <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
            <el-table :data="tableData1" border style="width: 100%" size="small"
                :header-row-class-name="() => 'header-row'" :height="160" :span-method="objectSpanMethod">
                <!-- 进料检验报告列组 -->
                <el-table-column label="进料检验报告" align="center">
                    <el-table-column prop="header1" :label="' '" />
                    <el-table-column prop="department" :label="' '" />
                    <el-table-column prop="header2" :label="' '" />
                    <el-table-column prop="accdepartment" :label="' '" />
                    <el-table-column prop="content" :label="' '" />
                    <el-table-column prop="header3" :label="' '" />
                    <el-table-column prop="paper" :label="' '" />
                </el-table-column>

                <!-- 通知日期列 -->
                <el-table-column label="通知日期 25.11.03" align="center" width="500">
                    <template #default="{ $index }">
                        <span>{{ `备注${$index}` }}</span>
                    </template>
                </el-table-column>

            </el-table>
            <el-table :data="tableData2" border style="width: 100%" size="small"
                :header-row-class-name="() => 'header-row'" :height="300" >
                <el-table-column prop="isCar" label="是否汽车产品" width="100" align="center" />
                <el-table-column prop="materialName" label="材料名称" width="120" align="center" />
                <el-table-column prop="modelRules" label="型号规格" width="120" align="center" />
                <el-table-column prop="supplier" label="供应商" width="150" align="center" />
                <el-table-column prop="orderNumber" label="订单号" width="120" align="center" />
                <el-table-column prop="lotNo" label="批号(Lot No)" width="120" align="center" />
                <el-table-column prop="qtyIncomeMaterial" label="来料数量" width="100" align="center" />
                <el-table-column prop="clNumber" label="抽检数量" width="100" align="center" />

                <!-- 检验列组 -->
                <el-table-column label="检验" align="center">
                    <el-table-column prop="appearance" label="外观" width="80" align="center" />
                    <el-table-column prop="dimension" label="尺寸" width="80" align="center" />
                    <el-table-column prop="specification" label="规格" width="80" align="center" />
                    <el-table-column prop="characteristic" label="特性" width="80" align="center" />
                </el-table-column>

                <!-- 判断列组 -->
                <el-table-column label="判断" align="center">
                    <el-table-column prop="cZero" label="*c=0" width="80" align="center" />
                    <el-table-column prop="result" label="是否合格" width="100" align="center" />
                </el-table-column>

                <el-table-column prop="inspector" label="检验员" width="100" align="center" />
                <el-table-column prop="approval" label="批准" width="100" align="center" />
                <el-table-column prop="tCode" label="T-Code" width="100" align="center" />
            </el-table>

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
import { ElNotification, ElMessageBox } from "element-plus";
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
const tableData1 = ref([
    {
        header1: "进料检验通知部门",
        department: "品质管理部",
        header2: "受理部门",
        accdepartment: "生产部",
        content: "外观检查 AQL Level IT 1.0",
        header3: "页数",
        paper: "1/1"
    },
    {
        header1: "通知人签名",
        department: "周丽琛",
        header2: "受理人签名",
        accdepartment: "生产部",
        content: "外观检查 AQL Level IT 1.0",
        header3: "来料种类数",
        paper: "ADRS"
    },
    {
        header1: "来料日期",
        department: "251003",
        header2: "受理日期",
        accdepartment: "251103",
        content: "外观检查 AQL Level IT 1.0",
        header3: "来料种类数",
        paper: "ADRS"
    },
])
const tableData2 = ref([
    {
        isCar: "是",
        materialName: "钢材",
        modelRules: "G-100",
        supplier: "供应商A",
        orderNumber: "ORD123456",
        lotNo: "LOT12345",
        qtyIncomeMaterial: 1000,
        clNumber: 50,
        appearance: "合格",
        dimension: "合格",
        specification: "合格",
        characteristic: "合格",
        cZero: "*c=0",
        result: "合格",
        inspector: "检验员A",
        approval: "批准A",
        tCode: "T001"
    },
    {
        isCar: "否",
        materialName: "塑料",
        modelRules: "P-200",
        supplier: "供应商B",
        orderNumber: "ORD654321",
        lotNo: "LOT67890",
        qtyIncomeMaterial: 500,
        clNumber: 25,
        appearance: "合格",
        dimension: "不合格",
        specification: "合格",
        characteristic: "合格",
        cZero: "*c=0",
        result: "不合格",
        inspector: "检验员B",
        approval: "批准B",
        tCode: "T002"
    }
])
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
  const workbook = new ExcelJS.Workbook();
  
  // 创建工作表
  const worksheet = workbook.addWorksheet('进料检验报告');
  
// 定义样式
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  } as Partial<ExcelJS.Style>;

  const cellStyle = {
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  } as Partial<ExcelJS.Style>;

  let currentRow = 1;

  // 第一个表格的标题
  const table1Title = '进料检验报告';
  worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
  const titleCell = worksheet.getCell(`A${currentRow}`);
  titleCell.value = table1Title;
  const titleStyle: Partial<ExcelJS.Style> = {
    ...(headerStyle as Partial<ExcelJS.Style>),
    font: { ...((headerStyle.font as any) || {}), size: 14 }
  };
  titleCell.style = titleStyle as ExcelJS.Style;
  currentRow++;

  // 第一个表格的表头
  const table1Headers = ['', '', '', '', '', '', '', '通知日期 25.11.03'];
  worksheet.getRow(currentRow).values = table1Headers;
  worksheet.getRow(currentRow).eachCell((cell) => {
    cell.style = headerStyle;
  });
  currentRow++;

  // 第一个表格的数据
  tableData1.value.forEach((row) => {
    const rowData = [
      row.header1,
      row.department,
      row.header2,
      row.accdepartment,
      row.content,
      row.header3,
      row.paper,
      `备注${currentRow - 3}`
    ];
    worksheet.getRow(currentRow).values = rowData;
    worksheet.getRow(currentRow).eachCell((cell) => {
      cell.style = cellStyle;
    });
    currentRow++;
  });

  // 添加空行分隔两个表格
  currentRow += 2;

  // 第二个表格的标题
  const table2Title = '检验详情';
  worksheet.mergeCells(`A${currentRow}:S${currentRow}`);
  const titleCell2 = worksheet.getCell(`A${currentRow}`);
  titleCell2.value = table2Title;
  titleCell2.style = {
    ...headerStyle,
    font: { ...headerStyle.font, size: 14 }
  };
  currentRow++;

  // 第二个表格的表头
  const table2Headers = [
    '是否汽车产品', '材料名称', '型号规格', '供应商', '订单号', '批号(Lot No)', 
    '来料数量', '抽检数量', '外观', '尺寸', '规格', '特性', '*c=0', '是否合格', 
    '检验员', '批准', 'T-Code'
  ];
  
  // 主表头
  worksheet.getRow(currentRow).values = table2Headers;
  worksheet.getRow(currentRow).eachCell((cell) => {
    cell.style = headerStyle;
  });
  currentRow++;

  // 第二个表格的数据
  tableData2.value.forEach((row) => {
    const rowData = [
      row.isCar,
      row.materialName,
      row.modelRules,
      row.supplier,
      row.orderNumber,
      row.lotNo,
      row.qtyIncomeMaterial,
      row.clNumber,
      row.appearance,
      row.dimension,
      row.specification,
      row.characteristic,
      row.cZero,
      row.result,
      row.inspector,
      row.approval,
      row.tCode
    ];
    worksheet.getRow(currentRow).values = rowData;
    worksheet.getRow(currentRow).eachCell((cell) => {
      cell.style = cellStyle;
    });
    currentRow++;
  });

  // 设置列宽
  worksheet.columns = [
    { width: 10 }, { width: 12 }, { width: 12 }, { width: 15 }, 
    { width: 12 }, { width: 15 }, { width: 10 }, { width: 10 },
    { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 },
    { width: 8 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }
  ];

  // 合并第一个表格的表头单元格（模拟嵌套表头）
  worksheet.mergeCells(`A2:G2`);
  const mergedHeader = worksheet.getCell('A2');
  mergedHeader.value = '进料检验报告';
  mergedHeader.style = headerStyle;

  // 生成Excel文件
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, '进料检验报告.xlsx');
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

<style lang="scss" scoped></style>