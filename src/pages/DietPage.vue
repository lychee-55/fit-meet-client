<template>
  <div class="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
    <TodayNutritions class="h-48 p-4 sm:p-6" />
    <div
      class="flex flex-col mx-auto p-4 bg-white rounded-xl shadow-lg sm:p-6 mt-4"
    >
      <div class="mt-4">
        <DietHeaderMonth
          :selectedMonth="selectedMonth"
          :viewMode="viewMode"
          @changeMonth="selectedMonth = $event"
          @changeView="viewMode = $event"
        />

        <WeekDateSlider
          v-if="viewMode === 'week'"
          :base-month="selectedMonth"
          :selected-date="selectedDate"
          @select="selectedDate = $event"
        />
        <div
          v-if="viewMode === 'week'"
          class="relative p-px bg-linear-to-b from-gray-300 to-gray-100 shadow-sm"
        ></div>
        <MonthlyDietView
          v-else
          :selectedMonth="selectedMonth"
          @dateClick="handleCalendarDateClick"
        />

        <DietCalendarModal
          :is-visible="isCalendarModalOpen"
          :selected-date="calendarSelectedDate"
          :diets="dailyDietMap[selectedDateString] || []"
          @close="isCalendarModalOpen = false"
        />
        <div class="rounded-lg">
          <!-- border-2 border-[#79ae70] my-4 -->
          <MealTypeTabs v-if="viewMode === 'week'" v-model="selectedMealType" />

          <DietList
            v-if="viewMode === 'week'"
            :diets="dietByMealType[selectedMealType]"
            :mealLabel="mealLabelMap[selectedMealType]"
            @itemClick="handleDietClick"
          />
        </div>

        <AIAnalysisList
          :analysisList="weeklyAnalysisList"
          @rowClick="handleAnalysisClick"
          @deleteClick="handleDeleteAnalysis"
        />

        <AiAnalysisModal
          :is-visible="isAnalysisModalOpen"
          :data="selectedAnalysis"
          @close="isAnalysisModalOpen = false"
        />

        <DietDetailModal
          v-if="viewMode === 'week'"
          :is-visible="isDetailModalOpen"
          :diet="selectedDietForDetail || {}"
          :meal-label="mealLabelMap[selectedMealType]"
          @close="isDetailModalOpen = false"
        />
      </div>

      <button
        @click="isOptionModalVisible = true"
        class="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#8A8F6E] text-white shadow-xl hover:bg-[#6e7256] transition z-40 cursor-pointer"
      >
        <PlusIcon class="w-8 h-8 mx-auto" />
      </button>
      <CreateDietFormOptionModal
        :is-visible="isOptionModalVisible"
        @update:isVisible="isOptionModalVisible = $event"
        @selectOption="handleSelectOption"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDietStore } from '@/stores/Diet';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';

import DietHeaderMonth from '@/components/diet/DietHeaderMonth.vue';
import WeekDateSlider from '@/components/diet/WeekDateSlider.vue';
import MonthlyDietView from '@/components/diet/MonthlyDietView.vue';
import MealTypeTabs from '@/components/diet/MealTypeTabs.vue';
import DietList from '@/components/diet/DietList.vue';
import CreateDietFormOptionModal from '@/components/diet/CreateDietFormOptionModal.vue';
import DietDetailModal from '@/components/diet/DietDetailModal.vue';
import DietCalendarModal from '@/components/diet/DietCalendarModal.vue';
import TodayNutritions from '@/components/dashboard/nutrition/TodayNutritions.vue';
import AIAnalysisList from '@/components/diet/AIAnalysisList.vue';
import AiAnalysisModal from '@/components/dashboard/AiAnalysisModal.vue';

const route = useRoute();
const router = useRouter();
const dietStore = useDietStore();
const { dailyDietMap, weeklyAnalysisList } = storeToRefs(dietStore);

const isAnalysisModalOpen = ref(false);
const selectedAnalysis = ref(null);

const selectedMonth = ref(new Date());
const selectedDate = ref(new Date());
const selectedMealType = ref('breakfast');
const isOptionModalVisible = ref(false);
const isDetailModalOpen = ref(false);
const selectedDietForDetail = ref(null);
const isCalendarModalOpen = ref(false);
const calendarSelectedDate = ref(new Date());

const mealLabelMap = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
  nightSnack: '야식',
};

// 유틸리티 함수
const formatDateToString = d => {
  if (!(d instanceof Date)) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// 기간 계산 통합 함수 (중복 제거)
const getRange = (date, mode) => {
  if (mode === 'month') {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: formatDateToString(start),
      endDate: formatDateToString(end),
    };
  } else {
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      startDate: formatDateToString(start),
      endDate: formatDateToString(end),
    };
  }
};

// 라우터 주소 처리
const viewMode = computed({
  get() {
    return route.query.view === 'month' ? 'month' : 'week';
  },
  set(mode) {
    router.replace({
      query: { ...route.query, view: mode === 'month' ? 'month' : 'week' },
    });
  },
});

const selectedDateString = computed(() =>
  formatDateToString(selectedDate.value),
);

const dietsOfDay = computed(
  () => dailyDietMap.value[selectedDateString.value] || [],
);

const dietByMealType = computed(() => {
  const diets = dietsOfDay.value;
  const result = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    nightSnack: [],
  };
  diets.forEach(d => {
    const type = d.mealType || d.meal_type;
    if (type === 'A') result.breakfast.push(d);
    else if (type === 'B') result.lunch.push(d);
    else if (type === 'C') result.dinner.push(d);
    else if (type === 'D') result.snack.push(d);
    else if (type === 'E') result.nightSnack.push(d);
  });
  return result;
});

// 모드나 날짜 변경시 기간 단위로 데이터 호출
watch(
  [selectedMonth, selectedDate, viewMode],
  async ([newMonth, newDate, newMode]) => {
    const baseDate = newMode === 'month' ? newMonth : newDate;
    const { startDate, endDate } = getRange(baseDate, newMode);

    await dietStore.fetchMonthDiets(startDate, endDate);
  },
  { immediate: true },
);

const handleSelectOption = option => {
  const methodParam =
    option === 'manual'
      ? 'manual'
      : option === 'public-api'
      ? 'public-api'
      : 'image';

  router.push({
    name: 'dietForm',
    params: {
      method: methodParam,
    },
  });
};

const handleDietClick = async diet => {
  const detail = await dietStore.fetchDietDetail(diet.dietId || diet.id);
  if (detail) {
    selectedDietForDetail.value = detail;
    isDetailModalOpen.value = true;
  }
};

const handleCalendarDateClick = async date => {
  calendarSelectedDate.value = date;
  selectedDate.value = date;

  const dateStr = formatDateToString(date);
  if (
    !dailyDietMap.value[dateStr] ||
    dailyDietMap.value[dateStr].length === 0
  ) {
    await dietStore.fetchDietForDay(dateStr);
  }
  isCalendarModalOpen.value = true;
};

const handleAnalysisClick = data => {
  selectedAnalysis.value = data;
  isAnalysisModalOpen.value = true;
};

const handleDeleteAnalysis = async logId => {
  if (!confirm('이 분석 보고서를 정말 삭제하시겠습니까?')) return;

  try {
    await dietStore.deleteWeeklyAnalysisLog(logId);
    alert('삭제되었습니다.');
  } catch (err) {
    alert('삭제 중 오류가 발생했습니다.');
  }
};

onMounted(async () => {
  if (!route.query.view)
    router.replace({ query: { ...route.query, view: 'week' } });

  await dietStore.fetchWeeklyAnalysisLogs();
});
</script>
