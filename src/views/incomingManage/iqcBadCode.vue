<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAdd">添加</el-button>
                </div>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'light'" border fit
                highlight-current-row>
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="PriorityCodeName" :label="$t('iqcBadCode.testItem')" />
                <el-table-column prop="ProductName" :label="$t('iqcBadCode.testType')" />
                <el-table-column prop="Description" :label="$t('iqcBadCode.badCode')" />
                   <el-table-column prop="Description" :label="$t('iqcBadCode.badDsc')" />
                <el-table-column :label="$t('publicText.operation')">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="handleEdit(row)">
                            {{ $t('publicText.edit') }}
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)">
                            {{ $t('publicText.delete') }}
                        </el-button>
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
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="500px" @close="addCancel">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" size="normal">
                <el-form-item :label="$t('iqcBadCode.testItem')" prop="testItem">
                    <el-input v-model="addForm.testItem"></el-input>
                </el-form-item>
                <el-form-item :label="$t('iqcBadCode.testType')" prop="testType">
                    <el-input v-model="addForm.testType"></el-input>
                </el-form-item>
                <el-form-item :label="$t('iqcBadCode.badCode')" prop="badCode">
                    <el-input v-model="addForm.badCode"></el-input>
                </el-form-item>
                 <el-form-item :label="$t('iqcBadCode.badDsc')" prop="badDsc">
                    <el-input v-model="addForm.badDsc"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="500px" @close="editCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false" size="normal">
               <el-form-item :label="$t('iqcBadCode.testItem')" prop="testItem">
                    <el-input v-model="editForm.testItem"></el-input>
                </el-form-item>
                <el-form-item :label="$t('iqcBadCode.testType')" prop="testType">
                    <el-input v-model="editForm.testType"></el-input>
                </el-form-item>
                <el-form-item :label="$t('iqcBadCode.badCode')" prop="badCode">
                    <el-input v-model="editForm.badCode"></el-input>
                </el-form-item>
                 <el-form-item :label="$t('iqcBadCode.badDsc')" prop="badDsc">
                    <el-input v-model="editForm.badDsc"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
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
import { ElNotification, ElMessageBox } from "element-plus";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const tableHeight = ref(0);
const tableData = ref([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const addVisible = ref(false);
const addForm = ref({
    testItem: "",
    testType: "",
    badCode: "",
    badDsc: "",
});
const addFormRef = ref();
const editVisible = ref(false)
const editForm = ref({
    testItem: "",
    testType: "",
    badCode: "",
    badDsc: "",
})
const editFormRef = ref();
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});

const openAdd = () => {
    addVisible.value = true;
};
const addCancel = () => {
    addFormRef.value.resetFields();
    addVisible.value = false;
};
const addSubmit = () => { };
const handleEdit = (val: any) => { }
const handleDelete = (val: any) => {
    ElMessageBox.confirm(t('publicText.confirm') + t('publicText.disassembly'), t('publicText.confirm') + t('publicText.operation'), {
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
 }
const editCancel = () => {
    editFormRef.value.resetFields();
    editVisible.value = false;
}
const editSubmit = () => {

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
