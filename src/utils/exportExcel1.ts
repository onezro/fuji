import { ref } from "vue";
import { ElNotification } from "element-plus";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

// 类型定义
interface ColumnConfig {
  label: string;
  property: string;
  align?: string;
}

// 类型定义扩展
interface FieldMapping {
  lineNos?: string;
  projectCategoryName?: string;
  projectName?: string;
  charaCteristicGrade?: string;
  targetValue?: string;
  maxValue?: string;
  minValue?: string;
  toolName?: string;
  inspectionBasis?: string;
  sampleNum?: string;
  defectNum?: string;
  measuredValue1?: string;
  measuredValue2?: string;
  measuredValue3?: string;
  measuredValue4?: string;
  measuredValue5?: string;
  measuredValue6?: string;
  measuredValue7?: string;
  measuredValue8?: string;
  measuredValue9?: string;
  measuredValue10?: string;
  observedValueSum?: string;
  averageNum?: string;
  inspectionResult?: string;
  resulthandLing?: string;
}

// 更新 ExportTableOptions 类型
interface ExportTableOptions {
  tableRef: {
    columns: ColumnConfig[];
  };
  fetchAllData: () => Promise<any[]>;
  fileName?: string;
  styles?: {
    cell?: Record<string, any>;
    headerFont?: Record<string, any>;
    headerBgColor?: string;
  };
  t: (key: string) => string;
  stringColumns?: string[] | { columns: string[]; prefix?: string };
  dataFormatter?: (data: any[], columns: ColumnConfig[]) => any[];
  exportAllColumns?: boolean;
  splitMeasurementColumns?: boolean;
  // 新增字段映射配置
  fieldMapping?: FieldMapping;
}

// 对齐方式映射
function mapAlignment(align?: string): "left" | "center" | "right" {
  const map: Record<string, "left" | "center" | "right"> = {
    left: "left",
    center: "center",
    right: "right",
    undefined: "left",
  };
  return map[align ?? "undefined"] ?? "left";
}

// 格式化单元格值为字符串
function formatCellAsString(value: any, prefix?: string): any {
  if (value === null || value === undefined) {
    return "";
  }

  // 如果是数字类型，转换为字符串
  if (typeof value === "number") {
    // 对于大数字，避免科学计数法
    const strValue = String(value);
    if (strValue.includes("e") || strValue.includes("E")) {
      // 科学计数法转换为普通字符串
      return prefix ? prefix + value.toString() : value.toString();
    }
    // 对于长数字（如身份证号、电话号码），添加前缀避免Excel自动转换
    if (value.toString().length > 10) {
      return prefix ? prefix + value.toString() : value.toString();
    }
  }

  // 其他类型直接返回，添加前缀
  return prefix ? prefix + String(value) : String(value);
}

// 处理测量值拆分
function processMeasurementData(data: any[]): {
  processedData: any[];
  measurementColumns: ColumnConfig[];
} {
  // 创建测量值列配置
  const measurementColumns: ColumnConfig[] = [];
  for (let i = 1; i <= 10; i++) {
    measurementColumns.push({
      label: `测量值${i}`,
      property: `MeasuredValue${i}`,
      align: "center",
    });
  }

  // 处理数据
  const processedData = data.map((item) => {
    const newItem = { ...item };

    // 如果原始数据中有 MeasuredValue 字段（合并的测量值），则拆分它
    if (item.MeasuredValue && typeof item.MeasuredValue === "string") {
      const values = item.MeasuredValue.split(/[\s,]+/).filter(Boolean);
      for (let i = 1; i <= 10; i++) {
        newItem[`MeasuredValue${i}`] = values[i - 1] || "";
      }
    }

    // 如果原始数据中已经有 MeasuredValue1 到 MeasuredValue10，则保留它们
    for (let i = 1; i <= 10; i++) {
      const key = `MeasuredValue${i}`;
      if (item[key] !== undefined && newItem[key] === undefined) {
        newItem[key] = item[key];
      }
    }

    return newItem;
  });

  return { processedData, measurementColumns };
}

