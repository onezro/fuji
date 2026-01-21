<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAdd">
                        {{ $t("publicText.add") }}
                    </el-button>
                </div>
                <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                    <el-form-item :label="$t('iqcProjectCate.ProjectCategoryName')" class="mb-2">
                        <el-input style="width: 140px" v-model="getForm.ProjectName" placeholder=""
                            clearable></el-input>
                    </el-form-item>

                    <el-form-item class="mb-2">
                        <el-button type="primary" size="small" @click="getData">
                            {{ $t("publicText.query") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" border fit>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ProjectCategoryName" :label="$t('iqcProjectCate.ProjectCategoryName')" />
                <el-table-column prop="Description" :label="$t('iqcProjectCate.Description')" />
               
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
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
        <el-dialog v-model="addVisible" title="添加" width="500" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center>
            <el-form ref="addFormRef" :model="addForm" label-width="auto">
                <el-form-item :label="$t('iqcProjectCate.ProjectCategoryName')" prop="ProjectName">
                    <el-input v-model="addForm.ProjectCategoryName" />
                </el-form-item>
                <el-form-item :label="$t('iqcProjectCate.Description')" prop="Description">
                    <el-input v-model="addForm.Description" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleAddClose">{{
                    $t("publicText.cancel")
                    }}</el-button>
                <el-button type="primary" @click="handleAddConfirm">{{
                    $t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editVisible" title="修改" width="500" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center>
            <el-form ref="editFormRef" :model="editForm" label-width="auto">
                <el-form-item  :label="$t('iqcProjectCate.ProjectCategoryName')" prop="ProjectName">
                    <el-input v-model="editForm.ProjectCategoryName" :disabled="true"/>
                </el-form-item>
                <el-form-item :label="$t('iqcProjectCate.Description')" prop="Description">
                    <el-input v-model="editForm.Description" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleEditClose">{{
                    $t("publicText.cancel")
                }}</el-button>
                <el-button type="primary" @click="handleEditConfirm">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    GetProjectCategoryQuery,
    AyscProjectCategory,
} from "@/api/incomingManage/iqcProjectCate";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import { useUserStoreWithOut } from "@/stores/modules/user";

const userStore = useUserStoreWithOut();
const getForm = ref({
    ProjectName: "",
    Status: 0,
});
const uomData = ref<any[]>([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const addFormRef = ref();
const editFormRef = ref();
const addVisible = ref(false);
const editVisible = ref(false);
const addForm = ref({
    ProjectCategoryName: "",
    Description: "",
});
const editForm = ref({
    ProjectCategoryName: "",
    Description: "",
});
const tableHeight = ref(0);
const tableData = ref<any[]>([]);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
const getData = () => {
    GetProjectCategoryQuery(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};

const openAdd = () => {
    addVisible.value = true;
};
const handleEdit = (row: any) => {
    editForm.value = {
        ...row,
    };
    editVisible.value = true;
};
const handleAddClose = () => {
    addFormRef.value.resetFields();
    addVisible.value = false;
};

const handleAddConfirm = () => {
    AyscProjectCategory(addForm.value).then((res: any) => {
        addVisible.value = false;
        getData();
    });
};
const handleEditClose = () => {
    editFormRef.value.resetFields();
    editVisible.value = false;
};
const handleEditConfirm = () => {
    AyscProjectCategory(editForm.value).then((res: any) => {
        editVisible.value = false;
        getData();
    });
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: number) => {
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
