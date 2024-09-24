<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div>
                <el-button type="primary" @click="openDialog">不良品登记</el-button>
            </div>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[320px]">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" size="default" ref="formRef" :model="form" label-width="auto">
                            <el-form-item label="工单">
                                <selectTa ref="selectTable" :table="orderTable" :columns="orderColumns"
                                    :max-height="400" :tableWidth="700"
                                    :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                                    @radioChange="(...args: any) => radioChange(args)">
                                </selectTa>
                            </el-form-item>
                            <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                                <span class="font-bold text-[18px] leading-[30px]"
                                    :class="f.value == 'passNum' ? 'text-[#00B400]' : ''">
                                    {{ formText(f.value) }}</span>
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
                                    <el-input v-model="barCode" clearable ref="inputRef" style="width: 500px"
                                        placeholder="请扫描条码" @change="handleInput" />
                                </el-form-item>
                                <el-form-item >
                                   <el-button type="primary" @click="getChange">完成</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="text-xl font-bold text-[#00B400]" v-show="msgTitle === '成功' || msgTitle === ''">
                                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
                            </div>
                            <div class="text-xl font-bold text-[red]" v-show="msgTitle !== '成功' && msgTitle !== ''">
                                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 tabs-css">
                        <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
                            <el-tab-pane label="扫描记录" name="history" :stretch="true">
                                <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem>
                            </el-tab-pane>
                            <!-- <el-tab-pane label="SOP" name="sop"> sop </el-tab-pane> -->
                            <el-tab-pane label="工装治具" name="fixtures">
                                fixtures
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
        <badInfoTem :visible="editVisible" :list="list" :formHeader="formHeader1" :form="editForm" :badForm="badForm"
            :tableData="BadtableData" @cancel="editCancel" @submit="editSubmit" @deleteBad="deleteBad"
            @addBadData="addBadData" @openAddBad="openAddBad" />

    </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import selectTa from '@/components/selectTable/index.vue';
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import {
    QueryWorkOrderInfo,
    // DIPStationMoveOut,
    FindAllDevice,
    UpdateDevice,
} from "@/api/dipApi";
import {
    ref,
    reactive,
    onMounted,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
interface StopsForm {
    Barcode: Array<Barcode>;
    WorkStationName: string;
    ResourceName: string;
    EmployeeName: string;
}
interface Barcode {
    Barcode: string;
    Status: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const inputRef = ref();
const stopsForm = ref<StopsForm>({
    Barcode: [],
    WorkStationName: opui.station,
    ResourceName: opui.station !== null ? opui.station : "",
    EmployeeName: userStore.getUserInfo || "",
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
    // { label: "工单号", width: "", prop: "MfgOrderName" },
    // { label: "产品编码", width: "", prop: "ProductName" }
]);
const timeout = ref()

const radioChange = (args: any) => {
    // console.log(args);
    orderTable.value.data.forEach((v: any) => {
        if (v.MfgOrderName == args[1]) {
            form.MfgOrderName = v.MfgOrderName;
            form.ProductName = v.ProductName;
            form.ProductDesc = v.ProductDesc;
            form.PlannedStartDate = v.PlannedStartDate;
            form.PlannedCompletionDate = v.PlannedCompletionDate;
            form.Qty = v.Qty;
        }
    });
    inputRef.value.focus();
};
const change = (val: any) => {
    // console.log(val);
    // orderTable.value.forEach((v: any) => {
    //     if (v.MfgOrderName == val) {
    //        form.MfgOrderName=v.MfgOrderName
    //        form.ProductName=v.ProductName
    //        form.ProductDesc=v.ProductDesc
    //        form.PlannedStartDate=v.PlannedStartDate
    //        form.PlannedCompletionDate=v.PlannedCompletionDate
    //        form.Qty=v.Qty
    //     }
    // });
    // inputRef.value.focus();
};

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getOrderData()
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const getOrderData = () => {
    QueryWorkOrderInfo().then((res: any) => {
        // let data = JSON.parse(res.content);
        orderTable.value.data[0] = res.content
    });
}

const formText = (data: string) => {
    let key = data as keyof typeof form;
    return form[key];
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

//连续扫描
const handleInput = () => {
    if (form.MfgOrderName.trim() == '') {
        ElNotification({
            title: '请选择工单',
            type: "error",
        });
        barCode.value = ''
        return
    }
    // if (timeout.value) {
    //     clearTimeout(timeout.value);
    // }
    // timeout.value = setTimeout(() => {
        if (barCode.value.length && !barCode.value.endsWith(',')) {
            // 如果条码非空且未以逗号结尾，则添加逗号  
            barCode.value += ',';
        }
    // }, 500);
     
}
//过站
const getChange = (val: any) => {
    let barCodeArr=barCode.value.trim().split(',')
    barCodeArr=barCodeArr.filter((v:any)=>v!=='')
    console.log(barCodeArr)
    // let data = {
    //     Barcode: barCode.value,
    //     Status: "0",
    // };
    // stopsForm.value.Barcode.push(data);
    // DIPStationMoveOut(stopsForm.value).then((res: any) => {
    //     if (res.succes) {
    //         msgTitle.value = "成功";
    //         barCode.value = "";
    //         inputRef.value.focus();
    //         if (stopsForm.value.Barcode.length == 2) {
    //             stopsForm.value.Barcode = [];
    //             msgTitle.value = "";
    //         }
    //     } else {
    //         inputRef.value.select()
    //         stopsForm.value.Barcode = stopsForm.value.Barcode.filter((b: any) => b.Barcode != barCode.value)
    //         msgTitle.value = res.msg;
    //         // console.log(stopsForm.value)
    //     }

    // });
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
        tableHeight.value = window.innerHeight - 369.5;
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
    // background-color: #fff;
    background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
