<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" label-width="">
          <el-form-item label="查询条件1" class="mb-2">
            <el-input
              v-model="form.lineName"
              style="width: 240px"
              size="small"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="查询条件2" class="mb-2">
            <el-input
              v-model="form.lineName"
              style="width: 240px"
              size="small"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button class="ml-3" type="primary" size="small">查询</el-button>
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
            <el-form-item label="波峰焊" class="mb-2">
                <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item label="程序员" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <div>设备关键设置确认:</div>
            <el-form-item label="助焊剂喷雾流量" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="锡炉温度" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="链速" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="预热区温度1" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="预热区温度2" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="预热区温度3" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="预热区温度4" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="技术员" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <br>
            <el-form-item
            label-width="auto"
              label="对炉温进行温度测试，符合SOP要求"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
            label-width="auto"
              label="首件炉后焊接效果状态确认OK"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
          </el-form>
          <el-divider />
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            label-width="7rem"
          >
            <el-form-item label="助焊剂量" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="锡炉温度" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="预热时间" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="预热区温度" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="技术员" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 180px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <br>
            <el-form-item
            label-width="auto"
              label="对炉温进行温度测试，符合SOP要求"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
            label-width="auto"
              label="首件炉后焊接效果状态确认OK"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
          </el-form>
          <el-divider />
          <div class="w-full h-full flex justify-between">
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
      <!-- <div class="el-upload__tip">
        jpg/png
      </div> -->
      <div v-if="fileList.length" class="el-upload-list__item w-full">  
        <span class="el-upload-list__file-name">{{ fileList[0].name }}</span>  
      </div>  
    </template>
  </el-upload>
            </div>
            <div>1</div>
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
const tableHeight = ref(0);
const dialogImageUrl = ref("");
const disabled = ref(false);
const dialogVisible = ref(false);
const detailsTableData = ref<any[]>([{}, {}, {}, {}, {}, {}]);
const tableData = ref<any[]>([{}]);
const pageObj = ref({
  pageSize: 10,
  currentPage: 1,
  isShow: -1,
});
const fileList = ref<any[]>([]);

interface formTS {
  lineName: string;
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

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const handleInput = () => {};

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
    prop: "BD_RequestNo",
    label: "申请编号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "RequestTypeName",
    label: "申请类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MfgOrderName",
    label: "工单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_ProductModel",
    label: "机型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    isOperation: true,
    label: "操作",
    width: "60",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "自检",
        icon: "Document",
        buttonClick: () => {
          dialogVisible.value = true;
        },
      },
    ],
  },
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
    tableHeight.value = window.innerHeight - 150;
  });
};
</script>

<style scoped></style>
