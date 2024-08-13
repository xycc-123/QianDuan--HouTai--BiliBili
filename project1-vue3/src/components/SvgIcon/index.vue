<!-- 封装一个使用svg的组件 -->
<template>
    <!-- svg图标外层容器节点，需要与use结合使用 -->
    <svg :style="{width,height}">
        <!-- xlink:href选择用哪一个图标，必须#icon-图标名字 -->
        <!-- fill属性可以定义图标颜色 -->
        <use :xlink:href="prefix+name" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts" >
defineProps({
    //xlink-href前缀默认值
    prefix:{
        type: String,
        default: "#icon-"
    },
    name: String,
    color: {
        type: String,
        default: " "
    },
    width: {
        type: String,
        default: "16px"
    },
     height: {
        type: String,
        default: "16px"
    }
})

</script>

<style scoped>

</style>