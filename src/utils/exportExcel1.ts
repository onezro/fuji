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

// 在 exportExcel1.ts 文件末尾添加以下函数

/**
 * 特殊格式导出 - 计量检验表纵向格式（按照模板格式）
 * 模板格式：第一行是"检验名称"，下面是各检验项目的名称
 * 每个检验项目一列，每个LineNos一行检验序列值
 */
export async function exportInspectionToExcelVertical(
  options: ExportTableOptions & {
    // 字段映射配置
    fieldMapping?: FieldMapping;
    // 最大检验序列数
    maxLineNosCount?: number;
  },
) {
  const {
    fetchAllData,
    fileName = "export",
    styles = {},
    t,
    dataFormatter,
    maxLineNosCount = 10, // 默认最多10个检验序列
    fieldMapping,
  } = options;

  try {
    // 1. 获取全部数据
    let allData = await fetchAllData();

    // 2. 自定义数据处理
    if (dataFormatter && typeof dataFormatter === "function") {
      allData = dataFormatter(allData, []);
    }

    // 3. 创建 Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // 4. 获取所有唯一的 ProjectName（检验项目），并保持原有顺序
    const projectNameMap = new Map<string, {
      name: string;
      order: number;
    }>();
    
    allData.forEach((item, index) => {
      if (item.ProjectName) {
        const projectName = item.ProjectName.toString();
        if (!projectNameMap.has(projectName)) {
          projectNameMap.set(projectName, {
            name: projectName,
            order: projectNameMap.size
          });
        }
      }
    });
    
    // 转换为数组并保持顺序
    const projectNames = Array.from(projectNameMap.values())
      .sort((a, b) => a.order - b.order)
      .map(item => item.name);

    // 5. 获取所有唯一的 LineNos（检验序列号）
    const lineNosSet = new Set<string>();
    allData.forEach(item => {
      if (item.LineNos) {
        lineNosSet.add(item.LineNos.toString());
      }
    });
    const lineNosList = Array.from(lineNosSet)
      .sort((a, b) => parseInt(a) - parseInt(b))
      // .slice(0, maxLineNosCount);//最大值

    // 6. 构建表头行（第一行："检验名称"）
    const headerRow = ["检验名称"]; // 第一列是标题"检验名称"
    
    // 添加每个检验项目的名称
    projectNames.forEach(projectName => {
      headerRow.push(projectName);
    });
    
    worksheet.addRow(headerRow);

    // 设置第一行样式
    const firstRow = worksheet.getRow(1);
    firstRow.eachCell((cell, colNumber) => {
      Object.assign(cell, {
        font: { bold: true, ...(styles.headerFont || {}) },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: styles.headerBgColor || "FFD3D3D3" },
        },
      });
    });

    // 7. 构建其他固定数据行
    
    // 检验类别行
    addFieldRowWithTitle(worksheet, "检验类别", projectNames, allData, "ProjectCategoryName", fieldMapping?.projectCategoryName);
    
    // 特性分级行
    addFieldRowWithTitle(worksheet, "特性分级", projectNames, allData, "CharaCteristicGrade", fieldMapping?.charaCteristicGrade);
    
    // 目标值行
    addFieldRowWithTitle(worksheet, "目标值", projectNames, allData, "TargetValue", fieldMapping?.targetValue);
    
    // 最大值行
    addFieldRowWithTitle(worksheet, "最大值", projectNames, allData, "MaxValue", fieldMapping?.maxValue);
    
    // 最小值行
    addFieldRowWithTitle(worksheet, "最小值", projectNames, allData, "MinValue", fieldMapping?.minValue);
    
    // 检验工具行
    addFieldRowWithTitle(worksheet, "检验工具", projectNames, allData, "ToolName", fieldMapping?.toolName);
    
    // 检验依据行
    addFieldRowWithTitle(worksheet, "检验依据", projectNames, allData, "InspectionBasis", fieldMapping?.inspectionBasis);
    
    // 样品数行
    addFieldRowWithTitle(worksheet, "样品数", projectNames, allData, "SampleNum", fieldMapping?.sampleNum);
    
    // 缺陷数行
    addFieldRowWithTitle(worksheet, "缺陷数", projectNames, allData, "DefectNum", fieldMapping?.defectNum);

    // 8. 添加检验序列值行（根据 LineNos 的数量动态生成）
    lineNosList.forEach(lineNo => {
      const rowTitle = `检验序列${lineNo}值`;
      const rowData = [rowTitle]; // 第一列是行标题
      
      projectNames.forEach(projectName => {
        // 查找对应 ProjectName 和 LineNos 的数据
        const item = allData.find(data => {
          const dataProjectName = data.ProjectName?.toString();
          const dataLineNos = data.LineNos?.toString();
          return dataProjectName === projectName && dataLineNos === lineNo;
        });
        
        let cellValue = "";
        if (item) {
          // 使用字段映射或默认字段
          const observedValueKey = fieldMapping?.measuredValue1 
            ? fieldMapping.measuredValue1.replace(/MeasuredValue\d+/, "ObservedValue")
            : "ObservedValue";
          
          cellValue = item[observedValueKey] || item.ObservedValue || "";
        }
        
        rowData.push(cellValue);
      });
      
      const row = worksheet.addRow(rowData);
      
      // 设置行标题样式（第一列）
      const titleCell = row.getCell(1);
      Object.assign(titleCell, {
        font: { bold: true, italic: true },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8F8F8" },
        },
      });
    });

    // 9. 如果实际 LineNos 数量不足 maxLineNosCount，补全空行
    // for (let i = lineNosList.length; i < maxLineNosCount; i++) {
    //   const rowTitle = `检验序列${i + 1}值`;
    //   const rowData = [rowTitle];
      
    //   // 填充空数据
    //   for (let j = 0; j < projectNames.length; j++) {
    //     rowData.push("");
    //   }
      
    //   const row = worksheet.addRow(rowData);
      
    //   // 设置行标题样式（第一列）
    //   const titleCell = row.getCell(1);
    //   Object.assign(titleCell, {
    //     font: { bold: true, italic: true },
    //     fill: {
    //       type: "pattern",
    //       pattern: "solid",
    //       fgColor: { argb: "FFF8F8F8" },
    //     },
    //   });
    // }

    // 10. 设置列宽
    const columnWidths = [15]; // 第一列（行标题列）的宽度
    for (let i = 0; i < projectNames.length; i++) {
      // 根据项目名称长度调整列宽
      const projectNameLength = projectNames[i]?.length || 10;
      columnWidths.push(Math.max(15, projectNameLength + 2));
    }
    
    worksheet.columns = columnWidths.map((width) => ({ width }));

    // 11. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);
    
    return {
      success: true,
      fileName: `${fileName}.xlsx`,
      rowCount: allData.length,
      projectCount: projectNames.length,
      lineNosCount: lineNosList.length,
    };
  } catch (error) {
    console.error("[Excel Inspection Export Vertical Error]", error);
    ElNotification.error({
      title: t("message.error"),
      message: t("message.exportFailure"),
    });
    throw new Error(t("message.exportFailure"));
  }
}

