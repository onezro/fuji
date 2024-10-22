<template>
    <div class="p-2">
      <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
        <div>
        <el-form ref="formRef" class="form" :inline="true" label-width="">
          <el-form-item label="时间" class="mb-2">
            <el-date-picker
              size="small"
              :shortcuts="shortcuts"
              v-model="dateValue"
              type="daterange"
              range-separator="-"
              value-format="YYYY-MM-DD"
              @change="dateChange"
              claerable
            />
          </el-form-item>
          <el-form-item label="任务单号" class="mb-2">
            <el-input
              v-model="searchForm.TaskNo"
              style="width: 240px"
              size="small"
              placeholder="请输入"
              claerable
            ></el-input>
          </el-form-item>
          <el-form-item label="工单号" class="mb-2">
            <el-input
              v-model="searchForm.OrderNumber"
              style="width: 240px"
              size="small"
              placeholder="请输入"
              claerable
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button
              class="ml-3"
              type="primary"
              size="small"
              @click="getTaskList"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
          <table-tem
            size="small"
            :show-index="true"
            :tableData="tableData"
            :tableHeight="tableHeight"
            :columnData="columnData"
            :pageObj="pageObj"
          >
          </table-tem>
        </div>
      </el-card>
      <el-dialog
        v-model="dialogVisible"
        title="生产自检"
        width="1100"
        :align-center="true"
        @closed="clearForm"
      >
        <div class="w-full">
          <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
            <el-form-item
              label-width="auto"
              label="元件未插到位，极性插错、反向，出脚不标准"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="焊点拉尖、虚焊、桥接、焊点粗糙"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="锡渣残留、异物"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="浮高、溢锡"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="元件螺丝漏锁，未锁到位"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="元件漏打胶屏蔽罩漏装，未装到位"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="PCB板损坏、异物、元件撞件，板边不整洁，有毛刺、缺口"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="周边SMT元件少"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="其它"
              class="mb-0"
            >
            <div class="w-full flex items-center">
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
              <el-input  class="ml-4"
                v-model="form.lineName"
                style="width: 1000px"
                size="small"
                placeholder="请输入"
              ></el-input>
            </div>
            </el-form-item>
          </el-form>
          <br>
          <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
            <el-form-item
              label-width="auto"
              label="质量确认"
              class="mb-0"
            >
              <el-input
                v-model="form.lineName"
                style="width: 240px"
                size="small"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label-width="auto"
              label="首件状态确认"
              class="mb-0"
            >
            <el-radio-group v-model="checkForm.lineName">
      <el-radio value="1" size="small">合格</el-radio>
      <el-radio value="2" size="small">不合格   </el-radio>
    </el-radio-group>
            </el-form-item>
          </el-form>
          <br>
          <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
            <el-row>
                <el-col :span="12">
            <el-form-item
              label-width="auto"
              label="不良现象"
              class="mb-0"
            >
              <el-input
                v-model="form.lineName"
                style="width: 500px"
                type="textarea"
                size="small"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
                </el-col>
                <el-col :span="12">
            <el-form-item
              label-width="auto"
              label="改善对策"
              class="mb-0"
            >
              <el-input
                v-model="form.lineName"
                style="width: 500px"
                type="textarea"
                size="small"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
                </el-col>
            </el-row>
          </el-form>
          <el-divider />
          <div class="w-full h-full flex justify-between items-end">
            <div>
              <el-upload
                class="upload-demo"
                drag
                action=""
                :multiple="false"
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  拖拽文件到此 或 <em>点击这里选择上传</em>
                </div>
                <template #tip>
                  <div v-if="fileList.length" class="el-upload-list__item w-full">
                    <span class="el-upload-list__file-name">{{
                      fileList[0].name
                    }}</span>
                  </div>
                </template>
              </el-upload>
            </div>
            <div>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">提交</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    ElMessage,
    ElNotification,
    ElMessageBox,
    UploadFile,
  } from "element-plus";
  import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
  import tableTem from "@/components/tableTem/index.vue";
  import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
  import {
    ref,
    unref,
    nextTick,
    reactive,
    onBeforeMount,
    watch,
    computed,
    onMounted,
    onBeforeUnmount,
  } from "vue";
  import { GetInspectack, FirstStage, SecondStage, ThirdStage } from "@/api/operate";
  const tableHeight = ref(0);
  const dialogImageUrl = ref("");
  const disabled = ref(false);
  const dialogVisible = ref(false);
  const detailsTableData = ref<any[]>([{}, {}, {}, {}, {}, {}]);
  const tableData = ref<any[]>([{}]);
  const pageObj = ref({
    pageSize: 10,
    currentPage: 1
  });
  const dateValue = ref<any[]>([]);
  const fileList = ref<any[]>([]);
  
  interface formTS {
    lineName: string;
  }

