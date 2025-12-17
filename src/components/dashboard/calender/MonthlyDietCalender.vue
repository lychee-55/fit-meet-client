<template>
  <div class="p-2 border border-gray-200 rounded-xl">
    <h3 class="text-sm font-medium text-gray-500 mb-3">2025년 12월</h3>
    <div
      class="grid grid-cols-7 text-xs font-semibold text-center text-gray-500 mb-1"
    >
      <span class="text-red-500">일</span><span>월</span><span>화</span
      ><span>수</span><span>목</span><span>금</span
      ><span class="text-blue-500">토</span>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="i in 35"
        :key="i"
        :class="[
          'aspect-square p-1 rounded-md text-xs border',
          i === 18 ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-100',
        ]"
      >
        <span
          :class="['font-bold', i === 18 ? 'text-blue-800' : 'text-gray-800']"
          >{{ i < 25 ? i : '' }}</span
        >
        <p class="text-[10px] text-green-600 mt-0.5" v-if="i % 5 === 0">
          식단 2건
        </p>
        <p class="text-[10px] text-red-600 mt-0.5" v-if="i % 7 === 0">
          분석 필요
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 월간 캘린더 로직 (날짜 계산 및 식단 데이터 연동) 코드가 추가됩니다.
</script>