// 导出函数（横向表格格式 - 保持原样）
export async function exportTableToExcel1(options: ExportTableOptions) {
  const {
    tableRef,
    fetchAllData,
    fileName = "export",
    styles = {},
    t,
    stringColumns,
    dataFormatter,
    exportAllColumns = false,
    splitMeasurementColumns = false, // 新增参数，默认为false
  } = options;

  try {
    // 1. 获取全部数据
    let allData = await fetchAllData();

    // 处理测量值拆分
    let measurementColumns: ColumnConfig[] = [];
    if (splitMeasurementColumns) {
      const result = processMeasurementData(allData);
      allData = result.processedData;
      measurementColumns = result.measurementColumns;
    }

    // 2. 过滤并处理表头
    let baseColumns = tableRef.columns
      .filter((col) => {
        if (exportAllColumns) {
          // 导出所有列
          return col.label !== undefined && col.property !== undefined;
        }
        // 过滤掉索引列和操作列
        return (
          col.label !== t("publicText.index") &&
          col.label !== t("publicText.operation") &&
          col.label !== undefined
        );
      })
      .map((col) => ({
        label: col.label,
        prop: col.property || "",
        align: col.align,
        // 检查是否为字符串列
        isStringColumn: Array.isArray(stringColumns)
          ? stringColumns.includes(col.property)
          : stringColumns?.columns?.includes(col.property) || false,
        // 获取前缀
        stringPrefix:
          stringColumns && !Array.isArray(stringColumns)
            ? stringColumns.prefix
            : undefined,
      }));

    // 如果启用了测量值拆分，则替换测量值列
    let columns = [...baseColumns];
    if (splitMeasurementColumns) {
      // 查找测量值列的索引
      const measurementIndex = columns.findIndex(
        (col) =>
          col.label.includes("测量值") ||
          col.prop === "MeasuredValue" ||
          col.label === "$t('incomeSheet.MeasurementNumber')",
      );

      if (measurementIndex !== -1) {
        // 移除原来的测量值列
        columns.splice(measurementIndex, 1);
        // 插入10个测量值列
        measurementColumns.forEach((measurementCol, index) => {
          columns.splice(measurementIndex + index, 0, {
            label: measurementCol.label,
            prop: measurementCol.property,
            align: measurementCol.align || "center",
            isStringColumn: Array.isArray(stringColumns)
              ? stringColumns.includes(measurementCol.property)
              : stringColumns?.columns?.includes(measurementCol.property) ||
                false,
            stringPrefix:
              stringColumns && !Array.isArray(stringColumns)
                ? stringColumns.prefix
                : undefined,
          });
        });
      }
    }

    // 3. 自定义数据处理
    if (dataFormatter && typeof dataFormatter === "function") {
      allData = dataFormatter(allData, tableRef.columns);
    }

    // 4. 创建 Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // 5. 添加表头
    const headerRow = columns.map((col) => col.label);
    worksheet.addRow(headerRow);

    // 6. 添加数据行
    allData.forEach((row) => {
      const rowData = columns.map((col) => {
        // 处理嵌套属性（如 user.name）
        let cellValue = col.prop.split(".").reduce((obj: any, key: any) => {
          if (obj && typeof obj === "object") return obj[key];
          return "";
        }, row);

        // 如果该列需要格式化为字符串
        if (col.isStringColumn) {
          cellValue = formatCellAsString(cellValue, col.stringPrefix);
        }

        return cellValue;
      });

      worksheet.addRow(rowData);
    });

    // 7. 自适应列宽并设置单元格格式
    worksheet.columns = columns.map((col, colIndex) => {
      const headerLength = col.label?.length || 0;
      let maxDataLength = 0;

      // 计算最大数据长度
      allData.forEach((row, rowIndex) => {
        const excelRowNumber = rowIndex + 2;
        const cell = worksheet.getRow(excelRowNumber).getCell(colIndex + 1);
        const cellValue = cell.value?.toString() || "";
        maxDataLength = Math.max(maxDataLength, cellValue.length);
      });

      // 基本样式
      const baseStyle = {
        alignment: {
          wrapText: true,
          horizontal: col.align ? mapAlignment(col.align) : "left",
        },
        ...(styles.cell || {}),
      };

      // 如果该列需要字符串格式，添加numFmt
      if (col.isStringColumn) {
        return {
          width: Math.max(headerLength, maxDataLength) + 6,
          style: {
            ...baseStyle,
            numFmt: "@", // Excel文本格式
          },
        };
      }

      return {
        width: Math.max(headerLength, maxDataLength) + 6,
        style: baseStyle,
      };
    });

    // 8. 应用表头样式
    worksheet.getRow(1).eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, ...(styles.headerFont || {}) },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: styles.headerBgColor || "FFD3D3D3" },
        },
      });
    });

    // 9. 对字符串列的数据行应用格式
    if (stringColumns) {
      const stringColumnIndices = columns
        .map((col, index) => (col.isStringColumn ? index + 1 : -1))
        .filter((index) => index !== -1);

      if (stringColumnIndices.length > 0) {
        // 从第2行开始（跳过表头）
        for (let rowNum = 2; rowNum <= allData.length + 1; rowNum++) {
          const row = worksheet.getRow(rowNum);
          stringColumnIndices.forEach((colIndex) => {
            const cell = row.getCell(colIndex);
            // 确保单元格格式为文本
            cell.numFmt = "@";
          });
        }
      }
    }

    // 10. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);

    return {
      success: true,
      fileName: `${fileName}.xlsx`,
      rowCount: allData.length,
    };
  } catch (error) {
    console.error("[Excel Export Error]", error);
    ElNotification.error({
      title: t("message.error"),
      message: t("message.exportFailure"),
    });
    throw new Error(t("message.exportFailure"));
  }
}

