<template>
    <div class="p-[10px]">
      <el-card shadow="always" :body-style="{ padding: '10px' }">
        <div class="pb-[10px] flex justify-between">
          <el-button type="primary" @click="addVisible = true">添加</el-button>
          <div class="flex">
              <el-input v-model="form.type" style="width: 240px" placeholder="请输入"></el-input>
              <el-button class="ml-3" type="primary" @click="">查询</el-button>
          </div>
        </div>
        <el-table
          :data="
            tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          "
          stripe
          border
          fit
          :height="tableHeight"
          row-key="step1"
          :tree-props="{ children: 'stepItemList' }"
        >
          <!-- <el-table-column label="序号" width="60px" type="index" align="center" /> -->
          <el-table-column prop="WorkSection" label="产品编号"> </el-table-column>
          <el-table-column prop="ProductName" label="类型"> </el-table-column>
          <el-table-column prop="Step" label="消耗量"> </el-table-column>
          <el-table-column prop="StepName" label="工序"> </el-table-column>
          <el-table-column prop="SubItem" label="面别"> </el-table-column>
          <el-table-column prop="SubItemName" label="描述"> </el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template #default="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="EditPen"
                  size="small"
                  @click.prevent=""
                ></el-button>
              </el-tooltip>
  
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click.prevent=""
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
        @close=""
        title="添加"
        width="50%"
      >
        <el-form
          ref="formRef"
          :model="form"
          label-position="left"
          label-width="auto"
        >
          <el-form-item label="类型" prop="WorkSection">
            <el-input v-model="form.type" style="width: 240px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="form.Des"
              autosize
              type="textarea"
              placeholder=""
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <span class="dialog-footer">
            <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
            <el-button @click=""> 取消 </el-button>
            <el-button type="primary" @click=""> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
  import {
    InsertInspect,
    GetInspectData,
    UpdateInspectData,
    DeleteInspectData,
  } from "@/api/permiss";
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
  
  interface tableDataTS {
    number: string;
    type: string;
    consumption: string;
    Step1: string;
    SubItem1: string;
    process: string;
    FaceType: string;
    Des: string;
  }
  
  interface formTS {
    type: string;
    Des: string;
  }
  
  const pageSize = ref(10);
  const currentPage = ref(1);
  const tableHeight = ref(0);
  const addVisible = ref(false);
  const inputValue = ref();
  
  const tableData = ref<tableDataTS[]>([]);
  const form = ref<formTS>({
    type: "",
    Des: "",
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
  </script>
  
  <style scoped>
  .el-pagination {
    justify-content: center;
  }
  </style>
  