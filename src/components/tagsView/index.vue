<script lang="ts" setup>
import { computed, onMounted, unref, ref, watch, onActivated } from 'vue'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { filterAffixTags } from './helper'
import { cloneDeep } from 'lodash-es'
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStoreWithOut()
const { currentRoute, push } = useRouter()
import { useTagsView } from '@/hooks/useTagsView'
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()

const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const routers = computed(() => permissionStore.getRouters)
const setSelectTag = tagsViewStore.setSelectedTag
const affixTagArr = ref<any>([])

//初始化
const initTags = () => {
    // console.log(permissionStore.getRouters)
    affixTagArr.value = filterAffixTags(unref(routers))
    for (const tag of unref(affixTagArr)) {
        if (tag.name) {
            tagsViewStore.addVisitedView(cloneDeep(tag))
        }
    }
}
//增加
const addTags = () => {
    const { name } = unref(currentRoute)
    if (name) {
        setSelectTag(unref(currentRoute))
        tagsViewStore.addView(unref(currentRoute))
    }
}
//关闭tag
const closeSelectedTag = (view: any) => {
    // console.log(view)
    tagsViewStore.delView(view)
    // closeCurrent(view, () => {


    if (isActive(view)) {
        toLastView()
    }
    // })
}


const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
    return route.path === unref(currentRoute).path
}

const toLastView = () => {
    const visitedViews = tagsViewStore.getVisitedViews
    const latestView = visitedViews.slice(-1)[0]
    // console.log(visitedViews,latestView)
    if (latestView) {
        push(latestView)
    } else {
        console.log(unref(currentRoute).path)
        if (
            unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
            unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
        ) {
            addTags()
            return
        }

        push(permissionStore.getAddRouters[0].path)
    }
}
watch(
    () => currentRoute.value,
    () => {
        addTags()
        // moveToCurrentTag()
    }
)
onMounted(() => {
    initTags()
    addTags()
})
onActivated(() => {
    // console.log(111)
    initTags()
})
// const bbb = () => {
//     console.log(tagsViewStore.getVisitedViews)
// }
</script>
<template>
    <div class="bood  h-[35px] flex w-full relative bg-[#fff]">
        <div class="overflow-hidden flex-1">
            <el-scrollbar class="h-full">
                <div class="flex h-full items-center">
                    <div v-for="item in visitedViews" :key="item.fullPath" class="tag_item " :class="[item.meta.affix ? `affix` : '', {
                        'is-active': isActive(item)
                    }]">
                        <router-link :to="{ ...item }" custom v-slot="{ navigate }"  >
                            <div @click="navigate"
                                class="flex  whitespace-nowrap  justify-center items-center  pl-[15px]">

                                <!-- <el-tag size="large" type="primary" :effect="isActive(item) ? 'dark' : 'plain'"
                                :closable="item.fullPath === '/dashboard/analysis' ? false : true"
                                @close="closeSelectedTag(item)">
                                {{ item?.meta?.title as string }}
                            </el-tag> -->
                                {{ item?.meta?.title as string }}
                                <div class="qx" v-if="item.fullPath !== '/dashboard/analysis'">
                                    <el-icon :size="12" :color="isActive(item) ? '#fff' : '#333'"
                                        @click.prevent.stop="closeSelectedTag(item)">
                                        <Close />
                                    </el-icon>

                                </div>

                            </div>
                        </router-link>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.bood {
    box-sizing: border-box;
    border-bottom: 1px solid #cbd5e1;
}

.tag_item {
    position: relative;
    top: 2px;
    height: calc(100% - 6px);
    padding: 5px 15px 5px 0;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;

    
    .qx {
        position: absolute;
        top: 28%;
        right: 1px;
        display: none;
        transform: translate(0, -50%);
    }


}

.tag_item:not(.affix) {
    &:hover {

        .qx {
            display: block;
        }
    }
}

.tag_item:not(.is-active) {
    &:hover {
        color: #006487;

    }
}

.is-active {
    color: #ffff;
    background-color: #006487;
    border: 1px solid #006487;

}
</style>