<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div class="pb-[10px]">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        stripe
        border
        fit
        :height="tableHeight"
        row-key="Step1"
        :tree-props="{ children: 'stepItemList' }"
      >
        <!-- <el-table-column label="序号" width="60px" type="index" align="center" /> -->
        <el-table-column prop="Step1" label="检验工序"> </el-table-column>
        <el-table-column prop="Name" label="检验设备"> </el-table-column>
        <el-table-column prop="SubItem" label="检验编号"> </el-table-column>
        <el-table-column prop="SubItemName" label="检验名称"> </el-table-column>
        <el-table-column prop="SubItemAim" label="检验目标"> </el-table-column>
        <el-table-column prop="SubItemMethod" label="检验方法">
        </el-table-column>
        <el-table-column prop="SubItemBasic" label="检验标准">
        </el-table-column>
        <el-table-column prop="SubItemSolution" label="结果处理方式">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                icon="EditPen"
                size="small"
                @click.prevent="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click.prevent="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-3">
        <el-pagination
          size="large"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close="addCancel()"
      title="添加"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="检验工序" prop="step">
              <el-input v-model="form.step" placeholder="工序" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验设备" prop="name">
              <el-input v-model="form.name" placeholder="检验设备"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容" prop="inspectContent">
          <el-input
            type="textarea"
            v-model="form.inspectContent"
            placeholder="内容"
          ></el-input>
        </el-form-item>

        <!-- <el-form ref="formRef2" :model="formItem" label-position="left" label-width="auto"> -->

        <div v-for="(item, index) in form.stepItemList" :key="index">
          <el-divider>检验子项{{ index + 1 }}</el-divider>
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item
                label="编号"
                :prop="'stepItemList.' + index + '.subItem'"
              >
                <el-input
                  v-model.number="item.subItem"
                  placeholder="子项编号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="名称"
                :prop="'stepItemList.' + index + '.subItemName'"
              >
                <el-input
                  v-model="item.subItemName"
                  placeholder="子项名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item
                label="检查目标"
                :prop="'stepItemList.' + index + '.subItemAim'"
              >
                <el-input
                  type="textarea"
                  v-model="item.subItemAim"
                  placeholder="子项检查目标"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item
                label="检验方法"
                :prop="'stepItemList.' + index + '.subItemMethod'"
              >
                <el-input
                  type="textarea"
                  v-model="item.subItemMethod"
                  placeholder="子项检验方法"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item
                label="检查标准"
                :prop="'stepItemList.' + index + '.subItemBasic'"
              >
                <el-input
                  type="textarea"
                  v-model="item.subItemBasic"
                  placeholder="检查标准"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item
                label="解决办法"
                :prop="'stepItemList.' + index + '.subItemSolution'"
              >
                <el-input
                  type="textarea"
                  v-model="item.subItemSolution"
                  placeholder="子项检查解决办法"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-button v-if="index != 0" type="danger" @click="deleteSon(index)"
            >删除子项</el-button
          >
        </div>
      </el-form>
      <!-- </el-form> -->

      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="addSon"> 增加子项</el-button>
          <el-button type="primary" @click="addSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="editVisible"
      @close="eidtCancel()"
      title="添加"
      width="50%"
    >
      <el-form ref="eidtForm" :model="editForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验工序" prop="step">
              <el-input
                v-model.number="editForm.step"
                placeholder="检验工序"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验设备" prop="name">
              <el-input
                v-model="editForm.name"
                placeholder="检验设备"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容" prop="inspectContent">
          <el-input
            type="textarea"
            v-model="editForm.inspectContent"
            placeholder="内容"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编号">
              <el-input
                v-model.number="editForm.stepItemList[0].subItem"
                placeholder="子项编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input
                v-model="editForm.stepItemList[0].subItemName"
                placeholder="子项名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="检查目标">
              <el-input
                type="textarea"
                v-model="editForm.stepItemList[0].subItemAim"
                placeholder="子项检查目标"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="检验方法">
              <el-input
                type="textarea"
                v-model="editForm.stepItemList[0].subItemMethod"
                placeholder="子项检验方法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查标准">
              <el-input
                type="textarea"
                v-model="editForm.stepItemList[0].subItemBasic"
                placeholder="检查标准"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="解决办法">
              <el-input
                type="textarea"
                v-model="editForm.stepItemList[0].subItemSolution"
                placeholder="子项检查解决办法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>

      <!-- <el-form ref="eidtForm2" :model="stepItemList" label-width="100px">
       
      </el-form> -->

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="editSubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FistTableData, AllInspection } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox, ElTree } from "element-plus";
// import { getFirstMeun, addMeun, deleteMeun, updateMeun } from "@/api/permiss";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
const tableData = ref<InstanceType<typeof FistTableData>[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const formRef = ref();
const form = reactive({
  step: "",
  status: "I",
  name: "",
  inspectContent: "",
  stepItemList: [
    {
      subItemName: "",
      subItem: "",
      subItemMethod: "",
      subItemBasic: "",
      subItemSolution: "",
      subItemAim: "",
      subItemType: "",
    },
  ],
});
const editForm = reactive({
  step: "",
  status: "I",
  name: "",
  inspectContent: "",
  stepItemList: [
    {
      subItemName: "",
      subItem: "",
      subItemMethod: "",
      subItemBasic: "",
      subItemSolution: "",
      subItemAim: "",
      subItemType: "",
    },
  ],
});
const deleteForm = reactive<InstanceType<typeof AllInspection>>({
  product: "",
  inspectType: "WI",
  stepList: [],
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//获取基础数据
const getData = () => {};

const openAdd = () => {
  addVisible.value = true;
};
const addSon = () => {
  form.stepItemList.push({
    subItemName: "",
    subItem: "",
    subItemMethod: "",
    subItemBasic: "",
    subItemSolution: "",
    subItemAim: "",
    subItemType: "",
  });
};
const deleteSon = (index: any) => {
  form.stepItemList = form.stepItemList.filter((v: any, i) => i !== index);
};

const addCancel = () => {
  resetForm();
  // formRef.value.resetFields()
};
//添加确定
const addSubmit = () => {
  console.log(form);
};

//编辑
const handleEdit = (row: any) => {
  eidtData(row);
  editVisible.value = true;
};
const eidtCancel = () => {
  editVisible.value = false;
};
const editSubmit = () => {
  console.log(editForm);
};

const eidtData = (row: any) => {
  editForm.status = row.Status;
  editForm.step = row.Step;
  editForm.name = row.Name;
  editForm.inspectContent = row.InspectContent;
  editForm.stepItemList[0].subItem = row.SubItem;
  editForm.stepItemList[0].subItemAim = row.SubItemAim;
  editForm.stepItemList[0].subItemBasic = row.SubItemBasic;
  editForm.stepItemList[0].subItemMethod = row.SubItemMethod;
  editForm.stepItemList[0].subItemName = row.SubItemName;
  editForm.stepItemList[0].subItemSolution = row.SubItemSolution;
  editForm.stepItemList[0].subItemType = row.SubItemType;
};
//删除
const handleDelete = (row: any) => {
  eidtData(row);

  deleteForm.stepList.push(editForm);
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // deleteRole(row.id).then((data: any) => {
      //   // console.log(res);
      //   if ((data.code = 100200)) {
      //     getData();
      //     ElNotification({
      //       title: "删除成功",
      //       // message: "取消操作",
      //       type: "success",
      //     });
      //   } else {
      //     ElNotification({
      //       title: "删除失败",
      //       // message: "取消操作",
      //       type: "error",
      //     });
      //     // this.$message({
      //     //   type: "error",
      //     //   message: data.msg,
      //     // });
      //   }
      // });
    })
    .catch(() => {
      // ElMessage({
      //   type: "info",
      //   message: "取消操作",
      // });
      ElNotification({
        title: "取消操作",
        // message: "取消操作",
        type: "info",
      });
    });
};

//基础数据处理成树形结构
const dispose = (data: any) => {
  const a: InstanceType<typeof FistTableData>[] = [];
  data.InOrList.forEach((item: any) => {
    let isExist = a.findIndex((ela: any) => ela.Name == item.Name);
    if (isExist != -1) {
      a[isExist].stepItemList.push({
        ...item,
        Step1: a[isExist].Step + "-" + item.SubItem,
      });
      a[isExist].SubItem1++;
    } else {
      const obj: InstanceType<typeof FistTableData> = {
        Name: item.Name,
        Step: item.Step,
        InspectContent: item.InspectContent,
        Step1: item.Step,
        stepItemList: [],
      };
      obj.stepItemList.push({
        ...item,
        Step1: item.Step + "-" + item.SubItem,
      });
      a.push(obj);
    }
  });
  tableData.value = a;
  if (tableData.value.length % pageSize.value == 0 && currentPage.value > 1) {
    currentPage.value--;
  }
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
    tableHeight.value = window.innerHeight - 215;
  });
};
const resetForm = () => {
  form.step = "";
  form.status = "I";
  form.name = "";
  form.inspectContent = "";

  form.stepItemList = form.stepItemList.filter((v: any, i) => i == 0);
  // 重置 stepItemList，这里假设我们只重置第一个对象，或者你可以遍历它们
  form.stepItemList.forEach((item) => {
    item.subItemName = "";
    item.subItem = "";
    item.subItemMethod = "";
    item.subItemBasic = "";
    item.subItemSolution = "";
    item.subItemAim = "";
    item.subItemType = "";
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
