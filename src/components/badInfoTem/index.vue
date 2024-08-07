<template>
    <el-dialog :close-on-press-escape="false" align-center :close-on-click-modal="false" title="不良品登记"
        v-model="dialogVisible" width="80%" @close="cancel">
        <formTemple ref="badFormRef" :visible="badVisible" :width="'30%'" :title="'添加不良信息'" :formHeader="formHeader1" :form="form1"
            @addCancel="addCancel" @onSubmit="onSubmit" @selectData="selectData"/>
        <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                <span class="ml-5">基本信息</span>
            </div>
            <el-form class="pt-2" ref="formRef" :inline="true" :model="form" label-width="auto">
                <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label" :prop="f.value">
                    <el-input v-if="f.type == 'input' || f.type === 'password'" v-model="form[f.value]" :type="f.type"
                        :disabled="f.disabled" :placeholder="'请输入' + f.label" :style="{ width: f.width + 'px' }" />
                    <el-input v-if="f.type == 'textarea'" v-model="form[f.value]" :type="f.type" :disabled="f.disabled"
                        :placeholder="'请输入' + f.label" :style="{ width: f.width + 'px' }" />
                </el-form-item>
            </el-form>
        </div>
        <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                <span class="ml-5">不良品信息</span>
            </div>
            <div class="pt-2">
                <div class="mb-2">
                    <el-button type="primary" @click="openAddBad">增加</el-button>
                    <el-button type="danger" :disabled="multipleSelection.length == 0" @click="deleteBad">删除</el-button>
                </div>
                <el-table :data="tableData" stripe border fit :style="{ width: '100%' }" :height="250"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" align="center" label="序号" width="60" />
                    <el-table-column prop="badCode" label="不良代码" />
                    <el-table-column prop="badCodeDec" label="不良代码描述" />
                    <el-table-column prop="backProcess" label="快修返回工序" />
                    <el-table-column prop="remark" label="备注" />
                </el-table>
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>

    </el-dialog>
</template>
<script setup lang="ts">
interface User {
    badCode: string,
    badCodeDec: string,
    backProcess: string,
    remark: string
}
import formTemple from '@/components/formTem/index.vue'
import { cloneDeep } from 'lodash-es'
import { defineProps, defineExpose, defineEmits, toRefs, computed, ref, reactive } from "vue"
const props = defineProps(['visible', 'badForm', 'form', 'formHeader', 'tableData','list'])
const { visible, form, formHeader, tableData,badForm ,list} = toRefs(props)
const emit = defineEmits(['cancel', 'submit', 'deleteBad', 'addBadData','openAddBad'])
const formRef = ref()
const badFormRef = ref()

const dialogVisible = computed({
    get() {
        return visible?.value
    },
    set(val) {
        return val
    }
})
const multipleSelection = ref<User[]>([])
const badVisible = ref(false)
const formHeader1 = reactive([
    // {
    //     label: '不良代码',
    //     value: 'badCode',
    //     disabled: false,
    //     type: 'select',
    //     width: '',
    //     list:list
    // },
    {
        label: '不良代码描述',
        value: 'badCodeDec',
        disabled: false,
        type: 'select',
        width: '',
        list:list
    },
    {
        label: '快速返修',
        value: 'backProcess',
        disabled: false,
        type: 'input',
        width: ''
    },
    {
        label: '备注',
        value: 'remark',
        disabled: false,
        type: 'textarea',
        width: 300
    },
])
const form1 = ref({
    badCode: '',
    badCodeDec: '',
    backProcess: '',
    remark: ''
})
const addCancel = () => {
    badVisible.value = false
}
//增加不良信息
const onSubmit=()=>{
    let data = cloneDeep(form1.value)
    emit('addBadData',data)
    badVisible.value = false
    badFormRef.value.cleanForm()

}
const cancel = () => {
    emit('cancel')
}
const submit = () => {
    emit('submit')
}
const selectData=(data:any)=>{
let findList=list?.value.find((x: any) => x.key === data)
// console.log(findList);
form1.value.badCode=findList.value
}
const openAddBad = () => {
    badVisible.value = true
}
const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
    // console.log(multipleSelection.value);
}
const deleteBad = () => {
    let data = cloneDeep(multipleSelection.value)
    emit('deleteBad', data);
}
const cleanForm = () => {
    formRef.value.resetFields();
}
const validateJbxx = async () => {
    //校验成功则方法自动返回true，校验方法报错则说明校验失败，返回false
    try {
        return await formRef.value.validate()
    } catch (error) {
        return false
    }
}

defineExpose({
    cleanForm,
    validateJbxx
})

</script>