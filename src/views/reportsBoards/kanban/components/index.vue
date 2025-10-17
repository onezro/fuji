<template>
    <div class="w-full h-full">
        <div class="flex flex-col w-full">
            <div class="title">
                <dv-decoration-10 class="dv-dec-10 decoration" :color="['#40a0ffb8']" />
                <dv-decoration-8 class="dv-dec-8 decoration decoration-center" :color="['#40a0ffb8', '#40a0ffb8']" />
                <div class="text decoration-center">
                    <div  class="text-white flex items-center ">
                        <span style="padding-top: 18px;">环宇昌电子数字化运营平台</span>
                    </div>
                </div>
                <dv-decoration-8 class="dv-dec-8 transform decoration decoration-center"
                    :color="['#40a0ffb8', '#40a0ffb8']" />
                <dv-decoration-10 class="dv-dec-10 transform decoration" :color="['#40a0ffb8']" />

                <div class="text-white flex justify-end timetext" style="font-size: 24px">
                    <span class="pr-5">{{ currentTime }}</span>
                </div>
            </div>
            <div class="pt-2">
                <el-row :gutter="5">
                    <el-col :span="6" :offset="0">
                        <dv-border-box-12 class="centerh">
                            <div class="header_title">
                                <i class="fa fa-check-circle"></i> 今日人员
                            </div>
                            <div>
                                <div class="right-panel">
                                    <div class="card">
                                        <div class="personnel-card">
                                            <div class="personnel-item">
                                                <h3>钢板车间</h3>
                                                <div class="personnel-count">
                                                 <span class="text-[#5dade2] text-[36px]"> {{ personnel.steelPlate.actual }}</span>  /{{
                                                    personnel.steelPlate.standard }}</div>
                                            </div>
                                            <div class="personnel-item">
                                                <h3>缓冲垫车间</h3>
                                                <div class="personnel-count">  <span class="text-[#5dade2] text-[36px]">{{ personnel.cushion.actual }}</span>/{{
                                                    personnel.cushion.standard }}</div>
                                            </div>
                                            <div class="personnel-item">
                                                <h3>膜材垫车间</h3>
                                                <div class="personnel-count"><span class="text-[#5dade2] text-[36px]">{{ personnel.membrane.actual }}</span>/{{
                                                    personnel.membrane.standard }}</div>
                                            </div>
                                            <div class="personnel-item">
                                                <h3>总到岗率</h3>
                                                <div class="personnel-count "><span class="text-[#5dade2] text-[36px]">{{ overallAttendanceRate }}%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </dv-border-box-12>
                    </el-col>
                    <el-col :span="12" :offset="0">

                        <dv-border-box-13 class="centerh">
                            <div class="header_title">
                                <i class="fa fa-tasks"></i> 生产数据
                            </div>
                            <div>
                                <dv-scroll-board :config="config" style="height:300px" />
                            </div>
                        </dv-border-box-13>
                    </el-col>
                    <el-col :span="6" :offset="0">
                        <dv-border-box-12 class="centerh">
                            <div class="header_title">
                                <i class="fa fa-check-circle"></i> <span class="text-color ">异常物料</span><span style="color: #ff0000;"> Top5</span>
                            </div>
                            <div>
                                <div class="material-card">
                                    <ul class="material-list">
                                        <li class="header">
                                            <span class="col1">{{ '物料编码' }}</span>
                                            <span class="col2">{{ '数量' }}</span>
                                        </li>
                                        <li v-for="(item, index) in abnormalMaterial" class="text-white" :key="index" :style="{ 
          backgroundColor: `rgba(255, 0, 0, ${0.2 + (abnormalMaterial.length - 1 - index) * 0.1})` 
        }">
                                            <span class="col1">{{ item.materialNo }}</span>
                                            <span class="col2">{{ item.quantity }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </dv-border-box-12>
                    </el-col>

                </el-row>



            </div>
            <div>
                <el-row :gutter="5">
                    <el-col :span="6" :offset="0">
                        <dv-border-box-12 class="centerh1">
                            <div class="header_title">
                                <i class="fa fa-check-circle"></i> 设备管理
                            </div>
                            <div>
                                <div class="equipment-card">
                                    <div class="equipment-item">
                                        <h3>钢板车间</h3>
                                        <div class="equipment-status">
                                            <div class="status-item">
                                                <div class="status-count status-normal">{{ equipment.steelPlate.normal
                                                }}</div>
                                                <div class="status-label">正常</div>
                                            </div>
                                            <div class="status-item">
                                                <div class="status-count status-pending">{{ equipment.steelPlate.pending
                                                }}</div>
                                                <div class="status-label">未开机</div>
                                            </div>
                                            <div class="status-item">
                                                <div class="status-count status-abnormal">{{
                                                    equipment.steelPlate.abnormal }}</div>
                                                <div class="status-label">异常</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="equipment-item">
                                        <h3>缓冲垫车间</h3>
                                        <div class="equipment-status">
                                            <div class="status-item">
                                                <div class="status-count status-normal">{{ equipment.cushion.normal }}
                                                </div>
                                                <div class="status-label">正常</div>
                                            </div>
                                            <div class="status-item">
                                                <div class="status-count status-pending">{{ equipment.cushion.pending }}
                                                </div>
                                                <div class="status-label">未开机</div>
                                            </div>
                                            <div class="status-item">
                                                <div class="status-count status-abnormal">{{ equipment.cushion.abnormal
                                                }}</div>
                                                <div class="status-label">异常</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="equipment-item">
                                        <h3>膜材垫车间</h3>
                                        <div class="equipment-status">
                                            <div class="status-item">
                                                <div class="status-count status-normal">{{ equipment.membrane.normal }}
                                                </div>
                                                <div class="status-label">正常</div>
                                            </div>
                                            <div class="status-item">
                                                <div class="status-count status-pending">{{ equipment.membrane.pending
                                                }}</div>
                                                <div class="status-label">未开机</div>
                                            </div>
                                            <div class="status-item">
                                                <div class="status-count status-abnormal">{{ equipment.membrane.abnormal
                                                }}</div>
                                                <div class="status-label">异常</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </dv-border-box-12>
                    </el-col>
                    <el-col :span="12" :offset="0">

                        <dv-border-box-12 class="centerh1">
                            <div class="header_title">
                                <i class="fa fa-tasks"></i> 设备自动报工
                            </div>
                            <div>
                                <emChart />
                            </div>
                        </dv-border-box-12>
                    </el-col>

                    <el-col :span="6" :offset="0">
                        <dv-border-box-12 class="centerh1">
                            <div class="header_title">
                                <i class="fa fa-check-circle"></i>物料安全库存
                            </div>
                            <div>
                                <div class="material-card">
                                    <ul class="material-list">
                                        <li class="header">
                                            <span class="col1 material-code">物料编码</span>
                                            <span class="col">安全库存</span>
                                            <span class="col">库存</span>
                                        </li>
                                        <li class="text-white" v-for="(item, index) in materialStock" :key="index" :class="item.quantity >= item.SafetyQty ? 'safe-row' : 'danger-row'">
                                            <span class="col1 material-code" :title="item.materialNo">{{ item.materialNo
                                                }}</span>
                                            <span class="col">{{ item.SafetyQty }}</span>
                                            <span class="col font-bold" :class="{ 'text-green': item.quantity >= item.SafetyQty, 'text-red': item.quantity < item.SafetyQty }">{{ item.quantity }}</span>
                                        </li>
                                    </ul>
                                </div>


                            </div>
                        </dv-border-box-12>
                    </el-col>


                </el-row>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import emChart from "./emChart.vue";
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

const currentTime = ref('')
const refreshCountdown = ref(60)
const lastUpdatedTime = ref('')
const dataRefreshInterval = ref(null)
const countdownInterval = ref(null)
const config = ref<{ header: string[]; data: string[][]; headerBGC: string; align: string[], columnWidth: number[] }>({
    header: ['订单号', '计划数量', '完成', '合格率'],
    data: [] as string[][],
    //   index: true,
    headerBGC: "",
    columnWidth: [80, 220, 220, 130, 120, 120],
    align: ['center', 'left', 'left', 'center', 'center', 'center'] as string[],


})
const personnel = ref({
    steelPlate: { standard: 55, actual: 50 },
    cushion: { standard: 30, actual: 30 },
    membrane: { standard: 15, actual: 15 }
});
const overallAttendanceRate = computed(() => {
    const totalStandard = personnel.value.steelPlate.standard +
        personnel.value.cushion.standard +
        personnel.value.membrane.standard;
    const totalActual = personnel.value.steelPlate.actual +
        personnel.value.cushion.actual +
        personnel.value.membrane.actual;
    return Math.round((totalActual / totalStandard) * 100);
});
// 物料库存数据
const materialStock = ref([
    { materialNo: '1050170695100', quantity: 1500, SafetyQty: 1000 },
    { materialNo: '1050670722800', quantity: 300, SafetyQty: 1000 },
    { materialNo: '1050971149500', quantity: 2400, SafetyQty: 1000 }
]);

// 异常物料数据
const abnormalMaterial = ref([
    { materialNo: '1050271160900', quantity: 50 },
    { materialNo: '1051070733700', quantity: 37 },
    { materialNo: '1050170757800', quantity: 20 },
    { materialNo: '1050270760200', quantity: 12 },
    { materialNo: '1050170079800', quantity: 1 }
]);
// 设备数据
const equipment = ref({
    steelPlate: { normal: 40, pending: 1, abnormal: 0 },
    cushion: { normal: 30, pending: 1, abnormal: 0 },
    membrane: { normal: 20, pending: 0, abnormal: 0 }
});
onMounted(() => {
    config.value.header = [
        '<div style="font-size:25px;width:50px">序号</div>',
        '<div style="font-size:25px;width:250px">订单号</div>',
        '<div style="font-size:25px;width:250px">产品编码</div>',
        '<div style="font-size:25px;width:100px">计划数量</div>',
        '<div style="font-size:25px;width:100px">完成进度</div>',
        '<div style="font-size:25px;width:100px">合格率</div>',

    ];
    let data = [
        {
            order: '20251013001',
            productCode: '4050213337200',
            planOrder: '1000',
            complete: '100%',

            passRate: '99%'
        },
        {
            order: '20251013002',
            productCode: '4050213956109',
            planOrder: '500',
            complete: '50%',
            passRate: '99%'
        },
        {
            order: '20251013003',
            productCode: '4050217937203',
            planOrder: '100',
            complete: '0%',
            passRate: '100%'
        }
    ]
    config.value.data = data.map((item, index) => {
        return [
            `<div style="font-size:24px;color:#fff;width:50px">${index + 1}</div>`,
            `<div style="font-size:24px;color:#fff;width:250px">${item.order}</div>`,
            `<div style="font-size:24px;color:#fff;width:250px">${item.productCode}</div>`,
            `<div style="font-size:24px;color:#fff;width:100px"><span>${item.planOrder}</span></div>`,
            `<div style="font-size:24px;color:#fff;width:100px"><span>${item.complete}</span></div>`,
            `<div style="font-size:24px;color:#fff;width:80px"><span>${item.passRate}</span></div>`,
        ];
    });
    updateTime();
    // this.getData();
    setInterval(updateTime, 1000);
})
onBeforeUnmount(() => {
    if (dataRefreshInterval.value) {
        clearInterval(dataRefreshInterval.value);
    }
    if (countdownInterval.value) {
        clearInterval(countdownInterval.value);
    }
})
const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
        hour12: false,
    });
}
</script>

