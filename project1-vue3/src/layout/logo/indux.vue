<template>
    <div class="logo" v-if="setting.logoHidden">
        <img :src="setting.logo" alt="">
        <p>{{ setting.title }}</p>
    </div>
</template>

<script setup lang="ts">
import setting from '@/setting';
</script>

<script lang="ts">
export default {
    name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
    width: 100%;
    height: $base-menu-logo-height;
    // background: white;
    color: white;
    display: flex;
    // border-radius: 50%;
    align-items: center;
    padding-left: 8px;

    img {
        width: 45px;
        height: 45px;
        margin-right: 20px;
        border-radius: 50%;
    }

    p {
        font-size: $base-logo-title-fontsize;
    }
}
</style>