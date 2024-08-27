<template>
  <div>
    <el-table
      :data="
        tableData.slice(
          (pageObj.currentPage - 1) * pageObj.pageSize,
          pageObj.currentPage * pageObj.pageSize
        )
      "
      stripe
      border
      fit
      :height="tableHeight"
      :size="size || 'default'"
      :tooltip-effect="'dark'"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTableRef"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="showSelect"
      />
      <el-table-column
        type="index"
        align="center"
        fixed
        label="序号"
        width="60"
        v-if="showIndex"
      >
      </el-table-column>
      <el-table-column
        v-for="(c, i) in columnData"
        :key="i"
        :prop="c.prop"
        :label="c.label"
        :show-overflow-tooltip="true"
        :width="c.width"
        :min-width="c.min ? flexColumnWidth(c.label, c.prop) : ''"
        :fixed="c.fixed"
        :align="c.align || 'center'"
      >
        <template #default="scope">
          <span v-if="c.text">{{ scope.row[c.prop] }}</span>
          <div v-if="c.tag === true">
            <el-tag
              v-if="c.tagType === 'string'"
              :type="c.tagItem[scope.row[c.prop]]"
              effect="plain"
            >
              {{ scope.row[c.prop] }}
            </el-tag>
            <el-tag
              v-if="c.tagType === 'bolean'"
              :type="scope.row[c.prop] ? c.tagItem[0].type:c.tagItem[1].type"
              effect="plain"
            >
              {{ scope.row[c.prop] ? c.tagItem[0].text:c.tagItem[1].text }}
            </el-tag>
          </div>
          <el-tooltip
            v-if="c.isOperation"
            v-for="(o, oi) in c.operation"
            :key="oi"
            :content="o.label"
            placement="top"
          >
            <el-button
              v-if="o.icon"
              :icon="o.icon"
              size="small"
              :type="o.type"
              @click="o.buttonClick(scope.row)"
            />
            <span
              v-if="!o.icon"
              class="underline font-bold text-[#006487]"
              @click="o.buttonClick(scope.row)"
              >{{ scope.row[o.prop] || o.label }}</span
            >
          </el-tooltip>
          <!-- <span v-if="c.IsReleased">{{ c.IsReleased === 0 ? '未释放':'已释放'}}</span> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-2 mb-2">
      <el-pagination
        :size="size || 'default'"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager-count="5"
        :current-page="pageObj.currentPage"
        :page-size="pageObj.pageSize"
        :page-sizes="[10, 30, 50, 100, 150]"
        layout="total,sizes, prev, pager, next"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref } from "vue";
const props = defineProps([
  "tableData",
  "tableHeight",
  "columnData",
  "pageObj",
  "showIndex",
  "showSelect",
  "size",
]);
const {
  tableData,
  tableHeight,
  columnData,
  pageObj,
  showIndex,
  showSelect,
  size,
} = toRefs(props);

const multipleTableRef = ref();

const emit = defineEmits([
  "handleSizeChange",
  "handleCurrentChange",
  "handleSelectionChange",
]);

const handleSizeChange = (e: any) => {
  emit("handleSizeChange", e);
};
const handleSelectionChange = (e: any) => {
  emit("handleSelectionChange", e);
};

const handleCurrentChange = (e: any) => {
  emit("handleCurrentChange", e);
};

const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};

const toggleSelection = (rows?: any) => {
  if (rows) {
    rows.forEach((row: any, index: any) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};

const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.innerText = str;
  html.className = "getTextWidth";
  document.body?.appendChild(html);

  // 使用类型断言将 Element 转换为 HTMLElement
  const spanElement = document.querySelector(".getTextWidth") as HTMLElement;
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};
// const getTextWidth = (str: string): number => {
//     let width = 0;
//     let canvas = document.createElement("canvas");
//     let context = canvas.getContext("2d");

//     // 检查 context 是否为 null
//     if (!context) {
//         throw new Error("Unable to get 2D rendering context for canvas.");
//     }

//     context.font = "14px Microsoft YaHei";
//     width = context.measureText(str).width;
//     console.log(width);
//     return width;
// };

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

defineExpose({
  toggleSelection,
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
<style lang="scss" scoped></style>
