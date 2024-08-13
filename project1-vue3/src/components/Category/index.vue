<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select :disabled="scene == 1 ? true : false" style="width: 240px;" v-model="categoryStore.c1Id"
                    @change="handler">
                    <!-- value是下拉菜单收集的数据 -->
                    <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name"
                        :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select :disabled="scene == 1 ? true : false" style="width: 240px;" v-model="categoryStore.c2Id"
                    @change='handler_1'>
                    <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name"
                        :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="scene == 1 ? true : false" style="width: 240px;" v-model="categoryStore.c3Id">
                    <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name"
                        :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
defineProps(['scene'])
import useCategoryStore from '@/store/modules/category';
import { onMounted } from 'vue';

let categoryStore = useCategoryStore();
onMounted(() => {
    getC1();
})

const getC1 = () => {
    categoryStore.getC1();
}
//一级数据改变时触发change
const handler = () => {
    //清空二级和三级数据
    categoryStore.c2Id = '';
    categoryStore.c3Arr = [];
    categoryStore.c3Id = '';

    //获取二级数据
    categoryStore.getC2();
}
//
const handler_1 = () => {
    //清空三级数据
    categoryStore.c3Id = '';
    //获取三级数据
    categoryStore.getC3();
}
</script>

<style scoped></style>