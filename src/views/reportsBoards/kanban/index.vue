<template>
    <div class="line-container" ref="container" id="fullDiv5">
        <div class="content-wrapper" ref="content" :style="contentStyle">
            <indexChart></indexChart>

        </div>
    </div>
</template>

<script setup lang="ts">
import indexChart from './components/index.vue'
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

const container = ref<any>()
const content = ref<any>()
const timer = ref<any>(null)
const baseWidth = ref(1920)
const baseHeight = ref(1080)
const isVertical = ref(false)
const windowWidth = ref(0)
const windowHeight = ref(0)
const contentStyle = computed(() => {
    return {
        width: baseWidth.value + 'px',
        height: baseHeight.value + 'px'
    };
})
const baseProportion = computed(() => {
    return baseWidth.value / baseHeight.value;
})
onMounted(() => {
    checkOrientation()
    calcScaleRatio()
    window.addEventListener("resize", handleResize);
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
})
onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    if (timer.value) {
        clearTimeout(timer.value);
    }
})
const checkOrientation = () => {

    // 判断屏幕方向
    isVertical.value = window.innerHeight > window.innerWidth;

    // 根据方向调整基准尺寸
    if (isVertical.value) {
        baseWidth.value = 1080;
        baseHeight.value = 1920;
    } else {
        baseWidth.value = 1920;
        baseHeight.value = 1080;
    }
}

const calcScaleRatio = () => {
    if (!container.value || !content.value) return;
    const containerWidth = container.value.clientWidth;
    const containerHeight = container.value.clientHeight;

    // 容器尺寸校验
    if (containerWidth === 0 || containerHeight === 0) return;

    const currentRatio = containerWidth / containerHeight;

    let scaleX, scaleY;
    if (currentRatio > baseProportion.value) {
        // 容器更宽（横向空间多）
        scaleX = (containerHeight * baseProportion.value) / baseWidth.value;
        scaleY = containerHeight / baseHeight.value;
    } else {
        // 容器更高（纵向空间多）
        scaleX = containerWidth / baseWidth.value;
        scaleY = containerWidth / (baseProportion.value * baseHeight.value);
    }


    // console.log(scaleX,scaleY,containerHeight / this.baseWidth,currentRatio); 
    // 应用缩放变换
    content.value.style.transform = `scale(${scaleX}, ${scaleY}) translate(-50%, -50%)`;
}
const handleResize = () => {
    checkOrientation();
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        calcScaleRatio();
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;
    }, 200);
}
</script>

<style lang="scss" scoped>
.line-container {
    height: calc(100vh - 80px);
    overflow: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    background-image: url("../../../assets/bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
}

.content-wrapper {
    color: #000;
    // width: 1920px;
    // height: 1080px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: left top;
    transition: transform 0.3s ease;
}

.isRotate {
    transform: rotate(270deg);
}
</style>