<style lang="scss" scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 10px 0;
    padding: 15px 20px;
    background: rgba(16, 33, 68, 0.7);
    border-radius: 8px;
    border: 2px solid rgba(64, 160, 255, 0.723);
    box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
}

.info-item {
    background: rgba(16, 33, 68, 0.5);
    padding: 10px 15px;
    border-radius: 6px;
    border-left: 3px solid #40a9ff;
}

.info-item:first-child {
    border-left: none;
}

.info-label {
    font-size: 24px;
    color: #8ac6ff;
    margin-bottom: 5px;
}

.info-value {
    font-size: 30px;
    font-weight: bold;
    color: #ffffff;
}

.centerh {
    display: flex;
    flex-direction: column;
    padding: 15px;
    height: 400px;
    font-size: 22px;
    font-weight: bolder;
    color: #8ac6ff;
    background-color: rgba(16, 33, 68, 0.7);

    .header_title {
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 1px solid rgb(64, 160, 255);
    }
}

.centerh1 {
    display: flex;
    flex-direction: column;
    padding: 15px;
    height: 590px;
    font-size: 22px;
    font-weight: bolder;
    color: #8ac6ff;
    background-color: rgba(16, 33, 68, 0.7);

    .header_title {
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 1px solid rgb(64, 160, 255);
    }
}

