<template>
  <div
    class="flex flex-col h-full justify-center items-center p-4 bg-blue-50 rounded-xl border border-blue-200"
  >
    <div class="text-sm text-gray-600">
      {{ viewMode === 'weekly' ? '주간' : '월간' }} 평균 점수
    </div>
    <div class="text-6xl font-extrabold text-blue-700 my-2">85</div>
    <div class="text-md text-gray-600">점</div>
    <div class="text-xs text-green-500 mt-2">지난 기간 대비 +5점</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  viewMode: String, // 'weekly' or 'monthly'
});
</script>
