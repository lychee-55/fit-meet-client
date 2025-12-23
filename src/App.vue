<script setup>
import AppHeader from '@/components/common/Header.vue';
import { ref, onMounted } from 'vue';
import MobileSidebar from './components/common/MobileSidebar.vue';
import { useTrainingStore } from './stores/Training';

const trainingStore = useTrainingStore();

const isSidebarOpen = ref(false);

onMounted(async () => {
  // 개발 환경에서만 수동 싱크 실행 (배포 후에는 주석 처리하거나 조건문 사용)
  if (import.meta.env.MODE === 'development') {
    await trainingStore.fetchYoutubeAdminSync();
  }
});
</script>

<template>
  <div class="bg-blur-container">
    <!-- <div> -->
    <AppHeader @open-menu="isSidebarOpen = true" />
    <div class="main-content">
      <router-view />
    </div>
  </div>

  <teleport to="body">
    <div class="blur-layer blur-top-left"></div>
    <div class="blur-layer blur-top-right"></div>
    <div class="blur-layer blur-bottom-left"></div>
    <div class="blur-layer blur-bottom-right"></div>
  </teleport>

  <MobileSidebar :open="isSidebarOpen" :close="() => (isSidebarOpen = false)" />
</template>

<style scoped></style>
