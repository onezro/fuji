<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div>
                <!-- <el-button type="primary" @click="openDialog">工装治具</el-button> -->
                <!-- <el-button type="primary" @click="openDialog">不良品登记</el-button> -->
            </div>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[320px]">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <!-- <el-form-item label="工单号">
                                <selectTa ref="selectTable" :table="orderTable" :selectWidth="180"
                                    :columns="orderColumns" :max-height="400" :tableWidth="700"
                                    :defaultSelectVal="defaultSelectVal" :keywords="{
                                        label: 'MfgOrderName',
                                        value: 'MfgOrderName',
                                    }" @radioChange="(...args: any) => radioChange(args)">
                                </selectTa>
                                <el-tooltip content="刷新" placement="top">
                                    <el-icon class="ml-2" color="#777777" :class="isLoding" size="24"
                                        @click="getOrderData">
                                        <RefreshRight />
                                    </el-icon>
                                </el-tooltip>
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
                                    <el-input v-model="stopsForm.containerName" :autofocus="inputFocus" clearable
                                        ref="inputRef" style="width: 500px" placeholder="请扫描条码"
                                        @keyup.enter.native="getChange" />
                                </el-form-item>
                                <el-form-item>
                                    <!-- <div class="">
                                        ok
                                    </div> -->
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
                            :columnData="hisColumn" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"></table-tem>

                        <!-- <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
                            <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                                <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="hisColumn" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem>
                            </el-tab-pane>
                            <el-tab-pane label="工装治具" name="fixtures">
                                <table-tem :showIndex="true" :tableData="fixtureData" :tableHeight="tableHeight"
                                    :columnData="fixtureColumn" :pageObj="fixturePageObj"
                                    @handleSizeChange="handleSizeChange1"
                                    @handleCurrentChange="handleCurrentChange1"></table-tem>
                            </el-tab-pane>
                        </el-tabs> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- <badInfoTem :visible="editVisible" :list="list" :formHeader="badFormHeader" :form="editForm" :badForm="badForm"
            :tableData="BadtableData" @cancel="editCancel" @submit="editSubmit" @deleteBad="deleteBad"
            @addBadData="addBadData" @openAddBad="openAddBad" /> -->
    </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import {
    ref,
    reactive,
    onMounted,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { PCBASplitMoveStd, OrderQuery, QueryMoveHistory } from "@/api/dipApi";
import { QueryToolInfo, SortTools } from "@/api/operate";

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
const barCode = ref("");
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgTitle = ref("");
const msgType = ref(true);
const dialogVisible = ref(false);
const workOrderList = ref([
    {
        workOrder: "12345677",
    },
]);

const workOrder = ref("");
const orderTableData = ref([]);
const pageObj1 = ref({
    pageSize: 50,
    currentPage: 1,
});

//过站扫描
const stopsForm = ref({
    containerName: "",
    resource: "",
    userAccount: userStore.getUserInfo,
    txnDate: "",
    workstationName: opui.station,
});
const form = ref<InstanceType<typeof Formspan>>({
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
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

const hisColumn = reactive([
    {
        text: true,
        prop: "ContainerName",
        label: "PCB条码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "BD_Tools",
        label: "工装治具",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "BD_EmployeeName",
        label: "扫描人",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "TxnDate",
        label: "扫描时间",
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

const fixtureColumn = reactive([
    {
        text: true,
        prop: "ToolName",
        label: "治具编码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "类型",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "CompName",
        label: "类型编号",
        width: "",
        align: "1",
    },
]);
const fixtureData = ref([]);

const fixturePageObj = ref({
    pageSize: 10,
    currentPage: 1,
});
const hisForm = ref({
    MfgOrderName: "",
    workstationName: opui.station,
});
const getToolForm = ref({
    ToolName: "",
    OrderNumber: "",
    OperateType: "",
    CompName: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
});
const toolList = ref<ToolList[]>([]);
const isLoding = ref("");
const defaultSelectVal = ref<string[]>([]);
const inputFocus = ref(true);
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // inputRef.value.focus();
    // getOrderData();

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

//获取光标
const getFocus = () => {
    inputFocus.value = false;
    setTimeout(() => {
        inputFocus.value = true;
    }, 100);
};

//历史过站记录
const getHisData = () => {
    QueryMoveHistory(hisForm.value).then((res: any) => {
        tableData1.value = res.content;
    });
};

const getOrderData = () => {
    // OrderQuery({ lineName: opui.line, OrderTypeName: 'DIP' }).then((res: any) => {
    //     orderTable.value.data[0] = res.content
    // });
    // isLoding.value = "is-loading";
    OrderQuery({ lineName: opui.line, OrderTypeName: "DIP" }).then((res: any) => {
        let data = res.content;
        orderTable.value.data[0] = data[0] || [];
        let timer = setTimeout(() => {
            isLoding.value = "";
            clearTimeout(timer);
        }, 2000);
        if (data.length == 1) {
            let a = data[0].MfgOrderName;
            defaultSelectVal.value[0] = a;
        }
    });
};
const getToolData = () => {
    QueryToolInfo(getToolForm.value).then((res: any) => {
        if (res.content == null || res.content.length == 0) {
            toolList.value = [];
            return;
        }
        toolList.value = res.content;
        // stopsForm.value.tools = res.content[0].ToolName;
        // checked.value[0] = res.content[0].ToolName;
    });
};

const formText = (data: string) => {
    let key = data as keyof typeof form;
    return form.value[key];
};
const getChange = () => {
    PCBASplitMoveStd(stopsForm.value).then((res: any) => {
        if (res.success) {
            msgTitle.value = res.msg;
            msgType.value = res.success;
            stopsForm.value.containerName = "";
            form.value = { ...res.content[0] };
            hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
            getHisData();
            // inputRef.value.focus();
            getFocus();
        } else {
            inputRef.value.select();
            msgTitle.value = res.msg;
            msgType.value = res.success;
        }
    });
};
const selectTable = ref();

// const radioChange = (args: any) => {
//     if (args[1] == null) {
//         form.MfgOrderName = "";
//         form.ProductName = "";
//         form.ProductDesc = "";
//         form.PlannedStartDate = "";
//         form.BD_ProductModel = "";
//         form.BD_SoftVersion = "";
//         form.PlannedCompletionDate = "";
//         form.Qty = "";
//     } else {
//         // orderTable.value.data.forEach((v: any) => {
//         //   if (v.MfgOrderName == args[1]) {
//         form.MfgOrderName = args[0].MfgOrderName;
//         form.ProductName = args[0].ProductName;
//         form.ProductDesc = args[0].ProductDesc;
//         form.BD_ProductModel = args[0].BD_ProductModel;
//         form.BD_SoftVersion = args[0].BD_SoftVersion;
//         form.PlannedStartDate = args[0].PlannedStartDate;
//         form.PlannedCompletionDate = args[0].PlannedCompletionDate;
//         form.Qty = args[0].Qty;
//         hisForm.value.MfgOrderName = args[0].MfgOrderName;

//         if (getToolForm.value.OrderNumber == args[0].MfgOrderName) {
//             return;
//         } else {
//             getToolForm.value.OrderNumber = args[0].MfgOrderName;
//             getHisData();
//             getToolData();
//         }
//     }
// };
const clear = () => {
    console.log("selectTable.value", selectTable.value);
    selectTable.value.clear();
};

//打开不良登记
const openDialog = () => {
    editVisible.value = true;
    
};

//分页
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
    fixturePageObj.value.currentPage = 1;
    fixturePageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
    fixturePageObj.value.currentPage = val;
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 358;
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
    --el-tabs-header-height: 35px;
    background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
    padding: 0px;
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

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    font-size: 1.1rem;
    color: #006487 !important;
    background-color: rgba(255, 255, 255, 0.8);
}

.el-table th.el-table__cell .el-checkbox {
    display: none;
}
</style>
