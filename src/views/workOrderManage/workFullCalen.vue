<template>
  <div class="p-1">
    <el-card shadow="always" :body-style="{ padding: '4px' }">
      <div class="flex flex-col">
        <!-- <div><el-button size="small" @click="getdata">测试</el-button></div> -->
        <div class="w-[85%] h-[640px]">
          <FullCalendar ref="fullcalendar" :options="calendarOptions"></FullCalendar>
        </div>

      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, reactive } from "vue";
import FullCalendar from '@fullcalendar/vue3'
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from 'dayjs'
const fullcalendar = ref();
const Tcalendar = ref();
const type = ref("dayGridMonth");
const calendarApi=ref()
const dataSelet = ref([
  {
    title: '白班',
    start: '2025-01-13 08:30:00',
    end: '2025-01-13 17:30:00',
    allDay: false,
    shift: 'day', // 自定义属性，表示白班
    color: '#000000', // 可以设置事件颜色（可选）
    backgroundColor: '#006487', // 背景颜色（可选）
    borderColor: '#000000' // 边框颜色（可选）
  },
  {
    title: '保养',
    start: '2025-01-13 09:30:00',
    end: '2025-01-13 10:30:00',
    allDay: false,
    shift: 'repair', // 自定义属性，表示夜班
    color: '#000000', // 可以设置事件颜色（可选）
    backgroundColor: '#ffcd50', // 背景颜色（可选）
    borderColor: '#000000' // 边框颜色（可选）
  },
  {
    title: '夜班',
    start: '2025-01-13 20:00:00',
    end: '2025-01-14 08:00:00',
    allDay: false,
    shift: 'night', // 自定义属性，表示夜班
    color: '#000000', // 可以设置事件颜色（可选）
    backgroundColor: '#094b8e', // 背景颜色（可选）
    borderColor: '#000000' // 边框颜色（可选）
  }
])
const eventClickData=(val:any)=>{
console.log(val.event);

}
const calendarOptions = reactive({
  height: '100%',
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: "timeGridWeek",// 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
  weekends: true, // 显示周末  
  headerToolbar: true,//是否隐藏默认工具栏
  aspectRatio: 1.0,
  // navLinks: true,//日期是否可以被点击
  dayMaxEvents: 3,// 最大事件数
  firstDay: 0, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推  new Date().getDay()当前天
  locale: 'zh-cn',// 切换语言，当前为中文
  allDaySlot: false,
  unselectAuto: false,//当点击页⾯⽇历以外的位置时，是否⾃动取消当前的选中状态。false是不取消
  selectable: true, //是否可以选中日历格
  dayCellClassNames: 'month-day-cell',//单元格类名
  nowIndicator: true,//是否显示时间线
  // headerToolbar: {
  //   left: 'prev next',
  //   center: 'title',
  //   right: 'today'
  // },
  buttonText: { today: "今天", month: "月", week: "周", day: "日" },
  eventOverlap: false, // 允许事件叠堆
  events: dataSelet.value,
  eventClick:eventClickData

})
onMounted(() => {
  nextTick(() => {
    calendarApi.value=fullcalendar.value.getApi()
    // console.log(fullcalendar.value.getApi().getDate());
    
  })


})

const getdata = () => {
  // let calendarApi = fullcalendar.value.getApi()
  dataSelet.value.push(
    {
      title: '吃饭休息',
      start: '2024-12-16 11:30:00',
      end: '2024-12-16 13:00:00',
      allDay: false,
      shift: 'day', // 自定义属性，表示白班
      color: '#FFFFFF', // 可以设置事件颜色（可选）
      backgroundColor: '#333', // 背景颜色（可选）
      borderColor: '#000000' // 边框颜色（可选）
    },
  )
  calendarApi.value.refetchEvents()

  // const calendarFunc = calendarApi.view.calendar;
  // console.log(calendarFunc);
}



</script>

<style scoped></style>
