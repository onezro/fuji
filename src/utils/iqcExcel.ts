// iqcExcelExporter.ts
import * as ExcelJS from "exceljs";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";

// ==================== 类型定义 ====================
interface InspectionDetail {
  IQC_InspectionDetailName?: string;
  InspectionDetailName?: string;
  ProjectCategoryName?: string;
  ProjectName?: string;
  TargetValue?: string;
  MinValue?: string;
  MaxValue?: string | null;
  CharacteristicGrade?: string | null;
  InspectionToolName?: string;
  InspectionBasis?: string;
  InspectionType?: string;
  MeasurementType?: string; // 检验类型（计量/计数）
  SampleSize?: string;
  DefectCount?: string;
  DefectDescription?: string | null;
  StatusText?: string;
  Status?: string;
  Inspector?: string;
  MeasuredValue1?: string | null;
  MeasuredValue2?: string | null;
  MeasuredValue3?: string | null;
  MeasuredValue4?: string | null;
  MeasuredValue5?: string | null;
  MeasuredValue6?: string | null;
  MeasuredValue7?: string | null;
  MeasuredValue8?: string | null;
  MeasuredValue9?: string | null;
  MeasuredValue10?: string | null;
  uomname?: string | null;
  UnqualifiedHandlingResults?: string | null;
  Sum?: string;
  Average?: string;
  DecimalPlaces?: string;
}

interface MaterialDetail {
  IQC_DetailName?: string;
  MaterialName?: string;
  ModelSpec?: string;
  Supplier?: string;
  OrderNo?: string | null;
  LotNo?: string;
  TCode?: string | null;
  QuantityPerBox?: string;
  SupplierReportGuid?: string | null;
  SupplierReportName?: string | null;
  CreateTime?: string;
  StatusText?: string;
  Status?: string;
  IsAutomotive?: string;
  InspectionResult?: string;
  ApprovalResult?: string;
  Inspector?: string;
  Approver?: string;
  SampledBoxes?: string;
  Package?: string;
  Appearance?: string;
  Specification?: string;
  Property?: string;
  AC?: string;
  RE?: string;
  RoHS?: string | null;
  UL?: string | null;
  ApprovalTime?: string;
  InspectionDetails?: InspectionDetail[];
}

interface IQCDataSource {
  Header: {
    IQCNumber?: string;
    NotifyDept?: string;
    Notifier?: string;
    PriorityCodeName?: string;
    NotifyDate?: string;
    ArrivalDate?: string;
    IsAutomotive?: string | null;
    SamplingStandards?: string;
    CreateTime?: string;
    IncomingUnit?: string;
    ReceivingDept?: string;
    ReceiverName?: string;
    ReceiveDate?: string;
    MaterialTypes?: string;
    InspectionResult?: string;
    ApprovalResult?: string;
    ApprovalRemarks?: string | null;
    Approver?: string;
  };
  MaterialDetails?: MaterialDetail[];
}

// ==================== 工具函数 ====================
function safeStr(val: any): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

/** 合并 MeasuredValue1~10 所有非空值为逗号分隔的字符串 */
function mergeMeasuredValues(detail: InspectionDetail): string {
  const values: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const key = `MeasuredValue${i}` as keyof InspectionDetail;
    const v = detail[key];
    if (v !== null && v !== undefined && String(v).trim() !== "") {
      values.push(String(v).trim());
    }
  }
  return values.join(", ");
}

