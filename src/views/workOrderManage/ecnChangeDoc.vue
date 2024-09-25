<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
            <!-- <el-button @click="detailsVisible=true">明细</el-button> -->
            <div class="mb-2 flex justify-between">
                <div>
                </div>
                <div>
                    <el-input v-model="searchName" placeholder="请输入">
                        <template #append>
                            <el-button type="primary" icon="Search"></el-button> </template></el-input>
                </div>
            </div>
            <table-tem size="small" :show-index="true" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>

        </el-card>
        <el-dialog v-model="detailsVisible" width="90%" title="ECN变更单" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <el-form ref="formRef" :model="addForm" label-width="auto" size="small" :inline="true">
                <el-form-item label="ECN编号" prop="name" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="ECN类型" prop="zone" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="客户名称" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="更改时间" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="ECN变更所处阶段" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="切换方式" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="变更时间点" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="申请人" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="受影响的项目和产品" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" style="width: 600px" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="变更原因" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" style="width: 600px" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="变更原因详述" prop="time" class="mb-[5px]">
                    <el-input v-model="addForm.number" style="width: 600px" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <table-tem size="small" :show-index="true" :tableData="detailsData" :tableHeight="400"
                :columnData="detailsColumn" :pageObj="detailsPageObj" @handleSizeChange="detailsSizeChange"
                @handleCurrentChange="detailsCurrentChange"></table-tem>
            <template #footer>
                <span class="dialog-footer">
                    <el-button>关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
import tableTem from "@/components/tableTem/index.vue";
const detailsVisible = ref(false);
const addForm = ref({
    number: "",
});
const searchName = ref('')
const tableData = ref([]);
const pageObj = ref({
    pageSize: 50,
    currentPage: 1,
});
const editSubmit=()=>{
    detailsVisible.value=true
}
const columnData = reactive([
    {
        text: true,
        prop: "ProductName",
        label: "ECN编号",
        width: "",
        min: true,
        fixed: true,
        align: "1",
    },
    {
        text: true,
        prop: "ProductDesc",
        label: "ECN类型",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "BD_ProductModel",
        label: "客户名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "BD_ChipType",
        label: "项目编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "BD_SoftVersion",
        label: "更改时间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "BD_CheckSum",
        label: "ECN变更所处阶段",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "FirstClass",
        label: "切换方式",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "SecondClass",
        label: "变更切换时间点",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ThirdClass",
        label: "申请人",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ThirdClass",
        label: "受影响的项目和产品",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ThirdClass",
        label: "变更原因",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ThirdClass",
        label: "变更详述",
        width: "",
        min: true,
        align: "1",
    },
    {
    isOperation: true,
    label: "操作",
    width: "80",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "明细",
        icon: "EditPen",
        buttonClick: editSubmit,
      },
    ],
  },
]);
const detailsData = ref([]);
const tableHeight = ref(0);
const detailsPageObj = ref({
    pageSize: 30,
    currentPage: 1,
    isShow: -1,
});

const detailsColumn = ref([
    {
        text: true,
        prop: "MaterialName",
        label: "父级零件",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "子件零件",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "子物料类型",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "物料描述",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "数量",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "计量单位代码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "物料序号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "工序名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "基准",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "产出率",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "替代组件",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "参考指标符",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "供应类型",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "子库存",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "货位",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "备注",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "数模版本",
        width: "",
        min: true,
        align: "1",
    },
]);
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const detailsSizeChange = (val: any) => {
    detailsPageObj.value.currentPage = 1;
    detailsPageObj.value.pageSize = val;
};
const detailsCurrentChange = (val: any) => {
    detailsPageObj.value.currentPage = val;
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
        tableHeight.value = window.innerHeight - 194;
    });
};
</script>

<style scoped></style>
