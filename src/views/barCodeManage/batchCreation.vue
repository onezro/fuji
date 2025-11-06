<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small">
                <el-form-item :label="$t('batchCreation.scheduling')" class="mb-2">
                    <!-- <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD HH:mm:ss"
                        type="datetimerange" range-separator="-" size="small" style="width: 330px" :clearable="false"
                        :disabled-date="disabledDate" /> -->
                    <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD"
                        type="daterange" range-separator="-" size="small" style="width: 200px" :clearable="false" />
                </el-form-item>

                <el-form-item :label="$t('batchCreation.purchaseOrderNumber')" class="mb-2">
                    <el-input style="width: 140px" v-model="getForm.CustomerPO" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('batchCreation.orderType')" class="mb-2">
                    <el-select v-model="getForm.OrderType" placeholder="" filterable style="width: 140px" clearable>
                        <el-option v-for="p in orderTypeList" :label="p.OrderTypeName" :value="p.OrderTypeName"
                            :key="p.OrderTypeId" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('batchCreation.orderStatus')" class="mb-2">
                    <el-select v-model="getForm.OrderStatus" placeholder="" filterable style="width: 140px" clearable>
                        <el-option v-for="p in orderStatusList" :label="p.OrderStatusName" :value="p.OrderStatusName"
                            :key="p.OrderStatusId" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('batchCreation.customer')" class="mb-2">
                    <el-select v-model="getForm.Customer" placeholder="" filterable style="width: 140px" clearable>
                        <el-option v-for="p in customerList" :label="p.CustomerName" :value="p.CustomerName"
                            :key="p.CustomerId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="getData">{{ $t('publicText.query') }}</el-button>
                    <el-button type="" @click="resetData">{{ $t('publicText.reset') }}</el-button>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-radio-group v-model="batchPrintForm.PackagingType">
                        <el-radio :value="0">{{ $t('batchCreation.AccordingSmallBox') }}</el-radio>
                        <el-radio :value="1">{{ $t('batchCreation.AccordingBox') }}</el-radio>
                        <el-radio :value="2">{{ $t('batchCreation.AccordingOrder') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item :label="$t('batchCreation.Printer')"  prop="Printer" class="mb-2">
                    <el-select v-model="batchPrintForm.PrinterName" placeholder="" filterable style="width: 200px"
                        clearable>
                        <el-option v-for="p in printList" :label="p.PrintQueueName" :value="p.PrintQueueName"
                            :key="p.PrintQueueId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="warning" :disabled="selectList.length == 0" size="small" @click="submitPrint">{{
                        $t('batchCreation.ProduceBatchPrint')
                    }}</el-button>
                </el-form-item>
            </el-form>
            <div>

            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'light'" border fit
                highlight-current-row @cell-click="cellClick" ref="multipleTableRef"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MfgOrderName" :label="$t('batchCreation.OrderCode')">
                    <template #default="scope">
                        <span class="underline">{{ scope.row.MfgOrderName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PriorityCodeName" :label="$t('batchCreation.Priority')" width="80" />
                <el-table-column prop="ProductName" :label="$t('batchCreation.OrderProduct')" width="150" />
                <el-table-column prop="Description" :label="$t('batchCreation.ProductDsc')" width="100"
                    :show-overflow-tooltip="true" />
                <el-table-column prop="Qty" :label="$t('batchCreation.OrderNumber')" />
                <el-table-column prop="UOMName" :label="$t('batchCreation.OrderUnit')" />
                <el-table-column prop="WorkflowName" :label="$t('batchCreation.ProcessFlow')" />
                <el-table-column prop="OrderStatusName" :label="$t('batchCreation.orderStatus')" />
                <el-table-column prop="OrderTypeName" :label="$t('batchCreation.orderType')" />
                <el-table-column prop="ES_CustomerPO" :label="$t('batchCreation.purchaseOrderNumber')" width="120" />
                <el-table-column prop="CustomerName" :label="$t('batchCreation.customer')" />
                <el-table-column prop="ES_SchedulingDate" :label="$t('publicText.time')" width="150" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog v-model="printVisible" :title="$t('batchCreation.OrderCode') + '：' + chooseOrder" width="75%"
            align-center draggable :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false"
            @close="closePrint">
            <el-form ref="resetFormRef" :inline="true" :model="resetPrintForm" :rules="rules">


                <el-form-item :label="$t('batchCreation.Printer')"  prop="Printer">
                    <el-select v-model="resetPrintForm.Printer" placeholder="" filterable style="width: 200px"
                        clearable>
                        <el-option v-for="p in printList" :label="p.PrintQueueName" :value="p.PrintQueueName"
                            :key="p.PrintQueueId" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item :label="$t('batchCreation.PrintingTemplate')"  prop="PrintTemplate">
                    <el-select v-model="resetPrintForm.PrintTemplate" placeholder="" filterable style="width: 200px"
                        clearable>
                        <el-option v-for="p in printTemplate" :label="p.PrinterLabelDefinitionName"
                            :value="p.PrinterLabelDefinitionName" :key="p.PrinterLabelDefinitionId" />
                    </el-select>
                </el-form-item> -->


            </el-form>
            <el-table :data="barchTable" size="small" :style="{ width: '100%' }" height="450px"
                :tooltip-effect="'light'" border fit highlight-current-row ref="barchRef"
                @selection-change="handleSelectionChange1">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">

                </el-table-column>

                <el-table-column prop="ContainerName" :label="$t('batchCreation.BatchName')" />
                <el-table-column prop="Qty" :label="$t('batchCreation.BatchNumber')" width="100" />
                <el-table-column prop="UOMName" :label="$t('batchCreation.BatchUnit')" width="100" />
                <el-table-column prop="ProductName" :label="$t('batchCreation.BatchProduct')" />
                <el-table-column prop="Description" :label="$t('batchCreation.ProductDsc')" width="180"
                    :show-overflow-tooltip="true" />
                <el-table-column prop="SpecName" :label="$t('batchCreation.CurrentProcess')" width="100" />
                <el-table-column prop="Status" :label="$t('batchCreation.CurrentStatus')" width="100" />

                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closePrint">{{ $t('publicText.close') }}</el-button>
                    <el-button type="primary" :disabled="resetList.length == 0" @click="resetPrint"> {{
                        $t('batchCreation.Reprint') }} </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    getOrderTypeQuery,
    getOrderStatusQuery,
    getCustomerQuery,
    getMfgOrderInformationQuery,
    getMfgOrderContainerQuery,
    getPrintQuery,
    getPrintTemplateQuery,
    AddMfgOrderContainer,
    ReprintMfgOrderContainer
} from "@/api/barCodeManage/batchCreation";
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification } from "element-plus";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const multipleTableRef = ref()
const barchRef = ref()
const resetFormRef = ref()
const getForm = ref({
    SchedulingStartDate: "",
    SchedulingEndDate: "",
    CustomerPO: "",
    OrderType: "",
    OrderStatus: "",
    Customer: "",
});
const searchDate = ref<any[]>([]);
const orderTypeList = ref<any[]>([]);
const orderStatusList = ref<any[]>([]);
const customerList = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([]);
const pageObj = ref({
    pageSize: 50,
    currentPage: 1,
});
interface BatchPrintForm {
    PackagingType: number,
    PrinterName: string,
    mfgOrderStartLists: any[]
}
const batchPrintForm = ref<BatchPrintForm>({
    PackagingType: 0,
    PrinterName: "",
    mfgOrderStartLists: []
})
const selectList = ref<any[]>([])
const printVisible = ref(false)
const barchTable = ref([])
const printList = ref<any[]>([])
const printTemplate = ref<any[]>([])
const chooseOrder = ref("")
const resetList = ref<any[]>([])

