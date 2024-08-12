<template>
    <div>
        <el-table
            :data="tableData.slice((pageObj.currentPage - 1) * pageObj.pageSize, pageObj.currentPage * pageObj.pageSize)"
            stripe border fit :height="tableHeight">
            <el-table-column type="index" align="center" label="序号" width="60" v-if="showIndex">
            </el-table-column>
            <el-table-column v-for="(c, i) in columnData" :key="i" :prop="c.prop" :label="c.label" :width="c.width"
                :fixed="c.fixed" :align="c.align || 'center'">
                <template #default="scope">
                    <span v-if="c.text">{{ scope.row[c.prop] }}</span>
                    <el-tooltip v-if="c.isOperation" v-for="(o, oi) in c.operation" :key="oi" :content="o.label"
                        placement="top">
                        <el-button :icon="o.icon" size="small" :type="o.type" @click="o.buttonClick(scope.row)" />
                    </el-tooltip>
                    <!-- <span v-if="c.IsReleased">{{ c.IsReleased === 0 ? '未释放':'已释放'}}</span> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="mt-3">
            <el-pagination  background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageObj.currentPage" :page-size="pageObj.pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, toRefs } from "vue"
const props = defineProps(['tableData', 'tableHeight', 'columnData', 'pageObj','showIndex'])
const { tableData, tableHeight, columnData, pageObj,showIndex } = toRefs(props)
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange'])

const handleSizeChange = (e: any) => {
    emit('handleSizeChange', e)
}
const handleCurrentChange = (e: any) => {
    emit('handleCurrentChange', e)
}
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>