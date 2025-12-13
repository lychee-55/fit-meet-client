<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-white"
  >
    <h1 class="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-8">
      페이지를 찾을 수 없습니다. 경로를 다시 확인해주세요.
    </p>

    <RouterLink
      to="/"
      class="px-6 py-3 bg-[#68b478] text-white rounded-lg hover:bg-green-700 transition"
    >
      홈으로 돌아가기
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
