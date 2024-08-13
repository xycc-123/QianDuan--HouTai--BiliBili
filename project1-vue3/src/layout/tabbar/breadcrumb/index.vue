<template>
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.icon"
            :to="item.path">
            <!-- 图标 -->
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <!-- 面包屑导航信息 -->
            <span style="margin: 0px 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
//获取仓库
import useLayOutSettingStore from '@/store/modules/seeting';
//获取路由对象
import { useRoute } from 'vue-router';

//响应式数据控制图标切换
let LayOutSettingStore = useLayOutSettingStore()
let $route = useRoute();

const changeIcon = () => {
    //切换图标
    LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>

<script lang="ts">
export default {
    name: 'Breadcrumb',
}
</script>

<style scoped></style>