// 新增：为计量检验表定制的导出函数（横向格式）
export async function exportMeasureTableToExcel(options: ExportTableOptions) {
  return exportTableToExcel1({
    ...options,
    splitMeasurementColumns: true,
    stringColumns: options.stringColumns || [
      "MeasuredValue1",
      "MeasuredValue2",
      "MeasuredValue3",
      "MeasuredValue4",
      "MeasuredValue5",
      "MeasuredValue6",
      "MeasuredValue7",
      "MeasuredValue8",
      "MeasuredValue9",
      "MeasuredValue10",
    ],
  });
}

// 新增：纵向格式导出函数（根据新建 XLSX 工作表.xlsx格式）
export async function exportTableToExcelVertical(
  options: ExportTableOptions & {
    // 每个sheet显示一条记录
    perSheet?: boolean;
    // 指定要导出的字段顺序，如果不指定则使用tableRef.columns
    verticalFields?: Array<{ label: string; property: string }>;
  },
) {
  const {
    tableRef,
    fetchAllData,
    fileName = "export",
    styles = {},
    t,
    stringColumns,
    dataFormatter,
    splitMeasurementColumns = false,
    perSheet = false, // 是否每个sheet显示一条记录
    verticalFields, // 纵向字段配置
  } = options;

  try {
    // 1. 获取全部数据
    let allData = await fetchAllData();

    // 处理测量值拆分
    let measurementColumns: ColumnConfig[] = [];
    if (splitMeasurementColumns) {
      const result = processMeasurementData(allData);
      allData = result.processedData;
      measurementColumns = result.measurementColumns;
    }

    // 2. 自定义数据处理
    if (dataFormatter && typeof dataFormatter === "function") {
      allData = dataFormatter(allData, tableRef.columns);
    }

    // 3. 确定要导出的字段
    let exportFields = verticalFields;
    if (!exportFields) {
      // 如果没有指定verticalFields，则使用tableRef.columns
      exportFields = tableRef.columns
        .filter((col) => col.label !== undefined && col.property !== undefined)
        .map((col) => ({
          label: col.label,
          property: col.property,
        }));
    }

    // 如果启用了测量值拆分，则调整字段
    if (splitMeasurementColumns && measurementColumns.length > 0) {
      // 查找测量值字段的索引
      const measurementIndex = exportFields.findIndex(
        (field) =>
          field.label.includes("测量值") || field.property === "MeasuredValue",
      );

      if (measurementIndex !== -1) {
        // 移除原来的测量值字段
        exportFields.splice(measurementIndex, 1);
        // 插入10个测量值字段
        measurementColumns.forEach((measurementCol, index) => {
          exportFields!.splice(measurementIndex + index, 0, {
            label: measurementCol.label,
            property: measurementCol.property,
          });
        });
      }
    }

    // 4. 创建 Workbook
    const workbook = new ExcelJS.Workbook();

    if (perSheet && allData.length > 0) {
      // 每个sheet显示一条记录（保持原有逻辑不变）
      allData.forEach((record, index) => {
        const worksheet = workbook.addWorksheet(`记录${index + 1}`);

        // 添加数据行（纵向）
        exportFields!.forEach((field, rowIndex) => {
          const row = worksheet.addRow([field.label, ""]);

          // 获取单元格值
          let cellValue = field.property
            .split(".")
            .reduce((obj: any, key: any) => {
              if (obj && typeof obj === "object") return obj[key];
              return "";
            }, record);

          // 应用字符串格式处理
          const isStringColumn = Array.isArray(stringColumns)
            ? stringColumns.includes(field.property)
            : stringColumns?.columns?.includes(field.property) || false;

          if (isStringColumn) {
            cellValue = formatCellAsString(
              cellValue,
              stringColumns && !Array.isArray(stringColumns)
                ? stringColumns.prefix
                : undefined,
            );
          }

          // 设置值
          row.getCell(2).value = cellValue;

          // 设置样式
          const cell = row.getCell(1);
          Object.assign(cell, {
            font: { bold: true, ...(styles.headerFont || {}) },
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: styles.headerBgColor || "FFD3D3D3" },
            },
          });
        });

        // 设置列宽
        worksheet.columns = [{ width: 15 }, { width: 30 }];
      });
    } else {
      // === 修改部分开始：所有记录在一个sheet中，按照第一个Excel文件格式（横向排列记录） ===
      const worksheet = workbook.addWorksheet("Sheet1");

      // 构建表格数据：左边是标题列，右边是各条记录的数据列

      // 第一行：表头
      const headerRow = worksheet.addRow([
        "检验序列",
        ...allData.map((item, index) => item.LineNos),
      ]);

      // 设置表头样式
      headerRow.eachCell((cell, colNumber) => {
        Object.assign(cell, {
          font: { bold: true, ...(styles.headerFont || {}) },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: styles.headerBgColor || "FFD3D3D3" },
          },
        });
      });

      // 后续行：每个字段对应一行
      exportFields!.forEach((field, fieldIndex) => {
        // 如果是"检验序列"字段，跳过，因为已经在表头中显示了
        if (field.label === "检验序列") {
          return;
        }

        const rowData = [field.label];

        // 为每条记录获取该字段的值
        allData.forEach((record) => {
          // 获取单元格值
          let cellValue = field.property
            .split(".")
            .reduce((obj: any, key: any) => {
              if (obj && typeof obj === "object") return obj[key];
              return "";
            }, record);

          // 应用字符串格式处理
          const isStringColumn = Array.isArray(stringColumns)
            ? stringColumns.includes(field.property)
            : stringColumns?.columns?.includes(field.property) || false;

          if (isStringColumn) {
            cellValue = formatCellAsString(
              cellValue,
              stringColumns && !Array.isArray(stringColumns)
                ? stringColumns.prefix
                : undefined,
            );
          }

          rowData.push(cellValue);
        });

        const row = worksheet.addRow(rowData);

        // 设置标题列样式（第一列）
        const titleCell = row.getCell(1);
        Object.assign(titleCell, {
          font: { bold: true },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" },
          },
        });
      });

      // 设置列宽
      const columnWidths = [20]; // 第一列（标题列）的宽度
      for (let i = 0; i < allData.length; i++) {
        columnWidths.push(15); // 每条记录列的宽度
      }

      worksheet.columns = columnWidths.map((width) => ({ width }));
      // === 修改部分结束 ===
    }

    // 5. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);

    return {
      success: true,
      fileName: `${fileName}.xlsx`,
      rowCount: allData.length,
    };
  } catch (error) {
    console.error("[Excel Export Vertical Error]", error);
    ElNotification.error({
      title: t("message.error"),
      message: t("message.exportFailure"),
    });
    throw new Error(t("message.exportFailure"));
  }
}

