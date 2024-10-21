<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" label-width="">
            <el-form-item label="查询条件1" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 240px" size="small"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="查询条件2" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 240px" size="small"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="" class="mb-2">
              <el-button class="ml-3" type="primary" size="small"
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
      width="1300"
      :align-center="true"
      @closed="clearForm"
    >
      <div class="w-full flex">
        <div class="w-[80%]">
          <el-form ref="formRef" class="form" :inline="true" label-width="5rem">
            <el-form-item label="日期/时间" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="机种型号" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="生产工单" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="批量" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="类型" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="表单编号" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="组长" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="拉长" class="mb-2">
              <el-input
                v-model="form.lineName"
                style="width: 220px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-form>
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            label-width="460px"
            label-position="left"
          >
            <el-form-item
              label="是否对物料料号、物料规格、十五丝印进行一一核对"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label="插件方向及对应插件位置是否OK,元件出脚是否标准"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item label="焊点是否饱满OK" class="mb-0">
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label="元件螺丝是否漏锁、锁到位，元件是否漏打胶，屏蔽罩是否漏装、装到位"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item
              label="PCB板是否有损坏、异物、元件撞件，板边是否整洁，是否有毛刺、缺口"
              class="mb-0"
            >
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item label="SOP是否符合生产实际作业" class="mb-0">
              <el-checkbox v-model="checkForm.lineName"></el-checkbox>
            </el-form-item>
            <el-form-item label="BOM文件编号" class="mb-0" label-width="atuo">
              <el-input
                v-model="form.lineName"
                style="width: 340px"
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="w-[20%]">
          <div class="w-full h-full">
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
        </div>
      </div>
      <div class="w-full flex justify-between mt-2">
        <div class="invisible">
          <el-button size="small">增加一条明细</el-button>
        </div>
        <div class="text-xl text-[#006487]">物料及所插元件位置确认明细</div>
        <div>
          <el-button @click="addDetail" size="small" type="primary">增加一条明细</el-button>
        </div>
      </div>
      <el-table
        :data="detailsTableData"
        size="small"
        stripe
        border
        fit
        :tooltip-effect="'dark'"
        :height="250"
        row-key="MaterialName"
      >
        <el-table-column
          type="index"
          align="center"
          fixed
          label="序号"
          width="60"
        />
        <!-- <el-table-column
              prop="SpecName"
              label="料号"
              align="center"
              :min-width="flexColumnWidth('料号', 'SpecDesc')"
            >
            </el-table-column> -->
        <el-table-column prop="RequestQty" align="center" label="料号">
          <template #default="scope">
            <el-input
              v-model="scope.row.RequestQty"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="RequestQty" align="center" label="物料规格描述">
          <template #default="scope">
            <el-input
              v-model="scope.row.RequestQty"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="RequestQty" align="center" label="插件位置号">
          <template #default="scope">
            <el-input
              v-model="scope.row.RequestQty"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="RequestQty" align="center" label="用量">
          <template #default="scope">
            <el-input
              v-model="scope.row.RequestQty"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="RequestQty" align="center" label="方向与极性">
          <template #default="scope">
            <el-input
              v-model="scope.row.RequestQty"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="RequestQty"
          align="center"
          label="操作"
          :width="60"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="删除"
              placement="right"
            >
              <el-button
                icon="DeleteFilled"
                size="small"
                type="danger"
                @click="handleDelete(scope.$index)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox, UploadFile } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
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
const dialogImageUrl = ref('');
const disabled = ref(false);
const dialogVisible = ref(false);
const detailsTableData = ref<any[]>([{}, {}, {}, {}, {}, {}]);
const tableData = ref<any[]>([{}]);
const pageObj = ref({
  pageSize: 10,
  currentPage: 1,
  isShow: -1,
});
const fileList = ref<any[]>([])

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
  detailsTableData.value = [{},{},{},{},{},{}];
  fileList.value = []
};

const handleExceed = (files:any,fileList:any) => {
  console.log(`Limit of one file is exceeded.`);
}

const beforeUpload = (file:any) => { 
      const isImage = file.type.startsWith('image/');  
      if (!isImage) {  
        ElNotification({
          title: '提示',
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
}

const handleSuccess = (response:any,file:any,fileList:any) => {
  console.log(`File ${file.name} uploaded successfully.`);
}

const handleError = (response:any,file:any,fileList:any) => {
  console.log(`Failed to upload file ${file.name}.`);
}

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

<style scoped>
</style>