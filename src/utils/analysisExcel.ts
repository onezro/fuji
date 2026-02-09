import * as ExcelJS from 'exceljs'
import dayjs from 'dayjs'

// 字段映射关系配置 - 原始版本（合并的测量值）
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

// 字段映射关系配置 - 新版本（分开的测量值1-10）
export const FIELD_MAPPING_SPLIT: Record<string, string> = {
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
  '测量值1': 'MeasuredValue1',
  '测量值2': 'MeasuredValue2',
  '测量值3': 'MeasuredValue3',
  '测量值4': 'MeasuredValue4',
  '测量值5': 'MeasuredValue5',
  '测量值6': 'MeasuredValue6',
  '测量值7': 'MeasuredValue7',
  '测量值8': 'MeasuredValue8',
  '测量值9': 'MeasuredValue9',
  '测量值10': 'MeasuredValue10',
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
  ObservedValue: string  // 合并的测量值
  MeasuredValue1?: string  // 新增：测量值1
  MeasuredValue2?: string  // 新增：测量值2
  MeasuredValue3?: string  // 新增：测量值3
  MeasuredValue4?: string  // 新增：测量值4
  MeasuredValue5?: string  // 新增：测量值5
  MeasuredValue6?: string  // 新增：测量值6
  MeasuredValue7?: string  // 新增：测量值7
  MeasuredValue8?: string  // 新增：测量值8
  MeasuredValue9?: string  // 新增：测量值9
  MeasuredValue10?: string // 新增：测量值10
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

// 从分开的测量值合并成单个测量值字符串
const mergeMeasuredValues = (data: any): string => {
  const measuredValues = []
  for (let i = 1; i <= 10; i++) {
    const key = `MeasuredValue${i}`
    if (data[key] && data[key].trim() !== '') {
      measuredValues.push(data[key].trim())
    }
  }
  return measuredValues.join(',')
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

// 检测Excel模板类型：合并的测量值还是分开的测量值
const detectExcelTemplateType = (headerMap: Map<number, string>): 'merged' | 'split' => {
  // 检查是否有测量值1到测量值10的列
  const hasSplitMeasurements = Array.from(headerMap.values()).some(value => 
    value.startsWith('MeasuredValue') && /^\d+$/.test(value.replace('MeasuredValue', ''))
  )
  
  if (hasSplitMeasurements) {
    return 'split'
  }
  
  // 检查是否有合并的测量值列
  const hasMergedMeasurement = Array.from(headerMap.values()).includes('ObservedValue')
  if (hasMergedMeasurement) {
    return 'merged'
  }
  
  // 默认返回合并类型
  return 'merged'
}

// 主要的解析函数 - 支持两种模板
export const parseInspectionExcel = async (file: File, templateType?: 'auto' | 'merged' | 'split'): Promise<InspectionData[]> => {
  try {
    console.log('开始解析文件:', file.name, '模板类型:', templateType || 'auto')

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
        // 尝试从两种映射表中查找
        let targetField = FIELD_MAPPING_SPLIT[excelHeader]
        if (!targetField) {
          targetField = FIELD_MAPPING[excelHeader]
        }
        
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

    // 6. 检测模板类型
    let detectedType = templateType === 'auto' || !templateType 
      ? detectExcelTemplateType(headerMap) 
      : templateType
    
    console.log('检测到的模板类型:', detectedType)

    // 7. 解析数据行
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
          if (detectedType === 'merged' && targetField === 'ObservedValue') {
            value = processObservedValue(value)
          }
          
          // 赋值到对应字段
          (inspectionData as any)[targetField] = value
        }
      })

      // 特殊字段处理逻辑
      
      // 1. 处理测量值字段：如果模板是分开的，合并到ObservedValue字段
      if (detectedType === 'split') {
        // 从分开的测量值字段合并到ObservedValue
        inspectionData.ObservedValue = mergeMeasuredValues(inspectionData)
      }

      // 2. 从目标值中提取最小值和最大值（如果这两个字段为空）
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

      // 3. 自动计算总和和平均值（如果这两个字段为空且有测量值）
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

      // 4. 设置检验类别为测量类型
      if (inspectionData.ProjectCategoryName && !inspectionData.MeasurementType) {
        inspectionData.MeasurementType = inspectionData.ProjectCategoryName
      }

      // 5. 默认检验结果为"合格"（如果检验结果字段为空）
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
      解析字段数: headerMap.size,
      模板类型: detectedType
    })

    return result

  } catch (error) {
    console.error('Excel解析失败:', error)
    throw error
  }
}