interface searchFormTS {
  StartTime: string;
  EndTime: string;
  TaskNo: string;
  OrderNumber: string;
}
  
  interface checkFormTS {
    lineName: boolean;
  }
  
  const form = ref<formTS>({
    lineName: "",
  });
  
  const checkForm = ref<checkFormTS>({
    lineName: false,
  });

const searchForm = ref<searchFormTS>({
  StartTime: "",
  EndTime: "",
  TaskNo: "",
  OrderNumber: ""
});
  
  onBeforeMount(() => {
    getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  dateValue.value = [start, end];
  searchForm.value.StartTime = start;
  searchForm.value.EndTime = end;
  });

  onMounted(() => {
  getTaskList();
    window.addEventListener("resize", getScreenHeight);
  });
  onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
  });

const getTaskList = () => {
  GetInspectack({}).then((res:any) => {
    if (res && res.success) {
      tableData.value = res.content;
    }
  })
}
  
  const handleInput = () => {};

//时间变化时候触发
const dateChange = (data: any) => {
  if (data !== null && data !== "") {
    searchForm.value.StartTime = data[0];
    searchForm.value.EndTime = data[1];
  } else {
    searchForm.value.StartTime = "";
    searchForm.value.EndTime = "";
  }
};
  
  const addDetail = () => {
    detailsTableData.value.push({});
  };
  
  const handleDelete = (index: any) => {
    detailsTableData.value.splice(index, 1);
  };
  
  const clearForm = () => {
    form.value = {
      lineName: "",
    };
    checkForm.value = {
      lineName: false,
    };
    detailsTableData.value = [{}, {}, {}, {}, {}, {}];
    fileList.value = [];
  };
  
  const handleExceed = (files: any, fileList: any) => {
    console.log(`Limit of one file is exceeded.`);
  };
  
  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      ElNotification({
        title: "提示",
        message: "只允许上传图片",
        type: "warning",
      });
      return false;
    }
    // 假设文件验证通过，将文件添加到fileList中（实际上不需要，因为el-upload会自动管理）
    // 但为了演示，我们在这里手动管理一下
    fileList.value = [file];
    // 返回false以阻止自动上传（因为我们可能要在其他地方处理上传逻辑）
    return false;
  };
  
  const handleSuccess = (response: any, file: any, fileList: any) => {
    console.log(`File ${file.name} uploaded successfully.`);
  };
  
  const handleError = (response: any, file: any, fileList: any) => {
    console.log(`Failed to upload file ${file.name}.`);
  };
  
  const columnData = reactive([
  {
    text: true,
    prop: "TaskNo",
    label: "任务单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TaskTime",
    label: "任务创建时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Shift",
    label: "班次",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "OrderNumber",
    label: "工单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "OrderQuantity",
    label: "工单数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Product",
    label: "产品",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductModel",
    label: "产品机型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "未提交", type: "primary", number: false },
      { text: "已提交", type: "success", number: true },
    ],
    prop: "FirstStage",
    label: "生产自检状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "未提交", type: "primary", number: false },
      { text: "已提交", type: "success", number: true },
    ],
    prop: "SecondStage",
    label: "设备自检状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "未提交", type: "primary", number: false },
      { text: "已提交", type: "success", number: true },
    ],
    prop: "ThirdStage",
    label: "质量确认状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "InspectResult",
    label: "检查结果",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "DocumentNo",
    label: "文档编号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "DocumentVer",
    label: "文档版本",
    width: "",
    min: true,
    align: "center",
  }
]);
  
  const flexColumnWidth = (label: any, prop: any) => {
    const arr = detailsTableData?.value.map((x: { [x: string]: any }) => x[prop]);
    arr.push(label); // 把每列的表头也加进去算
    // console.log(arr);
    return getMaxLength(arr) + 25 + "px";
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
    html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${16}px; font-family: Arial, sans-serif;`;
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
  
  const getScreenHeight = () => {
    nextTick(() => {
      tableHeight.value = window.innerHeight - 195;
    });
  };

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
  </script>
  
  <style scoped></style>
  