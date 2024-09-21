<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div></div>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[350px]">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <!-- <el-form-item label="工单号">
                                <selectTa ref="selectTable" :table="orderTable" :defaultSelectVal="defaultSelectVal" :columns="orderColumns"  :max-height="400" :tableWidth="700"
                                    :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                                    @radioChange="(...args: any) => radioChange(args)">
                                </selectTa>
                            </el-form-item> -->
                            <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                                <span class="font-bold text-lg leading-[30px]"
                                    :class="f.value == 'passNum' ? 'text-[#00B400]' : ''">
                                    {{ formText(f.value) }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%-350px)]">
                <!-- <div class="w-full"> -->
                <div class="w-full h-full flex flex-col">
                    <div>
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 扫描条码</span>
                        </div>
                        <div class="h-[120px] pt-3 pr-5 pl-5">
                            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                                @submit.native.prevent>
                                <el-form-item label="扫描条码" class="mb-2">
                                    <el-input v-model.trim="barCode" ref="inputRef"
                                        :autofocus="inputFocus" style="width: 500px" placeholder="请扫描条码"
                                        @keyup.enter.native="getChange" />
                                </el-form-item>
                                <el-form-item :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']" class="mb-2">
                                    <el-switch v-model="stopsForm.result" size="large" style="
                      zoom: 1.2;
                      --el-switch-on-color: #ff4949;
                      --el-switch-off-color: #13ce66;
                    " :active-value="'NG'" :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                                </el-form-item>
                            </el-form>
                            <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                                {{ msgTitle === "" ? "请扫描PCB条码" : msgTitle }}
                            </div>
                            <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                                {{ msgTitle }}
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col flex-1 tabs-css">
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5">历史过站记录</span>
                        </div>
                        <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                            :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"></table-tem>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { MoveStd, QueryWorkOrderInfo } from "@/api/dipApi";
import { QueryToolInfo, SortTools } from "@/api/operate";
import {
    ref,
    reactive,
    onMounted,
    nextTick,
    computed,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
interface StopsForm {
    containerName: string;
    workstationName: string;
    result:string;
    userAccount: string;
    txnDate: string;
}

interface ToolList {
    WorkStationName: string;
    OrderNumber: string;
    ToolName: string;
    sort: number;
    MaterialName: string;
    CompName: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const inputFocus = ref(true);
const barCode = ref("");
const stopsForm = ref<StopsForm>({
    containerName: "",
    workstationName: opui.station || "",
    userAccount: userStore.getUserInfo,
    txnDate: "",
    result: "OK",
    // ToolName: "",
    // ContainerName: "",
    // OrderNumber: "",
    // workstationName: opui.station || "",
    // userAccount: userStore.getUserInfo,
});
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const form = reactive<InstanceType<typeof Formspan>>({
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
});
const editForm = ref({
    order: "1213434",
    models: "3A4621-01C",
    productCode: "24010606000131",
    productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
    // orderNum: '100',
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
    {
        label: "工单号",
        value: "MfgOrderName",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "产品编码",
        value: "ProductName",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "产品描述",
        value: "ProductDesc",
        disabled: true,
        type: "textarea",
        width: 300,
    },
    {
        label: "计划开始",
        value: "PlannedStartDate",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "计划完成",
        value: "PlannedCompletionDate",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "工单数量",
        value: "Qty",
        disabled: true,
        type: "input",
        width: "",
    },
]);
const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
    {
        label: "工单号",
        value: "order",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "机型",
        value: "models",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "产品编码",
        value: "productCode",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "产品描述",
        value: "productDes",
        disabled: true,
        type: "textarea",
        width: 300,
    },
]);
const columnData1 = reactive([
    {
        text: true,
        prop: "eqty",
        label: "PCB条码",
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
    },
]);
const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 10,
    currentPage: 1,
});
const badForm = ref({
    badCode: "",
    badCodeDec: "",
    backProcess: "",
    remark: "",
});
//不良信息table
const BadtableData = ref([
    {
        badCode: "E208711",
        badCodeDec: "切料刀缺口",
        backProcess: "总成外观",
        remark: "Test",
    },
    {
        badCode: "E208711",
        badCodeDec: "切料刀缺口",
        backProcess: "总成外观",
        remark: "测试",
    },
]);
const list = ref([
    {
        key: "切料刀缺口",
        value: "E208711",
    },
    {
        key: "划痕",
        value: "E208715",
    },
]);
const msgTitle = ref("");
const msgType = ref(true);
const toolList = ref<ToolList[]>([]);
const getToolForm = ref({
    ToolName: "",
    OrderNumber: "",
    OperateType: "",
    CompName: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
});
const defaultSelectVal = ref<string[]>([]);
const checked = ref<string[]>([]);
const leftBoxH = ref(0);

const selectTable = ref();
const orderTable = ref<InstanceType<typeof OrderData>>({
    data: [],
});