// 专门解析分开测量值模板的函数
export const parseSplitMeasurementExcel = async (file: File): Promise<InspectionData[]> => {
  return parseInspectionExcel(file, 'split')
}

// 专门解析合并测量值模板的函数
export const parseMergedMeasurementExcel = async (file: File): Promise<InspectionData[]> => {
  return parseInspectionExcel(file, 'merged')
}

// 用于处理上传组件的函数
export const handleExcelUpload = async (file: File, options?: {
  templateType?: 'auto' | 'merged' | 'split'
}): Promise<{
  success: boolean
  data: InspectionData[]
  message?: string
  templateType?: string
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
    const data = await parseInspectionExcel(file, options?.templateType || 'auto')
    
    // 检测实际使用的模板类型
    const hasSplitValues = data.some(item => 
      item.MeasuredValue1 !== undefined || 
      item.MeasuredValue2 !== undefined
    )
    const actualTemplateType = hasSplitValues ? 'split' : 'merged'
    
    return {
      success: true,
      data,
      message: `成功导入 ${data.length} 条数据 (${actualTemplateType === 'split' ? '分开测量值' : '合并测量值'}模板)`,
      templateType: actualTemplateType
    }

  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: `解析失败: ${error.message || '未知错误'}`
    }
  }
}
export const parseHorizontalInspectionExcel = async (file: File): Promise<InspectionData[]> => {
  try {
    console.log('开始解析横向格式文件:', file.name)

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

    // 5. 解析表头（第一行是检验序列，从第二列开始）
    const firstRow = worksheet.getRow(1)
    const columnCount = worksheet.columnCount
    
    // 收集所有检验序列（从第二列开始）
    const inspectionSequences: string[] = []
    
    for (let col = 2; col <= columnCount; col++) {
      const cell = worksheet.getCell(1, col)
      const sequence = getCellValue(cell)
      if (sequence && sequence.trim() !== '') {
        inspectionSequences.push(sequence.trim())
      }
    }

    if (inspectionSequences.length === 0) {
      throw new Error('未找到检验序列数据')
    }

    console.log(`找到 ${inspectionSequences.length} 个检验序列:`, inspectionSequences)

    // 6. 解析字段名（第一列，从第二行开始）
    const fieldNameMap = new Map<number, { label: string; property: string }>()
    const rowCount = worksheet.rowCount || 0
    
    // 定义横向格式的字段映射（中文标签到字段名的映射）
    const horizontalFieldMapping: Record<string, string> = {
      '检验序列': 'LineNos',
      '检验类别': 'ProjectCategoryName',
      '检验名称': 'ProjectName',
      '特性分级': 'CharaCteristicGrade',
      '目标值': 'TargetValue',
      '最大值': 'MaxValue',
      '最小值': 'MinValue',
      '检验工具': 'ToolName',
      '检验依据': 'InspectionBasis',
      '样品数': 'SampleNum',
      '缺陷数': 'DefectNum',
      '测量值1': 'MeasuredValue1',
      '测量值2': 'MeasuredValue2',
      '测量值3': 'MeasuredValue3',
      '测量值4': 'MeasuredValue4',
      '测量值5': 'MeasuredValue5',
      '测量值6': 'MeasuredValue6',
      '测量值7': 'MeasuredValue7',
      '测量值8': 'MeasuredValue8',
      '测量值9': 'MeasuredValue9',
      '测量值10': 'MeasuredValue10',
      '总和': 'ObservedValueSum',
      '平均数': 'AverageNum',
      '结果': 'InspectionResult',
      '不良处理结果': 'ResulthandLing'
    }

    // 遍历第一列，获取字段名
    for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
      const cell = worksheet.getCell(rowNum, 1)
      const fieldName = getCellValue(cell)
      
      if (fieldName && fieldName.trim() !== '') {
        const trimmedName = fieldName.trim()
        const property = horizontalFieldMapping[trimmedName]
        
        if (property) {
          fieldNameMap.set(rowNum, { label: trimmedName, property })
          console.log(`字段映射: 第${rowNum}行 "${trimmedName}" -> ${property}`)
        } else {
          console.warn(`未找到字段映射: "${trimmedName}"`)
        }
      }
    }

    if (fieldNameMap.size === 0) {
      throw new Error('无法识别Excel字段名，请检查文件格式')
    }

    // 7. 解析数据并转换为纵向格式
    const result: InspectionData[] = []

    // 为每个检验序列创建一条记录
    for (let seqIndex = 0; seqIndex < inspectionSequences.length; seqIndex++) {
      const sequence = inspectionSequences[seqIndex]
      const columnIndex = seqIndex + 2 // Excel列索引（第一列是字段名，所以从2开始）
      
      // 创建空的数据对象
      const inspectionData = createEmptyInspectionData()
      inspectionData.LineNos = sequence
      
      // 填充字段数据
      fieldNameMap.forEach((field, rowNum) => {
        const cell = worksheet.getCell(rowNum, columnIndex)
        let value = getCellValue(cell)
        
        // 特殊处理测量值：如果是测量值字段，直接赋值
        if (field.property.startsWith('MeasuredValue')) {
          // 直接赋值给对应的测量值字段
          (inspectionData as any)[field.property] = value
        } else {
          // 其他字段直接赋值
          (inspectionData as any)[field.property] = value
        }
      })

      // 特殊字段处理逻辑
      
      // 1. 将分开的测量值合并到ObservedValue字段
      const measuredValues: string[] = []
      for (let i = 1; i <= 10; i++) {
        const key = `MeasuredValue${i}` as keyof InspectionData
        const value = (inspectionData as any)[key]
        if (value && value.toString().trim() !== '') {
          measuredValues.push(value.toString().trim())
        }
      }
      if (measuredValues.length > 0) {
        inspectionData.ObservedValue = measuredValues.join(',')
      }

      // 2. 从目标值中提取最小值和最大值（如果这两个字段为空）
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

      // 3. 自动计算总和和平均值（如果这两个字段为空且有测量值）
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

      // 4. 设置检验类别为测量类型
      if (inspectionData.ProjectCategoryName && !inspectionData.MeasurementType) {
        inspectionData.MeasurementType = inspectionData.ProjectCategoryName
      }

      // 5. 默认检验结果判断
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

      // 6. 处理目标值中的特殊格式（如 "26+/-0.3"）
      if (inspectionData.TargetValue) {
        // 处理 "26+/-0.3" 格式，转换为 "26±0.3"
        inspectionData.TargetValue = inspectionData.TargetValue
          .replace(/\+\/-\s*/g, '±')
          .replace(/-\s*\+\s*/g, '±')
      }

      result.push(inspectionData)
    }

    console.log('横向格式解析完成:', {
      文件名: file.name,
      文件大小: `${(file.size / 1024).toFixed(2)} KB`,
      检验序列数: inspectionSequences.length,
      字段数: fieldNameMap.size,
      解析记录数: result.length
    })

    return result

  } catch (error) {
    console.error('横向格式Excel解析失败:', error)
    throw error
  }
}

