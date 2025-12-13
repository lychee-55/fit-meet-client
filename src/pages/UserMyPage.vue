<template>
  <div class="py-10 md:py-20 min-h-screen">
    <div class="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <h1 class="text-3xl font-bold text-gray-900">마이페이지</h1>
      <p class="mt-1 text-lg text-gray-500">
        회원님의 계정을 안전하게 관리하고, 맞춤 설정을 변경해 보세요.
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

<style scoped></style>
