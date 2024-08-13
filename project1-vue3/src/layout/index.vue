<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider">
            <Logo></Logo>
            <!-- 菜单 -->
            <!-- 滚动组件 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu :collapse="LayOutSettingStore.fold ? true : false" :default-active="$route.path"
                    background-color="rgb(212, 104, 229)" text-color="white">
                    <!-- 根据路由动态生成菜单 -->
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
            <Tabbar></Tabbar>
        </div>
        <!-- 内容展示区 -->
        <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
//logo组件
import Logo from './logo/indux.vue';
//菜单组件
import Menu from './menu/index.vue';
//用户相关小仓库
import useUserStore from '@/store/modules/user';
import Main from '@/layout/main/index.vue';
//引入tabber
import Tabbar from '@/layout/tabbar/index.vue'
//引入layout仓库
import useLayOutSettingStore from '@/store/modules/seeting'
let LayOutSettingStore = useLayOutSettingStore()

let userStore = useUserStore()
let $route = useRoute()
</script>

<script lang="ts">
export default {
    name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
}

.layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.3s;

    .scrollbar {
        width: 100%;
        height: calc(100vh - $base-menu-logo-height);

        .el-menu {
            border-right: none;
        }
    }
}

.layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabber-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
    }
}

.layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabber-height);
    // background: white;
    left: $base-menu-width;
    top: $base-tabber-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
    }
}
</style>