// 新增：检测Excel文件格式类型的函数
export const detectExcelFormat = (worksheet: ExcelJS.Worksheet): 'horizontal' | 'vertical' | 'unknown' => {
  try {
    // 获取第一行第一列和第一行第二列的值
    const a1 = worksheet.getCell(1, 1).value
    const b1 = worksheet.getCell(1, 2).value
    
    // 获取第二行第一列的值
    const a2 = worksheet.getCell(2, 1).value
    
    // 判断是否为横向格式
    // 横向格式特征：第一行第一列是"检验序列"，第一行第二列是数字，第二行第一列是"检验类别"
    if (a1 && b1 && a2) {
      const a1Value = getCellValue(worksheet.getCell(1, 1)).trim()
      const b1Value = getCellValue(worksheet.getCell(1, 2)).trim()
      const a2Value = getCellValue(worksheet.getCell(2, 1)).trim()
      
      // 检查是否是横向格式
      if (a1Value === '检验序列' && 
          (/\d+/.test(b1Value) || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(b1Value)) &&
          a2Value === '检验类别') {
        return 'horizontal'
      }
      
      // 检查是否是竖向格式
      // 竖向格式特征：第一行是表头，包含"检验序列"等字段
      const headerRow = worksheet.getRow(1)
      let verticalHeaderCount = 0
      headerRow.eachCell((cell, colNumber) => {
        const header = getCellValue(cell).trim()
        if (header && Object.keys(FIELD_MAPPING).includes(header)) {
          verticalHeaderCount++
        }
      })
      
      if (verticalHeaderCount >= 5) { // 至少5个匹配的字段才认为是竖向格式
        return 'vertical'
      }
    }
    
    return 'unknown'
  } catch (error) {
    console.error('检测Excel格式失败:', error)
    return 'unknown'
  }
}

