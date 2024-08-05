<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class=" text-2xl">物料检验-外观</span>
            <!-- <el-button type="primary">不良品登记</el-button> -->
        </div>
        <el-row class="w-full flex-1">
            <el-col :span="6">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <el-form-item size="large" v-for="f in formHeader" :key="f.value" :label="f.lable">
                                <span class="font-bold text-[18px]"> {{ formText(f.value) }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="w-full h-full">
                    <div>
                        <div class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 扫描条码</span>
                        </div>
                        <div class="h-[120px] p-5">
                            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                                <el-form-item label="扫描条码">
                                    <el-input v-model="barCode" style="width: 500px;" placeholder="请扫描条码" />
                                </el-form-item>
                            </el-form>
                            <div class="text-xl  font-bold text-[#00B400]">请扫描物料批次条码</div>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]">
                            <span class="ml-5">物料检验记录</span>
                        </div>
                        <div class="flex-1">
                            <table-tem :showIndex="showIndex" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
                                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                @handleCurrentChange="handleCurrentChange"></table-tem>
                        </div>
                    </div>
                </div>

            </el-col>
        </el-row>
        <!-- <div class=" bg-slate-500"></div>
        <div class="bg-slate-800"></div> -->
    </div>
</template>

<script lang="ts" setup>
import tableTem from '@/components/tableTem/index.vue'
interface Form {
    order: string,
    models: string,
    productCode: string,
    productDes: string,
    orderNum: string
}
interface FormHeader {
    lable: string,
    value: string
}
import { ref, reactive } from 'vue'
const barCode = ref('')
const form = reactive<Form>({
    order: '1213434',
    models: '3A4621-01C',
    productCode: '24010606000131',
    productDes: '0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D',
    orderNum: '100'
})
const formHeader = reactive<FormHeader[]>([
    {
        lable: '工单号',
        value: 'order'
    },
    {
        lable: '机型',
        value: 'models'
    },
    {
        lable: '产品编码',
        value: 'productCode'
    },
    {
        lable: '产品描述',
        value: 'productDes'
    },
    {
        lable: '工单数量',
        value: 'orderNum'
    },
])
const tableData = ref([]);
const showIndex=ref(true)
const tableHeight = ref(370);
const columnData = reactive([
    {
        text: true,
        prop: "eqty",
        label: "物料批次条码",
        width: "",
        align: "1",

    },
    {
        text: true,
        prop: "eqName",
        label: "物料编码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "zcnumber",
        label: "供应商条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "供应商物料条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "供应商批次",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "检验结果",
        width: "100",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "检验时间",
        width: "",
        align: "1",
    }

])
const pageObj = ref({
    pageSize: 10,
    currentPage: 1
})
const formText = (data: string) => {
    let key = data as keyof typeof form
    return form[key]
}
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
    font-size: 16px;

}
// .el-col{
//     min-width: 350px;
// }

.box {
    border-right: 2px solid #cbcbcb;


}
</style>