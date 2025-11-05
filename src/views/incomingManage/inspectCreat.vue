<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="flex justify-between">

                <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                    <el-form-item :label="$t('incomeCreat.creatInspect')" class="mb-2">
                        <el-input style="width: 140px" v-model="getForm.inspect" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('incomeCreat.creatInspect')" class="mb-2"><el-date-picker
                            :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                            range-separator="-" size="small" style="width: 200px" :clearable="false" /></el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" size="small">
                            {{ $t("publicText.query") }}
                        </el-button>
                        <el-button type="info" size="small">
                            {{ $t("publicText.reset") }}
                        </el-button>
                    </el-form-item>
                </el-form>
                <div>

                    <el-button type="warning" size="small" @click="handleCreat">
                        {{ $t("incomeCreat.creatInspectCode") }}
                    </el-button>
                </div>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" border fit
                highlight-current-row @cell-click="cellClick">

                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index +
                            pageObj.pageSize * (pageObj.currentPage - 1) +
                            1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creatInspect" :label="$t('incomeCreat.creatInspect')" />
                <el-table-column prop="NotifyDate" :label="$t('incomeCreat.NotifyDate')" />
                <el-table-column prop="NotifyPerson" :label="$t('incomeCreat.NotifyPerson')" />
                <el-table-column prop="NotifyDepartment" :label="$t('incomeCreat.NotifyDepartment')" />
                <el-table-column prop="incomeDate" :label="$t('incomeCreat.incomeDate')" />
                <el-table-column prop="isCarProduct" :label="$t('incomeCreat.isCarProduct')" />
                <el-table-column prop="InspectStandard" :label="$t('incomeCreat.InspectStandard')" />
                <el-table-column prop="Status" :label="$t('incomeCreat.Status')" />
                <el-table-column prop="creatDate" :label="$t('incomeCreat.creatDate')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button type="danger" icon="Delete" size="small"
                                @click.stop="handleDelete(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
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
        <el-dialog v-model="creatVisible" :title="$t('incomeCreat.creatInspectCode')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleClose">
            <el-form ref="creatFormRef" :model="creatForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('incomeCreat.NotifyDepartment')" prop="NotifyDepartment">
                    <!-- <el-input v-model="creatForm.NotifyDepartment" style="width: 200px" placeholder="" /> -->
                    <el-select v-model="creatForm.NotifyDepartment" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyPerson')" prop="NotifyPerson">
                    <el-select v-model="creatForm.NotifyPerson" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeDate')" prop="incomeDate">
                    <el-select v-model="creatForm.incomeDate" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyDate')" prop="NotifyDate">
                    <el-select v-model="creatForm.NotifyDate" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.isCarProduct')" prop="isCarProduct">
                    <el-select v-model="creatForm.isCarProduct" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeUnit')" prop="incomeUnit">
                    <el-select v-model="creatForm.incomeUnit" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleConfirm"> {{ $t('publicText.confirm') }} </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="creatVisible" :title="$t('incomeCreat.creatInspectCode')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleClose">
            <el-form ref="editCreatFormRef" :model="editCreateForm" label-width="auto" :inline="true">


                <el-form-item :label="$t('incomeCreat.NotifyDepartment')" prop="NotifyDepartment">
                    <!-- <el-input v-model="editCreateForm.NotifyDepartment" style="width: 200px" placeholder="" /> -->
                    <el-select v-model="editCreateForm.NotifyDepartment" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyPerson')" prop="NotifyPerson">
                    <el-select v-model="editCreateForm.NotifyPerson" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeDate')" prop="incomeDate">
                    <el-select v-model="editCreateForm.incomeDate" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.NotifyDate')" prop="NotifyDate">
                    <el-select v-model="editCreateForm.NotifyDate" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.isCarProduct')" prop="isCarProduct">
                    <el-select v-model="editCreateForm.isCarProduct" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.incomeUnit')" prop="incomeUnit">
                    <el-select v-model="editCreateForm.incomeUnit" placeholder="" style="width: 200px">
                        <el-option label="Options1" value="1" />
                        <el-option label="Options2" value="2" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleEditClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleEditConfirm"> {{ $t('publicText.confirm') }} </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="detailVisible" title="来料检验单明细" width="75%" @close="detailVisible = false">
            <div class="mb-2 flex justify-end">
                <el-button type="warning" size="small" @click="addDetailVisible = true">
                    {{ $t("publicText.add")+$t("incomeCreat.incomeDetail") }}
                </el-button>
            </div>
            <el-table :data="detailTableData" size="small" :style="{ width: '100%' }" ref="rawRef" :height="450" border
                fit highlight-current-row @cell-click="cellClick">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index +
                            pageObj.pageSize * (pageObj.currentPage - 1) +
                            1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="materialName" :label="$t('incomeCreat.materialName')" />
                <el-table-column prop="modelRules" :label="$t('incomeCreat.modelRules')" />
                <el-table-column prop="supplier" :label="$t('incomeCreat.supplier')" />
                <el-table-column prop="orderNumber" :label="$t('incomeCreat.orderNumber')" />
                <el-table-column prop="lotno" label="Lot No" />
                <el-table-column prop="T-Code" label="T-Code" />
                <el-table-column prop="qtyIncomeMaterial" :label="$t('incomeCreat.qtyIncomeMaterial')" />
                <el-table-column prop="InspectStandard" :label="$t('incomeCreat.InspectStandard')" />
                <el-table-column prop="supplierReport" :label="$t('incomeCreat.supplierReport')" />
                <el-table-column prop="creatDate" :label="$t('incomeCreat.creatDate')" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEditDetail(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button type="danger" icon="Delete" size="small"
                                @click.stop="handleDeleteDetail(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="detailVisible = false">{{ $t('publicText.close') }}</el-button>

                </div>
            </template>
        </el-dialog>
         <el-dialog v-model="addDetailVisible" :title="$t('incomeCreat.incomeDetail')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleAddDetailClose">
            <el-form ref="detailFormRef" :model="detailForm" label-width="auto" :inline="true">
                <el-form-item :label="$t('incomeCreat.materialName')" prop="materialName">
                    <el-input v-model="detailForm.materialName" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.modelRules')" prop="modelRules">
                    <el-input v-model="detailForm.modelRules" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.supplier')" prop="supplier">
                    <el-input v-model="detailForm.supplier" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.orderNumber')" prop="orderNumber">
                    <el-input v-model="detailForm.orderNumber" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="Lot No" prop="lotno">
                    <el-input v-model="detailForm.lotno" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="T-Code" prop="T-Code">
                    <el-input v-model="detailForm['T-Code']" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.qtyIncomeMaterial')" prop="qtyIncomeMaterial">
                    <el-input v-model="detailForm.qtyIncomeMaterial" style="width: 200px" placeholder="" />
                </el-form-item>
              
                <el-form-item :label="$t('incomeCreat.supplierReport')" prop="supplierReport">
                    <el-input v-model="detailForm.supplierReport" style="width: 200px" placeholder="" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleAddDetailClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleAddDetailConfirm"> {{ $t('publicText.confirm') }} </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="editDetailVisible" :title="$t('publicText.edit')+$t('incomeCreat.incomeDetail')" width="750px"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" align-center
            @close="handleEditDetailClose">
            <el-form ref="editdetailFormRef" :model="editdetailForm" label-width="auto" :inline="true">
                
                <el-form-item :label="$t('incomeCreat.materialName')" prop="materialName">
                    <el-input v-model="editdetailForm.materialName" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.modelRules')" prop="modelRules">
                    <el-input v-model="editdetailForm.modelRules" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.supplier')" prop="supplier">
                    <el-input v-model="editdetailForm.supplier" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.orderNumber')" prop="orderNumber">
                    <el-input v-model="editdetailForm.orderNumber" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="Lot No" prop="lotno">
                    <el-input v-model="editdetailForm.lotno" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item label="T-Code" prop="T-Code">
                    <el-input v-model="editdetailForm['T-Code']" style="width: 200px" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('incomeCreat.qtyIncomeMaterial')" prop="qtyIncomeMaterial">
                    <el-input v-model="editdetailForm.qtyIncomeMaterial" style="width: 200px" placeholder="" />
                </el-form-item>
              
                <el-form-item :label="$t('incomeCreat.supplierReport')" prop="supplierReport">
                    <el-input v-model="editdetailForm.supplierReport" style="width: 200px" placeholder="" />
                </el-form-item>

            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleEditDetailClose">{{ $t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleEditDetailConfirm"> {{ $t('publicText.confirm') }} </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification, ElMessageBox } from "element-plus";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const getForm = ref({
    inspect: "",
    SchedulingStartDate: "",
    SchedulingEndDate: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([
    {
        creatInspect: "INSP20230901001",
        NotifyDate: "2023-09-01",
        NotifyPerson: "张三",
        NotifyDepartment: "采购部",
        incomeDate: "2023-09-05",
        isCarProduct: "是",
        InspectStandard: "标准A",
        Status: "待检验",
        creatDate: "2023-09-01 10:00:00"
    },
    {
        creatInspect: "INSP20230901002",
        NotifyDate: "2023-09-02",
        NotifyPerson: "李四",
        NotifyDepartment: "质检部",
        incomeDate: "2023-09-06",
        isCarProduct: "否",
        InspectStandard: "标准B",
        Status: "已检验",
        creatDate: "2023-09-02 11:30:00"
    }
]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const creatVisible = ref(false);
const creatForm = ref({
    NotifyDepartment: "",
    NotifyPerson: "",
    NotifyDate: "",
    isCarProduct: "",
    incomeUnit: "",
    incomeDate: ""
});
const creatFormRef = ref("")
const editCreateForm = ref({
    NotifyDepartment: "",
    NotifyPerson: "",
    NotifyDate: "",
    isCarProduct: "",
    incomeUnit: "",
    incomeDate: ""
});
const editCreatFormRef = ref("")
const detailVisible = ref(false);
const detailTableData = ref([
    {
        materialName: "物料A",
        modelRules: "型号X",
        supplier: "供应商1",
        orderNumber: "ORD20230901001",
        lotno: "LOT12345",
        "T-Code": "T001",
        qtyIncomeMaterial: 100,
        InspectStandard: "标准A",
        supplierReport: "报告A",
        creatDate: "2023-09-01 10:00:00"
    },
    {
        materialName: "物料B",
        modelRules: "型号Y",
        supplier: "供应商2",
        orderNumber: "ORD20230901002",
        lotno: "LOT67890",
        "T-Code": "T002",
        qtyIncomeMaterial: 200,
        InspectStandard: "标准B",
        supplierReport: "报告B",
        creatDate: "2023-09-02 11:30:00"
    }
]);
const addDetailVisible=ref(false);
const detailFormRef = ref("")
const detailForm=ref({
    materialName: "",
    modelRules: "",
    supplier: "",
    orderNumber: "",
    lotno: "",
    "T-Code": "",
    qtyIncomeMaterial: "",
    InspectStandard: "",
    supplierReport: "",
    creatDate: ""
});
const editDetailVisible=ref(false);
const editdetailFormRef=ref('')
const editdetailForm=ref({
    materialName: "",
    modelRules: "",
    supplier: "",
    orderNumber: "",
    lotno: "",
    "T-Code": "",
    qtyIncomeMaterial: "",
    InspectStandard: "",
    supplierReport: "",
    creatDate: ""
});

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
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const handleEdit = (row: any) => {
    editCreateForm.value = { ...row };
    creatVisible.value = true;
};
const handleDelete = (row: any) => {
      ElMessageBox.confirm(t('publicText.confirm') + t('publicText.delete'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
       
    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('message.tipTitle'),
            message: t('publicText.cancel'),
            type: "info",
        });
    });
};
const cellClick = () => {
    detailVisible.value = true;
}
const handleCreat = () => {
    creatVisible.value = true;
}
const handleClose = () => {
    creatVisible.value = false;
}
const handleConfirm = () => {

}
const handleEditClose = () => {
    creatVisible.value = false;
}
const handleEditConfirm = () => {

}

const handleEditDetail = (row: any) => {
    editdetailForm.value = { ...row };
    editDetailVisible.value = true;
};
const handleDeleteDetail = (row: any) => {
      ElMessageBox.confirm(t('publicText.confirm') + t('publicText.delete'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
       
    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('message.tipTitle'),
            message: t('publicText.cancel'),
            type: "info",
        });
    });
};
const handleAddDetailClose = () => {
    addDetailVisible.value = false;
}
const handleAddDetailConfirm = () => {

}
const handleEditDetailClose = () => {
    editDetailVisible.value = false;
}
const handleEditDetailConfirm = () => {

}
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;

    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>