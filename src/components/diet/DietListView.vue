<template>
  <div>
    <DietFilterPanel @search="applyFilter" @reset="resetFilter" />

    <div class="mt-6 border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              날짜
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              시간
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              총 칼로리
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              점수
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              비고
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="diet in filteredDiets"
            :key="diet.id"
            @click="$emit('open-detail', diet.id)"
            class="hover:bg-gray-50 cursor-pointer transition"
          >
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ diet.date }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ diet.time }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ diet.calories }} kcal
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600"
            >
              {{ diet.score }}점
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"
            >
              {{ diet.notes }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DietFilterPanel from '@/components/diet/DietFilterPanel.vue';

// 임시 데이터 (실제는 API 호출)
const diets = ref([
  {
    id: 1,
    date: '2025-12-14',
    time: '아침',
    calories: 550,
    score: 92,
    notes: '닭가슴살 샐러드와 사과',
  },
  // ...
]);

const filteredDiets = ref(diets.value);

const applyFilter = filterParams => {
  // API 호출 또는 로컬 필터링 로직 구현
  console.log('필터 적용:', filterParams);
  // filteredDiets.value = ...
};

const resetFilter = () => {
  // 필터 초기화 로직
  filteredDiets.value = diets.value;
};
</script>
