<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[#006487]"> {{ title.stationDec }} </span>
            <el-button type="primary" @click="openDialog">不良品登记</el-button>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[320px] ">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <el-form-item size="large" v-for="f in formHeader" :key="f.value" :label="f.label">
                                <span class="font-bold text-[18px] leading-[30px]"
                                    :class="f.value == 'passNum' ? 'text-[#00B400]' : ''"> {{ formText(f.value)
                                    }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%-320px)]">
                <div class="w-full h-full flex flex-col">
                    <div>
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 扫描条码</span>
                        </div>
                        <div class="h-[120px] p-5">
                            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                                @submit.native.prevent>
                                <el-form-item label="扫描条码">
                                    <el-input v-model="barCode" style="width: 500px;" placeholder="请扫描条码" />
                                </el-form-item>
                                <el-form-item>
                                    <div class="">
                                        ok
                                    </div>
                                </el-form-item>
                            </el-form>
                            <div class="text-xl  font-bold text-[#00B400]">请扫描物料批次条码</div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 tabs-css">
                        <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
                            <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                                <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem>
                            </el-tab-pane>
                            <el-tab-pane label="SOP" name="sop">
                                sop
                                <!-- <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem> -->
                            </el-tab-pane>
                            <el-tab-pane label="工装治具" name='fixtures'>
                                fixtures
                                <!-- <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem> -->
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
        <badInfoTem :visible="editVisible" :list="list" :formHeader="formHeader1" :form="form" :badForm="badForm" :tableData="BadtableData"
            @cancel="editCancel" @submit="editSubmit" @deleteBad="deleteBad" @addBadData="addBadData"  @openAddBad="openAddBad"/>
           
        <!-- <el-dialog :append-to-body="true" :close-on-press-escape="false" align-center  :close-on-click-modal="false" title="不良品登记" v-model="editVisible" width="80%"
            @close="editCancel">
            <div>
                <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                    <span class="ml-5">基本信息</span>
                </div>
                <el-form class="pt-2" ref="formRef" :inline="true" :model="badForm" label-width="auto">
                    <el-form-item label="MES屏条码" prop="name"><el-input disabled v-model="badForm.barCode"
                            style="width: 150px" /></el-form-item>
                    <el-form-item label="工单号" prop="name"><el-input disabled v-model="badForm.barCode"
                            style="width: 150px" /></el-form-item>
                    <el-form-item label="机型" prop="name"><el-input disabled v-model="badForm.barCode"
                            style="width: 150px" /></el-form-item>
                    <el-form-item label="产品编码" prop="name"><el-input disabled v-model="badForm.barCode"
                            style="width: 150px" /></el-form-item>
                    <el-form-item label="产品描述" prop="name"><el-input disabled v-model="badForm.barCode"
                            style="width: 240px" /></el-form-item>
                    <el-form-item label="不良工位" prop="name"><el-input disabled v-model="badForm.barCode"
                            style="width: 150px" /></el-form-item>
                </el-form>
            </div>
            <div>
                <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                    <span class="ml-5">不良品信息</span>
                </div>
                <div class="pt-2">
                    <div class="mb-2"><el-button type="primary">增加</el-button><el-button type="danger">删除</el-button>
                    </div>
                    <el-table :data="BadtableData" stripe border fit :style="{ width: '100%' }" :height="250">
                        <el-table-column type="index" align="center" label="序号" width="60"/>
                        <el-table-column prop="badCode" label="不良代码" />
                        <el-table-column prop="badCodeDec" label="不良代码描述" />
                        <el-table-column prop="backProcess" label="快修返回工序" />
                        <el-table-column prop="remark" label="备注" />
                    </el-table>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editCancel">取消</el-button>
                    <el-button type="primary" @click="editSubmit">确定</el-button>
                </span>
            </template>
</el-dialog> -->
    </div>
</template>