/** 估算字符串在 Excel 中的显示宽度，中文字符按 2 个单位计算 */
function estimateWidth(str: string | null | undefined): number {
  if (!str) return 0;
  let width = 0;
  for (const ch of String(str)) {
    const code = ch.charCodeAt(0);
    if (
      (code >= 0x4e00 && code <= 0x9fff) || // 基本汉字
      (code >= 0x3000 && code <= 0x303f) || // CJK 标点
      (code >= 0xff00 && code <= 0xffef) || // 全角字符
      (code >= 0x2e80 && code <= 0x2eff) || // 部首补充
      (code >= 0x2f00 && code <= 0x2fdf) || // 康熙部首
      (code >= 0x3100 && code <= 0x312f) || // 注音符号
      (code >= 0x31a0 && code <= 0x31bf) || // 注音扩展
      (code >= 0xac00 && code <= 0xd7af) || // 韩文
      (code >= 0x3040 && code <= 0x309f) || // 平假名
      (code >= 0x30a0 && code <= 0x30ff) // 片假名
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

/** 将零基列索引转换为 Excel 列字母（0->A, 25->Z, 26->AA） */
function columnIndexToLetter(index: number): string {
  let letter = "";
  let num = index;
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter;
    num = Math.floor(num / 26) - 1;
  }
  return letter;
}

// ==================== 数据展平 ====================
interface FlattenResult {
  rows: string[][];
  materialRowRanges: {
    startRow: number;
    endRow: number;
    materialIndex: number;
  }[];
  totalDataRows: number;
}

function flattenData(source: IQCDataSource): FlattenResult {
  const header = source.Header;
  const materialDetails = source.MaterialDetails || [];
  const rows: string[][] = [];
  const materialRowRanges: FlattenResult["materialRowRanges"] = [];

  let currentDataRow = 1; // 1-based，表头算第1行，数据从第2行开始

  for (let mIdx = 0; mIdx < materialDetails.length; mIdx++) {
    const material = materialDetails[mIdx];
    const details = material.InspectionDetails || [];
    const startRow = currentDataRow;
    const endRow = currentDataRow + details.length - 1;

    materialRowRanges.push({ startRow, endRow, materialIndex: mIdx });

    let seqNum = 1;
    for (const detail of details) {
      const measuredValues = mergeMeasuredValues(detail);

      const row = [
        safeStr(header.IQCNumber), // 0  检验单号
        safeStr(header.ArrivalDate), // 1  来料日期

        safeStr(material.InspectionResult), // 3  检验结果
        safeStr(header.CreateTime), // 4  创建时间
        safeStr(material.ModelSpec), // 5  型号规格
        safeStr(material.MaterialName), // 6  材料名称
        safeStr(material.Supplier), // 7  供应商
        safeStr(material.IsAutomotive), // 8  汽车产品
        safeStr(material.OrderNo), // 9  订单号
        safeStr(material.LotNo), // 10 Lot No
        safeStr(material.TCode), // 11 T-Code
        safeStr(material.QuantityPerBox), // 12 来料数量/箱
        safeStr(material.SampledBoxes), // 13 抽检箱数
        safeStr(header.SamplingStandards), // 14 检验标准
        safeStr(material.StatusText), // 2  状态
        safeStr(detail.MeasurementType), // 15 检验类型
        String(seqNum), // 16 检验序列
        safeStr(detail.ProjectCategoryName), // 17 检验类别
        safeStr(detail.ProjectName), // 18 检验名称
        safeStr(detail.CharacteristicGrade), // 19 特性分级
        safeStr(detail.TargetValue), // 20 目标值
        safeStr(detail.MaxValue), // 21 最大值
        safeStr(detail.MinValue), // 22 最小值
        safeStr(detail.DecimalPlaces), // 23 小数位数
        safeStr(detail.InspectionToolName), // 24 检验工具
        safeStr(detail.uomname), // 25 单位
        safeStr(detail.InspectionBasis), // 26 检验依据
        safeStr(detail.SampleSize), // 27 样品数
        safeStr(detail.DefectCount), // 28 缺陷数
        measuredValues, // 29 测量值
        safeStr(detail.Sum), // 30 总和
        safeStr(detail.Average), // 31 平均数
        safeStr(detail.StatusText), // 32 结果
        safeStr(detail.UnqualifiedHandlingResults), // 33 不合格处理结果
      ];
      rows.push(row);
      seqNum++;
    }
    currentDataRow = endRow + 1;
  }

  return { rows, materialRowRanges, totalDataRows: currentDataRow - 1 };
}

// ==================== 导出主函数 ====================
export async function exportIQCToExcel(
  dataSource: IQCDataSource,
  fileName?: string,
): Promise<void> {
  ElMessage.warning({
    message: "正在导出",
  });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("IQC检验报告", {
    properties: { defaultRowHeight: 20 },
  });

  // 表头（34列，顺序已调整）
  const headers = [
    "检验单号",
    "来料日期",
    "检验结果",
    "创建时间",
    "型号规格",
    "材料名称",
    "供应商",
    "汽车产品",
    "订单号",
    "Lot No",
    "T-Code",
    "来料数量/箱",
    "抽检箱数",
    "检验标准",
     "状态",
    "检验类型", // 15
    "检验序列", // 16
    "检验类别", // 17
    "检验名称",
    "特性分级",
    "目标值",
    "最大值",
    "最小值",
    "小数位数",
    "检验工具",
    "单位",
    "检验依据",
    "样品数",
    "缺陷数",
    "测量值",
    "总和",
    "平均数",
    "结果",
    "不合格处理结果",
  ];

  const { rows, materialRowRanges, totalDataRows } = flattenData(dataSource);

  // 添加表头
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 24;

  // 添加数据行
  for (const rowData of rows) {
    worksheet.addRow(rowData);
  }

  // ---- 合并单元格 ----
  // 1. 全单据级别合并
  const headerLevelCols = [0, 1, 2, 3];
  if (totalDataRows >= 2) {
    for (const colIdx of headerLevelCols) {
      const colLetter = columnIndexToLetter(colIdx);
      worksheet.mergeCells(`${colLetter}2:${colLetter}${totalDataRows + 1}`);
    }
  }

  // 2. 物料级别合并
  const materialLevelCols = [4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  for (const range of materialRowRanges) {
    if (range.endRow > range.startRow) {
      for (const colIdx of materialLevelCols) {
        const colLetter = columnIndexToLetter(colIdx);
        worksheet.mergeCells(
          `${colLetter}${range.startRow + 1}:${colLetter}${range.endRow + 1}`,
        );
      }
    }
  }

  // 3. 检验类型合并（同一物料内连续相同类型）
  const inspectionTypeColIdx = 15;
  for (const range of materialRowRanges) {
    const startExcelRow = range.startRow + 1;
    const endExcelRow = range.endRow + 1;
    if (startExcelRow === endExcelRow) continue; // 单行无需合并

    // 提取该物料所有行的检验类型
    const rowsChunk = rows.slice(range.startRow - 1, range.endRow);
    const types = rowsChunk.map((row) => row[inspectionTypeColIdx]);

    let blockStart = startExcelRow;
    for (let i = 1; i < types.length; i++) {
      if (types[i] !== types[i - 1]) {
        if (blockStart < startExcelRow + i - 1) {
          // 至少两行
          const colLetter = columnIndexToLetter(inspectionTypeColIdx);
          worksheet.mergeCells(
            `${colLetter}${blockStart}:${colLetter}${startExcelRow + i - 1}`,
          );
        }
        blockStart = startExcelRow + i;
      }
    }
    // 最后一段
    if (blockStart < startExcelRow + types.length - 1) {
      const colLetter = columnIndexToLetter(inspectionTypeColIdx);
      worksheet.mergeCells(
        `${colLetter}${blockStart}:${colLetter}${startExcelRow + types.length - 1}`,
      );
    }
  }

  // ---- 列宽计算（保持不变）----
  const columnWidths = new Array(headers.length).fill(0);
  for (let i = 0; i < headers.length; i++) {
    columnWidths[i] = Math.max(columnWidths[i], estimateWidth(headers[i]));
  }
  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      columnWidths[i] = Math.max(columnWidths[i], estimateWidth(row[i]));
    }
  }
  for (let i = 0; i < columnWidths.length; i++) {
    const colLetter = columnIndexToLetter(i);
    const width = Math.max(columnWidths[i] + 3, 8);
    worksheet.getColumn(colLetter).width = Math.min(width, 40);
  }
  const wideCols = [
    { index: 14, extra: 4, max: 45 }, // 检验标准
    { index: 5, extra: 4, max: 40 }, // 型号规格
    { index: 20, extra: 3, max: 25 }, // 目标值（注意索引变化，原20不变，因调整前目标值在20，调整后仍在20）
  ];
  for (const { index, extra, max } of wideCols) {
    if (columnWidths[index] > 0) {
      worksheet.getColumn(columnIndexToLetter(index)).width = Math.min(
        columnWidths[index] + extra,
        max,
      );
    }
  }

  // ---- 样式设置 ----
  const headerStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 11, name: "Microsoft YaHei" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD6E4F0" },
    },
    alignment: { horizontal: "center", vertical: "middle", wrapText: true },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  const dataStyle: Partial<ExcelJS.Style> = {
    font: { size: 10, name: "Microsoft YaHei" },
    alignment: { horizontal: "center", vertical: "middle", wrapText: true },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  headerRow.eachCell((cell: any) => {
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = headerStyle.border;
  });

  for (let r = 2; r <= totalDataRows + 1; r++) {
    const row = worksheet.getRow(r);
    row.eachCell((cell: any) => {
      cell.font = dataStyle.font;
      cell.alignment = dataStyle.alignment;
      cell.border = dataStyle.border;
    });
  }

  // ---- 冻结首行 ----
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // ---- 生成 Blob 并下载 ----
  const buffer = await workbook.xlsx.writeBuffer();
  const defaultFileName = `IQC_检验报告_${dataSource.Header.IQCNumber ?? "unknown"}_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`;
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName || defaultFileName);
}
