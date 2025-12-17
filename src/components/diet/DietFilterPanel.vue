<template>
  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"
    >
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow"
      >
        <div>
          <label
            for="start-date"
            class="block text-sm font-medium text-gray-700"
            >조회 기간</label
          >
          <input
            type="date"
            id="start-date"
            v-model="filters.startDate"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
          />
        </div>

        <div>
          <label for="meal-type" class="block text-sm font-medium text-gray-700"
            >식사 분류</label
          >
          <select
            id="meal-type"
            v-model="filters.mealType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
          >
            <option value="">전체</option>
            <option value="breakfast">아침</option>
            <option value="lunch">점심</option>
            <option value="dinner">저녁</option>
            <option value="snack">간식</option>
          </select>
        </div>

        <div>
          <label for="score-min" class="block text-sm font-medium text-gray-700"
            >최소 점수</label
          >
          <input
            type="number"
            id="score-min"
            v-model.number="filters.minScore"
            placeholder="점수"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="applyFilter"
            class="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            검색
          </button>
          <button
            @click="resetFilter"
            class="w-full bg-gray-300 text-gray-800 py-2 rounded-md text-sm hover:bg-gray-400 transition"
          >
            초기화
          </button>
        </div>
      </div>

      <div class="shrink-0">
        <button
          @click="modalStore.openWriteModal()"
          class="w-full md:w-auto bg-indigo-600 text-white py-2 px-6 rounded-md text-sm font-medium hover:bg-indigo-700 transition h-10 flex items-center justify-center"
        >
          + 새 식단 등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useModalStore } from '@/stores/modal'; // 💡 1. 스토어 임포트

const emit = defineEmits(['search', 'reset']);
const modalStore = useModalStore(); // 💡 2. 스토어 인스턴스 생성

const filters = ref({
  startDate: '',
  mealType: '',
  minScore: null,
});

const defaultFilters = JSON.parse(JSON.stringify(filters.value)); // 초기값 복사

const applyFilter = () => {
  emit('search', filters.value);
};

const resetFilter = () => {
  filters.value = JSON.parse(JSON.stringify(defaultFilters));
  emit('reset');
};
</script>
