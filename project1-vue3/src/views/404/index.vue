<template>
    <div class="box">
        <img src="../../assets/images/error_images/404.png" alt="">
        <button @click="goHome">首页</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter();
const goHome = () => {
    $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
    width: 100vw;
    height: 100vh;
    background: pink;
    display: flex;
    justify-content: center;

    img {
        width: 800px;
        height: 400px;
    }
}

button {
    width: 80px;
    height: 50px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background-color: #007BFF;
    border: none;
    border-radius: 0px 0px 5px 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: background-color 0.5s;

}

button:hover {
    background-color: #0056b3;
    /* 悬浮时背景颜色变深 */
}

button:active {
    background-color: #2e96ff;
    /* 点击时背景颜色更深 */
}
</style>