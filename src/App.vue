<script setup>
import AppHeader from "@/components/common/Header.vue";
import { ref, onMounted } from "vue";
import MobileSidebar from "./components/common/MobileSidebar.vue";
import { useTrainingStore } from "./stores/Training";
import { useAuthStore } from "./stores/Auth"; // 사용자의 로그인 상태를 알 수 있는 스토어

const trainingStore = useTrainingStore();
const authStore = useAuthStore(); // 추가

const isSidebarOpen = ref(false);

onMounted(async () => {
  // 1. 개발 환경인지 확인
  const isDev = import.meta.env.MODE === "development";

  // 2. 로그인 상태인지 확인 (인증 토큰이 있는지 등)
  // authStore.isAuthenticated는 예시입니다. 실제 스토어 상태에 맞게 수정하세요.
  const isLoggedIn =
    authStore.isAuthenticated || localStorage.getItem("ACCESS_TOKEN");

  if (isDev && isLoggedIn) {
    try {
      await trainingStore.fetchYoutubeAdminSync();
    } catch (error) {
      console.warn("로그인은 되어있으나 싱크 권한이 없습니다(관리자 아님).");
    }
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
