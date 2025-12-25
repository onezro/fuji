import * as ExcelJS from 'exceljs'
import dayjs from 'dayjs'

// 字段映射关系配置
export const FIELD_MAPPING: Record<string, string> = {
  '检验序列': 'LineNos',
  '检验类别': 'ProjectCategoryName',
  '检验名称': 'ProjectName',
  '特性分级': 'CharaCteristicGrade',
  '目标值': 'TargetValue',
  '最小值': 'MinValue',
  '最大值': 'MaxValue',
  '检验工具': 'ToolName',
  '检验依据': 'InspectionBasis',
  '样品数': 'SampleNum',
  '缺陷数': 'DefectNum',
  '测量值': 'ObservedValue',
  '总和': 'ObservedValueSum',
  '平均数': 'AverageNum',
  '结果': 'InspectionResult',
  '不良处理结果': 'ResulthandLing',
  '缺陷描述': 'DefectDec',
  '特殊原因': 'SpecialCause',
  '检验日期': 'InspectionDate'
}

// 目标对象接口
export interface InspectionData {
  LineNos: string
  MfgorderName: string
  ProjectName: string
  ProjectCategoryName: string
  TargetValue: string
  MaxValue: string
  MinValue: string
  CharaCteristicGrade: string
  ToolName: string
  InspectionBasis: string
  SampleNum: string
  MeasurementType: string
  DefectNum: string
  ObservedValue: string
  ObservedValueSum: string
  AverageNum: string
  DefectDec: string
  SpecialCause: string
  InspectionResult: string
  InspectionDate: string
  ResulthandLing: string
}

// 创建空的目标对象
const createEmptyInspectionData = (): InspectionData => ({
  LineNos: '',
  MfgorderName: '',
  ProjectName: '',
  ProjectCategoryName: '',
  TargetValue: '',
  MaxValue: '',
  MinValue: '',
  CharaCteristicGrade: '',
  ToolName: '',
  InspectionBasis: '',
  SampleNum: '',
  MeasurementType: '',
  DefectNum: '',
  ObservedValue: '',
  ObservedValueSum: '',
  AverageNum: '',
  DefectDec: '',
  SpecialCause: '',
  InspectionResult: '',
  InspectionDate: '',
  ResulthandLing: ''
})

// 获取单元格值
const getCellValue = (cell: ExcelJS.Cell): string => {
  if (!cell || cell.value === null || cell.value === undefined) {
    return ''
  }

  const value = cell.value

  // 处理日期
  if (value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }

  // 处理数字
  if (typeof value === 'number') {
    // 整数直接转字符串
    if (Number.isInteger(value)) {
      return value.toString()
    }
    // 浮点数保留适当精度
    const str = value.toString()
    // 避免科学计数法
    if (str.includes('e')) {
      return value.toFixed(10).replace(/\.?0+$/, '')
    }
    return str
  }

  // 处理布尔值
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }

  // 处理对象（公式、富文本等）
  if (value && typeof value === 'object') {
    // 富文本
    if (Array.isArray((value as any).richText)) {
      return (value as any).richText.map((p: any) => p.text).join('')
    }

    // 超链接
    if ((value as any).hyperlink) {
      return (value as any).text || (value as any).hyperlink
    }

    // 公式结果
    if ((value as any).result !== undefined) {
      const result = (value as any).result
      if (result instanceof Date) {
        return dayjs(result).format('YYYY-MM-DD HH:mm:ss')
      }
      return String(result)
    }

    // 文本对象
    if ((value as any).text !== undefined) {
      return String((value as any).text)
    }

    // 其他对象转为字符串
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }

  // 处理字符串：去除首尾空格
  return String(value).trim()
}

// 处理测量值：将中文逗号转为英文逗号
const processObservedValue = (value: string): string => {
  if (!value) return ''
  return value
    .replace(/，/g, ',')      // 中文逗号转英文逗号
    .replace(/;/g, ',')       // 分号转逗号
    .replace(/\s+/g, '')      // 去除空格
    .replace(/,+/g, ',')      // 合并多个逗号
    .replace(/^,|,$/g, '')    // 去除首尾逗号
}

// 从目标值中提取最小值和最大值
const extractMinMaxFromTarget = (targetValue: string): { min?: string; max?: string } => {
  if (!targetValue) return {}

  const value = targetValue.trim()

  // 处理 "200±5" 格式
  const match1 = value.match(/(\d+(?:\.\d+)?)\s*±\s*(\d+(?:\.\d+)?)/)
  if (match1) {
    const base = parseFloat(match1[1])
    const tolerance = parseFloat(match1[2])
    return {
      min: (base - tolerance).toString(),
      max: (base + tolerance).toString()
    }
  }

  // 处理 "195-205" 或 "195~205" 格式
  const match2 = value.match(/(\d+(?:\.\d+)?)\s*[-~]\s*(\d+(?:\.\d+)?)/)
  if (match2) {
    return {
      min: match2[1],
      max: match2[2]
    }
  }

  return {}
}

// 根据测量值自动计算总和和平均值
const calculateSumAndAverage = (observedValue: string): { sum?: string; average?: string } => {
  if (!observedValue) return {}

  const values = observedValue
    .split(',')
    .map(v => v.trim())
    .filter(v => v !== '')

  if (values.length === 0) return {}

  const numbers = values
    .map(v => parseFloat(v))
    .filter(n => !isNaN(n))

  if (numbers.length === 0) return {}

  const sum = numbers.reduce((a, b) => a + b, 0)
  const average = sum / numbers.length

  return {
    sum: sum.toString(),
    average: average.toFixed(2)
  }
}

