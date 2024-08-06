<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="  text-[#006487]"> DIP离线分板-01 </span>
            <el-button type="primary">不良品登记</el-button>
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
                                    <el-input v-model="barCode" style="width: 500px;" placeholder="请扫描条码"
                                        @change="openDialog" />
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
                        <!-- <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5">物料检验记录</span>
                        </div>
                        <div class="flex-1" ref="tablebox">
                            <table-tem :showIndex="showIndex" :tableData="tableData" :tableHeight="tableHeight"
                                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                @handleCurrentChange="handleCurrentChange"></table-tem>
                        </div> -->

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import tableTem from '@/components/tableTem/index.vue'
// import formTemple from '@/components/formTem/form.vue'
import type { Formspan, FormHeader } from "@/typing";
import { ref, reactive, onMounted, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
const barCode = ref('')
const activeName = ref('first')
// const tabsHeight = ref(0)
const tabsValue = ref('history')
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
        type: 'input'
    },
    {
        label: '机型',
        value: 'models',
        disabled: true,
        type: 'input'
    },
    {
        label: '产品编码',
        value: 'productCode',
        disabled: true,
        type: 'input'
    },
    {
        label: '产品描述',
        value: 'productDes',
        disabled: true,
        type: 'textarea'
    },
    {
        label: '工单数量',
        value: 'orderNum',
        disabled: true,
        type: 'input'
    },
    {
        label: '过站数量',
        value: 'passNum',
        disabled: true,
        type: 'input'
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
        // tabsHeight.value = window.innerHeight - 350
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