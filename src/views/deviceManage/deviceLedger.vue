<template>
    <div class="p-[10px]">
        <el-card shadow="always" :body-style="{ padding: '10px' }">
            <div class="mb-[10px]">
                <el-button type="primary" @click="openAdd">添加</el-button>
            </div>
            <table-tem :tableData="tableData" :tableHeight="tableHeight"  :columnData="columnData" :pageObj="pageObj"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></table-tem>
            <formTem ref="addFormRef" :addVisible="addVisible" :rules="rules" :width="'30%'" :title="'添加'" :addForm="form"
                :formHeader="formHeader" @addCancel="addCancel" @onSubmit="onSubmit"></formTem>
            <formTem ref="editFormRef" :addVisible="editVisible" :width="'30%'" :title="'编辑'" :addForm="editForm"
                :formHeader="formHeader" @addCancel="editCancel" @onSubmit="editSubmit"></formTem>
            <!-- <el-table :data="tableData" stripe border fit :height="tableHeight" row-key="id"
                :tree-props="{ children: 'childMenu' }">
                <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
                <el-table-column prop="title" label="设备型号"> </el-table-column>
                <el-table-column prop="title" label="设备名称"> </el-table-column>
                <el-table-column prop="title" label="资产编号"> </el-table-column>
                <el-table-column prop="title" label="等级"> </el-table-column>
                <el-table-column prop="title" label="类别"> </el-table-column>
                <el-table-column prop="title" label="设备状态"> </el-table-column>
                <el-table-column prop="title" label="使用状态"> </el-table-column>
                <el-table-column prop="title" label="负责人"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <el-tooltip content="编辑" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.prevent="handleEdit(scope.row)"></el-button>
                        </el-tooltip>

                        <el-tooltip content="删除" placement="top">
                            <el-button type="danger" icon="Delete" size="small"
                                @click.prevent="handleDelete(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
</el-table-column>
</el-table>
<div class="mt-3">
    <el-pagination size="large" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
        layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
    </el-pagination>
</div> -->
        </el-card>
     
    </div>

</template>

<script lang="ts" setup>
import tableTem from '@/components/tableTem/index.vue'
import formTem from '@/components/formTem/index.vue'
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
const tableData = ref([{
    eqty: '1',
    eqName: '23',
    zcnumber: '4',
    level: '5',
}, {
    eqty: '1',
    eqName: '23',
    zcnumber: '4',
    level: '5',
}, {
    eqty: '1',
    eqName: '23',
    zcnumber: '4',
    level: '5',
}, {
    eqty: '1',
    eqName: '23',
    zcnumber: '4',
    level: '5',
}, {
    eqty: '1',
    eqName: '23',
    zcnumber: '4',
    level: '5',
}, {
    eqty: '1',
    eqName: '23',
    zcnumber: '4',
    level: '5',
}]);
// const pageSize = ref(10);
// const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref()
const editFormRef = ref()

const form = reactive({
    eqty: '',
    eqName: '',
    zcnumber: '',
    level: '',
    category: '',
    deviceStatus: '',
    leader: ''
})
const editForm = reactive({
    eqty: '',
    eqName: '',
    zcnumber: '',
    level: '',
    category: '',
    deviceStatus: '',
    leader: ''
})
const handleEdit = (data: any) => {
    console.log(data);
    editVisible.value = true
}
const handleDelete = (data: any) => {
    ElMessageBox.confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {


        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消操作",
            });
        });
}
const columnData = reactive([
    {
        text: true,
        prop: "eqty",
        label: "设备型号",
        width: "",
        align: "1",

    },
    {
        text: true,
        prop: "eqName",
        label: "设备名称",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "zcnumber",
        label: "资产编号",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "level",
        label: "等级",
        width: "",
        align: "1",
    }, {
        isOperation: true,
        label: "操作",
        width: "120",
        align: "center",
        fixed: 'right',
        operation: [{
            type: "primary",
            label: "编辑",
            icon: "EditPen",
            buttonClick: handleEdit,

        },
        {
            type: "danger",
            label: "删除",
            icon: "Delete",
            buttonClick: handleDelete,

        }]
    }

])
const pageObj = ref({
    pageSize: 10,
    currentPage: 1
})

const formHeader = ref([
    {
        label: '设备型号', value: 'account', type: 'input'
    }
])
const rules = reactive({
    account: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
    ],
})

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    //   getData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});


const openAdd = () => {
    addVisible.value = true
}

const addCancel = () => {
    addVisible.value = false
    addFormRef.value.cleanForm()
}
const onSubmit = () => {
    console.log(form)
    addFormRef.value.validateJbxx()
}



const editCancel = () => {
    editVisible.value = false;
    editFormRef.value.cleanForm();
}

const editSubmit = () => {
console.log(editForm);
}



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