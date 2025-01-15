<template>
  <div class="p-1">
    <el-card shadow="always" :body-style="{ padding: '4px' }">
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <div>
            <el-button icon="ArrowLeftBold" circle @click="getPrev"></el-button>
            <el-button icon="ArrowRightBold" circle @click="getNext"></el-button>
          </div>
          <div>
            <div class="text-xl font-bold">{{ calendarTitle }}</div>
          </div>
          <div class="flex gap-2">
            <el-select v-model="calendarLine" placeholder="请选择产线" style="width: 150px;" :clearble="false">
              <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
            </el-select>
            <el-select v-model="viewType" placeholder="视图类型" style="width: 80px" class="header_select"
              @change="handleChangeType">
              <el-option label="月" value="dayGridMonth" />
              <el-option label="周" value="timeGridWeek" />
              <el-option label="日" value="timeGridDay" />
            </el-select>

            <el-button icon="Plus" type="primary" @click="openAdd">
              新增日程
            </el-button>
          </div>

        </div>
        <div class="w-[100%] h-[calc(100vh-130px)]">
          <FullCalendar ref="fullcalendar" :options="calendarOptions"></FullCalendar>
        </div>

      </div>
    </el-card>
    <el-drawer v-model="drawer" title="新增日程计划" direction="rtl" size="400" @close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="auto"> 
          <el-form-item label="产线" prop="WorkLineName">
            <el-select v-model="formData.WorkLineName" placeholder="请选择产线"  :clearble="false" style="width: 220px;">
              <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期" prop="StartDate">
            <el-date-picker v-model="formData.StartDate"   value-format="YYYY-MM-DD" type="date" placeholder="请选择日期" :clearble="false"/>
          </el-form-item>
          <el-form-item label="结束日期" prop="LongDate">
            <el-date-picker v-model="formData.LongDate"   value-format="YYYY-MM-DD" type="date" placeholder="请选择日期" :clearble="false"/>
          </el-form-item>
          <el-form-item label="计划类型" prop="ClassType">
            <el-select v-model="formData.WorkLineName" placeholder="请选择产线"  :clearble="false" style="width: 220px;">
              <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="ClassStartTime">
            <el-time-picker v-model="formData.ClassStartTime"   value-format="HH:mm:ss" />
          
          </el-form-item>
          <el-form-item label="结束时间" prop="ClassEndTime">
            <el-time-picker v-model="formData.ClassEndTime"   value-format="HH:mm:ss"/>
          </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary"  @click="onSubmit">保存</el-button>
        <el-button  @click="handleClose">取消</el-button>
       
      </template>

    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { GetMESWorkLineNews } from "@/api/operate"
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
const viewType = ref("timeGridWeek");
const calendarApi = ref()
const calendarTitle = ref('')
const calendarLine = ref("M08-SMT-Line-01")
const lineData = ref<any[]>([])

const dataSelet = ref([
  {
    title: '白班',
    start: '2025-01-13 08:30:00',
    end: '2025-01-13 17:30:00',
    allDay: false,
    shift: 'day', // 自定义属性，表示白班
    dataID:1234234,
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
const drawer=ref(false)
const formData=ref({
  WorkLineName:"",
  StartDate:"",
  LongDate:"",
  ClassType:"",
  ClassStartTime:"",
  ClassEndTime:"",
  UserNo:""
})
const formRef=ref()

const eventClickData = (val: any) => {
  console.log(val.event._def);

}
const calendarOptions = reactive({
  height: '100%',
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: "timeGridWeek",// 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
  weekends: true, // 显示周末  
  headerToolbar: true,//是否隐藏默认工具栏
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
  eventClick: eventClickData

})
onMounted(() => {
  nextTick(() => {
    calendarApi.value = fullcalendar.value.getApi()
    calendarTitle.value = calendarApi.value.view.title
    getLineData()
    // console.log();
  })


})
const getPrev = () => {
  calendarApi.value.prev();
  calendarTitle.value = calendarApi.value.view.title
}
const getNext = () => {
  calendarApi.value.next()
  calendarTitle.value = calendarApi.value.view.title
}
const getLineData = () => {
  GetMESWorkLineNews({ WorkLineName: "" }).then((res: any) => {
    lineData.value = res.content
  })
}
const openAdd=()=>{
  drawer.value=true
}
const onSubmit=()=>{
console.log(formData.value);

}
const handleClose=()=>{
  drawer.value=false
  formRef.value.resetFields()
}

const handleChangeType = (val: any) => {
  // console.log(calendarApi.value.view.title);
  calendarApi.value.changeView(val)
  calendarTitle.value = calendarApi.value.view.title
}
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