// 新增：专门用于计量检验表的纵向导出函数
export async function exportMeasureTableToExcelVertical(
  options: ExportTableOptions & {
    perSheet?: boolean;
  },
) {
  // 默认字段映射（第一种情况）
  const defaultFieldMapping: FieldMapping = {
    lineNos: "LineNos",
    projectCategoryName: "ProjectCategoryName",
    projectName: "ProjectName",
    charaCteristicGrade: "CharaCteristicGrade",
    targetValue: "TargetValue",
    maxValue: "MaxValue",
    minValue: "MinValue",
    toolName: "ToolName",
    inspectionBasis: "InspectionBasis",
    sampleNum: "SampleNum",
    defectNum: "DefectNum",
    measuredValue1: "MeasuredValue1",
    measuredValue2: "MeasuredValue2",
    measuredValue3: "MeasuredValue3",
    measuredValue4: "MeasuredValue4",
    measuredValue5: "MeasuredValue5",
    measuredValue6: "MeasuredValue6",
    measuredValue7: "MeasuredValue7",
    measuredValue8: "MeasuredValue8",
    measuredValue9: "MeasuredValue9",
    measuredValue10: "MeasuredValue10",
    observedValueSum: "ObservedValueSum",
    averageNum: "AverageNum",
    inspectionResult: "InspectionResult",
    resulthandLing: "ResulthandLing",
  };

  // 合并用户自定义字段映射
  const fieldMapping = { ...defaultFieldMapping, ...options.fieldMapping };

  // 基于字段映射生成 verticalFields
  const measureVerticalFields = [
    { label: "检验序列", property: fieldMapping.lineNos! },
    { label: "检验类别", property: fieldMapping.projectCategoryName! },
    { label: "检验名称", property: fieldMapping.projectName! },
    { label: "特性分级", property: fieldMapping.charaCteristicGrade! },
    { label: "目标值", property: fieldMapping.targetValue! },
    { label: "最大值", property: fieldMapping.maxValue! },
    { label: "最小值", property: fieldMapping.minValue! },
    { label: "检验工具", property: fieldMapping.toolName! },
    { label: "检验依据", property: fieldMapping.inspectionBasis! },
    { label: "样品数", property: fieldMapping.sampleNum! },
    { label: "缺陷数", property: fieldMapping.defectNum! },
    { label: "测量值1", property: fieldMapping.measuredValue1! },
    { label: "测量值2", property: fieldMapping.measuredValue2! },
    { label: "测量值3", property: fieldMapping.measuredValue3! },
    { label: "测量值4", property: fieldMapping.measuredValue4! },
    { label: "测量值5", property: fieldMapping.measuredValue5! },
    { label: "测量值6", property: fieldMapping.measuredValue6! },
    { label: "测量值7", property: fieldMapping.measuredValue7! },
    { label: "测量值8", property: fieldMapping.measuredValue8! },
    { label: "测量值9", property: fieldMapping.measuredValue9! },
    { label: "测量值10", property: fieldMapping.measuredValue10! },
    { label: "总和", property: fieldMapping.observedValueSum! },
    { label: "平均数", property: fieldMapping.averageNum! },
    { label: "结果", property: fieldMapping.inspectionResult! },
    { label: "不良处理结果", property: fieldMapping.resulthandLing! },
  ];

  // 根据字段映射生成 stringColumns
  const stringColumns = [
    fieldMapping.measuredValue1,
    fieldMapping.measuredValue2,
    fieldMapping.measuredValue3,
    fieldMapping.measuredValue4,
    fieldMapping.measuredValue5,
    fieldMapping.measuredValue6,
    fieldMapping.measuredValue7,
    fieldMapping.measuredValue8,
    fieldMapping.measuredValue9,
    fieldMapping.measuredValue10,
  ].filter(Boolean) as string[];

  return exportTableToExcelVertical({
    ...options,
    splitMeasurementColumns: false,
    verticalFields: measureVerticalFields,
    stringColumns: options.stringColumns || stringColumns,
    perSheet: options.perSheet || false,
  });
}

