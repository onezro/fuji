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
            @submit.native.prevent
          >
            <el-form-item label="工单">
              <el-input
                v-model="ContainerName"
                class="input-with-select"
                @keyup.enter.native="inputGetData()"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="table_container">
          <div class="flex justify-between">
            <div>
              <el-button size="small" type="" class="mr-4" @click=""
                >查询</el-button
              >
            </div>
            <!-- <div class="flex items-center">
              <el-button size="small" type="primary" class="mr-4" @click="inStore"
                >申请入库</el-button
              >
              <el-checkbox v-model="IsPrint">是否打印</el-checkbox>
            </div> -->
          </div>
          <el-table
            size="small"
            :data="tableData"
            ref="multipleTable"
            border
            :height="tableHeight"
            :row-key="rowKey"
            style="width: 100%"
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
            <el-table-column
              prop="MfgorderName"
              label="工单号"
              align="center"
              :min-width="flexColumnWidth('工单号', 'MfgorderName')"
            >
            </el-table-column>
            <el-table-column
              prop="ContainerName"
              label="成品条码"
              align="center"
              :min-width="flexColumnWidth('成品条码', 'ContainerName')"
            >
            </el-table-column>
            <el-table-column
              prop="OAorder"
              label="送检单"
              align="center"
              :min-width="flexColumnWidth('送检单', 'OAorder')"
            >
            </el-table-column>
            <el-table-column
              prop="ProductName"
              label="产品编码"
              align="center"
              :min-width="flexColumnWidth('产品编码', 'ProductName')"
            >
            </el-table-column>
            <el-table-column
              prop="OATime"
              label="检验时间"
              align="center"
              :min-width="flexColumnWidth('检验时间', 'OATime')"
            >
            </el-table-column>
            <el-table-column
              prop="QAResult"
              label="抽检结果"
              align="center"
              :min-width="flexColumnWidth('抽检结果', 'QAResult')"
              :filters="[
                { text: '合格', value: 'Y' },
                { text: '不合格', value: 'N' },
                { text: '送检中', value: '' },
              ]"
            >
              <template #default="scope">
                <div v-if="scope.row.QAResult === 'Y'">合格</div>
                <div v-if="scope.row.QAResult === 'N'">不合格</div>
                <div v-if="scope.row.QAResult === ''"></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="InspecResult"
              label="检验单结果"
              align="center"
              :min-width="flexColumnWidth('检验单结果', 'InspecResult')"
              :filters="[
                { text: '合格', value: 'Y' },
                { text: '不合格', value: 'N' },
              ]"
            >
              <template #default="scope">
                <div v-if="scope.row.InspecResult === 'Y'">合格</div>
                <div v-if="scope.row.InspecResult === 'N'">不合格</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-top: 15px">
            <el-pagination
              align="center"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchForm.CurrentPage"
              :page-size="searchForm.PageSize"
              :page-sizes="[5, 10, 20, 50, 100]"
              layout="total,sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
      <el-dialog
        v-model="dialogVisible"
        width="70%"
        title="单号详情"
        align-center
        @close="filterTableData = []"
      >
        <div class="w-full">
          <div class="table_container">
            <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
              <el-tab-pane label="未入库的成品信息" name="shelveMaterial">
                <el-table
                  :data="filterTableData"
                  size="small"
                  stripe
                  border
                  fit
                  :tooltip-effect="'dark'"
                  :height="400"
                  ref="tableRef"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                    align="center"
                    fixed
                  />
                  <el-table-column
                    prop="ContainerName"
                    label="成品条码"
                    :min-width="150"
                  >
                  </el-table-column>
                  <el-table-column prop="InspectionOrder" label="送检单">
                  </el-table-column>
  
                  <el-table-column
                    prop="PackagingBoxNumber"
                    label="箱条码"
                    align="center"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="箱信息" name="boxMaterial">
                <el-table
                  :data="boxTableData"
                  size="small"
                  stripe
                  border
                  fit
                  :tooltip-effect="'dark'"
                  :height="400"
                  ref="tableRef"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                    align="center"
                    fixed
                  />
                  <el-table-column
                    prop="ContainerName"
                    label="成品条码"
                    :min-width="150"
                  >
                  </el-table-column>
                  <el-table-column prop="InspectionOrder" label="送检单">
                  </el-table-column>
                  <el-table-column
                    prop="PackagingBoxNumber"
                    label="箱条码"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="Quantity"
                    label="MES产品数量"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column prop="State" label="送检结果" align="center">
                    <template #default="scope">
                      <div v-if="scope.row.State === 'Y'">合格</div>
                      <div v-if="scope.row.QAResulStatet === 'N'">不合格</div>
                      <div v-if="scope.row.State === null">送检中</div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- <template #footer>
          <div class="dialog-footer">
            <el-button type="" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="applyFor">申请</el-button>
          </div>
        </template> -->
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { shortcuts } from "@/utils/dataMenu";
  import {
    ElMessageBox,
    ElMessage,
    ElLoading,
    ElNotification,
  } from "element-plus";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import {
    InspectQueryWorkflowList,
    SavePackagingBoxNumber,
    ScanPackagingBoxNumberInfo
  } from "@/api/asyApi";
  import { ProductInspectDetailsHistory } from "@/api/report";
  import type { InspectionResult } from "@/typing";
  import {
    ref,
    reactive,
    watch,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
  } from "vue";
  const total = ref(0);
  const userStore = useUserStoreWithOut();
  const loginName = userStore.getUserInfo;
  const tableData = ref<any>([]);
  const pageSize = ref(10);
  const currentPage = ref(1);
  const tableHeight = ref(0);
  const order = ref("");
  const choiceList = ref<any[]>([]);
  const filterTableData = ref<any[]>([]);
  const boxTableData = ref<any[]>([]);
  const interval = ref<any>(null);
  const multipleTable = ref();
  const date = ref();
  const IsPrint = ref(false);
  const activeName = ref("shelveMaterial");
  const ContainerName = ref('')
  const getDataText = reactive({
    inspectType: "",
    inspect: "",
    dateStart: "",
    dateEnd: "",
  });
  const selectForm = ref({
    MfgOrderName: "",
    ProductModel: "",
    ProductName: "",
    ProductDesc: "",
    QTY: null,
  });
  const orderNumber = ref("order");
  const orderList = ref([
    {
      lable: "单号",
      value: "order",
    },
    {
      lable: "时间",
      value: "times",
    },
  ]);
  const value1 = ref([]);
  const dialogVisible = ref(false);
  const searchForm = ref({
    MfgOrderName: "",
    StartTime: "",
    EndTime: "",
    PageSize: 10,
    CurrentPage: 1,
  });
  
  watch(
    () => value1.value,
    (data) => {
      console.log(data);
      getDataText.dateStart = data[0];
      getDataText.dateEnd = data[1];
    }
  );
  
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
    getScreenHeight();
  });
  
  onMounted(() => {
    // interval.value = setInterval(() => {
    //   getData(order.value);
    // }, 2000);
    window.addEventListener("resize", getScreenHeight);
  });
  onBeforeUnmount(() => {
    // clearInterval(interval.value);
    window.addEventListener("resize", getScreenHeight);
  });
  
  const handleSelectionChange = (data: any) => {
    choiceList.value = data;
  };
  
  const dateChange = () => {
    if (date.value !== null && date.value.length !== 0) {
      searchForm.value.StartTime = date.value[0];
      searchForm.value.EndTime = date.value[1];
    } else {
      searchForm.value.StartTime = "";
      searchForm.value.EndTime = "";
    }
  };
  
  const inputGetData = () => {
    ScanPackagingBoxNumberInfo(ContainerName.value).then((res:any) => {
      if (res.success) {
        tableData.value = res.content;
      }
    })
  };
  
  const getDetail = async () => {
    InspectQueryWorkflowList()
  };
  
  const rowKey = (row: any) => {
    return row.PackagingBoxNumber;
  };
  
  const selectable = (row: any) => {
    // if (row.QAResult === "N" || row.QAResult === null) {
    //   return false;
    // }
    // if (row.StorageSta === "StorageHalfway" || row.StorageSta === "Storage") {
    //   return false;
    // }
    return true;
  };
  
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
  
  const inStore = () => {
    // if (choiceList.value.length === 0) {
    //     ElNotification({
    //       title: "提示信息",
    //       message: '请选择',
    //       type: "warning",
    //     });
    //     return;
    // }
    let arr: any = [];
    choiceList.value.forEach((element) => {
      if (
        arr.some((obj: any) => obj.InspectionOrder === element.InspectionOrder)
      ) {
      } else {
        arr.push(element);
      }
    });
  };
  
  const flexColumnWidth = (label: any, prop: any) => {
    const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
    arr.push(label); // 把每列的表头也加进去算
    // console.log(arr);
    return getMaxLength(arr) + 25 + "px";
  };
  
  const handleSizeChange = (val: any) => {
    searchForm.value.CurrentPage = 1;
    searchForm.value.PageSize = val;
  };
  const handleCurrentChange = (val: any) => {
    searchForm.value.CurrentPage = val;
  };
  
  const getScreenHeight = () => {
    nextTick(() => {
      tableHeight.value = window.innerHeight - 310;
    });
  };
  </script>
  
  <style lang="scss" scoped></style>
  <style scoped>
  .el-pagination {
    justify-content: center;
  }
  </style>
  