// 增强的主解析函数 - 自动检测并选择合适的解析方法
export const parseInspectionExcelEnhanced = async (file: File): Promise<InspectionData[]> => {
  try {
    console.log('使用增强解析函数处理文件:', file.name)

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

    // 4. 检测文件格式
    const formatType = detectExcelFormat(worksheet)
    console.log(`检测到文件格式: ${formatType}`)

    // 5. 根据格式选择合适的解析方法
    if (formatType === 'horizontal') {
      return await parseHorizontalInspectionExcel(file)
    } else if (formatType === 'vertical') {
      // 使用现有的竖向解析函数
      return await parseInspectionExcel(file, 'split')
    } else {
      // 如果无法检测，尝试使用横向解析，如果失败再使用竖向解析
      try {
        console.log('格式未知，尝试横向解析...')
        return await parseHorizontalInspectionExcel(file)
      } catch (horizontalError) {
        console.log('横向解析失败，尝试竖向解析...')
        return await parseInspectionExcel(file, 'split')
      }
    }
  } catch (error) {
    console.error('增强解析失败:', error)
    throw error
  }
}

// 新增：专门处理横向格式的上传函数
export const handleHorizontalExcelUpload = async (file: File): Promise<{
  success: boolean
  data: InspectionData[]
  message?: string
  formatType?: string
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
    const data = await parseHorizontalInspectionExcel(file)
    
    return {
      success: true,
      data,
      message: `成功导入 ${data.length} 条数据 (横向格式)`,
      formatType: 'horizontal'
    }

  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: `解析失败: ${error.message || '未知错误'}`
    }
  }
}