.el-dropdown-link {
    color: #ffffff;
    font-size: 32px;
}

.test-dropdown {
    background: #05162f !important;
    border: 1px solid #4472cb !important;
}

.el-dropdown-menu__item {
    color: #47c4ff !important;
    background: #05162f !important;

    &:hover {
        background-color: #4472cb !important;
        color: #b2dde9 !important;
    }

    &:not(.is-disabled):focus {
        background-color: #4472cb !important;
        color: #b2dde9 !important;
    }
}

.popper__arrow {
    border-color: #4472cb !important;

    &::after {
        border-top-color: #46bcff !important;
        border-bottom-color: #46bcff !important;
    }
}

.timetext {
    position: absolute;
    top: 45px;
    right: 10px;
}

.custom-select-wrapper {
    position: relative;
    width: 120px;
    // margin: 15px 0;
}

.custom-select {
    width: 100%;

    font-size: 2rem;
    color: #ffffff;
    background-color: transparent;
    border: none;
    border-radius: 4px;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: all 0.3s;
}

.custom-select:hover {
    border-color: #5a8cff;
}

.custom-select:focus {
    border-color: #5a8cff;
    box-shadow: 0 0 5px rgba(71, 196, 255, 0.5);
}

.custom-select-wrapper::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 5px;

    // left: 10px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #fff;
    pointer-events: none;
}

