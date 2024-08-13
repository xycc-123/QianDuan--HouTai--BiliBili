import { createApp } from 'vue'
import App from './App.vue'
//引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置ElementPlus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//导入svg图标插件
import 'virtual:svg-icons-register'
import globalComponent from '@/components/index'
import '@/styles/index.scss'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'
//引入路由鉴权文件
import './permission'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//自定义指令文件
import { isHasButton } from '@/driective/has'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(globalComponent)
//注册路由
app.use(router)

app.use(pinia)
app.mount('#app')
isHasButton(app);