// 更新主处理函数，支持自动格式检测
export const handleExcelUploadEnhanced = async (file: File, options?: {
  forceFormat?: 'auto' | 'horizontal' | 'vertical' | 'split' | 'merged'
}): Promise<{
  success: boolean
  data: InspectionData[]
  message?: string
  formatType?: string
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

    let data: InspectionData[] = []
    let formatType = 'unknown'
    
    // 根据选项选择合适的解析方法
    if (options?.forceFormat) {
      switch (options.forceFormat) {
        case 'horizontal':
          data = await parseHorizontalInspectionExcel(file)
          formatType = 'horizontal'
          break
        case 'vertical':
          data = await parseInspectionExcel(file, 'split')
          formatType = 'vertical'
          break
        case 'split':
          data = await parseSplitMeasurementExcel(file)
          formatType = 'vertical_split'
          break
        case 'merged':
          data = await parseMergedMeasurementExcel(file)
          formatType = 'vertical_merged'
          break
        case 'auto':
        default:
          data = await parseInspectionExcelEnhanced(file)
          // 检测实际使用的格式
          if (data.length > 0) {
            const firstItem = data[0]
            // 根据数据特征判断格式类型
            if (firstItem.MeasuredValue1 !== undefined) {
              formatType = 'vertical_split'
            } else if (firstItem.ObservedValue && firstItem.ObservedValue.includes(',')) {
              formatType = 'vertical_merged'
            } else {
              formatType = 'horizontal'
            }
          }
          break
      }
    } else {
      // 默认使用增强解析函数
      data = await parseInspectionExcelEnhanced(file)
      formatType = 'auto_detected'
    }

    return {
      success: true,
      data,
      message: `成功导入 ${data.length} 条数据`,
      formatType
    }

  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: `解析失败: ${error.message || '未知错误'}`
    }
  }
}

// 新增：专门用于处理分开测量值模板的上传函数
export const handleSplitExcelUpload = async (file: File) => {
  return handleExcelUpload(file, { templateType: 'split' })
}

// 新增：专门用于处理合并测量值模板的上传函数
export const handleMergedExcelUpload = async (file: File) => {
  return handleExcelUpload(file, { templateType: 'merged' })
}
// 在 analysisExcel.ts 文件中添加以下函数

/**
 * 解析横向计量检验表Excel文件（特殊格式）
 * 格式：第一行是检验名称，每列一个检验项目
 *       每行第一列是字段名，后续列是对应检验项目的值
 */
