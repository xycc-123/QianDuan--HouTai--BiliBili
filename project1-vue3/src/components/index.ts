//设置全局组件
import SvgIcon from '@/components/SvgIcon/index.vue';
import Category from '@/components/Category/index.vue'
import type { App, Component } from 'vue';
//引入全部图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
//{ [name: string]: Component }表示 allGloablComponent 对象的键是字符串类型，值是 Component 类型。将任何字符串作为键，任何符合 Component 类型的值作为对应的组件。
const allGloablComponent: { [name: string]: Component } = { SvgIcon, Category }
//对外暴露插件对象
export default {
    //必须用install方法
    //(app: App)表示install方法的参数app的类型是App。App是Vue3中定义的类型，代表Vue应用的实例。
    install(app: App) {
        //注册项目的全部全局组件
        /*
        1、Object.keys方法返回一个给定对象自有属性的数组，数组中的元素按照属性名称的字符串形式排列。
        allGloablComponent是一个对象，包含了多个组件。
        Object.keys(allGloablComponent)将返回一个包含所有组件名称的数组。
        2、forEach是数组的一个方法，用于遍历数组中的每个元素。
        key是allGloablComponent对象的键名，代表每个组件的名称。
        3、app.component是一个Vue实例方法，用于注册或获取全局组件。
        第一个参数是组件的名称（在forEach中是key），第二个参数是组件的定义（在forEach中是allGloablComponent[key]）。
        */
        Object.keys(allGloablComponent).forEach(key => {
            app.component(key, allGloablComponent[key])
        });
        //将element-plus提供的图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}