<script lang="ts" setup>
import tableTem from '@/components/tableTem/index.vue'
import badInfoTem from '@/components/badInfoTem/index.vue'
import { useAppStoreWithOut } from '@/stores/modules/app'
import type { Formspan, FormHeader } from "@/typing";
import { ref, reactive, onMounted, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
const appStore = useAppStoreWithOut()
const title=appStore.getOPUIReal()
const barCode = ref('')
const tabsValue = ref('history')
const editVisible = ref(false)
const badVisible = ref(false)
const form = reactive<InstanceType<typeof Formspan>>({
    order: '1213434',
    models: '3A4621-01C',
    productCode: '24010606000131',
    productDes: '0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D',
    orderNum: '100',
    passNum: '83'
})
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
    {
        label: '工单号',
        value: 'order',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '机型',
        value: 'models',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '产品编码',
        value: 'productCode',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '产品描述',
        value: 'productDes',
        disabled: true,
        type: 'textarea',
        width: 300
    },
    {
        label: '工单数量',
        value: 'orderNum',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '过站数量',
        value: 'passNum',
        disabled: true,
        type: 'input',
        width: ''
    },
])
const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
    {
        label: '工单号',
        value: 'order',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '机型',
        value: 'models',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '产品编码',
        value: 'productCode',
        disabled: true,
        type: 'input',
        width: ''
    },
    {
        label: '产品描述',
        value: 'productDes',
        disabled: true,
        type: 'textarea',
        width: 300
    },
    {
        label: '工单数量',
        value: 'orderNum',
        disabled: true,
        type: 'input',
        width: ''
    },

])
const columnData1 = reactive([
    {
        text: true,
        prop: "eqty",
        label: "MES屏条码",
        width: "",
        align: "1",

    },
    {
        text: true,
        prop: "eqName",
        label: "CG/TP条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "zcnumber",
        label: "LCM条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "扫描时间",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "扫描人",
        width: "",
        align: "1",
    }


])
const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 10,
    currentPage: 1
})
const badForm = ref({
    badCode: '',
    badCodeDec: '',
    backProcess: '',
    remark: ''
})
//不良信息table
const BadtableData = ref([
    {
        badCode: 'E208711',
        badCodeDec: '切料刀缺口',
        backProcess: '总成外观',
        remark: 'Test'
    },
    {
        badCode: 'E208711',
        badCodeDec: '切料刀缺口',
        backProcess: '总成外观',
        remark: '测试'
    }
])
const list=ref([
    {
        key:'切料刀缺口',
        value:'E208711',
    },
    {
        key:'划痕',
        value:'E208715',
    },
])


onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // console.log(appStore.getOpuiData.stationDec);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const formText = (data: string) => {
    let key = data as keyof typeof form
    return form[key]
}

//打开不良登记
const openDialog = () => {
    editVisible.value = true
}

//关闭不良登记
const editCancel = () => {
    BadtableData.value=[]
    // console.log(BadtableData.value);
    editVisible.value = false
}
//提交不良信息
const editSubmit = () => {
    console.log( BadtableData.value);
    editVisible.value = false
}
//删除不良信息
const deleteBad = (data: any) => {
    BadtableData.value=BadtableData.value.filter((v:any)=>{
        return data[0].badCode!=v.badCode
    })
}
//打开不良登记
const openAddBad = () => {
    badVisible.value = true
}
//增加不良信息
const addBadData=(data:any)=>{
    BadtableData.value.push(data)
    // console.log(data);
}

//分页
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 374;
    });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
    font-size: 16px;
}

.setwidth {
    flex: 0 0 320px;
}

.box {
    border-right: 2px solid #cbcbcb;

}

.tabs-css .el-tabs--border-card {
    border-top: 1px solid #006487;
}

.tabs-css .el-tabs__header {
    background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
    padding: 5px 0px;
}

.tabs-css .el-tabs__item {
    font-size: 1.1rem;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item {
    color: #fff;
    // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
    // color: #fff;
    color: #006487 !important;
    // font-weight: bold;

}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    // color: #fff;
    background-color: #fff;
}
</style>