export const parseHorizontalInspectionExcelSpecial = async (file: File): Promise<InspectionData[]> => {
  try {
    console.log('开始解析特殊横向格式文件:', file.name)

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

    // 5. 解析第一行：检验名称（每个检验项目一列）
    const firstRow = worksheet.getRow(1)
    const columnCount = worksheet.columnCount
    
    // 收集所有检验项目（从第二列开始）
    const inspectionProjects: Array<{
      name: string;
      colIndex: number; // Excel列索引
    }> = []
    
    // 第一列是第一行的标题"检验名称"
    const firstCellValue = getCellValue(worksheet.getCell(1, 1))
    if (firstCellValue.trim() !== '检验名称') {
      console.warn('文件格式可能不正确，第一行第一列应为"检验名称"')
    }
    
    // 从第二列开始是检验项目名称
    for (let col = 2; col <= columnCount; col++) {
      const cell = worksheet.getCell(1, col)
      const projectName = getCellValue(cell)
      if (projectName && projectName.trim() !== '') {
        inspectionProjects.push({
          name: projectName.trim(),
          colIndex: col
        })
      }
    }

    if (inspectionProjects.length === 0) {
      throw new Error('未找到检验项目数据')
    }

    console.log(`找到 ${inspectionProjects.length} 个检验项目:`, inspectionProjects.map(p => p.name))

    // 6. 解析字段名（第一列，从第二行开始）和对应的值
    const fieldMap = new Map<number, {
      fieldName: string;
      rowIndex: number;
    }>()
    
    const rowCount = worksheet.rowCount || 0
    
    // 遍历第一列，获取字段名
    for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
      const cell = worksheet.getCell(rowNum, 1)
      const fieldName = getCellValue(cell)
      
      if (fieldName && fieldName.trim() !== '') {
        const trimmedName = fieldName.trim()
        fieldMap.set(rowNum, {
          fieldName: trimmedName,
          rowIndex: rowNum
        })
        console.log(`字段映射: 第${rowNum}行 "${trimmedName}"`)
      }
    }

    if (fieldMap.size === 0) {
      throw new Error('无法识别Excel字段名，请检查文件格式')
    }

    // 7. 根据字段名构建数据结构
    const projectDataMap = new Map<string, any>()
    
    // 为每个检验项目创建初始数据对象
    inspectionProjects.forEach(project => {
      projectDataMap.set(project.name, {
        ProjectName: project.name,
        // 其他字段将在后面填充
      })
    })

    // 8. 解析固定字段的值
    fieldMap.forEach((field, rowNum) => {
      // 跳过检验序列值行，这些行需要特殊处理
      if (field.fieldName.includes('检验序列') && field.fieldName.includes('值')) {
        return
      }
      
      inspectionProjects.forEach(project => {
        const cell = worksheet.getCell(rowNum, project.colIndex)
        const value = getCellValue(cell)
        
        if (!projectDataMap.has(project.name)) {
          projectDataMap.set(project.name, {})
        }
        
        const projectData = projectDataMap.get(project.name)
        
        // 根据字段名映射到对应的属性
        switch (field.fieldName) {
          case '检验类别':
            projectData.ProjectCategoryName = value
            projectData.MeasurementType = value // 检验类别也作为测量类型
            break
          case '特性分级':
            projectData.CharaCteristicGrade = value
            break
          case '目标值':
            projectData.TargetValue = value
            break
          case '最大值':
            projectData.MaxValue = value
            break
          case '最小值':
            projectData.MinValue = value
            break
          case '检验工具':
            projectData.ToolName = value
            break
          case '检验依据':
            projectData.InspectionBasis = value
            break
          case '样品数':
            projectData.SampleNum = value
            break
          case '缺陷数':
            projectData.DefectNum = value
            break
          default:
            // 其他字段暂不处理
            break
        }
        
        projectDataMap.set(project.name, projectData)
      })
    })

    // 9. 解析检验序列值行
    const lineNosData = new Map<string, Map<string, string>>() // LineNos -> 项目名 -> 测量值
    
    fieldMap.forEach((field, rowNum) => {
      // 只处理检验序列值行
      if (field.fieldName.includes('检验序列') && field.fieldName.includes('值')) {
        // 提取序列号，如"检验序列1值" -> "1"
        const match = field.fieldName.match(/检验序列(\d+)值/)
        if (match && match[1]) {
          const lineNo = match[1]
          
          if (!lineNosData.has(lineNo)) {
            lineNosData.set(lineNo, new Map())
          }
          
          const lineData = lineNosData.get(lineNo)!
          
          inspectionProjects.forEach(project => {
            const cell = worksheet.getCell(rowNum, project.colIndex)
            const value = getCellValue(cell)
            if (value && value.trim() !== '') {
              lineData.set(project.name, value.trim())
            }
          })
        }
      }
    })

    // 10. 构建最终结果
    const result: InspectionData[] = []
    
    // 对于每个LineNos和每个检验项目，创建一条记录
    lineNosData.forEach((lineData, lineNo) => {
      inspectionProjects.forEach(project => {
        const measurementValue = lineData.get(project.name)
        
        // 如果没有测量值，跳过
        if (!measurementValue) {
          return
        }
        
        // 获取该检验项目的基础数据
        const baseData = projectDataMap.get(project.name) || {}
        
        // 创建空的数据对象
        const inspectionData = createEmptyInspectionData()
        
        // 填充基础字段
        inspectionData.LineNos = lineNo
        inspectionData.ProjectName = project.name
        inspectionData.ProjectCategoryName = baseData.ProjectCategoryName || ''
        inspectionData.CharaCteristicGrade = baseData.CharaCteristicGrade || ''
        inspectionData.TargetValue = baseData.TargetValue || ''
        inspectionData.MaxValue = baseData.MaxValue || ''
        inspectionData.MinValue = baseData.MinValue || ''
        inspectionData.ToolName = baseData.ToolName || ''
        inspectionData.InspectionBasis = baseData.InspectionBasis || ''
        inspectionData.SampleNum = baseData.SampleNum || '1' // 默认样品数为1
        inspectionData.DefectNum = baseData.DefectNum || '0' // 默认缺陷数为0
        
        // 设置测量值
        inspectionData.ObservedValue = measurementValue
        
        // 设置测量类型
        if (baseData.ProjectCategoryName && !inspectionData.MeasurementType) {
          inspectionData.MeasurementType = baseData.ProjectCategoryName
        }
        
        // 11. 特殊字段处理逻辑
        
        // 从目标值中提取最小值和最大值（如果这两个字段为空）
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

        // 自动计算总和和平均值（如果这两个字段为空且有测量值）
        if (inspectionData.ObservedValue) {
          const { sum, average } = calculateSumAndAverage(inspectionData.ObservedValue)
          if (!inspectionData.ObservedValueSum && sum) {
            inspectionData.ObservedValueSum = sum
          }
          if (!inspectionData.AverageNum && average) {
            inspectionData.AverageNum = average
          }
        }

        // 默认检验结果判断
        if (!inspectionData.InspectionResult) {
          // 可以根据测量值判断是否合格
          if (inspectionData.ObservedValue && inspectionData.MinValue && inspectionData.MaxValue) {
            const min = parseFloat(inspectionData.MinValue)
            const max = parseFloat(inspectionData.MaxValue)
            const measurement = parseFloat(inspectionData.ObservedValue)
            
            if (!isNaN(measurement)) {
              const isInRange = measurement >= min && measurement <= max
              inspectionData.InspectionResult = isInRange ? '合格' : '不合格'
            }
          }
        }

        result.push(inspectionData)
      })
    })

    console.log('特殊横向格式解析完成:', {
      文件名: file.name,
      文件大小: `${(file.size / 1024).toFixed(2)} KB`,
      检验项目数: inspectionProjects.length,
      检验序列数: lineNosData.size,
      解析记录数: result.length
    })

    return result

  } catch (error) {
    console.error('特殊横向格式Excel解析失败:', error)
    throw error
  }
}

