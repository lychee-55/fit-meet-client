<script setup>
import AppHeader from '@/components/common/Header.vue';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import MobileSidebar from './components/common/MobileSidebar.vue';
import { useRouter } from 'vue-router';

// const store = useAuthStore();
// const router = useRouter();

const isSidebarOpen = ref(false);

// onMounted(async () => {
//   // 쿠키 기반 로그인 복구
//   const publicRoutes = ['login', 'signup', 'passwordReset'];

//   if (!publicRoutes.includes(router.currentRoute.value.name)) {
//     await store.fetchBasicUserInfo();

//     if (!store.isLoggedIn && !store.authChecked) {
//       alert('로그인이 필요하거나 세션이 만료되었습니다.');
//       router.push({ name: 'login' });
//     }
//   }
// });
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
