<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px]  pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div></div>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[300px]">
                <div class="w-full h-full border-r border-solid border-[#cbcbcb]">
                    <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-2">
                        <el-form ref="formRef" :model="form" label-width="auto">
                            <el-form-item label="产线">
                                <el-select v-model="form.line" clearable>
                                    <el-option v-for="l in lineList" :label="l.Dec" :value="l.Name" :key="l.Name" />
                                </el-select>
                            </el-form-item>
                            <div class="flex flex-col gap-2">
                                <div class="flex  items-center gap-4 p-1 border border-solid border-[#c6c271]">
                                    <img alt="" style="width: 40px;height: 40px;" src="@/assets/img/dbl.png"
                                        class="ml-10" />
                                    <span class="underline">待备料（{{ }}）</span>
                                </div>
                                <div class="flex  items-center gap-4 p-1 border border-solid border-[#f0b06f]">
                                    <img alt="" style="width: 40px;height: 40px;" src="@/assets/img/ing.png"
                                        class="ml-10" />
                                    <span class="underline">备料中（{{ }}）</span>
                                </div>
                                <div class="flex  items-center gap-4 p-1 border border-solid border-[#09bb07]">
                                    <img alt="" style="width: 40px;height: 40px;" src="@/assets/img/success.png"
                                        class="ml-10" />
                                    <span class="underline">备料完成（{{ }}）</span>
                                </div>
                            </div>
                        </el-form>
                        <div class="flex pt-2">
                            <el-button type="primary"> 备料历史查询</el-button>
                            <el-button type="primary"> 接料亮灯(人工/自动)</el-button>
                        </div>
                    </div>
                    <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
                            <span class="ml-5">消息提示</span>
                        </div>
                    <div class="p-2">
                      
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%-300px)]">
                <!-- <div class="w-full"> -->
                <div class="w-full h-full flex flex-col">
                    <div>
                        <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 工单备料操作</span>
                        </div>
                        <div class="h-[150px] pt-3 pr-5 pl-5">
                            <el-form ref="operateFormRef" :model="operateForm" :inline="true" label-width="auto"> 
                                <el-form-item label="工单号">
                                    <el-input v-model="operateForm.orderName" style="width: 200px;" />
                                </el-form-item>
                                <el-form-item label="面号">
                                    <el-input v-model="operateForm.orderName" style="width: 150px;" />
                                </el-form-item>
                                <el-form-item label="产线">
                                    <el-input v-model="operateForm.orderName" style="width: 200px;" disabled/>
                                </el-form-item>
                                <el-form-item label="工单数量">
                                    <el-input v-model="operateForm.orderName" style="width: 180px;" disabled/>
                                </el-form-item>
                                <el-form-item label="产品编码">
                                    <el-input v-model="operateForm.orderName" style="width: 200px;" disabled/>
                                </el-form-item>
                                <el-form-item label="产品描述">
                                    <el-input v-model="operateForm.orderName" style="width: 450px;" disabled/>
                                </el-form-item>
                                <el-form-item label="状态">
                                    <el-input v-model="operateForm.orderName" style="width: 180px;" disabled/>
                                </el-form-item> 
                            </el-form>
                            <div>
                                <el-button type="primary">重置</el-button>
                                <el-button type="info">开始备料</el-button>
                                <el-button type="success">完成备料</el-button>
                                <el-button type="warning">首套亮灯</el-button>
                                <!-- <el-button type="warning">首套亮灯</el-button> -->
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col flex-1 tabs-css">
                        <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
                            <span class="ml-5">工单物料明细</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const form = ref({
    line: ''
})
const lineList = ref<any[]>([
])
const operateForm=ref({
    orderName:"",
    side:"",
    lineName:"",
    qty:"",
    productName:"",
    productDec:"",
    status:""
})

</script>

<style lang="scss">
.setwidth {
    flex: 0 0 300px;
}
</style>