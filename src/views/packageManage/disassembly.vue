<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
            <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
                <el-tab-pane :label="$t('packageManage.boxDisassembly')" name="box">
                    <div class="flex justify-between">
                        <el-form ref="formRef" class="inbound" :inline="false" size="" @submit.native.prevent
                            label-width="auto">

                            <el-form-item :label="$t('packageManage.boxOrder')" class="mb-2">
                                <el-input v-model.trim="getPackForm.ContainerName" ref="inputRef" style="width: 300px"
                                    placeholder="" @keyup.enter.native="getDataPack('Packing')" /> <el-button
                                    class="ml-2" type="primary" @click="getDataPack('Packing')">{{
                                        $t('publicText.query')
                                    }}</el-button>
                            </el-form-item>

                            <el-form-item class="mb-2">

                                <el-button type="danger" :disabled="packSelectList.length == 0"
                                    @click="disassemPackClick">{{
                                        $t('publicText.disassembly')
                                    }}</el-button>
                                <el-button type="warning" @click="handlebindPack">{{
                                    $t('publicText.bind')
                                    }}</el-button>
                                <el-button @click="handlebindReset">{{
                                    $t('publicText.reset')
                                    }}</el-button>
                            </el-form-item>

                        </el-form>
                        <el-form ref="formRef" class="inbound" :inline="false" size="" @submit.native.prevent
                            label-width="auto">

                            <el-form-item :label="$t('publicText.bind') + $t('packageManage.outerCode')" class="mb-2">
                                <el-input v-model.trim="packForm.ContainerName" ref="inputPackRef" style="width: 600px"
                                    placeholder="" @keyup.enter.native="bindPackClick('OuterBox')" />
                            </el-form-item>
                            <el-form-item class="mb-2" :label="$t('publicText.tip')">
                                <el-input v-model="msgPackText" :rows="2" type="textarea" placeholder=""
                                    style="width: 600px" size="" :class="msgPackClass" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table :data="boxTableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'light'" border fit ref="tablePackRef" @selection-change="handleSelectionPack">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column type="index" align="center" width="60" fixed :label="$t('publicText.index')">

                        </el-table-column>
                        <el-table-column prop="ChildContainerName" :label="$t('packageManage.outerCode')">
                        </el-table-column>
                        <el-table-column prop="ParentContainerName" :label="$t('packageManage.boxOrder')" />

                        <el-table-column prop="CardAreaLocation" :label="$t('packageManage.katoCode')"
                            :show-overflow-tooltip="true" />
                        <el-table-column prop="BindingTime" :label="$t('packageManage.bandTime')" />

                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="$t('packageManage.outerBoxDisassembly')" name="outer">
                    <div class="flex justify-between">
                        <el-form ref="formRef" class="inbound" :inline="false" size="" @submit.native.prevent
                            label-width="auto">

                            <el-form-item :label="$t('packageManage.outerCode')" class="mb-2">
                                <el-input v-model.trim="getBoxForm.ContainerName" ref="inputRef" style="width: 300px"
                                    placeholder="" @keyup.enter.native="getDataBox('OuterBox')" /> <el-button
                                    class="ml-2" type="primary" @click="getDataBox('OuterBox')">{{
                                        $t('publicText.query')
                                    }}</el-button>
                            </el-form-item>

                            <el-form-item class="mb-2">

                                <el-button type="danger" :disabled="boxSelectList.length == 0"
                                    @click="disassemBoxClick">{{
                                        $t('publicText.disassembly')
                                    }}</el-button>
                                <el-button type="warning" @click="handleboxPack">{{
                                    $t('publicText.bind')
                                    }}</el-button>
                                <el-button @click="handleboxReset">{{
                                    $t('publicText.reset')
                                    }}</el-button>
                            </el-form-item>

                        </el-form>
                        <el-form ref="formRef" class="inbound" :inline="false" size="" @submit.native.prevent
                            label-width="auto">

                            <el-form-item :label="$t('publicText.bind') + $t('packageManage.smallCode')" class="mb-2">
                                <el-input v-model.trim="boxForm.ContainerName" ref="inputBoxRef" style="width: 600px"
                                    placeholder="" @keyup.enter.native="bindBoxClick('SmallBox')" />
                            </el-form-item>
                            <el-form-item class="mb-2" :label="$t('publicText.tip')">
                                <el-input v-model="msgBoxText" :rows="2" type="textarea" placeholder=""
                                    style="width: 600px" size="" :class="msgBoxClass" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table :data="outerTableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'light'" border fit ref="tableBoxRef" @selection-change="handleSelectionBox">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column type="index" align="center" width="60" fixed :label="$t('publicText.index')">

                        </el-table-column>
                        <el-table-column prop="ChildContainerName" :label="$t('packageManage.smallCode')">
                        </el-table-column>
                        <el-table-column prop="ChildQty" :label="$t('packageManage.smallNum')" />
                        <el-table-column prop="ParentContainerName" :label="$t('packageManage.outerCode')" />
                        <el-table-column prop="ParentQty" :label="$t('packageManage.boxNum')" />
                        <el-table-column prop="BindingTime" :label="$t('packageManage.bandTime')" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="$t('packageManage.smallBoxDisassembly')" name="small">
                    <el-form ref="formRef" class="inbound" :inline="false" size="" @submit.native.prevent
                        label-width="auto">

                        <el-form-item :label="$t('packageManage.smallCode')" class="mb-2">
                            <el-input v-model.trim="getSmallForm.ContainerName" ref="inputRef" style="width: 300px"
                                placeholder="" @keyup.enter.native="getDataSmall" /> <el-button class="ml-2"
                                type="primary" @click="getDataSmall">{{
                                $t('publicText.query') }}</el-button>
                                <el-button class="ml-2"  @click="handleSmallboxReset">{{
                                    $t('publicText.reset')
                                }}</el-button>
                        </el-form-item>
                        <!-- <el-form-item class="mb-2">
                         
                        </el-form-item> -->
                        <el-form-item class="mb-2" :label="$t('publicText.tip')">
                            <el-input v-model="msgSmallText" :rows="2" type="textarea" placeholder=""
                                style="width: 648px" size="" :class="msgSmallClass" disabled></el-input>
                        </el-form-item>


                    </el-form>

                    <el-table :data="smallTableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'light'" border fit>
                        <el-table-column type="index" align="center" width="60" fixed :label="$t('publicText.index')">

                        </el-table-column>
                        <el-table-column prop="ChildContainerName" :label="$t('packageManage.bacthCode')">
                        </el-table-column>
                        <el-table-column prop="ParentContianerName" :label="$t('packageManage.smallCode')">
                        </el-table-column>
                        <el-table-column prop="BoxParentContainerName" :label="$t('packageManage.outerCode')" />
                        <el-table-column prop="ProductName" :label="$t('packageManage.boxOrder')" />
                        <el-table-column :label="$t('publicText.operation')">
                            <template #default="scope">
                                <el-button type="danger" size="small" @click="disassemSmallClick(scope.row)">{{
                                    $t('publicText.disassembly')
                                    }}</el-button>
                            </template>

                        </el-table-column>

                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    getPackingListOuterBoxListSmallBoxQuery,
    GetSearchBoxNumberSmallBoxNumberQuery,
    AssociateAndDisassociateServices,
    GetSmallBoxQueryMfgOrderContianer,
    SmallBoxCloseAndChangeMfgOrderContianerQty
} from "@/api/packageManage/disassembly"
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification, ElMessageBox } from "element-plus";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const tablePackRef = ref()
const tableBoxRef = ref()
const inputPackRef = ref();
const inputBoxRef = ref();
const activeName = ref("box");
const searchDate = ref<any[]>([]);
const getPackForm = ref({
    ContainerLevelName: "",
    ContainerName: "",
});
const getBoxForm = ref({
    ContainerLevelName: "",
    ContainerName: "",
});
const getSmallForm = ref({
    ContainerLevelName: "",
    ContainerName: "",
});
const packForm = ref({
    ContainerName: "",
    ContainerLevelName: ""
})
const boxForm = ref({
    ContainerName: "",
    ContainerLevelName: ""
})
const form = ref({
    ContainerName: "",
    ContainerLevelName: ""
})
const tableHeight = ref(0);
const boxTableData = ref<any[]>([])
const smallTableData = ref([])
const outerTableData = ref<any[]>([])
const msgPackText = ref('')
const msgBoxText = ref('')
const msgSmallText = ref('')
const isPackSuccess = ref(true)
const isBoxSuccess = ref(true)
const isSmallSuccess = ref(true)
const packSelectList = ref<any[]>([])
const boxSelectList = ref<any[]>([])
const msgPackClass = computed(() => {
    return isPackSuccess.value ? "success-message" : "error-message";
})
const msgBoxClass = computed(() => {
    return isBoxSuccess.value ? "success-message" : "error-message";
})
const msgSmallClass = computed(() => {
    return isSmallSuccess.value ? "success-message" : "error-message";
})

