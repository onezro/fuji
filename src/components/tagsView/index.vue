<script lang="ts" setup>
import { computed, onMounted, unref, ref, watch, onActivated, onBeforeMount, reactive } from 'vue'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { filterAffixTags } from './helper'
import { cloneDeep } from 'lodash-es'
import { useAppStore } from '@/stores/modules/app'
const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStoreWithOut()
const { currentRoute, push } = useRouter()
import { useTagsView } from '@/hooks/useTagsView'
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()
import { useUserStoreWithOut } from '@/stores/modules/user'
const userStore = useUserStoreWithOut()
const routeData = userStore.getRoleRouters
const loginName = userStore.getUserInfo
import { filterBreadcrumb } from "@/components/bread/helper";
import { filter, treeToList } from "@/utils/tree";


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
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  refreshPage(view)
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
    tagsViewStore.delView(view)
    if (isActive(view)) {
        toLastView()
    }
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

const textArr = reactive(['车间：', '产线：', '工位：'])
const logoutsys = () => {
    // console.log(1111)
    userStore.logout()
    // push('/login');
}
const tabActive = ref("");
const addVisible = ref(false)
const form = ref({
    work: '',
    line: '',
    station: ''
})
const OPUIData = ref(
    {
        workShop: '',
        workShopDec: '',
        line: '',
        lineDec: '',
        station: '',
        stationDec: '',
        // equipment: '',
        // equipmentDesc: '',
        path: ''
    }
)
const rules = reactive({
    work: [
        { required: true, message: '请选择车间', trigger: 'change' },
    ],
    line: [
        { required: true, message: '请选择产线', trigger: 'change' },
    ],
    station: [
        { required: true, message: '请选择工位', trigger: 'change' },
    ],
})

const tabRouters = computed(() => {
    let data = unref(routers).filter((v: any) => !v?.meta?.hidden)
    data = data.filter((v: any) => v.path !== '/dashboard')
    return data
}
);
const formRef = ref()
const options2 = ref()
const options3 = ref()
const openAdd = () => {
    addVisible.value = true
}

const addCancel = () => {
    addVisible.value = false
    formRef.value.resetFields();
    cleanOPUIData()
}

const onSubmit = () => {
    formRef.value.validate((valid: any) => {
        if (valid) {
            let str = form.
                value.work + '/' + form.value.line + '/' + form.value.station
            OPUIData.value.path = str
            // localStorage.setItem('OPUI', str)
            localStorage.setItem('OPUIData', JSON.stringify(OPUIData.value))
            push(str)
            formRef.value.resetFields();
            addVisible.value = false
            cleanOPUIData()
            // console.log(OPUIData.value)
        } else {
            console.log("error submit!!");
            return false;
        }
    })

}
const cleanOPUIData = () => {
    OPUIData.value.workShop = ''
    OPUIData.value.workShopDec = ''
    OPUIData.value.line = ''
    OPUIData.value.lineDec = ''
    OPUIData.value.station = ''
    OPUIData.value.stationDec = ''
    // OPUIData.value.equipment = ''
    // OPUIData.value.equipmentDesc = ''
    OPUIData.value.path = ''

}
const meunItem = (value: any) => {
    let data = routeData.filter((v: any) => v.path === value)
    let data1 = cloneDeep(data)
    OPUIData.value.workShop = data1[0].MenuName
    OPUIData.value.workShopDec = data1[0].title
    options2.value = data1[0].childMenu
    options3.value = []
    form.value.line = ''
    form.value.station = ''
}
const meunItem2 = (value: any) => {
    // options3.value = []
    let data = options2.value.filter((v: any) => v.path === value)
    let data1 = cloneDeep(data)
    OPUIData.value.line = data1[0].MenuName
    OPUIData.value.lineDec = data1[0].title
    options3.value = data1[0].childMenu
    form.value.station = ''
}
const meunItem3 = (value: any) => {
    let data = options3.value.filter((v: any) => v.path === value)
    let data1 = cloneDeep(data)
    OPUIData.value.station = data1[0].MenuName
    OPUIData.value.stationDec = data1[0].title
    // OPUIData.value.equipment = data1[0].EquipmentName
    // OPUIData.value.equipmentDesc = data1[0].EquipmentDesc
}
const menuRouters = computed(() => {
    const routers = permissionStore.getRouters;
    return filterBreadcrumb(routers);
});

