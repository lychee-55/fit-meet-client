<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">섭취량 점수 분석</h2>
      <div class="flex border rounded-lg p-1 bg-gray-50">
        <button
          @click="viewMode = 'weekly'"
          :class="[
            'px-3 py-1 text-sm font-medium transition',
            viewMode === 'weekly'
              ? 'bg-blue-500 text-white rounded-md shadow-sm'
              : 'text-gray-600',
          ]"
        >
          주간
        </button>
        <button
          @click="viewMode = 'monthly'"
          :class="[
            'px-3 py-1 text-sm font-medium transition',
            viewMode === 'monthly'
              ? 'bg-blue-500 text-white rounded-md shadow-sm'
              : 'text-gray-600',
          ]"
        >
          월간
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <ScoreChart :viewMode="viewMode" class="lg:col-span-4 h-80" />

      <AvgScore :viewMode="viewMode" class="lg:col-span-1" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScoreChart from './ScoreChart.vue';
import AvgScore from './AvgScore.vue';

const viewMode = ref('weekly'); // 'weekly' or 'monthly'
</script>