// 导出为CSV格式（如果需要）
export async function exportTableToCSV(
  options: Omit<ExportTableOptions, "styles">,
) {
  const {
    tableRef,
    fetchAllData,
    fileName = "export",
    t,
    stringColumns,
  } = options;

  try {
    // 获取数据
    const allData = await fetchAllData();

    // 处理列
    const columns = tableRef.columns
      .filter(
        (col) =>
          col.label !== t("publicText.index") &&
          col.label !== t("publicText.operation") &&
          col.label !== undefined,
      )
      .map((col) => ({
        label: col.label,
        prop: col.property || "",
      }));

    // 构建CSV内容
    let csvContent = "";

    // 添加表头
    csvContent += columns.map((col) => `"${col.label}"`).join(",") + "\n";

    // 添加数据行
    allData.forEach((row) => {
      const rowData = columns.map((col) => {
        let value = col.prop.split(".").reduce((obj: any, key: any) => {
          if (obj && typeof obj === "object") return obj[key];
          return "";
        }, row);

        // 处理特殊字符
        if (typeof value === "string") {
          // 转义双引号
          value = value.replace(/"/g, '""');
        }

        // 字符串列处理
        const isStringColumn = Array.isArray(stringColumns)
          ? stringColumns.includes(col.prop)
          : stringColumns?.columns?.includes(col.prop) || false;

        if (isStringColumn && typeof value === "number") {
          // 对于数字类型的字符串列，添加单引号前缀
          value = "'" + value;
        }

        return `"${value}"`;
      });

      csvContent += rowData.join(",") + "\n";
    });

    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${fileName}_${new Date().getTime()}.csv`);

    return {
      success: true,
      fileName: `${fileName}.csv`,
      rowCount: allData.length,
    };
  } catch (error) {
    console.error("[CSV Export Error]", error);
    throw error;
  }
}
