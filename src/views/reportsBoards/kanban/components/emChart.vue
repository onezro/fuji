<template>
    <div>
        <div id="capacityChart" :style="{ height: barHeight + 'px' }"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import dayjs from "dayjs";
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
const option = ref({
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    grid: {
        left: "3%",
        right: "6%",
        bottom: "6%",
        top: "7%",
        containLabel: true,
    },
    legend: {
        orient: "horizontal",
        x: "center", //可设定图例在左、右、居中
        y: "top",
        data: ["产出数量"],
        textStyle: {
            color: "#ffffff",
            fontSize: 18,
        },
    },

    xAxis: {
        type: "category",
        //  type: 'time',
        data: [
            "1号",
            "2号",
            "3号",
            "4号",
            "5号",
            "6号",
            "7号",

        ],
        axisLine: {
            lineStyle: {
                color: "#8ac6ff",
            },
        },
        splitLine: {
            lineStyle: {
                color: "rgba(138, 198, 255, 0.1)",
            },
        },
        axisLabel: {
            // color: "#8ac6ff",
            color: "#fff",
            fontSize: 18,
        },
    },
    yAxis: {
        type: "value",

        axisLine: {
            lineStyle: {
                color: "#8ac6ff",
                fontSize: "18",
            },
        },
        axisLabel: {
            color: "#8ac6ff",
            // color: "#fff",
            fontSize: 18,
        },
    },
    series: [
        {
            name: "产出数量",
            type: "bar",
            data: [1250, 1320, 1410, 1530, 1420, 1480, 1370, 1500],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                        offset: 0,
                        color: "#1890ff",
                    },
                    {
                        offset: 1,
                        color: "#13c2c2",
                    },
                ]),
            },
            label: {
                show: true,
                position: "top",
                color: "#e6f7ff",
                fontWeight: "bold",
                fontSize: 24,
            },
        }
    ],
})
const timer = ref<any>(null)
const barHeight = ref(520)
const chart = ref()
const refreshing = ref(false)

onMounted(()=>{
    initChart();
        startRefreshing();
})
const  initChart=()=> {
            const chartDom = document.getElementById("capacityChart");
            chart.value = echarts.init(chartDom);
            chart.value.setOption(option.value);
            // myChart.resize();
        }
const getData=()=>{
    
}
const startRefreshing=()=>{
     stopRefreshing(); // 确保只有一个定时器运行
            refreshing.value = true;
        timer.value = setInterval(() => {
            getData();
            }, 60000);
}
const stopRefreshing=()=>{
         if (timer.value) {
                clearInterval(timer.value);
                timer.value = null;
            }
            refreshing.value = false;
}

</script>

<style lang="scss" scoped></style>
