import { ref } from 'vue';
import { ElNotification } from 'element-plus';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
}

// 对齐方式映射
function mapAlignment(align?: string): 'left' | 'center' | 'right' {
  const map: Record<string, 'left' | 'center' | 'right'> = {
    left: 'left',
    center: 'center',
    right: 'right',
    undefined: 'left',
  };
  return map[align ?? 'undefined'] ?? 'left';
}

// 导出函数
export async function exportTableToExcel(options: ExportTableOptions) {
    //  const { t } = useI18n();
  const {
    tableRef,
    fetchAllData,
    fileName = 'export',
    styles = {},
     t 
  } = options;

  try {
    // 1. 获取全部数据
    const allData = await fetchAllData();

    // 2. 过滤并处理表头
    // console.log(tableRef.columns);
    
    const columns = tableRef.columns
      .filter((col) => col.label !==t('publicText.index') && t('publicText.operation'))
      .map((col) => ({
        label: col.label,
        prop: col.property  || '',
        align: col.align,
      }));

    // 3. 创建 Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 4. 添加表头
    const headerRow = columns.map((col) => col.label);
    worksheet.addRow(headerRow);

    // 5. 添加数据行
    allData.forEach((row) => {
      const rowData = columns.map((col) => {
        
        // 处理嵌套属性（如 user.name）
        return col.prop.split('.').reduce((obj: any, key:any) => {
          if (obj && typeof obj === 'object') return obj[key];
          return '';
        }, row);
      });
      
      worksheet.addRow(rowData);
    });

    // 6. 自适应列宽
    worksheet.columns = columns.map((col, colIndex) => {
      const headerLength = col.label?.length || 0;
      let maxDataLength = 0;

      allData.forEach((row, rowIndex) => {
        const excelRowNumber = rowIndex + 2;
        const cell = worksheet.getRow(excelRowNumber).getCell(colIndex + 1);
        const cellValue = cell.value?.toString() || '';
        maxDataLength = Math.max(maxDataLength, cellValue.length);
      });

      return {
        width: Math.max(headerLength, maxDataLength) + 6,
        style: {
          alignment: {
            wrapText: true,
            horizontal: col.align ? mapAlignment(col.align) : 'left',
          },
          ...(styles.cell || {}),
        },
      };
    });

    // 7. 应用表头样式
    worksheet.getRow(1).eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, ...(styles.headerFont || {}) },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: styles.headerBgColor || 'FFD3D3D3' },
        },
      });
    });

    // 8. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error('[Excel Export Error]', error);
    ElNotification.error({
      title: t('message.error'),
      message: t('message.exportFailure'),
    });
    throw new Error(t('message.exportFailure'));
  }
}