/**
 * 检测特殊横向格式的Excel文件
 */
export const detectSpecialHorizontalFormat = (worksheet: ExcelJS.Worksheet): boolean => {
  try {
    // 获取第一行第一列的值
    const a1 = getCellValue(worksheet.getCell(1, 1)).trim()
    
    // 获取第二行第一列的值
    const a2 = getCellValue(worksheet.getCell(2, 1)).trim()
    
    // 获取第三行第一列的值
    const a3 = getCellValue(worksheet.getCell(3, 1)).trim()
    
    // 检查是否是特殊横向格式的特征
    // 特征1：第一行第一列是"检验名称"
    if (a1 !== '检验名称') {
      return false
    }
    
    // 特征2：第二行第一列是"检验类别"
    if (a2 !== '检验类别') {
      return false
    }
    
    // 特征3：第一行第二列应该是数字（检验项目编号）
    const b1 = getCellValue(worksheet.getCell(1, 2)).trim()
    if (!b1 || b1.trim() === '') {
      return false
    }
    
    // 特征4：有"检验序列X值"这样的行
    let hasInspectionSequence = false
    const rowCount = Math.min(worksheet.rowCount || 0, 50) // 检查前50行
    for (let row = 2; row <= rowCount; row++) {
      const cellValue = getCellValue(worksheet.getCell(row, 1)).trim()
      if (cellValue.includes('检验序列') && cellValue.includes('值')) {
        hasInspectionSequence = true
        break
      }
    }
    
    return hasInspectionSequence
  } catch (error) {
    console.error('检测特殊横向格式失败:', error)
    return false
  }
}

/**
 * 增强的解析函数 - 自动检测并选择合适的解析方法
 */
