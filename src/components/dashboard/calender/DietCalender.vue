<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">식단 조회</h2>
      <div class="flex border rounded-lg p-1 bg-gray-50">
        <button
          @click="calenderMode = 'weekly'"
          :class="[
            'px-3 py-1 text-sm font-medium transition',
            calenderMode === 'weekly'
              ? 'bg-indigo-500 text-white rounded-md shadow-sm'
              : 'text-gray-600',
          ]"
        >
          주간
        </button>
        <button
          @click="calenderMode = 'monthly'"
          :class="[
            'px-3 py-1 text-sm font-medium transition',
            calenderMode === 'monthly'
              ? 'bg-indigo-500 text-white rounded-md shadow-sm'
              : 'text-gray-600',
          ]"
        >
          월간
        </button>
      </div>
    </div>

    <WeeklyDietCalender v-if="calenderMode === 'weekly'" />
    <MonthlyDietCalender v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WeeklyDietCalender from './WeeklyDietCalender.vue';
import MonthlyDietCalender from './MonthlyDietCalender.vue';

const calenderMode = ref('weekly'); // 'weekly' or 'monthly'
</script>