watch(() => activeName.value, (nval, oval) => {
    if (nval !== oval) {


    }
})
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
//获取光标
const getPackFocus = () => {
    inputPackRef.value.focus();
};
const getBoxFocus = () => {
    inputBoxRef.value.focus();
};

//装箱单
const getDataPack = (val: any) => {
    getPackForm.value.ContainerLevelName = val
    getPackingListOuterBoxListSmallBoxQuery(getPackForm.value).then((res: any) => {
        // console.log(res.content);
        boxTableData.value = res.content
        console.log(tablePackRef.value);

    })
}
//装箱单解绑
interface BindForm {
    ParentContainerName: string,
    Status: number,
    packingContianerLists: Array<any>
}
const disassemPackClick = () => {
    ElMessageBox.confirm(t('publicText.confirm') + t('publicText.disassembly'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        let data: BindForm = {
            ParentContainerName: packSelectList.value[0].ParentContainerName,
            Status: 0,
            packingContianerLists: []
        }
        data.packingContianerLists = packSelectList.value.map((item: any) => {
            return {
                ContainerName: item.ChildContainerName
            }
        })
        AssociateAndDisassociateServices(data).then((res: any) => {
            isPackSuccess.value = res.success
            msgPackText.value = res.msg
            if (res.success) {
                getDataPack("Packing")
            }
        })
    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('publicText.tipTitle'),
            message: t('publicText.cancel'),
            type: "info",
        });
    });
}
//装箱单绑定
const bindPackClick = (val: any) => {
    if (getPackForm.value.ContainerName == '') {
        // msgText.value = t('packageManage.pleaseSamContainer')
        // isSuccess.value = false
        getPackFocus()
        return
    }
    packForm.value.ContainerLevelName = val

    
    GetSearchBoxNumberSmallBoxNumberQuery(packForm.value).then((res: any) => {
        isPackSuccess.value = res.success
        msgPackText.value = res.msg
        if (res.success) {
            boxTableData.value.unshift(
                {
                    ChildContainerName: packForm.value.ContainerName,
                    ParentContainerName: getPackForm.value.ContainerName
                }
            )
        }
        packForm.value.ContainerName = ''

    })
}
const handlebindPack = () => {
    let data: BindForm = {
        ParentContainerName: boxTableData.value[0].ParentContainerName,
        Status: 1,
        packingContianerLists: []
    }
    data.packingContianerLists = boxTableData.value.map((item: any) => {
        return {
            ContainerName: item.ChildContainerName
        }
    })
    AssociateAndDisassociateServices(data).then((res: any) => {
        isPackSuccess.value = res.success
        msgPackText.value = res.msg
        if (res.success) {
            getDataPack("Packing")
        }
    })

}
const handlebindReset = () => {
    packForm.value.ContainerName = ''
    getPackForm.value.ContainerName = ''
    boxTableData.value = []
    msgPackText.value = ''
    isPackSuccess.value = true

}
const handleboxReset = () => {
    boxForm.value.ContainerName = ''
    getBoxForm.value.ContainerName = ''
    outerTableData.value = []
    msgBoxText.value = ''
    isBoxSuccess.value = true

}
const handleSmallboxReset = () => {
    getSmallForm.value.ContainerName = ''
    smallTableData.value = []
    msgSmallText.value = ''
    isSmallSuccess.value = true

}
//外箱
const getDataBox = (val: any) => {
    getBoxForm.value.ContainerLevelName = val
    getPackingListOuterBoxListSmallBoxQuery(getBoxForm.value).then((res: any) => {

        outerTableData.value = res.content==null?[]:res.content
    })
}
//外箱
const disassemBoxClick = () => {
    ElMessageBox.confirm(t('publicText.confirm') + t('publicText.disassembly'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        let data: BindForm = {
            ParentContainerName: boxSelectList.value[0].ParentContainerName,
            Status: 0,
            packingContianerLists: []
        }
        data.packingContianerLists = boxSelectList.value.map((item: any) => {
            return {
                ContainerName: item.ChildContainerName
            }
        })
        AssociateAndDisassociateServices(data).then((res: any) => {
            isBoxSuccess.value = res.success
            msgBoxText.value = res.msg
            if (res.success) {
                getDataBox("OuterBox")
            }
        })
    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('publicText.tip'),
            message: t('publicText.cancel') + t('publicText.operation'),
            type: "info",
        });
    });

}
//外箱
const bindBoxClick = (val: any) => {
    if (getBoxForm.value.ContainerName == '') {
        // msgText.value = t('packageManage.pleaseSamContainer')
        // isSuccess.value = false
        getPackFocus()
        return
    }
    boxForm.value.ContainerLevelName = val
       
    GetSearchBoxNumberSmallBoxNumberQuery(boxForm.value).then((res: any) => {
        isBoxSuccess.value = res.success
        msgBoxText.value = res.msg
         console.log( boxForm.value.ContainerName,getBoxForm.value.ContainerName);
          if (!Array.isArray(outerTableData.value)) {
            outerTableData.value = []
        }
        if (res.success) {
            outerTableData.value.unshift(
                {
                    ChildContainerName: boxForm.value.ContainerName,
                    ParentContainerName: getBoxForm.value.ContainerName
                }
            )
        }
        boxForm.value.ContainerName = ''
    })
}
const handleboxPack = () => {
    let data: BindForm = {
        ParentContainerName: outerTableData.value[0].ParentContainerName,
        Status: 1,
        packingContianerLists: []
    }
    data.packingContianerLists = outerTableData.value.map((item: any) => {
        return {
            ContainerName: item.ChildContainerName
        }
    })
    AssociateAndDisassociateServices(data).then((res: any) => {
        isBoxSuccess.value = res.success
        msgBoxText.value = res.msg
        if (res.success) {
            getDataBox("OuterBox")
        }
    })

}
//小盒
const getDataSmall = (val: any) => {
    // getSmallForm.value.ContainerLevelName = val
    GetSmallBoxQueryMfgOrderContianer(getSmallForm.value).then((res: any) => {
        console.log(res.content);
        smallTableData.value = res.content
    })
}
//小盒
const disassemSmallClick = (val: any) => {
    ElMessageBox.confirm(t('publicText.confirm') + t('publicText.disassembly'), t('publicText.confirm') + t('publicText.operation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        let data = {
            ParentContianerName: val.ParentContianerName,
            ChildContainerName: val.ChildContainerName
        }
        SmallBoxCloseAndChangeMfgOrderContianerQty(data).then((res: any) => {
            isSmallSuccess.value = res.success
            msgSmallText.value = res.msg
            if (res.success) {
                getDataSmall('SmallBox')
            }
        })
    }).catch(() => {
        // on cancel
        ElNotification({
            title: t('publicText.tipTitle'),
            message: t('publicText.cancel'),
            type: "info",
        });
    });

}
//
const handleSelectionPack = (val: any) => {
    // console.log(val);
    packSelectList.value = val

}
const handleSelectionBox = (val: any) => {
    boxSelectList.value = val
}

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 290;
    });
};
</script>

<style lang="scss">
/* .demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
} 
.inbound .el-form-item__label {
    font-size: 20px;
}

.inbound .el-input__inner {
    font-size: 28px;
    font-weight: bolder;
}*/

.inbound .el-textarea__inner {
    font-size: 20px;
    font-weight: bolder;
}

.success-message .el-textarea__inner {
    color: #54c11d !important;
}

/* 失败样式 - 红色文字 */
.error-message .el-textarea__inner {
    color: #f64444 !important;
}
</style>