/* 选项样式 */
.custom-select option {
    background-color: #05162f;
    color: #47c4ff;
    font-size: 1rem;
    border: none;
    text-align: center;

}

.title {
    width: 100%;
    height: 80px;
    padding: 15px;
    display: flex;

    .transform {
        transform: rotateY(180deg);
    }

    .text {
        width: 500px;
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .decoration {
        width: calc((100% - 500px) / 4);
    }

    .decoration-center {
        padding-top: 20px;
    }
}

.custom-select option:hover,
.custom-select option:focus,
.custom-select option:checked {
    background-color: #4472cb !important;
    color: #fff !important;
    border: none;
}

.right-panel {
    display: grid;
    grid-template-rows: auto auto;
    gap: 20px;
}

.personnel-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.personnel-item {
    background: rgba(9, 39, 77, 0.8);
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    border: 1px solid rgba(64, 147, 255, 0.2);
}

.personnel-item h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #85c1e9;
}

.personnel-count {
    font-size: 30px;
    font-weight: bold;
    color: #7fb3d5;
}

.equipment-card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.equipment-item {
    background: rgba(9, 39, 77, 0.8);
    border-radius: 8px;
    padding: 15px;
    border: 1px solid rgba(64, 147, 255, 0.2);
}

.equipment-item h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #85c1e9;
}

.equipment-status {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
}

.status-item {
    text-align: center;
}

.status-count {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 5px;
}

.status-normal {
    color: #2ecc71;
}

.status-pending {
    color: #f1c40f;
}

.status-abnormal {
    color: #e74c3c;
}

.status-label {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.7);
}

.material-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
}

.material-card {
    background: rgba(9, 39, 77, 0.8);
    border-radius: 8px;
    padding: 10px;
    border: 1px solid rgba(64, 147, 255, 0.2);
    max-width: 100%;
    /* 防止溢出父容器 */
}

.material-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.material-list li {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.material-list li .col1 {
    flex: 1;
    
    // text-align: center;
    padding: 0 5px;
    overflow: hidden;
}
.material-list li .col2 {
    // flex: 1;
      min-width: 120px;
    text-align: center;
    padding: 0 5px;
    overflow: hidden;
}
.material-list li .col {
    flex: 1;
    text-align: center;
    padding: 0 5px;
    overflow: hidden;
}

.material-list li .material-code {
    flex: 2;
    /* 物料编码列更宽 */
    min-width: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.safe-row { background-color: rgba(40, 167, 69, 0.26); }
.danger-row { background-color: rgba(220, 53, 70, 0.26); }
.text-green { color: #00ff3c; }
.text-red { color: #ff0019; }
</style>