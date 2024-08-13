import axios from "axios";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import { getToken } from "@/utils/auth";

// import store from '@/store'
// import { getToken } from '@/utils/auth'
let loadingRequestCount = 0;
// 初始化loading
let loadingInstance: any;
// 显⽰loading的函数并且记录请求次数 ++
const showLoading = () => {
  if (loadingRequestCount === 0) {
    // 全局实现loading效果，不⽤每个页⾯单独去v-loading
    // loading样式
    loadingInstance = ElLoading.service({
      lock: true,
      text: "加载中……",
      background: 'rgba(0, 0, 0, 0.1)'
    });
  }
  loadingRequestCount++;
};
// 隐藏loading的函数，并且记录请求次数 --
const hideLoading = () => {
  if (loadingRequestCount <= 0) return;
  loadingRequestCount--;
  if (loadingRequestCount === 0) {
    loadingInstance.close();
  }
};
// 基地址
const service = axios.create({
  baseURL: '/smtApi',
  // 5秒超时
  timeout: 5000 * 2,
});
// let source = axios.CancelToken.source();
// console.log(source);
service.interceptors.request.use(
  (config) => {
    const token = getToken() || '' //getToken是在另一个JS文件中封装好的方法
    token && (config.headers['authorization'] = token)
    // return config
    // config.cancelToken = source.token; // 取消请求
    // if (config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
    //   config.cancelObj.cancel("中断请求");
    //   delete config.cancelObj;
    // }
    showLoading();
    if (!navigator.onLine) {
      // 断网提示
      ElMessageBox.alert(
        '您的网络故障，请检查!',
        '温馨提示',
        {
          confirmButtonText: '好的',
          type: 'warning'
        }
      )
    }
    return config;
  },

  //   (error) => Promise.error(error)
);
service.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      hideLoading();
    }, 500)
    //关闭加载窗口
    //建议打印一下 有些后台返回回来的数据格式不同  可根据自己的数据格式进行调整
    // console.log(response)
    //错误提示
    if (response.status === 500) {
      ElMessage({
        //elemen组件库中的提示组件
        message: "后台错误",
        type: "error",
        duration: 5000,
      });
      return Promise.reject(); //要返回一个promise对象出去
    }
    if (response.status === 404) {
      ElMessage({
        message: "接口地址错误",
        type: "error",
        duration: 5000,
      });
      return Promise.reject();
    }

    //成功的返回
    if (response.status === 200) {
      if (response.data.code == 100200 || !response.data.code) {
        return response.data;
      } else if (response.data.code == 100300 || response.data.Code == 1) {
        return response.data;
      }
      else {
        ElMessageBox.alert(response.data.msg, "提示信息", {
          confirmButtonText: "确定",
        });
        // return response.data;
      }
      // if (response.data.Status == "OK") {
      // return response.data;
      // } else {
      //   if (typeof response.data == "string") {
      //     let a = response.data;
      //     a = a.replace(/[\r|\n|\t]/g, "");
      //     a = JSON.parse(a);
      //     // console.log(a);
      //     MessageBox.alert(a.Message, "提示信息", {
      //       confirmButtonText: "确定",
      //     });
      //   } else {
      //     MessageBox.alert(response.data.Message, "提示信息", {
      //       confirmButtonText: "确定",
      //     });
      //   }
      //   return Promise.reject(response.data);
      // }
      //状态码
      //将data中需要的数据返回  可根据自己项目中的数据格式进行调整
    }
  },
  (error) => {
    hideLoading();
    ElMessageBox.alert(error, "提示信息", {
      confirmButtonText: "确定",
    });
  }
);


export default service;
