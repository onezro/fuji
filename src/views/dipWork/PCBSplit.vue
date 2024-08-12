<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div>
                <el-button type="primary" @click="dialogVisible = true">工单选择</el-button>
                <el-button type="primary" @click="openDialog">不良品登记</el-button>
            </div>

        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[320px] ">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <el-form-item size="large" label="工单号">
                                <!-- <t-select-table ref="selectTable" :table="table" :columns="tableColumns"
                                    :max-height="400"
                                    :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                                    @radioChange="(...args: any) => radioChange(args, '单选')"></t-select-table> -->
                                    <selectTa ref="selectTable" :table="table" :columns="tableColumns"
                                    :max-height="400"
                                    :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                                    @radioChange="(...args: any) => radioChange(args, '单选')"><</selectTa>
                                <!-- <el-select v-model="form.order" @change="change" filterable placeholder="点击选择">
                                    <el-option v-for="item in workOrderList" :key="item.workOrder"
                                        :label="item.workOrder" :value="item.workOrder"></el-option>
                                </el-select> -->
                            </el-form-item>
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
                                    <el-input v-model="barCode" ref="input" style="width: 500px;" placeholder="请扫描条码"
                                        @change="getChange" />
                                </el-form-item>
                                <el-form-item>
                                    <!-- <div class="">
                                        ok
                                    </div> -->
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
        <badInfoTem :visible="editVisible" :list="list" :formHeader="formHeader1" :form="editForm" :badForm="badForm"
            :tableData="BadtableData" @cancel="editCancel" @submit="editSubmit" @deleteBad="deleteBad"
            @addBadData="addBadData" @openAddBad="openAddBad" />
        <!-- <el-dialog v-model="dialogVisible" title="工单开工" width="90%" align-center>
            <template #header>
                <div class="custom-dialog-title flex items-center justify-between">
                    <div>工单列表</div>
                    <el-input v-model="workOrder" style="width: 400px;" placeholder="请输入">
                        <template #append>
                            <el-button type="primary" icon="Search"></el-button>
                        </template>
</el-input>
</div>
</template>
<el-table ref="taskTableRef" class="test" stripe border :data="orderTableData" style="width: 100%" :height="'60vh'"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column v-for="item in tabalHeader" :prop="item.value" :key="item.value" :label="item.lable" />
</el-table>
<div class="w-full mt-3 flex justify-around">
    <el-pagination size="large" background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
        :current-page="pageObj1.currentPage" :page-size="pageObj1.pageSize" :page-sizes="[5, 10, 20, 50, 100]"
        layout="total,sizes, prev, pager, next, jumper" :total="orderTableData.length">
    </el-pagination>
</div>
<template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureClick">确 定</el-button>
                </div>
            </template>
</el-dialog> -->
    </div>
</template>

