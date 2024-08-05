<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="  text-[#006487]">物料检验-外观</span>
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
                                <span class="font-bold text-[18px] leading-[30px]"> {{ formText(f.value) }}</span>
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
                            <el-form class="inbound" ref="formRef" :model="form" label-width="auto"
                                @submit.native.prevent>
                                <el-form-item label="扫描条码">
                                    <el-input v-model="barCode" style="width: 500px;" placeholder="请扫描条码"
                                        @change="openDialog" />
                                </el-form-item>
                            </el-form>
                            <div class="text-xl  font-bold text-[#00B400]">请扫描物料批次条码</div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1">
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5">物料检验记录</span>
                        </div>
                        <div class="flex-1" ref="tablebox">
                            <table-tem :showIndex="showIndex" :tableData="tableData" :tableHeight="tableHeight"
                                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                @handleCurrentChange="handleCurrentChange"></table-tem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import tableTem from '@/components/tableTem/index.vue'
// import formTemple from '@/components/formTem/form.vue'
interface Form {
    order: string,
    models: string,
    productCode: string,
    productDes: string,
    orderNum: string
}
interface FormHeader {
    label: string,
    value: string,
    disabled: boolean;
    type:string
}
import { ref, reactive, onMounted, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
const barCode = ref('')
const activeName = ref('first')

const form = reactive<Form>({
    order: '1213434',
    models: '3A4621-01C',
    productCode: '24010606000131',
    productDes: '0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D',
    orderNum: '100'
})
const formHeader = reactive<FormHeader[]>([
    {
        label: '工单号',
        value: 'order',
        disabled: true,
        type:'input'
    },
    {
        label: '机型',
        value: 'models',
        disabled: true,
        type:'input'
    },
    {
        label: '产品编码',
        value: 'productCode',
        disabled: true,
        type:'input'
    },
    {
        label: '产品描述',
        value: 'productDes',
        disabled: true,
        type:'textarea'
    },
    {
        label: '工单数量',
        value: 'orderNum',
        disabled: true,
        type:'input'
    },
])
const tableData = ref([]);
const showIndex = ref(true)
const tableHeight = ref(0);
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
const tablebox = ref()
const pageObj = ref({
    pageSize: 10,
    currentPage: 1
})
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const formText = (data: string) => {
    let key = data as keyof typeof form
    return form[key]
}

const openDialog = () => {
   console.log(barCode.value);
}


const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 365;
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
</style>