<template>
  <div class="w-20 bg-[#006487]" v-click-outside="clickOut">
    <!-- <div class="h-[50px]"></div> -->
    <el-scrollbar class="h-[calc(100%-120px)]">
      <!-- {{  routes}} -->

      <div class="w-[80px]" v-for="item in tabRouters">
        <div
          class="text-center text-xs cursor-pointer pt-3 pb-3 hover:bg-[#005A79]"
          :class="{ isActive: isActive(item.path) }"
          @click="tabClick(isOnlyChildren(item))"
        >
          <el-icon :size="24" color="#ffffff">
            <component :is="isOnlyChildren(item).meta?.icon" />
          </el-icon>
          <p class="text-[#ffffff] mt-5px px-2px">
            {{ isOnlyChildren(item).meta?.title || "" }}
          </p>
        </div>
      </div>
    </el-scrollbar>
    <div class="h-[120px] flex flex-col-reverse items-center">
      <el-dropdown trigger="click" placement="top">
        <div class="flex flex-col items-center">
          <div class="block">
            <el-avatar :size="35" icon="Avatar" />
          </div>
          <p
            class="w-[80px] p-2 text-white text-center break-words text-pretty"
          >
            Admin
          </p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="logoutsys">退出登录</el-dropdown-item>
            <!-- <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Menu
      class="absolute top-0 z-[3000] h-[100%] left-[80px] bg-[#003750]"
      :class="{ 'w-[200px]': showMenu, 'w-0': !showMenu }"
      style="transition: width 0.2s, left 0.2s"
      :base-path="'/'"
      @refresh="clickOut"
    ></Menu>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, unref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Menu from "@/components/menu/index.vue";
import { pathResolve } from "@/utils/routerHelper";
import {
  filterMenusPath,
  initTabMap,
  tabPathMap,
} from "@/components/TabMenu/helper";
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import {useUserStoreWithOut} from '@/stores/modules/user'
import { cloneDeep } from "lodash-es";
const { currentRoute, push } = useRouter();
const permissionStore = usePermissionStoreWithOut();
const userStore=useUserStoreWithOut()

const routers = computed(() => permissionStore.getRouters);
const tabRouters = computed(() =>
  unref(routers).filter((v: any) => !v?.meta?.hidden)
);

watch(
  () => routers.value,
  (routers: AppRouteRecordRaw[]) => {
    initTabMap(routers);
    filterMenusPath(routers, routers);
  },
  {
    immediate: true,
    deep: true,
  }
);
const showMenu = ref(false); //展示子菜单
const tabActive = ref("");
onMounted(() => {
  // console.log( permissionStore.getRouters)
});
//Tab高亮
const isActive = (currentPath: string) => {
  // console.log(tabPathMap)
  const { path } = unref(currentRoute);
  if (unref(tabPathMap[currentPath]).includes(path)) {
    return true;
  }
  return false;
};

const logoutsys=()=>{
  // console.log(1111)
  userStore.logout()
  // push('/login');
}
const tabClick = (item: any) => {
  const newPath = item.children ? item.path : item.path.split("/")[0];
  const oldPath = unref(tabActive);
  tabActive.value = item.children ? item.path : item.path.split("/")[0];
  if (item.children) {
    if (newPath === oldPath || !unref(showMenu)) {
      showMenu.value = !unref(showMenu);
    }
    if (unref(showMenu)) {
      permissionStore.setMenuTabRouters(
        cloneDeep(item.children).map((v: any) => {
          v.path = pathResolve(unref(tabActive), v.path);
          return v;
        })
      );
      // console.log(permissionStore.getMenuTabRouters)
    }
  } else {
    push(item.path);
    permissionStore.setMenuTabRouters([]);
    showMenu.value = false;
  }

  // console.log(item);
};
const clickOut = () => {
  showMenu.value = false;
};
const isOnlyChildren = (item: any) => {
  // console.log(item)
  if (item.children.length && item.children.length > 1) {
    return item;
  } else {
    return {
      ...(item.children && item.children[0]),
      path: pathResolve(
        item.path,
        (item.children && item.children[0])?.path as string
      ),
    };
  }
};
</script>
<script lang="ts">
import { ClickOutside } from "element-plus";
import { defineComponent } from "vue";
export default defineComponent({
  name: "TabMenu",
  directives: {
    ClickOutside,
  },
});
</script>
<style lang="scss" scoped>
.tell {
  height: calc(100% - 86px);
}

.isActive {
  // color: #006487;
  background: #005a79;
}
</style>