interface ResetPrintForm {
    Printer: string,
    PrintTemplate: string,
    reprintContianerLists: any[]
}
const resetPrintForm = ref<ResetPrintForm>({
    Printer: "",
    PrintTemplate: "",
    reprintContianerLists: []
})
const rules = reactive({
    Printer: [
        {
            required: true,
            message: t('publicText.pleaseSelect') + t('batchCreation.Printer'),
            trigger: 'change',
        },

    ],
    PrintTemplate: [
        {
            required: true,
            message: t('publicText.pleaseSelect') + t('batchCreation.PrintingTemplate'),
            trigger: 'change',
        },
    ],
})
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.SchedulingStartDate = "";
            getForm.value.SchedulingEndDate = "";
            // getForm.value.PageNumber = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.SchedulingStartDate = newVal[0];
            getForm.value.SchedulingEndDate = newVal[1];
            // getForm.value.PageNumber = 1
        }
    }
);
onBeforeMount(() => {
    getScreenHeight();
    // let end: string = setTodayDate(true);
    // let start: string = setLastDate(true);
    // searchDate.value = [start, end];
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData()
    getOrderType();
    getOrderStatus();
    getCustomer();
    getPrint()
    getPrintTemp()

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
//获取工单类型
const getOrderType = () => {
    getOrderTypeQuery({}).then((res: any) => {
        orderTypeList.value = res.content;
    });
};
//获取工单状态
const getOrderStatus = () => {
    getOrderStatusQuery({}).then((res: any) => {
        orderStatusList.value = res.content;
    });
};
//获取客户
const getCustomer = () => {
    getCustomerQuery({
        CustomerName: "",
        CustomerPO: "",
        CustomerProduct: "",
    }).then((res: any) => {
        customerList.value = res.content;
    });
};
//获取打印机
const getPrint = () => {
    getPrintQuery({}).then((res: any) => {
        printList.value = res.content;
    });
}
const getPrintTemp = () => {
    getPrintTemplateQuery({}).then((res: any) => {
        printTemplate.value = res.content;
    });
}
const getData = () => {
    getMfgOrderInformationQuery(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const resetData = () => {
    getForm.value = {
        SchedulingStartDate: "",
        SchedulingEndDate: "",
        CustomerPO: "",
        OrderType: "",
        OrderStatus: "",
        Customer: "",
    };
    searchDate.value = [];
    tableData.value = [];
    getData()
};


const submitPrint = () => {

    batchPrintForm.value.mfgOrderStartLists = selectList.value.map(item => {
        return {
            MfgOrderName: item.MfgOrderName,
            ProductName: item.ProductName
        }
    })

    AddMfgOrderContainer(batchPrintForm.value).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: "success",
            })
            batchPrintForm.value.mfgOrderStartLists = []
            multipleTableRef.value!.clearSelection()

        } else {
            ElNotification({
                title: t('message.tipTitle'),
                message: res.msg,
                type: "error",
            })
        }
    })
}
const cellClick = (val: any) => {
    // console.log(val.MfgOrderName);
    chooseOrder.value = val.MfgOrderName
    getMfgOrderContainerQuery({ MfgOrderName: val.MfgOrderName }).then((res: any) => {
        printVisible.value = true
        barchTable.value = res.content

    })
};
const resetPrint = () => {
    resetFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
            resetPrintForm.value.reprintContianerLists = resetList.value.map(item => {
                return {
                    ContainerName: item.ContainerName,

                }
            })
            ReprintMfgOrderContainer(resetPrintForm.value).then((res: any) => {
                if (res.success) {
                    ElNotification({
                        title: t('message.tipTitle'),
                        message: res.msg,
                        type: "success",
                    })
                    resetPrintForm.value.reprintContianerLists = []
                    barchRef.value!.clearSelection()
                    resetFormRef.value.resetFields()
                } else {
                    ElNotification({
                        title: t('message.tipTitle'),
                        message: res.msg,
                        type: "error",
                    })
                }
            })
        } else {
            ElNotification({
                title: t('message.tipTitle'),
                message: t('publicText.pleaseCompleSelect'),
                type: "error",
            })
        }
    })

}
const closePrint = () => {
    resetFormRef.value.resetFields()
    printVisible.value = false
    // resetPrintForm.value.PrintTemplate = ''
    // resetPrintForm.value.Printer = ''
      
}
const handleSelectionChange = (val: any) => {
    // console.log(val);
    selectList.value = val
}
const handleSelectionChange1 = (val: any) => {
    resetList.value = val
}
const handleSizeChange = (val: any) => {
    pageObj.value.pageSize=val
   
    // getForm.value.PageNumber = 1;
    // getForm.value.PageSize = val;
    // getData();
};
const handleCurrentChange = (val: any) => {
     pageObj.value.currentPage=val
    // getForm.value.PageNumber = val;
    // getData();
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 215;
    });
};
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
