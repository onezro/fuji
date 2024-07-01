import './assets/main.css'
import "animate.css"
import './assets/css/index.scss'
import "./style/tailwind.css";


import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCN from "element-plus/dist/locale/zh-cn.mjs" //引入中文
// import { ClickOutside } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './permission'

// import 'element-plus/dist/index.css'



const app = createApp(App)
// app.directive(ClickOutside)
app.use(ElementPlus, {locale:zhCN,size: ''})
app.use(createPinia())
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// app.use(ClickOutside)

app.mount('#app')
