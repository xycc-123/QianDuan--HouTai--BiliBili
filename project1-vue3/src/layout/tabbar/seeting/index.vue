<template>
    <el-button size='small' icon="Refresh" circle @click="updateRefresh"></el-button>
    <el-button size='small' icon="FullScreen" circle @click="fullScreen"></el-button>
    <el-popover placement="bottom" title="主题模式" :width="300" :visible.sync="visible">
        <el-form>
            <el-form-item label="主题颜色">
                <el-color-picker @change="setColor" v-model="color" size="small" show-alpha
                    :predefine="predefineColors" />
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch @change="changeDark" v-model="dark" class="mt-2" style="--el-switch-on-color: #000000;"
                    inline-prompt active-icon="Moon" inactive-icon="Sunrise" />
            </el-form-item>
            <div class="flex-right">
                <el-button type="primary" size="small" @click="hidePopover">关闭</el-button>
            </div>
        </el-form>
        <template #reference>
            <el-button size='small' icon="Setting" circle @click="showPopover"></el-button>
        </template>
    </el-popover>
    <img :src="userStore.avatar" style="width: 24px; height: 24px; border-radius: 50%;margin: 0px 10px;">
    <!-- 下拉菜单 -->
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//获得路由
import { useRouter, useRoute } from 'vue-router';
//获取骨架小仓库
import useLayOutSettingStore from '@/store/modules/seeting';
//获取用户相关小仓库
import useUserStore from '@/store/modules/user';

let $router = useRouter();
let $route = useRoute();
let layoutSettingStore = useLayOutSettingStore();
let userStore = useUserStore();
let dark = ref<boolean>(false)
let visible = ref<boolean>(false)

//刷新按钮点击回调
const updateRefresh = () => {
    layoutSettingStore.refresh = !layoutSettingStore.refresh
}
//全屏按钮点击回调
const fullScreen = () => {
    //DOM对象一个属性，用来判断当前是不是全屏[全屏：true，否则：false]
    let full = document.fullscreenElement;

    if (!full) {
        //通过requestFullscreen方法，实现全屏模式
        document.documentElement.requestFullscreen();
    } else {
        //通过exitFullscreen方法，退出全屏模式
        document.exitFullscreen()
    }

}
//登出回调
const logout = async () => {
    //一、向服务器发送请求
    //二、仓库中相关数据清空【tokken|username|avatar】
    //三、跳转至登录页
    await userStore.userLogout();
    $router.push({ path: '/login', query: { redirect: $route.path } })

}
//主题颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

const changeDark = () => {
    //获取html根节点
    let html = document.documentElement;
    dark.value ? html.className = 'dark' : html.className = '';
}

const setColor = () => {
    const html = document.documentElement;
    html.style.setProperty('--el-color-primary', color.value)
}

const showPopover = () => {
    visible.value = true
}
const hidePopover = () => {
    visible.value = false
}
</script>

<script lang="ts">
export default {
    name: 'Seeting',
}
</script>

<style scoped lang="scss">
.flex-right {
    display: flex;
    justify-content: flex-end;
}
</style>