<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAddTemp">添加</el-button>
                </div>
                <el-form ref="formRef" size="small" :model="getForm" label-width="auto" :inline="true">
                    <el-form-item label="名称" prop="RuleName" class="mb-2">
                        <el-input v-model="getForm.RuleName" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item label="物料编码" prop="ProductName" class="mb-2">
                        <el-input v-model="getForm.ProductName" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item label="物料描述" prop="ProductDescript" class="mb-2">
                        <el-input v-model="getForm.ProductDescript" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <tableTemp :showIndex="true" :size="'small'" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></tableTemp>
        </el-card>
        <el-dialog v-model="addTempVisible" title="添加成品包装模板标签" draggable width="900px" :append-to-body="true"
            :close-on-click-modal="false"  :close-on-press-escape="false" align-center
            @close="addTempCancel">
            <el-form ref="formRef" size="small" :model="addForm" :inline="true">
                <el-form-item label="名称" prop="RuleName">
                    <el-input v-model="addForm.RuleName" />
                </el-form-item>
                <el-form-item label="物料编码" prop="ProductName">
                    <el-select-v2 v-model="addForm.ProductName" :options="materData" filterable :props="props"
                        style="width: 180px" @change="getBasMaterialData" />
                </el-form-item>
                <el-form-item label="物料描述" prop="ProductDescript">
                    <el-input v-model="ProductDescript" disabled style="width: 240px;"/>
                </el-form-item>
                <el-form-item label="备注" prop="TemplateRemark">
                    <el-input v-model="addForm.TemplateRemark" disabled style="width: 240px;"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addTempCancel">取消</el-button>
                    <el-button type="primary" @click="addTempConfirm"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryBarCodeRuleTemplatePartNum,
    QueryMESProductNameNews,
    QueryBarCodeRule_TemContentRule,
    QueryTeplateExistProductNameNews,
    InsertBarCodeRule_TemContentRules,
    UpdateBarCodeRule_TemContentRule,
    DeleteCodeRuleTemplatePartNum,
    QueryProductNameTemplateName,
    QueryBarCodeRuleTemplatePara,
    InsertBarCodeRuleTemplatePara,
    DeleteBarCodeRuleTemplatePara,
} from "@/api/operate";
import tableTemp from "@/components/tableTem/index.vue";
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { find } from "lodash-es";
const userStore = useUserStoreWithOut();
const getForm = ref({
    RuleName: "",
    ProductName: "",
    ProductDescript: "",
});
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const columnData = ref([
    {
        text: true,
        prop: "Template_PartNum",
        label: "物料编码",
        width: "120",
        // min: true,
        align: "1",
        fixed: true,
    },
    {
        text: true,
        prop: "Description",
        label: "物料描述",
        width: "180",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "BD_ProductModel",
        label: "机型",
        // width: "80",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_RuleName",
        label: "规则名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_NameBOX",
        label: "外箱模板",
        // width: "600",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_NameFuselage",
        label: "机身模板",
        // width: "600",
        min: true,
        align: "1",
    },

    {
        text: true,
        prop: "Template_Name01",
        label: "标签模板1",
        // width: "600",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_Name02",
        label: "标签模板2",
        // width: "600",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_Name03",
        label: "标签模板3",
        // width: "600",
        min: true,
        align: "1",
    },

    //   {
    //     text: true,
    //     prop: "MfgOrderName",
    //     label: "生产计划号",
    //     width: "",
    //     min: true,
    //     align: "1",
    //   },
    //   {
    //     text: true,
    //     prop: "TxnDate",
    //     label: "烧录时间",
    //     width: "",
    //     min: true,
    //     align: "1",
    //   },
]);
const addTempVisible = ref(false);
const addForm = ref({
    RuleName: "",
    ProductName: "",
    TemplateRemark: "",
});

const materData = ref([]);
const props = ref({
    label: "ProductName",
    value: "ProductName",
});
const ProductDescript = ref("");
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getMesData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    QueryBarCodeRuleTemplatePartNum(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const getMesData = () => {
    QueryMESProductNameNews({
        ProductName: "",
    }).then((res: any) => {
        materData.value = res.content;
    });
};
const openAddTemp = () => {
    addTempVisible.value = true;
};
const addTempCancel = () => { };
const addTempConfirm = () => { };
const getBasMaterialData = (val: any) => {
    let data: any = materData.value.find((m: any) => m.ProductName === val);
    if (data != undefined) {
        ProductDescript.value = data.Description;
    }
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
        tableHeight.value = window.innerHeight - 190;
    });
};
</script>

<style scoped></style>