// 主要的解析函数
export const parseInspectionExcel = async (file: File): Promise<InspectionData[]> => {
  try {
    console.log('开始解析文件:', file.name)

    // 1. 读取文件为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // 2. 创建并加载工作簿
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)

    // 3. 获取第一个工作表
    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
      throw new Error('Excel文件中没有工作表')
    }

    // 4. 获取实际数据范围
    const dimensions = worksheet.dimensions
    if (!dimensions) {
      throw new Error('工作表中没有数据')
    }

    // 5. 解析表头（第一行）
    const headerMap = new Map<number, string>() // 列索引 -> 目标字段名
    const firstRow = worksheet.getRow(1)
    
    firstRow.eachCell((cell, colNumber) => {
      const excelHeader = getCellValue(cell)
      if (excelHeader) {
        // 查找映射关系
        const targetField = FIELD_MAPPING[excelHeader]
        if (targetField) {
          headerMap.set(colNumber, targetField)
          console.log(`表头映射: ${excelHeader} -> ${targetField}`)
        } else {
          console.warn(`未找到映射的表头: ${excelHeader}`)
        }
      }
    })

    if (headerMap.size === 0) {
      throw new Error('无法识别Excel表头，请检查文件格式')
    }

    // 6. 解析数据行
    const result: InspectionData[] = []
    const rowCount = worksheet.rowCount || 0
    let validRowCount = 0

    // 从第二行开始（跳过表头）
    for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum)
      
      // 检查行是否有数据
      let rowHasData = false
      row.eachCell((cell) => {
        if (getCellValue(cell) !== '') {
          rowHasData = true
        }
      })

      if (!rowHasData) {
        console.log(`跳过空行: ${rowNum}`)
        continue
      }

      // 创建空的数据对象
      const inspectionData = createEmptyInspectionData()

      // 填充映射字段
      row.eachCell((cell, colNumber) => {
        const targetField = headerMap.get(colNumber)
        if (targetField) {
          let value = getCellValue(cell)
          
          // 特殊处理测量值
          if (targetField === 'ObservedValue') {
            value = processObservedValue(value)
          }
          
          (inspectionData as any)[targetField] = value
        }
      })

      // 特殊字段处理逻辑
      
      // 1. 从目标值中提取最小值和最大值（如果这两个字段为空）
      if (inspectionData.TargetValue && 
          (!inspectionData.MinValue || !inspectionData.MaxValue)) {
        const { min, max } = extractMinMaxFromTarget(inspectionData.TargetValue)
        if (!inspectionData.MinValue && min) {
          inspectionData.MinValue = min
        }
        if (!inspectionData.MaxValue && max) {
          inspectionData.MaxValue = max
        }
      }

      // 2. 自动计算总和和平均值（如果这两个字段为空且有测量值）
      if (inspectionData.ObservedValue && 
          (!inspectionData.ObservedValueSum || !inspectionData.AverageNum)) {
        const { sum, average } = calculateSumAndAverage(inspectionData.ObservedValue)
        if (!inspectionData.ObservedValueSum && sum) {
          inspectionData.ObservedValueSum = sum
        }
        if (!inspectionData.AverageNum && average) {
          inspectionData.AverageNum = average
        }
      }

      // 3. 设置检验类别为测量类型
      if (inspectionData.ProjectCategoryName && !inspectionData.MeasurementType) {
        inspectionData.MeasurementType = inspectionData.ProjectCategoryName
      }

      // 4. 默认检验结果为"合格"（如果检验结果字段为空）
      if (!inspectionData.InspectionResult) {
        // 可以根据测量值判断是否合格
        if (inspectionData.ObservedValue && inspectionData.MinValue && inspectionData.MaxValue) {
          const min = parseFloat(inspectionData.MinValue)
          const max = parseFloat(inspectionData.MaxValue)
          const values = inspectionData.ObservedValue
            .split(',')
            .map(v => parseFloat(v.trim()))
            .filter(n => !isNaN(n))
          
          if (values.length > 0) {
            const allInRange = values.every(v => v >= min && v <= max)
            inspectionData.InspectionResult = allInRange ? '合格' : '不合格'
          }
        }
      }

      result.push(inspectionData)
      validRowCount++
    }

    console.log('解析完成:', {
      文件名: file.name,
      文件大小: `${(file.size / 1024).toFixed(2)} KB`,
      总行数: rowCount - 1,
      有效数据行数: validRowCount,
      解析字段数: headerMap.size
    })

    return result

  } catch (error) {
    console.error('Excel解析失败:', error)
    throw error
  }
}

// 用于处理上传组件的函数
export const handleExcelUpload= async (file: File): Promise<{
  success: boolean
  data: InspectionData[]
  message?: string
}> => {
  try {
    // 验证文件类型
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    
    if (!allowedTypes.includes(file.type) && 
        !file.name.match(/\.(xlsx|xls)$/i)) {
      return {
        success: false,
        data: [],
        message: '请上传Excel文件 (.xlsx 或 .xls)'
      }
    }

    // 验证文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        data: [],
        message: '文件大小不能超过10MB'
      }
    }

    // 解析Excel
    const data = await parseInspectionExcel(file)
    
    return {
      success: true,
      data,
      message: `成功导入 ${data.length} 条数据`
    }

  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: `解析失败: ${error.message || '未知错误'}`
    }
  }
}