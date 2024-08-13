//layout组件配置仓库
import { defineStore } from 'pinia';

let useLayOutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,//用于控制菜单折叠
            refresh: false,//控制刷新
        }
    }
})

export default useLayOutSettingStore;