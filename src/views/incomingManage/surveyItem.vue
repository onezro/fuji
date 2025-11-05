<template>
  <div class="report-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :span-method="arraySpanMethod"
      :cell-style="cellStyle"
    >
      <!-- 动态生成列 -->
      <el-table-column
        v-for="(col, index) in columns"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :align="col.align || 'center'"
      >
        <template #header="scope">
          <div v-html="scope.column.label"></div>
        </template>
        <template #default="scope">
          <div :class="{'red-text': scope.row[scope.column.property + 'Red']}">
            {{ scope.row[scope.column.property] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 表格列配置
const columns = ref([
  { label: '进料检验通知部门', prop: 'noticeDept', width: 120 },
  { label: '事务部', prop: 'dept', width: 80 },
  { label: '受理部门', prop: 'acceptDept', width: 100 },
  { label: '', prop: 'empty1', width: 80 },
  { label: '外观检查', prop: 'appearanceCheck', width: 100 },
  { label: 'AQL Level II 1.0', prop: 'aqlLevel', width: 130 },
  { label: '页次', prop: 'page', width: 80 },
  { label: '1/1', prop: 'pageNum', width: 80 },
  { label: '通知日期：25.06.19', prop: 'noticeDate', width: 150 },
  { label: '', prop: 'empty2', width: 80 },
  { label: '', prop: 'empty3', width: 80 },
  { label: '', prop: 'empty4', width: 80 },
  { label: '', prop: 'empty5', width: 80 },
  { label: '', prop: 'empty6', width: 80 },
  { label: '', prop: 'empty7', width: 80 },
  { label: '', prop: 'empty8', width: 80 },
  { label: '', prop: 'empty9', width: 80 },
  { label: '备注', prop: 'remark', width: 100 },
]);

// 表格数据
const tableData = ref([
  // 标题行
  {
    noticeDept: '进料检验报告',
    dept: '',
    acceptDept: '',
    empty1: '',
    appearanceCheck: '',
    aqlLevel: '',
    page: '',
    pageNum: '',
    noticeDate: '',
    empty2: '',
    empty3: '',
    empty4: '',
    empty5: '',
    empty6: '',
    empty7: '',
    empty8: '',
    empty9: '',
    remark: '',
    isTitle: true
  },
  // 第一行信息
  {
    noticeDept: '通知人签名',
    dept: '周丽琛',
    acceptDept: '受理人签名',
    empty1: '',
    appearanceCheck: 'ISO 2859',
    aqlLevel: '',
    page: '来料种类数',
    pageNum: '人工填写',
    noticeDate: '',
    empty2: '',
    empty3: '',
    empty4: '',
    empty5: '',
    empty6: '',
    empty7: '',
    empty8: '',
    empty9: '',
    remark: ''
  },
  // 第二行信息
  {
    noticeDept: '来料日期',
    dept: '25.06.19',
    acceptDept: '受理日期',
    empty1: '',
    appearanceCheck: '*(汽车产品 C=0)',
    aqlLevel: '',
    page: '',
    pageNum: '',
    noticeDate: '',
    empty2: '',
    empty3: '',
    empty4: '',
    empty5: '',
    empty6: '',
    empty7: '',
    empty8: '',
    empty9: '',
    remark: ''
  }
]);

// 单元格合并方法
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 标题行合并所有列
  if (rowIndex === 0) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 18 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
  
  // 其他合并规则...
};

// 单元格样式设置
const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  // 标题行样式
  if (rowIndex === 0) {
    return {
      'font-weight': 'bold',
      'font-size': '16px',
      'text-align': 'center',
      'background-color': '#ffff99'
    };
  }
  
  // 信息行样式
  if (rowIndex < 3) {
    return {
      'font-weight': 'bold',
      'background-color': '#f2f2f2',
      'text-align': 'center'
    };
  }
  
  return { 'text-align': 'center' };
};
</script>

<style scoped>
.report-container {
  padding: 20px;
}

::v-deep .el-table th {
  background-color: #f2f2f2;
}

.red-text {
  color: #ff0000;
}
</style>
