<script setup>
import AppHeader from '@/components/common/Header.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { useModalStore } from '@/stores/modal';
import MobileSidebar from './components/common/MobileSidebar.vue';
import DietWriteModal from './components/diet/DietWriteModal.vue';
import { useRouter } from 'vue-router';

const modalStore = useModalStore();
const store = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // 쿠키 기반 로그인 복구
  const publicRoutes = ['login', 'signup', 'passwordReset'];

  if (!publicRoutes.includes(router.currentRoute.value.name)) {
    await store.fetchBasicUserInfo();
  }
});
// 모달에서 저장 완료 시 호출됩니다.
// const handleDietSaved = () => {
//   modalStore.closeWriteModal();
//   alert('식단 데이터가 성공적으로 처리되었습니다.');

//   // 필요하다면, 현재 경로를 리로드하거나 특정 페이지로 이동하여 데이터 업데이트 유도
//   // 예: router.go(0); // 현재 페이지 강제 리로드
// };
// // 모달 닫기
// const closeModalAndRefresh = () => {
//   modalStore.closeWriteModal();
// };
</script>

<template>
  <div class="bg-blur-container">
    <AppHeader />
    <router-view />
  </div>

  <teleport to="body">
    <div class="blur-layer blur-top-left"></div>
    <div class="blur-layer blur-top-right"></div>
    <div class="blur-layer blur-bottom-left"></div>
    <div class="blur-layer blur-bottom-right"></div>
  </teleport>

  <DietWriteModal
    v-if="modalStore.isWriteModalOpen"
    :initial-data="modalStore.writeModalInitialData"
    @close="closeModalAndRefresh"
    @saved="handleDietSaved"
    @deleted="handleDietSaved"
  />

  <MobileSidebar />
</template>

<style scoped></style>
