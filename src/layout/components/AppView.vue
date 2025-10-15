<template>
  <div>
    <router-view>
      <template #default="{ Component, route }">
        <transition
        
         name="ios-fade" 
          mode="out-in"
        >
          <keep-alive :include="getCaches">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTagsViewStore } from '@/stores/modules/tagsView'
const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
</script>

<style lang="scss" scoped>

html,
body,
#app,
.box {
  margin: 0 auto;
  width: 50%;
  height: 100%;
  background: bisque;
}
.fade-enter-from{   /* 进入时的透明度为0 和 刚开始进入时的原始位置通过active透明度渐渐变为1 */  
  opacity: 0;
  transform: translateX(-100%);
}
 
.fade-enter-to{   /*定义进入完成后的位置 和 透明度 */
  transform: translateX(0%);
  opacity: 1; 
}
 
.fade-leave-active,.fade-enter-active {
    transition: all 0.5s ease-out;
}
 
.fade-leave-from { /* 页面离开时一开始的css样式,离开后为leave-to，经过active渐渐透明 */
  transform: translateX(0%);
  opacity: 1;
}
 
.fade-leave-to{   /* 这个是离开后的透明度通过下面的active阶段渐渐变为0 */  
  transform: translateX(100%);
  opacity: 0;
}
.ios-fade-enter-active,
.ios-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.28, 0.11, 0.32, 1);
}
.ios-fade-enter-from,
.ios-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.ios-modal {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}



</style>
