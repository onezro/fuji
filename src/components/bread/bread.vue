<script lang="ts" setup>
import { ref, unref, computed, watch, onBeforeMount } from "vue";
import { useRouter, type RouteLocationMatched } from "vue-router";
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import { filterBreadcrumb } from "./helper";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { filter, treeToList } from "@/utils/tree";

const { currentRoute } = useRouter();

const permissionStore = usePermissionStoreWithOut();
const menuRouters = computed(() => {
  const routers = permissionStore.getRouters;
  return filterBreadcrumb(routers);
});

const breadcrumbs = ref<Array<RouteLocationMatched>>([]);
const levelList = ref([]);
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);
const getBreadcrumb = () => {
  //     let matched = currentRoute.value.matched.filter(
  //     (item:any) => item.meta && item.meta.title
  //   );
  //   const first = matched[0];
  //   if (!isDashboard(first)) {
  //     matched = [
  //       { path: "/dashboard", meta: { title: "首页" } } as any,
  //     ].concat(matched);
  //   }
  //   breadcrumbs.value = matched.filter((item:any) => {
  //     return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  //   });
  const currentPath = currentRoute.value.matched.slice(-1)[0].path;
  levelList.value = filter(unref(menuRouters), (node: AppRouteRecordRaw) => {
    return node.path === currentPath;
  });
};

// function isDashboard(route: RouteLocationMatched) {
//   const name = route && route.name;
//   if (!name) {
//     return false;
//   }
//   return (
//     name.toString().trim().toLocaleLowerCase() ===
//     "Dashboard".toLocaleLowerCase()
//   );
// }
// const breadcrumbList = ;
onBeforeMount(() => {
  getBreadcrumb();
  // console.log(treeToList(unref(levelList)));
});
</script>

<template>
  <div class="flex items-center h-full">
    <div class="">
            <img src="../../assets/logo.png" width="200" alt="">
        </div>
    <el-breadcrumb separator="/" class="flex items-center h-full  ">
      <el-icon size="20" color="#fff" class="mr-2 ml-2"><Place /></el-icon>
      <TransitionGroup
        appear
        enter-active-class="animate__animated animate__fadeInRight"
      >
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item
          v-for="item in treeToList(unref(levelList))"
          :key="item.name"
          :to="{
            path:
              !item.redirect || item.redirect === 'noredirect' ? '' : item.path,
          }"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </TransitionGroup>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  ::v-deep .el-breadcrumb__inner {
    color: #fff;
    font-size: 13px;
    &:hover {
      color: #eeeeee;
    }
  }

  ::deep(.el-breadcrumb__item):not(:last-child) .el-breadcrumb__inner {
    color: #fff;
    // font-size: 14px;
    // &:hover {
    //   color: #ffcd50;
    // }
  }

  ::deep(.el-breadcrumb__item):last-child .el-breadcrumb__inner {
    color: #fff;
  }
}
</style>