const orderColumns = ref([
    { label: "工单号", width: "", prop: "MfgOrderName" },
    { label: "产品编码", width: "", prop: "ProductName" },
    { label: "产线", width: "", prop: "MfgLineDesc" },
    { label: "状态", width: "", prop: "OrderStatusDesc" },
    { label: "计划开始", width: "", prop: "PlannedStartDate" },
    { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);
const feedVisible = ref(false);
const feedForm = ref({
    order: "208310182",
    type: "3A4621-01C",
    productCode: "240106000131",
    productDes: "0402封装贴片电容100DF+5%50V MURATAGRM1555C1H101JA01D",
    orderNum: "100",
    eqInfo: "自动烧录机",
});

const FeedHeader = reactive([
    {
        label: "工单号",
        prop: "order",
    },
    {
        label: "机型",
        prop: "type",
    },
    {
        label: "产品编码",
        prop: "productCode",
    },
    {
        label: "产品描述",
        prop: "productDes",
    },
    {
        label: "工单数量",
        prop: "orderNum",
    },
    {
        label: "机台",
        prop: "eqInfo",
    },
]);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // getOrderData();
    getFocus();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

//   const getOrderData = () => {
//     QueryWorkOrderInfo().then((res: any) => {
//       let data = res.content;
//       orderTable.value.data[0] = data[0];
//       if (data.length == 1) {
//         // console.log(2111);
//         let a = data[0].MfgOrderName;
//         defaultSelectVal.value[0] = a;
//       }
//     });
//   };
//治具上移
// const moveUp = (val: any) => {
//     let data = {
//         ToolName: val.ToolName,
//         OrderNumber: "",
//         OperateType: "",
//         CompName: "",
//         workstationName: opui.station,
//         userAccount: userStore.getUserInfo,
//     };
//     SortTools(data).then((res: any) => {
//         getToolData();
//     });
// };
//获取治具
// const getToolData = () => {
//     QueryToolInfo(getToolForm.value).then((res: any) => {
//         if (res.content == null || res.content.length == 0) {
//             toolList.value = [];
//             return;
//         }
//         toolList.value = res.content;
//         stopsForm.value.ToolName = res.content[0].ToolName;
//         checked.value[0] = res.content[0].ToolName;
//     });
// };
//获取光标
const getFocus = () => {
    inputFocus.value = false;
    setTimeout(() => {
        inputFocus.value = true;
    }, 100);
};

const formText = (data: string) => {
    let key = data as keyof typeof form;
    return form[key];
};
const radioChange = (args: any) => {
    if (args[1] == null) {
        form.MfgOrderName = "";
        form.ProductName = "";
        form.ProductDesc = "";
        form.PlannedStartDate = "";
        form.BD_ProductModel = "";
        form.BD_SoftVersion = "";
        form.PlannedCompletionDate = "";
        form.Qty = "";
    } else {
        // orderTable.value.data.forEach((v: any) => {
        //   if (v.MfgOrderName == args[1]) {
        form.MfgOrderName = args[0].MfgOrderName;
        form.ProductName = args[0].ProductName;
        form.ProductDesc = args[0].ProductDesc;
        form.BD_ProductModel = args[0].BD_ProductModel;
        form.BD_SoftVersion = args[0].BD_SoftVersion;
        form.PlannedStartDate = args[0].PlannedStartDate;
        form.PlannedCompletionDate = args[0].PlannedCompletionDate;
        form.Qty = args[0].Qty;
        // if (getToolForm.value.OrderNumber == args[0].MfgOrderName) {
        //     return;
        // } else {
        //     getToolForm.value.OrderNumber = args[0].MfgOrderName;
        //     getToolData();
        // }

    }
};

//打开物料上料
const openFeed = () => {
    feedVisible.value = true;
};
//关闭物料上料
const feedCancel = () => {
    feedVisible.value = false;
};

//打开不良登记
const openDialog = () => {
    editVisible.value = true;
};

//关闭不良登记
const editCancel = () => {
    BadtableData.value = [];
    // console.log(BadtableData.value);
    editVisible.value = false;
};
//提交不良信息
const editSubmit = () => {
    // console.log(BadtableData.value);
    editVisible.value = false;
};
//删除不良信息
const deleteBad = (data: any) => {
    BadtableData.value = BadtableData.value.filter((v: any) => {
        return data[0].badCode != v.badCode;
    });
};
//打开不良登记
const openAddBad = () => {
    badVisible.value = true;
};
//增加不良信息
const addBadData = (data: any) => {
    BadtableData.value.push(data);
    // console.log(data);
};

//过站
const getChange = () => {
    let barCodeData = barCode.value;
    if (checkStringType(barCodeData) == "result") {
        // console.log(badCodeData);
        stopsForm.value.result = barCodeData;
    } else {
        stopsForm.value.containerName = barCodeData;
        MoveStd(stopsForm.value).then((res: any) => {
        msgTitle.value = res.msg;
        msgType.value = res.success;
        stopsForm.value.containerName = "";
    });
    }
    barCode.value = "";
   
};

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
        leftBoxH.value = window.innerHeight - 155;
        tableHeight.value = window.innerHeight - 360;
    });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
    font-size: 16px;
}

.setwidth {
    flex: 0 0 350px;
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

.switchok .el-switch__label.is-active {
    color: #13ce66;
}

.switchng .el-switch__label.is-active {
    color: #ff4949;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    // color: #fff;
    // background-color: #fff;
    background-color: rgba($color: #fff, $alpha: 0.8);
}

.saveAsDialog {
    min-width: 954px;
}

// .checked{
//   height: 14px;
// }
.checked .el-checkbox {
    height: 14px;
}
</style>
