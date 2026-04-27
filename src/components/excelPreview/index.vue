<template>
  <div style="position: relative; width: 100%; height: 100%;">
    <!-- 加载状态，在解析和渲染时显示 -->
    <div v-if="isLoading" style="display: flex; justify-content: center; align-items: center; height: 100%;">
      正在加载 Excel 文件...
    </div>
    <!-- Luckysheet 的挂载容器 -->
    <div id="luckysheet-container" style="margin:0px; padding:0px; width:100%; height:100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import LuckyExcel from 'luckyexcel';

// 接收父组件传入的 base64 字符串
const props = defineProps<{
  base64String: string; // Excel文件的Base64字符串，不含 data URL 前缀
}>();

const isLoading = ref(false);

// 1. 将 Base64 字符串转为 Blob 对象
const base64ToBlob = (base64: string): Blob => {
  // 有时后端返回的 base64 可能带有 data URL 前缀，需要处理一下
  const pureBase64 = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
  const byteCharacters = atob(pureBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
};

// 2. 使用 luckyexcel 解析文件并调用 luckysheet 进行预览
const previewExcel = (base64: string) => {
  isLoading.value = true;

  try {
    // 将 Base64 转为 Blob，再格式化为 File 对象
    const blob = base64ToBlob(base64);
    const file = new File([blob], 'preview.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // 核心转换步骤
    LuckyExcel.transformExcelToLucky(
      file,
      (exportJson: any) => {
        // 转换成功后的回调函数
        if (exportJson.sheets == null || exportJson.sheets.length === 0) {
          console.error('无法解析文件，该文件可能不是有效的xlsx文件');
          isLoading.value = false;
          return;
        }

        // 销毁之前的实例，避免冲突
      (window as any).luckysheet?.destroy?.();

        // 使用 luckysheet 创建新的预览
        (window as any).luckysheet.create({
          container: 'luckysheet-container', // 必须与模板中的 id 对应
          data: exportJson.sheets,          // Luckyexcel 转换后的核心数据
          title: exportJson.info?.name || 'Excel Preview', // 文件标题
          lang: 'zh',                       // 设置中文菜单
          showtoolbar: false,               // 隐藏工具栏
          showinfobar: false,               // 隐藏顶部信息栏
          allowEdit: false,                 // 禁止编辑
          enableAddRow: false,              // 禁止增加行
          enableAddCol: false,              // 禁止增加列
          showstatisticBar: false,          // 显示底部统计栏
        });
        isLoading.value = false;
      },
      (error: any) => {
        // 转换失败时的错误处理
        console.error('Excel转换失败:', error);
        isLoading.value = false;
        alert('文件预览失败，请检查文件格式是否正确。');
      }
    );
  } catch (error) {
    console.error('Base64转换过程中出错:', error);
    alert('处理文件时发生错误，请联系管理员。');
    isLoading.value = false;
  }
};

// 3. 使用 watch 监听 base64String 的变化：
//    当传入的 Base64 数据变化时，自动触发预览。
watch(
  () => props.base64String,
  (newBase64) => {
    if (newBase64) {
      previewExcel(newBase64);
    }
  }
);

// 4. 生命周期钩子
//    在组件挂载后，如果已经有 Base64 数据，立即预览
onMounted(() => {
  if (props.base64String) {
    previewExcel(props.base64String);
  }
});

//    在组件卸载前，务必清理 luckysheet 实例，防止内存泄漏
onBeforeUnmount(() => {
  (window as any).luckysheet?.destroy?.();
});
</script>