/**
 * 添加带标题的字段行到工作表
 */
function addFieldRowWithTitle(
  worksheet: ExcelJS.Worksheet,
  rowTitle: string,
  projectNames: string[],
  allData: any[],
  fieldKey: string,
  mappedKey?: string
) {
  const rowData = [rowTitle]; // 第一列为行标题
  
  projectNames.forEach(projectName => {
    // 查找对应 ProjectName 的数据（取第一条）
    const item = allData.find(data => {
      const dataProjectName = data.ProjectName?.toString();
      return dataProjectName === projectName;
    });
    
    let cellValue: any = "";
    if (item) {
      // 使用映射的key或原始key
      const actualKey = mappedKey || fieldKey;
      cellValue = item[actualKey] ?? "";
      
      // 特殊处理：样品数和缺陷数可能是数字
      if (fieldKey === "SampleNum" || fieldKey === "DefectNum") {
        if (typeof cellValue === "number") {
          cellValue = String(cellValue);
        }
      }
      
      // 处理 null 或 undefined
      if (cellValue === null || cellValue === undefined) {
        cellValue = "";
      }
    }
    
    rowData.push(cellValue);
  });
  
  const row = worksheet.addRow(rowData);
  
  // 设置行标题样式（第一列）
  const titleCell = row.getCell(1);
  Object.assign(titleCell, {
    font: { bold: true },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF2F2F2" },
    },
  });
}

/**
 * 简化的计量检验表导出函数（使用默认配置）
 */
export async function exportMeasureInspectionToExcel(
  options: ExportTableOptions & {
    maxLineNosCount?: number;
  },
) {
  // 默认字段映射
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
    measuredValue1: "ObservedValue",
  };

  return exportInspectionToExcelVertical({
    ...options,
    fieldMapping: { ...defaultFieldMapping, ...options.fieldMapping },
    maxLineNosCount: options.maxLineNosCount || 10,
  });
}

/**
 * 根据实际数据智能导出的函数
 */
export async function exportInspectionDataToExcel(
  options: {
    data: any[]; // 直接传入数据
    fileName?: string;
    t: (key: string) => string;
    fieldMapping?: FieldMapping;
    maxLineNosCount?: number;
  }
) {
  const {
    data,
    fileName = "计量检验表",
    t,
    fieldMapping,
    maxLineNosCount = 10,
  } = options;

  // 创建一个虚拟的 ExportTableOptions
  const exportOptions: ExportTableOptions & { 
    fieldMapping?: FieldMapping; 
    maxLineNosCount?: number;
  } = {
    tableRef: { columns: [] },
    fetchAllData: async () => data,
    fileName,
    t,
    fieldMapping,
    maxLineNosCount,
  };

  return exportInspectionToExcelVertical(exportOptions);
}