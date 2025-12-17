<template>
  <div
    class="p-4 border border-gray-200 rounded-xl flex items-center justify-center"
  >
    <div v-if="viewMode === 'weekly'" class="text-center w-full">
      <h3 class="font-semibold mb-2">주간 섭취량 점수 (막대 & 꺾은선 차트)</h3>
      <p class="text-gray-500 text-sm">일요일부터 토요일까지 7개 막대 표시</p>
      <div class="h-64 bg-gray-100 rounded-md mt-2"></div>
    </div>
    <div v-else class="text-center w-full">
      <h3 class="font-semibold mb-2">월간 섭취량 점수 (막대 & 꺾은선 차트)</h3>
      <p class="text-gray-500 text-sm">$주차별 막대 그래프 표시</p>
      <div class="h-64 bg-gray-100 rounded-md mt-2"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  viewMode: String, // 'weekly' or 'monthly'
});
// 데이터 로직 및 차트 라이브러리 연동 코드가 여기에 추가됩니다.
</script>
