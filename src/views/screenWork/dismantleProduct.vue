<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <!-- <el-button type="primary" @click="openDialog">不良品登记</el-button> -->
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[320px]">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form ref="formRef" :model="form" label-width="auto">
                            <el-form-item label="MES屏条码" prop="scrBarCode">
                                <el-input v-model="form.scrBarCode" placeholder="请输入MES屏条码" />
                            </el-form-item>
                            <el-form-item label="生产计划号" prop="order">
                                <el-input v-model="form.order" placeholder="请输入生产计划号" />
                            </el-form-item>
                            <!-- <el-form-item label="机型" prop="models">C</el-form-item> -->
                            <el-form-item label="产品编码" prop="productCode">
                                <el-input v-model="form.productCode" placeholder="请输入产品编码" />
                            </el-form-item>
                            <el-form-item label="起始时间" prop="startTime">
                                <el-date-picker v-model="form.startTime" type="date" placeholder="选择起始时间"
                                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                            </el-form-item>
                            <el-form-item label="结束时间" prop="endTime">
                                <el-date-picker v-model="form.endTime" type="date" placeholder="选择结束时间"
                                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                            </el-form-item>
                            <el-form-item label="状态" prop="station">
                                <el-select v-model="form.station" placeholder="选择状态">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>

                        </el-form>
                        <div class="flex justify-end">
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%-320px)]">
                <div class="w-full h-full flex flex-col">

                    <div class="flex flex-col flex-1">
                        <div class="h-[35px] flex items-center text-xl justify-between text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 扫描条码</span>
                        </div>
                        <div class="h-[120px] p-5">
                            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                                @submit.native.prevent>
                                <el-form-item label="扫描条码">
                                    <el-input v-model="barCode" ref="inputRef" style="width: 500px;" placeholder="请扫描条码"
                                        @keyup.enter.native="getChange" />
                                </el-form-item>

                            </el-form>
                            <div class="text-xl  font-bold text-[#00B400]">请扫描MES屏条码</div>
                        </div>
                        <div class="flex flex-col flex-1">
                            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                                <span class="ml-5">不良品拆解</span>
                            </div>
                            <div class="flex-1" ref="tablebox">
                                <table-tem :showIndex="true" :tableData="tableData" :tableHeight="tableHeight"
                                    :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem>
                            </div>
                        </div>
                        <el-dialog v-model="qtyVisible" width="80%" title="不良品拆解" :append-to-body="true"
                            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
                            <div>
                                <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                                    <span class="ml-5">基本信息</span>
                                </div>
                                <el-form class="pt-2" ref="formRef" :inline="true" :model="qtyForm" label-width="auto">
                                    <el-form-item label="MES屏条码" prop="scrBarCode">
                                        <el-input v-model="qtyForm.scrBarCode" placeholder="请输入" disabled />
                                    </el-form-item>
                                    <el-form-item label="生产计划号" prop="order">
                                        <el-input v-model="qtyForm.order" placeholder="请输入" disabled />
                                    </el-form-item>
                                    <el-form-item label="产品编码" prop="productCode">
                                        <el-input v-model="qtyForm.productCode" placeholder="请输入" disabled />
                                    </el-form-item>
                                    <el-form-item label="产品描述" prop="productDec">
                                        <el-input v-model="qtyForm.productDec" type="textarea" style="width: 500px;"
                                            placeholder="请输入" disabled />
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div>
                                <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                                    <span class="ml-5">不良品拆解</span>
                                </div>
                                <table-tem :showIndex="true" :tableData="qtytableData" :tableHeight="'300'"
                                    :columnData="qtycolumnData" :pageObj="qtypageObj"
                                    @handleSizeChange="handleSizeChange1"
                                    @handleCurrentChange="handleCurrentChange1"></table-tem>
                            </div>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="qtyCancel">关闭</el-button>
                                </span>
                            </template>
                        </el-dialog>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { checkStringType } from "@/utils/barcodeFormat";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader } from "@/typing";
import { cloneDeep } from 'lodash-es'
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
    ref,
    reactive,
    onMounted,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const tabsValue = ref("history");
const qtyVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgTitle = ref("");
const stopsForm = ref({
    ContainerName: "", //PCB
    result: "OK", //工装治具
    WorkStationName: opui.station, //工位
    ResourceName: opui.station !== null ? opui.station : "", //设备
    EmployeeName: userStore.getUserInfo, //用户
});
const form = ref({
    order: "",
    scrBarCode: '',
    // models: "",
    productCode: "",
    startTime: '',
    endTime: '',
    station: ''
});

const options = ref([
    {
        value: '12341234',
        label: '贴合外观',
    },
    {
        value: '123461283',
        label: '贴合下料',
    },
])
const tableData = ref([
    {
        order: "1232",
        scrBarCode: '23432',
        productCode: "234234",
        time: '241243',
        station: '234234'
    },
    {
        order: "1232",
        scrBarCode: '23432',
        productCode: "234234",
        time: '241243',
        station: '234234'
    }
])

const columnData = reactive([
    {
        text: true,
        prop: "scrBarCode",
        label: "MES屏条码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "order",
        label: "生产计划号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "productCode",
        label: "产品编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "productCode",
        label: "不良录入时间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "time",
        label: "拆解开始时间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "station",
        label: "拆解完成时间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "station",
        label: "状态",
        width: "",
        min: true,
        align: "1",
    },

]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});

const qtyForm = ref({
    order: "",
    scrBarCode: '',
    // models: "",
    productCode: "",
    productDec: '',

})
const qtytableData = ref([
    {
        order: "1232",
        scrBarCode: '23432',
        productCode: "234234",
        time: '241243',
        station: '234234'
    },
    {
        order: "1232",
        scrBarCode: '23432',
        productCode: "234234",
        time: '241243',
        station: '234234'
    }
])

const qtycolumnData = reactive([
    {
        text: true,
        prop: "scrBarCode",
        label: "MES屏条码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "order",
        label: "生产计划号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "productCode",
        label: "条码类型",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "productCode",
        label: "供应商条码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "time",
        label: "检查结果",
        width: "",
        min: true,
        align: "1",
    }, {
        isOperation: true,
        label: "操作",
        width: "120",
        align: "center",
        fixed: "right",
        operation: [
            {
                type: "primary",
                label: "解绑",
                icon: 'DocumentRemove'
            },
            {
                type: "danger",
                label: "报废",
                icon: 'Delete'
            },
        ],
    },

]);

const qtypageObj = ref({
    pageSize: 100,
    currentPage: 1,
});


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

const onSubmit = () => {
    console.log(form.value);
}

const getChange = () => {
    qtyVisible.value = true
}

const qtyCancel = () => {
    qtyVisible.value = false
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
        tableHeight.value = window.innerHeight - 365;
    });
};
const handleSizeChange1 = (val: any) => {
    qtypageObj.value.currentPage = 1;
    qtypageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
    qtypageObj.value.currentPage = val;
};


const getMaxLength = (arr: any) => {
    return arr.reduce((acc: any, item: any) => {
        if (item) {
            // console.log(acc,item);
            const calcLen = getTextWidth(item)

            if (acc < calcLen) {
                acc = calcLen
            }
        }
        return acc
    }, 0)

}

const getTextWidth = (str: string) => {
    let width = 0;
    const html = document.createElement('span');
    html.innerText = str;
    html.className = 'getTextWidth';
    document.body?.appendChild(html);

    // 使用类型断言将 Element 转换为 HTMLElement  
    const spanElement = document.querySelector('.getTextWidth') as HTMLElement;
    if (spanElement) {
        width = spanElement.offsetWidth;
        spanElement.remove();
    }
    // console.log(width);
    return width;
}


const flexColumnWidth = (label: any, prop: any) => {
    const arr = tableData?.value.map((x: { [x: string]: any; }) => x[prop])
    arr.push(label) // 把每列的表头也加进去算
    // console.log(arr);
    return (getMaxLength(arr) + 25) + 'px'
}
</script>

<style lang="scss" scoped>
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

.switchok .el-switch__label.is-active {
    color: #13ce66;
}

.switchng .el-switch__label.is-active {
    color: #ff4949;
}
</style>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>