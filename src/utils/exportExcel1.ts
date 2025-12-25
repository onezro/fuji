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
  // 新增参数：指定哪些列的值为字符串格式（避免科学计数法等问题）
  stringColumns?:
    | string[]
    | {
        // 列属性名
        columns: string[];
        // 自定义字符串前缀，如单引号开头
        prefix?: string;
      };
  // 新增参数：自定义数据处理函数（接收数据和列数组）
  dataFormatter?: (data: any[], columns: ColumnConfig[]) => any[];
  // 新增参数：是否导出所有数据（包括隐藏列）
  exportAllColumns?: boolean;
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

// 导出函数
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
  } = options;

  try {
    // 1. 获取全部数据
    let allData = await fetchAllData();

    // 2. 过滤并处理表头
    const columns = tableRef.columns
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

// 新增：导出为CSV格式（如果需要）
export async function exportTableToCSV(
  options: Omit<ExportTableOptions, "styles">
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
          col.label !== undefined
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