export const parseInspectionExcelEnhancedV2 = async (file: File): Promise<InspectionData[]> => {
  try {
    console.log('使用增强解析函数V2处理文件:', file.name)

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

    // 4. 检测文件格式
    // 首先检测是否是特殊横向格式
    if (detectSpecialHorizontalFormat(worksheet)) {
      console.log('检测到特殊横向格式')
      return await parseHorizontalInspectionExcelSpecial(file)
    }
    
    // 然后检测是否是标准横向格式
    const formatType = detectExcelFormat(worksheet)
    console.log(`检测到文件格式: ${formatType}`)

    // 5. 根据格式选择合适的解析方法
    if (formatType === 'horizontal') {
      return await parseHorizontalInspectionExcel(file)
    } else if (formatType === 'vertical') {
      // 使用现有的竖向解析函数
      return await parseInspectionExcel(file, 'split')
    } else {
      // 如果无法检测，尝试使用特殊横向解析，如果失败再尝试其他方法
      try {
        console.log('格式未知，尝试特殊横向解析...')
        return await parseHorizontalInspectionExcelSpecial(file)
      } catch (error1) {
        console.log('特殊横向解析失败，尝试标准横向解析...')
        try {
          return await parseHorizontalInspectionExcel(file)
        } catch (error2) {
          console.log('标准横向解析失败，尝试竖向解析...')
          return await parseInspectionExcel(file, 'split')
        }
      }
    }
  } catch (error) {
    console.error('增强解析V2失败:', error)
    throw error
  }
}

/**
 * 专门处理特殊横向格式的上传函数
 */
export const handleSpecialHorizontalExcelUpload = async (file: File): Promise<{
  success: boolean
  data: InspectionData[]
  message?: string
  formatType?: string
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
    const data = await parseHorizontalInspectionExcelSpecial(file)
    
    return {
      success: true,
      data,
      message: `成功导入 ${data.length} 条数据 (特殊横向格式)`,
      formatType: 'special_horizontal'
    }

  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: `解析失败: ${error.message || '未知错误'}`
    }
  }
}

/**
 * 更新主处理函数，支持所有格式
 */
export const handleExcelUploadAllFormats = async (file: File, options?: {
  forceFormat?: 'auto' | 'special_horizontal' | 'horizontal' | 'vertical' | 'split' | 'merged'
}): Promise<{
  success: boolean
  data: InspectionData[]
  message?: string
  formatType?: string
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

    let data: InspectionData[] = []
    let formatType = 'unknown'
    
    // 根据选项选择合适的解析方法
    if (options?.forceFormat) {
      switch (options.forceFormat) {
        case 'special_horizontal':
          data = await parseHorizontalInspectionExcelSpecial(file)
          formatType = 'special_horizontal'
          break
        case 'horizontal':
          data = await parseHorizontalInspectionExcel(file)
          formatType = 'horizontal'
          break
        case 'vertical':
          data = await parseInspectionExcel(file, 'split')
          formatType = 'vertical'
          break
        case 'split':
          data = await parseSplitMeasurementExcel(file)
          formatType = 'vertical_split'
          break
        case 'merged':
          data = await parseMergedMeasurementExcel(file)
          formatType = 'vertical_merged'
          break
        case 'auto':
        default:
          data = await parseInspectionExcelEnhancedV2(file)
          // 检测实际使用的格式
          if (data.length > 0) {
            // 通过数据特征判断格式类型
            const firstItem = data[0]
            if (firstItem.LineNos && firstItem.ProjectName) {
              // 检查是否有多个相同的ProjectName但不同LineNos
              const projectNames = [...new Set(data.map(item => item.ProjectName))]
              const lineNosCount = [...new Set(data.map(item => item.LineNos))].length
              
              if (projectNames.length > 1 && lineNosCount > 1) {
                formatType = 'special_horizontal'
              } else if (firstItem.MeasuredValue1 !== undefined) {
                formatType = 'vertical_split'
              } else if (firstItem.ObservedValue && firstItem.ObservedValue.includes(',')) {
                formatType = 'vertical_merged'
              } else {
                formatType = 'horizontal'
              }
            }
          }
          break
      }
    } else {
      // 默认使用增强解析函数V2
      data = await parseInspectionExcelEnhancedV2(file)
      formatType = 'auto_detected'
    }

    return {
      success: true,
      data,
      message: `成功导入 ${data.length} 条数据`,
      formatType
    }

  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: `解析失败: ${error.message || '未知错误'}`
    }
  }
}

