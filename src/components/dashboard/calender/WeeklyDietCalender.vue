<template>
  <div class="space-y-3">
    <h3 class="text-sm font-medium text-gray-500 mb-3">이번 주 식단</h3>
    <div
      v-for="day in weekDays"
      :key="day.date"
      class="p-3 border rounded-lg hover:bg-gray-50 transition duration-150"
    >
      <div class="flex justify-between items-center">
        <span
          :class="[
            'font-semibold',
            day.isToday ? 'text-blue-600' : 'text-gray-800',
          ]"
          >{{ day.date }} {{ day.dayName }}</span
        >
        <span class="text-sm text-gray-500">{{ day.dietCount }}건</span>
      </div>
      <div class="text-xs text-gray-600 mt-1 truncate">
        {{ day.dietSummary || '작성된 식단이 없습니다.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
// 임시 데이터 (실제는 API에서 가져옵니다)
const weekDays = [
  {
    date: '12/08',
    dayName: '일',
    dietSummary: '아침: 사과, 점심: 샐러드, 저녁: 닭가슴살',
    dietCount: 3,
    isToday: false,
  },
  {
    date: '12/09',
    dayName: '월',
    dietSummary: '아침: 계란, 점심: 일반식, 저녁: 고구마',
    dietCount: 3,
    isToday: false,
  },
  // ... 중략 ...
  {
    date: '12/14',
    dayName: '토',
    dietSummary: '아침: 토스트',
    dietCount: 1,
    isToday: true,
  },
];
</script>