<script lang="ts" setup>
import tableTem from '@/components/tableTem/index.vue'
import badInfoTem from '@/components/badInfoTem/index.vue'
import selectTa from '@/components/selectTable/index.vue'
import { checkStringType } from '@/utils/barcodeFormat'
import { useAppStore } from '@/stores/modules/app'
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader } from "@/typing";
import { ref, reactive, onMounted, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
const appStore = useAppStore()
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal()
const barCode = ref('')
const tabsValue = ref('history')
const editVisible = ref(false)
const badVisible = ref(false)
const dialogVisible = ref(false)
const workOrderList = ref([{
    workOrder: '12345677'
}])

const workOrder = ref('')
const orderTableData = ref([])
const pageObj1 = ref({
    pageSize: 10,
    currentPage: 1
})
const tabalHeader = reactive([
    {
        value: 'order',
        lable: '工单'
    }
])
const input = ref()
//过站扫描
const stopsForm = ref({
    ContainerName: '',//PCB
    ToolName: '',//工装治具
    WorkStationName: opui.station,//工位
    ResourceName: opui.equipment !== null ? opui.equipment : '',//设备
    EmployeeName: userStore.getUserInfo//用户
})
const form = reactive<InstanceType<typeof Formspan>>({
    order: '',
    models: '3A4621-01C',
    productCode: '24010606000131',
    productDes: '0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D',
    orderNum: '100',
    passNum: '83'
})
const editForm = ref({
    order: '1213434',
    models: '3A4621-01C',
    productCode: '24010606000131',
    productDes: '0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D',
    // orderNum: '100',
})
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
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
    // {
    //     label: '工单数量',
    //     value: 'orderNum',
    //     disabled: true,
    //     type: 'input',
    //     width: ''
    // },

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
const list = ref([
    {
        key: '切料刀缺口',
        value: 'E208711',
    },
    {
        key: '划痕',
        value: 'E208715',
    },
])


onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    input.value.focus()
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const formText = (data: string) => {
    let key = data as keyof typeof form
    return form[key]
}
const getChange = (val: any) => {
    // console.log(val);
    if (checkStringType(val) == 'result') {
        console.log('result', val);
    } else if (checkStringType(val) == 'pcb') {
        console.log('pcb', val);
        stopsForm.value.ContainerName = val
    } else if (checkStringType(val) == 'tool') {
        console.log('tool', val);
        stopsForm.value.ToolName = val
    } else {
        ElNotification({
            title: "错误",
            message: '扫描条码有误',
            type: "error",
        });
        // console.log('扫描条码有误');
    }
    barCode.value = ''
    input.value.focus()
    if (stopsForm.value.ContainerName && stopsForm.value.ToolName) {
        console.log(stopsForm.value)
    }

}
const handleSelectionChange = () => {

}
const sureClick = () => {

}
const change = (val: any) => {
    console.log(val);
}
// const radioChange = (args: any) => {
//     console.log(args)
// }
const selectTable = ref()
const table = ref({
    data: [
        { MfgOrderName: '24072681', ProductName: "2330201001988", spec: "物料规格1", UOMName: "PCS" },
        { MfgOrderName: '123242442', ProductName: "2024093452", spec: "物料规格2", UOMName: "PCS" },
        { MfgOrderName: '123242443', ProductName: "2024093453", spec: "物料规格3", UOMName: "PCS" },
        { MfgOrderName: '123242444', ProductName: "2024093454", spec: "物料规格4", UOMName: "PCS" },
        { MfgOrderName: '123242445', ProductName: "2024093455", spec: "物料规格5", UOMName: "PCS" },
        { MfgOrderName: '123242446', ProductName: "2024093456", spec: "物料规格6", UOMName: "PCS" },
        { MfgOrderName: '123242447', ProductName: "2024093457", spec: "物料规格7", UOMName: "PCS" },
        { MfgOrderName: '123242448', ProductName: "2024093458", spec: "物料规格8", UOMName: "PCS" },
        { MfgOrderName: '123242449', ProductName: "2024093459", spec: "物料规格9", UOMName: "PCS" }
    ]
})
const tableColumns = ref([
    { label: "工单号", width: "100px", prop: "MfgOrderName" },
    { label: "产品编码", width: "100px", prop: "ProductName" },
    { label: "规格", width: "149px", prop: "spec" },
    { label: "单位", width: "110px", prop: "UOMName" }
])
const radioChange = (args: any, type: any) => {
    console.log("单选--传给后台的值", args, type)
}
const clear = () => {
    console.log("selectTable.value", selectTable.value)
    selectTable.value.clear()
}

//打开不良登记
const openDialog = () => {
    editVisible.value = true
}

//关闭不良登记
const editCancel = () => {
    BadtableData.value = []
    // console.log(BadtableData.value);
    editVisible.value = false
}
//提交不良信息
const editSubmit = () => {
    console.log(BadtableData.value);
    editVisible.value = false
}
//删除不良信息
const deleteBad = (data: any) => {
    BadtableData.value = BadtableData.value.filter((v: any) => {
        return data[0].badCode != v.badCode
    })
}
//打开不良登记
const openAddBad = () => {
    badVisible.value = true
}
//增加不良信息
const addBadData = (data: any) => {
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
const handleSizeChange1 = (val: any) => {
    pageObj1.value.currentPage = 1;
    pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
    pageObj1.value.currentPage = val;
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

.el-table th.el-table__cell .el-checkbox {
    display: none
}
</style>