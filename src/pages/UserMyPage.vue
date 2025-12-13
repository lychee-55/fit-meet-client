<template>
  <div class="py-10 md:py-20 bg-gray-50 min-h-screen">
    <div class="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <h1 class="text-3xl font-bold text-gray-900">마이페이지</h1>
      <p class="mt-1 text-lg text-gray-500">
        계정 정보를 관리하고 설정을 변경하세요.
      </p>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <DisclosureContainer />
    </div>
  </div>
</template>

<script setup>
import DisclosureContainer from '@/components/userInfo/mypage/DisclosureContainer.vue';
</script>

<style scoped>
/* 페이지 스타일은 Tailwind 클래스로 충분합니다. */
</style>
