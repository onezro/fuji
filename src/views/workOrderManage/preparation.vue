<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 3px 8px' }">
      <el-form ref="formRef" class="form" :inline="true"  :model="form">

          <el-form-item label="工单" class="mb-[5px]">
            <el-select
              v-model="form.orderName"
              clearable
              filterable
              style="width: 150px"
            >
              <el-option
                v-for="item in orderList"
                :key="item"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="面别" class="mb-[5px]">
            <el-select
              v-model="form.side"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in sideList"
                :key="item"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="台车" class="mb-[5px]">
            <el-select
              v-model="form.McId"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in McIdList"
                :key="item"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="站位" class="mb-[5px]">
            <el-select
              v-model="form.Station"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in StationList"
                :key="item"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-[5px]">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
          <el-form-item class="mb-[5px]">
            <el-button type="warning" @click="getTableData">亮灯</el-button>
          </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";
const form = ref(
  {
    orderName:'',
    side:'',
    McId:'',
    Station:''
  }
);
const orderList=ref([
  {
    value:'24081206'
  }
])
const McIdList=ref([
  {
    value:'101',
    label:'印刷机'
  }
])
const StationList=ref([
{
    value:'101',
    label:'印刷机'
  }
])
const sideList=ref([
  {
    value:'A',
    label:'A面'
  },
  {
    value:'B',
    label:'B面'
  }
])
const getTableData=()=>{

}
const getData=()=>{
  
}
</script>

<style scoped lang="scss"></style>
