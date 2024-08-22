<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[500px]">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">周转箱列表</span>
                    </div>
                    <div class="p-2">
                        <el-card shadow="always" :body-style="{ padding: '8px' }">
                            <div class="">
                                <div>
                                    <span>周转箱条码</span>
                                    <span>12424</span>
                                </div>
                                <div>
                                    <span>类型</span>
                                    <span>12424</span>
                                </div>
                            </div>
                            <div class="">
                                <div>
                                    <span>周转箱条码</span>
                                    <span>12424</span>
                                </div>
                                <div>
                                    <span>类型</span>
                                    <span>12424</span>
                                </div>
                            </div>
    
                        </el-card>
                    </div>

                    <el-table :data="tableData1" :height="'200px'" stripe border fit class="list">
                        <el-table-column type="index" align="center" fixed label="序号" width="60" />
                        <el-table-column v-for="c in columnData1" :key="c.prop" :label="c.label" :prop="c.prop"
                            :width="c.width" :min-width="c.min ? flexColumnWidth(c.label, c.prop) : ''"
                            :align="c.align">
                            <template #default="scope">
                                <span v-if="c.text">{{ scope.row[c.prop] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <div class="flex justify-end p-5"> <el-button type="primary" >不满箱装箱</el-button></div> -->
                </div>
            </div>
            <div class="w-[calc(100%-500px)]">
                <div class="w-full h-full flex flex-col">
                    <div>
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 扫描条码</span>
                        </div>
                        <div class="h-[120px] p-5">
                            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                                @submit.native.prevent>
                                <el-form-item label="扫描条码">
                                    <el-input v-model="barCode" ref="inputRef" style="width: 500px" placeholder="请扫描条码"
                                        @keyup.enter.native="getChange" />
                                </el-form-item>
                            </el-form>
                            <div class="text-xl font-bold text-[#00B400]">请扫描条码</div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1">
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5">周转箱包装列表</span>
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
import tableTem from "@/components/tableTem/index.vue";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
// import formTemple from '@/components/formTem/form.vue'
interface Form {
    order: string;
    models: string;
    productCode: string;
    productDes: string;
    orderNum: string;
}
interface FormHeader {
    label: string;
    value: string;
    disabled: boolean;
    type: string;
}
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
// const title=appStore.getOPUIReal()
const barCode = ref("");
const inputRef = ref();
const lastInputTime = ref();
const activeName = ref("first");
const stopsForm = ref({
    ContainerName: "", //PCB
    result: "OK", //工装治具
    WorkStationName: opui.station, //工位
    ResourceName: opui.station !== null ? opui.station : "", //设备
    EmployeeName: userStore.getUserInfo, //用户
});
const form = reactive<Form>({
    order: "1213434",
    models: "3A4621-01C",
    productCode: "24010606000131",
    productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
    orderNum: "100",
});
const formHeader = reactive<FormHeader[]>([
    {
        label: "工单号",
        value: "order",
        disabled: true,
        type: "input",
    },
    {
        label: "机型",
        value: "models",
        disabled: true,
        type: "input",
    },
    {
        label: "产品编码",
        value: "productCode",
        disabled: true,
        type: "input",
    },
    {
        label: "产品描述",
        value: "productDes",
        disabled: true,
        type: "textarea",
    },
    {
        label: "工单数量",
        value: "orderNum",
        disabled: true,
        type: "input",
    },
]);
const tableData = ref([]);
const showIndex = ref(true);
const tableHeight = ref(0);
const columnData = reactive([
    {
        text: true,
        prop: "eqName",
        label: "小板条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "zcnumber",
        label: "产品编码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "产品名称",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "数量",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "大板条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "装箱时间",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "装箱人",
        width: "",
        align: "1",
    },
]);
const tablebox = ref();
const pageObj = ref({
    pageSize: 10,
    currentPage: 1,
});

const tableData1 = ref([]);
const columnData1 = reactive([
    {
        text: true,
        prop: "eqty",
        label: "周转箱条码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "eqty",
        label: "类型",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "eqName",
        label: "容量",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "zcnumber",
        label: "装箱数量",
        width: "",
        min: true,
        align: "center",
    },
]);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    document.addEventListener("keydown", handleScan);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
    document.removeEventListener("keydown", handleScan);
});

const handleScan = (event: any) => {
    if (
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        !event.shiftKey &&
        /\d|\w|\s|[-./()]+/.test(event.key)
    ) {
        const now = Date.now();
        if (now - lastInputTime.value > 100) {
            barCode.value += event.key;
            lastInputTime.value = now;
        }
    }
};
const formText = (data: string) => {
    let key = data as keyof typeof form;
    return form[key];
};

const getChange = (val: any) => {
    console.log(val);
    // if (checkStringType(val) == 'result') {
    //     console.log('result', val);
    //     stopsForm.value.result = val
    // } else if (checkStringType(val) == 'pcb') {
    //     console.log('pcb', val);
    //     stopsForm.value.ContainerName = val
    // } else if (checkStringType(val) == 'tool') {
    //     console.log('tool', val);
    //     // stopsForm.value.ToolName = val
    // } else {
    //     ElNotification({
    //         title: "错误",
    //         message: '扫描条码有误',
    //         type: "error",
    //     });
    //     // console.log('扫描条码有误');
    // }
    // barCode.value = ''
    // inputRef.value.focus()
    // if (stopsForm.value.ContainerName && stopsForm.value.result) {
    //     console.log(stopsForm.value)
    // }
};
const openDialog = () => {
    console.log(barCode.value);
};

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
    html.innerText = str;
    html.className = "getTextWidth";
    document.body?.appendChild(html);

    // 使用类型断言将 Element 转换为 HTMLElement
    const spanElement = document.querySelector(".getTextWidth") as HTMLElement;
    if (spanElement) {
        width = spanElement.offsetWidth;
        spanElement.remove();
    }
    // console.log(width);
    return width;
};

const flexColumnWidth = (label: any, prop: any) => {
    const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
    arr.push(label); // 把每列的表头也加进去算
    // console.log(arr);
    return getMaxLength(arr) + 25 + "px";
};
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
    font-size: 16px;
}

.setwidth {
    flex: 0 0 500px;
}

.box {
    border-right: 2px solid #cbcbcb;
}

.list .el-table__empty-text {
    display: none;
}
</style>
