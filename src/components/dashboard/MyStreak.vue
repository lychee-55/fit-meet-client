<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h2 class="text-xl font-bold text-gray-800 mb-4">My Streak (연속 기록)</h2>

    <div class="flex items-center gap-4">
      <div class="text-6xl font-extrabold text-red-500">14</div>
      <div class="flex flex-col">
        <span class="text-lg font-medium text-gray-700"
          >일 연속 식단 기록 중!</span
        >
        <span class="text-sm text-gray-500">다음 목표: 21일</span>
      </div>
    </div>

    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <p class="text-xs text-gray-500 mb-1">최근 4주 기록</p>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="i in 28"
          :key="i"
          :class="[
            'h-3 rounded-sm',
            i % 3 === 0
              ? 'bg-green-400'
              : i % 5 === 0
              ? 'bg-green-200'
              : 'bg-gray-200',
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>
