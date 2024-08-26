<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import {
  empolyeeLogin,
  getEmpoyeeInfo,
  findEmployeeRoles,
  GetVersion
} from "@/api/permiss";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAppStore } from '@/stores/modules/app'
import { ref, watch } from "vue";

const userStore = useUserStoreWithOut();
const { currentRoute, addRoute, push } = useRouter();
const appStore = useAppStore()
const version = ref('')
const form = ref({
  EmployeeName: "CamstarAdmin",
  DocManagerUser: "123456",
  EmployeeId: "",
  CanLogin: 0,
  FullName: "",
});
const redirect = ref<string>("");

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string;
  },
  {
    immediate: true,
  }
);
onBeforeMount(()=>{
  GetVersion().then((res: any) => {
    version.value = res.content.CurrentVer
  })
})
onMounted(() => {
 
})
const loginClick = () => {
  empolyeeLogin(form.value).then((data: any) => {
    const dataText = data.content
    if (data.code == 100200) {
      localStorage.setItem("OPCENTER_ROLE", form.value.EmployeeName);
      setToken(dataText.Token);
      // if (appStore.getSystemType && localStorage.getItem('OPUI')) {
      //   let routestr = localStorage.getItem('OPUI') || '/'
      //   push({ path: routestr })

      // } else {
      //   push({ path: redirect.value });
      // }
      if (appStore.getSystemType && localStorage.getItem('OPUIData')) {
        let routestr = appStore.getOpuiData.path || '/'
        push({ path: routestr })
      } else {
        push({ path: redirect.value });
      }
    }
  });
};
const switchSystems = () => {
  localStorage.setItem("SYSTEM_TYPE", JSON.stringify(!appStore.getSystemType));
  appStore.setSystemType(!appStore.getSystemType)
  if (appStore.getSystemType && localStorage.getItem('OPUIData')) {
    let routestr = appStore.getOpuiData.path || '/'
    push(routestr)
  } else {
    push({ path: '/login', query: { redirect: '/dashboard/index' } })
  }
  ElNotification({
    title: "系统已切换",
    message: appStore.getSystemType?'当前为操作端':'当前为系统端',
    type: "warning",
  });

}
</script>

<template>
  <div class="w-[100vw] h-[100vh] bg-no-repeat bg-cover bg-[url('../assets/bg.jpg')]">
    <div class="w-[100%] absolute h-[100%] flex bg-[#00000036]">
      <div class="m-auto bg-white p-5 rounded-3xl shadow-2xl">
        <el-form ref="formRef" label-position="top" :model="form" label-width="auto">
          <h2 class="text-center text-2xl font-bold p-2.5 mb-5">{{ appStore.getSystemType ? 'OPUI登录' : 'Portal登录' }}
          </h2>
          <el-form-item label="用户名" prop="userName"><el-input v-model="form.EmployeeName" size="large" class="w-[440px]"
              placeholder="请输入用户名" /></el-form-item>
          <el-form-item label="密码" prop="password"><el-input v-model="form.DocManagerUser" size="large"
              class="w-[440px]" type="password" placeholder="请输入密码" show-password
              @keyup.enter.native="loginClick" /></el-form-item>
          <el-form-item class="mt-5">
            <el-button @click="loginClick" size="large" class="w-[440px]" type="primary">登录</el-button>

          </el-form-item>
          <el-form-item>

            <el-button @click="switchSystems" size="large" class="w-[440px]">切换系统</el-button>
          </el-form-item>
        </el-form>
        <div class="flex flex-row-reverse"><span class="text-[#7c7c7c]">{{ version }}</span></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
