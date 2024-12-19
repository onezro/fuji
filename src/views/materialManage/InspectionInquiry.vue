<template>
    <div class="p-[10px]">
      <el-card shadow="always" :body-style="{ padding: '10px' }">
        <div>
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            size="small"
            label-width="85px"
          >
            <el-form-item label="工单">
              <el-input
                v-model="order"
                class="input-with-select"
                @keyup.enter.native="getData(order)"
              >
              </el-input>
              <!-- <el-select-v2
      v-model="value"
      :options="options"
      placeholder="Please select"
      size="large"
      style="width: 240px"
    /> -->
              <!-- <el-select-v2 v-model="form.MfgOrderName" :options="orderList" filterable
                :props="orderProps" style="width: 180px"  @change="orderChange"/> -->
            </el-form-item>
            <el-form-item label="产品机型">
              <el-input
                v-model="selectForm.productModel"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input
                v-model="selectForm.ProductName"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="计划数量">
              <el-input
                v-model="selectForm.num"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品描述">
              <el-input
                style="width: 420px"
                type="textarea"
                v-model="selectForm.ProductDesc"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="table_container">
          <div class="flex justify-between">
            <div></div>
            <el-button size="small" type="">入库</el-button>
          </div>
          <el-table size="small" :data="tableData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )
            " border :height="tableHeight" row-key="step1" style="width: 100%"
            @selection-change="handleSelectionChange"
            >
            <el-table-column
              type="selection"
              width="45"
               label="选择"
                align="center"
            />
            <el-table-column type="index" label="序号" width="50" align="center">
            </el-table-column>
            <el-table-column prop="InspectionOrder" label="送检单号" width="180" align="center" :min-width="flexColumnWidth('送检单号', 'InspectionOrder')">
            </el-table-column>
            <el-table-column prop="PackagingBoxNumber" label="包装箱号" align="center":min-width="flexColumnWidth('包装箱号', 'PackagingBoxNumber')"> </el-table-column>
            <el-table-column prop="StorageQty" label="包装箱数量" align="center":min-width="flexColumnWidth('包装箱数量', 'StorageQty')"> </el-table-column>
            <el-table-column prop="Quantity" label="MES产品数量" align="center":min-width="flexColumnWidth('MES产品数量', 'Quantity')"> </el-table-column>
            <el-table-column prop="InspectionTime" label="时间" align="center":min-width="flexColumnWidth('时间', 'InspectionTime')"> </el-table-column>
            <el-table-column prop="QAResult" label="送检结果" align="center":min-width="flexColumnWidth('送检结果', 'QAResult')">
              <template #default="scope">
                <div>
                  {{ scope.row.QAResult === 'Y' ? "合格" : "不合格" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="StorageSta" label="入库状况" align="center":min-width="flexColumnWidth('入库状况', 'StorageSta')"> </el-table-column>
          </el-table>
          <div class="block" style="margin-top: 15px">
            <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
              layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {shortcuts} from "@/utils/dataMenu"
  import { ProductInspectDetailsHistory } from "@/api/asyApi";
  import type { InspectionResult } from "@/typing";
  import { ref, reactive, watch, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
  const tableData = ref<any>([]);
  const pageSize = ref(10);
  const currentPage = ref(1);
  const tableHeight = ref(0);
  const order = ref('');
  const choiceList = ref([])
  const getDataText = reactive({
    inspectType: "",
    inspect: "",
    dateStart: "",
    dateEnd: "",
  })
  const selectForm = ref({
    orderNumber:'',
    num:0,
    mfgOrder:'',
    productModel:'',
    ProductName:'',
    ProductDesc:'',
    
  })
  const orderNumber = ref('order')
  const orderList = ref([
    {
      lable: "单号",
      value: "order",
    },
    {
      lable: "时间",
      value: "times",
    },
  ])
  const value1 = ref([])
  
  watch(() => value1.value, (data) => {
    console.log(data)
    getDataText.dateStart = data[0];
    getDataText.dateEnd = data[1];
  })
  
  // watch(() => inquire.value, (newData, oldData) => {
  //   if (newData == "times") {
  //     getDataText.inspect = "*";
  //   } else {
  //     getDataText.inspect = "";
  //   }
  //   if (newData != oldData) {
  //     getDataText.inspectType = "";
  //   }
  // })
  onBeforeMount(() => {
    getScreenHeight()
  })
  
  onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
  
  });
  onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
  })

  
const handleSelectionChange = (data: any) => {
};

const getData = (str:any) => {
  ProductInspectDetailsHistory({MfgOrderName:str}).then((res:any) => {
    tableData.value = res.content;
  })
}
  
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};

const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};
  
  const handleSizeChange = (val: any) => {
    currentPage.value = 1;
    pageSize.value = val;
  };
  const handleCurrentChange = (val: any) => {
    currentPage.value = val;
  };
  
  const getScreenHeight = () => {
    nextTick(() => {
      tableHeight.value = window.innerHeight - 280;
    });
  };
  </script>
  
  <style lang="scss" scoped></style>
  <style scoped>
  .el-pagination {
    justify-content: center;
  }
  </style>