<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div>
                <el-button type="primary" @click="openOver">过序设置</el-button>
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
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <el-form-item label="工单" size="large">
                                <!-- <el-select v-model="form.order" size="large" @change="change" filterable
                                    placeholder="点击选择">
                                    <el-option v-for="item in orderTable" :key="item.MfgOrderName"
                                        :label="item.MfgOrderName" :value="item.MfgOrderName"></el-option>
                                </el-select> -->
                                <selectTa ref="selectTable" :table="orderTable" :columns="orderColumns"
                                    :max-height="400"
                                    :tableWidth="700"
                                    :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                                    @radioChange="(...args: any) => radioChange(args)"><</selectTa>
                                <!-- <t-select-table ref="selectTable" :table="orderData" :columns="orderColumns"
                                    :max-height="400" :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                                    @radioChange="(...args: any) => radioChange(args)"></t-select-table> -->
                            </el-form-item>
                            <el-form-item size="large" v-for="f in formHeader" :key="f.value" :label="f.label">
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
                                    <el-input v-model="barCode" ref="inputRef" style="width: 500px" placeholder="请扫描条码"
                                        @change="getChange" />
                                </el-form-item>
                            </el-form>
                            <div class="text-xl font-bold text-[#00B400]">
                                请扫描物料批次条码
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 tabs-css">
                        <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
                            <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                                <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem>
                            </el-tab-pane>
                            <el-tab-pane label="SOP" name="sop"> sop </el-tab-pane>
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

        <el-dialog v-model="overVisible" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            width="90%" title="过序设置"> 
            <div class="mb-2">
                <el-button type="primary" @click="overAddVisible = true">添加</el-button>
            </div>
            <formTem ref="addOverRef" :width="'30%'" :visible="overAddVisible" :title="'过序添加'" :form="overAddForm"
                :formHeader="overHeader" @formCancel="addOverCancel" @onSubmit="addOveronSubmit"></formTem>
            <formTem ref="editOverRef" :width="'30%'" :visible="overEditVisible" :title="'过序修改'" :form="overEditForm"
                :formHeader="overHeader" @formCancel="editOverCancel" @onSubmit="editOveronSubmit"></formTem>
            <table-tem :showIndex="false" :tableData="overTableData" :tableHeight="'60vh'" :columnData="overColumnData"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="overCancel">关闭</el-button>
                    
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import selectTa from '@/components/selectTable/index.vue'
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader } from "@/typing";
import { ElMessage, ElNotification } from "element-plus";
import {
    QueryWorkOrderInfo,
    DIPStationMoveOut,
    FindAllDevice,
    AddDevice,
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
    Barcode: Array<Barcode>,
    WorkStationName: string,
    ResourceName: string,
    EmployeeName: string,
}
interface Barcode {
    Barcode: string,
    Status: string
}
interface orderArr {
    MfgOrderName: string,
    PlannedStartDate: string,
    PlannedCompletionDate: string,
    Qty: number,
    ProductName: string,
    BD_ProjectNo: string,
    BD_ProductModel: string,
    ProductDesc: string,
    UOMName: string,
    OrderStatusName: string,
    OrderStatusDesc: string,
    MfgLineName: string,
    MfgLineDesc: string
}
interface Columns {
    label: string, width: string, prop: string
}
interface OrderData {
    data: Array<orderArr>
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const inputRef = ref();
const stopsForm = ref<StopsForm>({
    Barcode: [],
    WorkStationName: opui.station,
    ResourceName: opui.equipment !== null ? opui.equipment : '',
    EmployeeName: userStore.getUserInfo || "",
});
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const form = reactive<InstanceType<typeof Formspan>>({
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: '',
    PlannedStartDate:'',
    PlannedCompletionDate:'',
    passNum: "",
});
const editForm = ref({
    order: "1213434",
    models: "3A4621-01C",
    productCode: "24010606000131",
    productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
    // orderNum: '100',
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
    // {
    //     label: "机型",
    //     value: "models",
    //     disabled: true,
    //     type: "input",
    //     width: "",
    // },
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
        label: "工单数量",
        value: "Qty",
        disabled: true,
        type: "input",
        width: "",
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
        label: "过站数量",
        value: "passNum",
        disabled: true,
        type: "input",
        width: "",
    }
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
//过序设置
const overVisible = ref(false);
//过序table
const overTableData = ref([]);
//
const addOverRef = ref();
const editOverRef = ref();
//过序添加
const overAddVisible = ref(false);
//过序编辑
const overEditVisible = ref(false);
//过序添加form
const overAddForm = ref({
    ID: "",
    Line: opui.line,
    WorkStation: opui.station,
    LineDec:opui.lineDec,
    WorkStationDec:opui.stationDec,
    NextWorkStation: "",
    NextDevice: "",
    InDeviceLength: 0,
    InDeviceSpeed: 0,
    OutDeviceLength: 0,
    OutDeviceSpeed: 0,
    UpdataDate: "2024-08-09T02:15:38.582Z",
    UpdateBy: userStore.getUserInfo || "",
});
//过序formHeader
const overHeader = reactive([
    {
        label: "产线",
        value: "LineDec",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "工位",
        value: "WorkStationDec",
        disabled: true,
        type: "input",
        width: "",
    },
    {
        label: "进炉距离(cm)",
        value: "InDeviceLength",
        disabled: false,
        type: "inputNumber",
        width: "",
    },
    {
        label: "进炉轨道速度(s/cm)",
        value: "InDeviceSpeed",
        disabled: false,
        type: "inputNumber",
        width: "",
    },
    {
        label: "炉子宽度(cm)",
        value: "OutDeviceLength",
        disabled: false,
        type: "inputNumber",
        width: "",
    },
    {
        label: "炉子轨道速度(s/cm)",
        value: "OutDeviceSpeed",
        disabled: false,
        type: "inputNumber",
        width: "",
    },
]);
//过序添加form
const overEditForm = ref({
    ID: "",
    Line: opui.line,
    WorkStation: opui.station,
    LineDec:opui.lineDec,
    WorkStationDec:opui.stationDec,
    NextWorkStation: "",
    NextDevice: "",
    InDeviceLength: 0,
    InDeviceSpeed: 0,
    OutDeviceLength: 0,
    OutDeviceSpeed: 0,
    UpdataDate: "2024-08-09T02:15:38.582Z",
    UpdateBy: userStore.getUserInfo || "",
});
//获取过序
const getOverData = () => {
    FindAllDevice().then((res: any) => {
        overTableData.value = JSON.parse(res.content);
    });
};

const openOver = () => {
    overVisible.value = true;
    getOverData();
};
//取消添加
const addOverCancel = () => {
    overAddVisible.value = false;
    addOverRef.value.cleanForm();
};
//确定添加
const addOveronSubmit = () => {
    overAddVisible.value = false;
    // console.log(overAddForm.value);
    AddDevice(overAddForm.value).then((res: any) => {
        getOverData();
        ElNotification({
            title: "添加成功",
            // message: "取消操作",
            type: "success",
        });
    });
};
const editOverCancel = () => {
    overEditVisible.value = false;
    editOverRef.value.cleanForm();
};
//确定编辑
const editOveronSubmit = () => {
    // console.log(data);
    UpdateDevice(overEditForm.value).then(() => {
        getOverData();
    });
    overEditVisible.value = false;
    // console.log(overEditForm.value);
};

//过序添加打开
const openOverAdd = () => { };
//过序编辑
const handleEdit = (data: any) => {
    overEditForm.value.ID = data.ID;
    overEditForm.value.Line = data.Line;
    overEditForm.value.WorkStation = data.WorkStation;
    overEditForm.value.NextWorkStation = data.NextWorkStation;
    overEditForm.value.NextDevice = data.NextDevice;
    overEditForm.value.InDeviceLength = data.InDeviceLength;
    overEditForm.value.InDeviceSpeed = data.InDeviceSpeed;
    overEditForm.value.OutDeviceLength = data.OutDeviceLength;
    overEditForm.value.OutDeviceSpeed = data.OutDeviceSpeed;
    overEditVisible.value = true;
};
//过序table overColumnData
const overColumnData = ref([
    {
        text: true,
        prop: "Line",
        label: "产线",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "WorkStation",
        label: "工位",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "InDeviceLength",
        label: "进炉距离(cm)",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "InDeviceSpeed",
        label: "进炉轨道速度(s/cm)",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "OutDeviceLength",
        label: "炉子宽度(cm)",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "OutDeviceSpeed",
        label: "炉子轨道速度(s/cm)",
        width: "",
        align: "1",
    },
    {
        isOperation: true,
        label: "操作",
        width: "120",
        align: "center",
        fixed: "right",
        operation: [
            {
                type: "primary",
                label: "编辑",
                icon: "EditPen",
                buttonClick: handleEdit,
            },
        ],
    },
]);
const selectTable = ref();
interface Order {
    MfgOrderName: string;
}
const orderTable = ref<OrderData>({
    data:[]
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

const radioChange = (args: any) => {
    // console.log(args);
      orderTable.value.data.forEach((v: any) => {
        if (v.MfgOrderName == args[1]) {
           form.MfgOrderName=v.MfgOrderName
           form.ProductName=v.ProductName
           form.ProductDesc=v.ProductDesc
           form.PlannedStartDate=v.PlannedStartDate
           form.PlannedCompletionDate=v.PlannedCompletionDate
           form.Qty=v.Qty
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
    QueryWorkOrderInfo().then((res: any) => {
        let data=JSON.parse(res.content)
        orderTable.value.data[0]=data[0]
        // orderTable.value = JSON.parse(res.content);
        // console.log( orderTable.value)
    });
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

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
    console.log(BadtableData.value);
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

//关闭过序
const overCancel = () => {
    overVisible.value = false;
};
//过站
const getChange = (val: any) => {
    let data = {
        Barcode: val,
        Status: 'false'
    }
    stopsForm.value.Barcode.push(data)

    DIPStationMoveOut(stopsForm.value).then((res: any) => {
        console.log(res);
        barCode.value = "";
        inputRef.value.focus();
        if (stopsForm.value.Barcode.length == 2) {
            stopsForm.value.Barcode = []
        }
    })
    if (stopsForm.value.Barcode.length == 2) {
        stopsForm.value.Barcode = []
    }
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
    // background-color: #fff;
    background-color: rgba($color: #fff, $alpha: .8);
}
</style>
