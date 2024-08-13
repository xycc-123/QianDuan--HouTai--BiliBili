<template>
    <div class="tabber">
        <div class="tabber_left">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="tabber_right">
            <Setting></Setting>
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue';
import Setting from './seeting/index.vue';
</script>

<script lang="ts">
export default {
    name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabber {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(to right, rgb(160, 14, 38), rgb(255, 255, 255));

    .tabber_left {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .tabber_right {
        display: flex;
        align-items: center;
    }
}
</style>