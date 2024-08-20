<template>
    <div class="p-[10px]">
        <el-card shadow="always" :body-style="{ padding: '10px' }">
            <div class="flex">
            <el-form ref="formRef" :model="form" :inline="true">
                <el-form-item label="车间" prop="WorkCenterName" class="mb-2">
                    <el-select v-model="form.WorkCenterName" clearable placeholder="选择车间" style="width: 180px" @change="meunItem">
                        <el-option v-for="item in option1" :key="item.Name" :label="item.Desc" :value="item.Name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="产线" prop="MfgLineName" class="mb-2">
                    <el-select v-model="form.MfgLineName" clearable placeholder="选择产线" style="width: 180px">
                        <el-option v-for="item in option2" :key="item.Name" :label="item.Desc" :value="item.Name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="设备类型" prop="EquipmentTypeName" class="mb-2">
                    <el-select v-model="form.EquipmentTypeName" clearable placeholder="选择产线" style="width: 180px">
                        <el-option v-for="item in option3" :key="item.EquipmentTypeName" :label="item.EquipmentTypeDesc"
                            :value="item.EquipmentTypeName" />
                    </el-select>
                </el-form-item>

            </el-form>
            <div>
                <el-button type="primary" @click="submit">
                    查询
                </el-button>
                <el-button @click="rest">
                    重置
                </el-button>
            </div>
        </div>
            <table-tem :show-index="true" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
        </el-card>
        <el-dialog v-model="editVisible" width="85%" title="履历明细" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center>
            <main>
                <el-tabs type="card" class="demo-tabs" v-model="tabValue">
                    <el-tab-pane label="设备点检记录" name="inspection">设备点检记录</el-tab-pane>
                    <el-tab-pane label="设备保养记录" name="maintain">设备保养记录</el-tab-pane>
                    <el-tab-pane label="设备维修记录" name="repair">设备维修记录</el-tab-pane>
                </el-tabs>
            </main>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { OrganData } from "@/utils/dataMenu";
import tableTem from "@/components/tableTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import { cloneDeep } from 'lodash-es'
import { ElMessage, ElMessageBox } from "element-plus";
import {
    ref,
    unref,
    nextTick,
    reactive,
    onBeforeMount,
    watch,
    onMounted,
    onBeforeUnmount,
} from "vue";
import {
    GetFactoryModelList,
    GetEquipmentTypeList,
    GetEquipmentList,
} from "@/api/permiss";
interface Option {
    Desc: string;
    FID: string;
    ID: string;
    Level: string;
    Name: string;
    sortId: string;
}
interface Option3 {
    EquipmentTypeDesc: string;
    EquipmentTypeName: string;

}
const tableData = ref([]);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();
const form = ref({
    EquipmentName: "",
    EquipmentDesc: "",
    EquipmentTypeName: "",
    EquipmentTypeDesc: "",
    MfgLineName: "",
    MfgLineDesc: "",
    WorkCenterName: "",
    WorkCenterDesc: "",
    WorkStationName: "",
    WorkStationDesc: "",
    VendorAndModel: "",
    VendorSerialNumber: "",
});
const editForm = reactive({
    eqty: "",
    eqName: "",
    zcnumber: "",
    level: "",
    category: "",
    deviceStatus: "",
    leader: "",
});
const option1 = ref<Option[]>([]);
const option2 = ref<Option[]>([]);
const option3 = ref<Option3[]>([]);
const tabValue = ref("inspection");
const formRef = ref()
const handleEdit = (data: any) => {
    // console.log(data);
    editVisible.value = true;
};
const handleDelete = (data: any) => {
    ElMessageBox.confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => { })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消操作",
            });
        });
};
const columnData = reactive([
{
        text: true,
        prop: "WorkCenterName",
        label: "车间编码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "WorkCenterDesc",
        label: "车间名称",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "MfgLineName",
        label: "产线编码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "MfgLineDesc",
        label: "产线名称",
        width: "",
        min: true,
        align: "center",
    },
    
    {
        text: true,
        prop: "EquipmentName",
        label: "设备编码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "EquipmentDesc",
        label: "设备名称",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "EquipmentTypeName",
        label: "设备类型编码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "EquipmentTypeDesc",
        label: "设备类型名称",
        width: "",
        min: true,
        align: "center",
    },
    {
        isOperation: true,
        label: "履历明细",
        width: "120",
        align: "center",
        fixed: "right",
        operation: [
            {
                type: "primary",
                label: "履历",
                icon: "Document",
                buttonClick: handleEdit,
            },
        ],
    },
]);
const pageObj = ref({
    pageSize: 30,
    currentPage: 1,
});

const formHeader = ref([
    {
        label: "设备型号",
        value: "account",
        type: "input",
    },
]);
const rules = reactive({
    account: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getModeList();
    getTypeList();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    GetEquipmentList(form.value).then((res: any) => {
        tableData.value = JSON.parse(res.content);
        console.log(JSON.parse(res.content));
    });
};

const getModeList = () => {
    GetFactoryModelList().then((res: any) => {
        let data = JSON.parse(res.content);
        option1.value = OrganData(data);
    });
};
const getTypeList = () => {
    GetEquipmentTypeList().then((res: any) => {
        let data = JSON.parse(res.content);
        option3.value = data
    });
};
const meunItem = (value: any) => {
    option2.value = []
    form.value.MfgLineName = ''
    let data = option1.value.filter((v: any) => v.Name === value)
    let data1 = cloneDeep(data)
    option2.value = data1[0].childMenu

}
const submit = () => {
    getData()
}
const rest = () => {
    formRef.value.resetFields()
    getData()
}
// const openAdd = () => {
//   addVisible.value = true;
// };

// const addCancel = () => {
//   addVisible.value = false;
//   addFormRef.value.cleanForm();
// };
// const onSubmit = () => {
//   console.log(form);
//   addFormRef.value.validateJbxx();
// };

// const editCancel = () => {
//   editVisible.value = false;
//   editFormRef.value.cleanForm();
// };

// const editSubmit = () => {
//   console.log(editForm);
// };

const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
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
<style scoped lang="scss"></style>
