<script setup>
import AppHeader from '@/components/common/Header.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';

const store = useAuthStore();

onMounted(async () => {
  // 쿠키 기반 로그인 복구
  await store.fetchBasicUserInfo();
});
</script>

<template>
  <AppHeader />

  <router-view />
</template>

<style scoped></style>
