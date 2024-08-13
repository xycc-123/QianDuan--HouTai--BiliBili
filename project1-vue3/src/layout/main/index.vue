<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue';
import useLayOutSettingStore from '@/store/modules/seeting';
let layoutSettingStore = useLayOutSettingStore();
let flag = ref(true);

//监听仓库内部数据是否发生变化
watch(() => layoutSettingStore.refresh, () => {
  //点击刷新，组件销毁
  flag.value = false;
  //重新创建组件
  nextTick(() => {
    flag.value = true;
  })
})
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all .5s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>