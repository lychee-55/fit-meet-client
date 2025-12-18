<template>
  <div class="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
    <!-- <DateSelectorDropdown class="flex justify-end" /> -->
    <!-- <DietWriteModal
      v-if="isWriteModalOpen"
      :initial-data="writeModalData"
      @close="isWriteModalOpen = false"
      @saved="handleDietSaved"
    /> -->
    <!-- <WriteDietBoardBtn /> -->
    <div
      class="flex flex-col max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg sm:p-6"
    >
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
      <MonthlyDietView v-else :selectedMonth="selectedMonth" />

      <MealTypeTabs v-if="viewMode === 'week'" v-model="selectedMealType" />

      <DietList
        v-if="viewMode === 'week'"
        :diets="dietByMealType[selectedMealType]"
        :mealLabel="mealLabelMap[selectedMealType]"
        @itemClick="handleDietClick"
      />

      <DietDetailModal
        v-if="viewMode === 'week'"
        :is-visible="isDetailModalOpen"
        :diet="selectedDietForDetail || {}"
        :meal-label="mealLabelMap[selectedMealType]"
        @close="isDetailModalOpen = false"
      />

      <button
        @click="isOptionModalVisible = true"
        class="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#8A8F6E] text-white shadow-xl hover:bg-[#6e7256] transition z-40"
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
import { useRoute, useRouter } from 'vue-router'; // 💡 Vue Router API 임포트
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

// 💡 Vue Router 인스턴스 사용
const route = useRoute();
const router = useRouter();
const dietStore = useDietStore();
const { dailyDietMap } = storeToRefs(dietStore);

const selectedMonth = ref(new Date()); // 기준 월
const selectedDate = ref(new Date());
const selectedMealType = ref('breakfast');

const isOptionModalVisible = ref(false);
const handleSelectOption = option => {
  let methodParam;

  if (option === 'manual') {
    // URL: /diet/create-diet/manual
    methodParam = 'manual';
  } else if (option === 'public-api') {
    // URL: /diet/create-diet/public-api
    methodParam = 'public-api';
  } else {
    // 옵션이 유효하지 않으면 종료
    return;
  }
  // 💡 라우팅 실행: name과 params를 사용하여 이동
  router.push({
    name: 'createDiet', // 라우터에 정의한 이름
    params: {
      method: methodParam, // URL에 들어갈 값 (manual 또는 public-api)
    },
  });
};

// 💡 setViewMode 함수: URL 쿼리 파라미터를 변경하여 뷰 모드를 전환합니다.
const viewMode = computed({
  get() {
    return route.query.view === 'month' ? 'month' : 'week';
  },
  set(mode) {
    router.replace({
      query: {
        ...route.query,
        view: mode === 'month' ? 'month' : 'week',
      },
    });
  },
});

onMounted(() => {
  if (!route.query.view) {
    router.replace({
      query: {
        ...route.query,
        view: 'week',
      },
    });
  }
});

/* Date → YYYY-MM-DD 변환 */
const selectedDateString = computed(() => {
  const d = selectedDate.value;
  if (!(d instanceof Date)) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
});

const dietsOfDay = computed(() => {
  const dateKey = selectedDateString.value;
  if (!dateKey || !dailyDietMap.value) return [];
  return dailyDietMap.value[dateKey] || [];
});
// const dietsOfDay = computed(() => {
//   return dailyDietMap.value[selectedDateString.value] || [];
// });

console.log('selectedDateString', selectedDateString.value);
console.log('dietStore.state', dietStore.diets);
console.log('dietStore', dietStore);
/* ✅ 날짜 변경 시 API 호출 */
watch(
  selectedDateString,
  async newDate => {
    if (!newDate) return;
    await dietStore.fetchDietForDay(newDate);
    console.log('fetched diets', dietStore.getDietByDate(newDate));
  },
  { immediate: true },
);

// const mealTypeMap = {
//   breakfast: 'A',
//   lunch: 'B',
//   dinner: 'C',
//   snack: 'D',
//   nightSnack: 'E',
// };
// 타입별 필터링
const dietByMealType = computed(() => {
  const diets = dietsOfDay.value || [];

  // 기본 구조 미리 생성 (데이터가 없어도 null 에러 방지)
  const result = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    nightSnack: [],
  };

  if (diets.length > 0) {
    diets.forEach(d => {
      // 백엔드 필드명에 따라 mealType 또는 meal_type 대응
      const type = d.mealType || d.meal_type;
      if (type === 'A') result.breakfast.push(d);
      else if (type === 'B') result.lunch.push(d);
      else if (type === 'C') result.dinner.push(d);
      else if (type === 'D') result.snack.push(d);
      else if (type === 'E') result.nightSnack.push(d);
    });
  }
  return result;
});
// const dietByMealType = computed(() => {
//   const diets = dietsOfDay.value || [];
//   return Object.fromEntries(
//     Object.entries(mealTypeMap).map(([key, val]) => [
//       key,
//       diets.filter(d => d.mealType === val),
//     ]),
//   );
// });

const mealLabelMap = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
  nightSnack: '야식',
};

const isDetailModalOpen = ref(false);
const selectedDietForDetail = ref(null);

// 리스트 클릭 핸들러
const handleDietClick = diet => {
  selectedDietForDetail.value = diet;
  isDetailModalOpen.value = true;
};

// --- 모달 관련 로직은 변경 없음 ---
// const isDetailModalOpen = ref(false);
// const isWriteModalOpen = ref(false);
// const selectedDietId = ref(null);
// const writeModalData = ref(null);

// const openDetailModal = dietId => {
//   selectedDietId.value = dietId;
//   isDetailModalOpen.value = true;
// };

// const openWriteModalForEdit = dietData => {
//   writeModalData.value = dietData;
//   isDetailModalOpen.value = false;
//   isWriteModalOpen.value = true;
// };

// const handleDietSaved = () => {
//   isWriteModalOpen.value = false;
//   alert('식단이 성공적으로 저장되었습니다.');
//   // 데이터 리로드 또는 뷰 업데이트 로직 추가
// };
</script>