// const breadcrumbs = ref<Array<RouteLocationMatched>>([]);
const levelList = ref([]);
const treeLength = ref(0)
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
    const currentPath = currentRoute.value.matched.slice(-1)[0].path;
    levelList.value = filter(unref(menuRouters), (node: AppRouteRecordRaw) => {
        return node.path === currentPath;
    });
    levelList.value = levelList.value.filter((v: any) => v.path !== '/dashboard/index')
    let data = treeToList(unref(levelList))
    treeLength.value = data.length
    // console.log(treeLength.value) 
};
onBeforeMount(() => {
    getBreadcrumb();
    // console.log(treeToList(unref(levelList)));
});
// 全屏方法
const fullScreen = () => {
    // 是否全屏，否为null
    let full = document.fullscreenElement
    console.log(full)
    if (!full) {
        // document自带的全屏方法
        document.documentElement.requestFullscreen()
    } else {
        // document自带的推出全屏方法
        document.exitFullscreen()
    }
}
</script>
<template>
    <div class="bood  h-[35px] flex w-full relative bg-[#fff]">
        <div class="overflow-hidden flex-1">
            <el-scrollbar class="h-full">
                <div class="flex h-full items-center" v-if="!appStore.getSystemType">
                    <div v-for="item in visitedViews" :key="item.fullPath" class="tag_item " :class="[item.meta.affix ? `affix` : '', {
                        'is-active': isActive(item)
                    }]">
                        <router-link :to="{ ...item }" custom v-slot="{ navigate }">
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
                <div v-else>
                    <div class="h-[34px] pr-[10px] pl-[10px] flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <el-tooltip content="工位设置" placement="top">
                                <el-icon size="24" @click="openAdd">
                                    <Setting />
                                </el-icon>
                            </el-tooltip>
                            <div v-for="(v, i) in treeToList(unref(levelList))" :key="v.name">{{
                                textArr[i]
                                }}<span class="text-[1.1rem] text-[#006487] underline">&nbsp;{{ v.meta.title
                                    }}&nbsp;</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">

                            <div class="flex items-center">
                                <el-tooltip content="全屏/正常" placement="top">
                                    <el-icon size="24" color="#777777" @click="fullScreen()">
                                        <FullScreen />
                                    </el-icon>
                                </el-tooltip>
                            </div>

                            <el-dropdown trigger="click" placement="bottom">
                                <div class="flex items-center">
                                    <div class="block mr-2">
                                        <el-avatar :size="30" icon="Avatar" />
                                    </div>
                                    <p class="font-bold text-base  text-center break-words text-pretty">
                                        {{ loginName }}
                                    </p>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <!-- <el-dropdown-item @click.native="openUpdatePwd">修改密码</el-dropdown-item> -->
                                        <el-dropdown-item @click.native="logoutsys"><el-icon>
                                                <Promotion />
                                            </el-icon>退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
           
        </div>
        <el-dialog :append-to-body="true" :close-on-click-modal="false" v-model="addVisible" title="设置" width="400px"
            @close="addCancel">
            <div class="w-full flex justify-center">
                <el-form ref="formRef" :rules="rules" style="width:70%" :model="form" label-position="left"
                    label-width="auto">
                    <el-form-item label="车间" prop="work">
                        <el-select v-model="form.work" placeholder="选择车间" size="large" style="width:100%;"
                            @change="meunItem">
                            <el-option v-for="item in routeData" :key="item.MenuName" :label="item.title"
                                :value="item.path" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产线" prop="line">
                        <el-select v-model="form.line" placeholder="选择产线" size="large" style="width:100%;"
                            @change="meunItem2">
                            <el-option v-for="item in options2" :key="item.MenuName" :label="item.title"
                                :value="item.path" />
                        </el-select>
                        <!-- :disabled="item.childMenu.length == 0" -->
                    </el-form-item>
                    <el-form-item label="工位" prop="station">
                        <el-select v-model="form.station" @change="meunItem3" placeholder="选择工位" size="large"
                            style="width:100%;">
                            <el-option v-for="item in options3" :key="item.MenuName" :label="item.title"
                                :value="item.path" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCancel()">取消</el-button>
                    <el-button type="primary" @click="onSubmit"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
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