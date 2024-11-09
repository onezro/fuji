<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAddTemp">添加</el-button>
                </div>
                <el-form size="small" :model="getForm" label-width="auto" :inline="true">
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
        <el-dialog v-model="addTempVisible" title="添加成品包装模板标签" draggable width="1000px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="addTempCancel">
            <el-form ref="addFormRef" size="small" :model="addForm" :inline="true" label-width="auto">
                <el-form-item label="物料编码" prop="ProductName">
                    <el-select-v2 v-model="addForm.ProductName" :options="materData" filterable :props="props"
                        style="width: 180px" @change="getBasMaterialData" />
                </el-form-item>
                <el-form-item label="物料描述" prop="ProductDescript">
                    <el-input v-model="ProductDescript" disabled style="width: 240px" />
                </el-form-item>
                <el-form-item label="名称" prop="RuleName">
                    <el-input v-model="addForm.RuleName" style="width: 180px" />
                </el-form-item>
                <el-form-item label="备注" prop="TemplateRemark">
                    <el-input v-model="addForm.TemplateRemark" type="textarea" style="width: 180px" />
                </el-form-item>
                <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="tabChange">
                    <el-tab-pane label="外箱模板" name="TemplateBox">
                        <el-form-item label="模板" prop="TemplateBox" label-width="68px">
                            <!-- <el-input v-model="addForm.TemplateBox" style="width: 150px" /> -->
                            <el-select-v2 v-model="addForm.TemplateBox" :options="tempList" filterable
                                :props="tempProps" style="width: 150px" />
                                <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水</span>
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 150px" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 150px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 150px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 150px" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 150px" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 150px" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 150px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="是否启用外部码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 150px" />
                                </el-form-item>
                                <el-form-item label="条码前缀5" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 150px" />
                                </el-form-item>
                                <el-form-item label="条码前缀6" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 150px" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center">
                                <div>
                                    <el-button type="primary" size="large" @click="addItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent01" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small">
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="100" />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码前缀5" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码前缀6" />
                            <el-table-column prop="TempRlueEnable1" label="外箱码" />
                            <el-table-column prop="TempRlueEnable2" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="机身模板" name="TemplateFuselage">
                        <el-form-item label="模板" prop="TemplateFuselage">
                            <el-input v-model="addForm.TemplateFuselage" style="width: 150px" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="标签一模板" name="Template01">
                        <el-form-item label="模板" prop="Template01">
                            <el-input v-model="addForm.Template01" style="width: 150px" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="标签二模板" name="Template02">
                        <el-form-item label="模板" prop="Template02">
                            <el-input v-model="addForm.Template02" style="width: 150px" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="标签三模板" name="Template03">
                        <el-form-item label="模板" prop="Template03">
                            <el-input v-model="addForm.Template03" style="width: 150px" />
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addTempCancel">关闭</el-button>
                    <el-button type="primary" @click="addTempConfirm"> 保存 </el-button>
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
} from "@/api/operate";
import tableTemp from "@/components/tableTem/index.vue";
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    computed,
} from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
interface AddForm{
    RuleName: string,
    ProductName: string;
    TemplateRemark: string,
    TemplateBox: string,
    TemplateFuselage: string,
    Template01: string,
    Template02:string,
    Template03: string,
    tempcontent01: Array<Tempcontent>,
    tempcontent02: Array<Tempcontent>,
    tempcontent03: Array<Tempcontent>,
    tempcontent04: Array<Tempcontent>,
    tempcontent05: Array<Tempcontent>,
    tempcontent06: Array<Tempcontent>,
}
interface  Tempcontent{
    TempRlueName: string,
    TempRlueFormat: string,
    TempRluePrefixSuffix01:string,
    TempRluePrefixSuffix02:string,
    TempRluePrefixSuffix03:string,
    TempRluePrefixSuffix04:string,
    TempRluePrefixSuffix05:string,
    TempRluePrefixSuffix06:string,
    TempRlueEnable1: boolean,
    TempRlueEnable2: boolean,
    TempRlueEnable3: boolean,
}
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
const addForm = ref<AddForm>({
    RuleName: "",
    ProductName: "",
    TemplateRemark: "",
    TemplateBox: "",
    TemplateFuselage: "",
    Template01: "",
    Template02: "",
    Template03: "",
    tempcontent01: [],
    tempcontent02: [],
    tempcontent03: [],
    tempcontent04: [],
    tempcontent05: [],
    tempcontent06: [],
});

const materData = ref([]);
const props = ref({
    label: "ProductName",
    value: "ProductName",
});
const ProductDescript = ref("");
const tempList = ref([]);
const tempProps = ref({
    label: "Template_Name",
    value: "Template_Name",
});
const ruleData = ref([])
const ruleProps = ref({
    label: "Temppara_Name",
    value: "Temppara_No",
})
const activeName = ref("TemplateBox");
const form = ref({
    TempRlueName: "",
    TempRlueFormat: "",
    TempRluePrefixSuffix01: "",
    TempRluePrefixSuffix02: "",
    TempRluePrefixSuffix03: "",
    TempRluePrefixSuffix04: "",
    TempRluePrefixSuffix05: "",
    TempRluePrefixSuffix06: "",
    TempRlueEnable1: true,
    TempRlueEnable2: true,
    TempRlueEnable3: true,
});
const addFormRef = ref();
const formRef = ref();
const barFormat = computed(() => {
    const barCodeFormat=form.value.TempRluePrefixSuffix01 + form.value.TempRluePrefixSuffix02 + form.value.TempRluePrefixSuffix03 + form.value.TempRluePrefixSuffix04 + form.value.TempRluePrefixSuffix05 + form.value.TempRluePrefixSuffix06
    form.value.TempRlueFormat=barCodeFormat
    return barCodeFormat
})
const barPreview=computed(()=>{

})

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
    QueryBarCodeRuleTemplatePara({
        Temppara_No: "",
    }).then((res: any) => {
        ruleData.value = res.content
    });
};
const addItem=()=>{
    if(activeName.value=="TemplateBox"){
        addForm.value.tempcontent01.push(form.value)
    }
}
//添加取消
const addTempCancel = () => {
    addFormRef.value.resetFields();
    formRef.value.resetFields();
    addTempVisible.value = false;
};
//添加保存
const addTempConfirm = () => { 
    console.log(addForm.value);
    
};
const getBasMaterialData = (val: any) => {
    let data: any = materData.value.find((m: any) => m.ProductName === val);
    if (data != undefined) {
        ProductDescript.value = data.Description;
    }
    QueryProductNameTemplateName({ ProductName: val }).then((res: any) => {
        tempList.value = res.content;
    });
};
const tabChange = () => { };
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

<style lang="scss">
.el-tabs--border-card {
    border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
    --el-tabs-header-height: 30px;
    background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
    padding: 5px;
}

.demo-tabs.el-tabs--border-card>.el-tabs__header .el-tabs__item {
    color: #fff;
    font-size: 0.8rem;
    // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
    font-size: 0.8rem;
    // color: #fff;
    color: #006487 !important;
    // font-weight: bold;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    font-size: 0.8rem;
    color: #006487 !important;
    background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
