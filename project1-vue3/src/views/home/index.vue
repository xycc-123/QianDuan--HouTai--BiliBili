<template>
    <el-card>
        <div class="box">
            <img :src="userStore.avatar" alt="" class="avatar">
            <div class="bottum">
                <h3 class="title">{{ getTime() }}好！{{ userStore.username }}</h3>
                <p class="subtitle">狂拽猪少の无限好物</p>
            </div>
        </div>
    </el-card>
    <div class="bot">
        <svg-icon name="welcome" width="500px" height="400px"></svg-icon>
    </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';

let userStore = useUserStore();
</script>

<style scoped lang="scss">
.box {
    display: flex;

    .avatar {
        height: 100px;
        width: 100px;
        border-radius: 50%;
    }

    .bottum {
        margin-left: 20px;

        .title {
            font-size: 30px;
            font-weight: 900;
            margin-bottom: 30px;
        }

        .subtitle {
            font-style: italic;
            color: darkgrey;
        }
    }
}

.bot {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}
</style>