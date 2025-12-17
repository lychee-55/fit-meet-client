<template>
  <div class="text-xs space-y-2">
    <h4 class="font-semibold text-gray-800">
      선택된 식단 요약 ({{ formattedDate }})
    </h4>

    <div v-if="loading" class="text-center text-gray-500 py-4">
      식단 정보를 불러오는 중입니다...
    </div>

    <div
      v-else-if="!summaryData || summaryData.length === 0"
      class="text-center text-gray-500 py-4"
    >
      해당 날짜에 등록된 식단이 없습니다.
    </div>

    <div v-else class="space-y-1">
      <div
        v-for="item in summaryData"
        :key="item.mealType"
        class="flex justify-between p-2 border-b last:border-b-0 bg-white hover:bg-gray-50 rounded-sm"
      >
        <span class="font-medium text-gray-700">{{
          mealLabels[item.mealType]
        }}</span>
        <span class="text-indigo-600 font-semibold"
          >{{ item.calories }} kcal</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, computed } from 'vue';

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
});

const loading = ref(false);
const summaryData = ref([]); // { mealType: 'breakfast', calories: 550 } 형태의 배열
const mealLabels = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
};

// --- Computed ---
const formattedDate = computed(() => {
  return `${props.date.getMonth() + 1}/${props.date.getDate()}`;
});

// --- API 호출 로직 ---
const fetchDietSummary = async date => {
  loading.value = true;
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환

  try {
    // 💡 API 호출: GET /api/diets/day?date=YYYY-MM-DD 사용 가정
    // const response = await fetch(`/api/diets/day?date=${dateString}`);
    // const data = await response.json();
    // summaryData.value = data.summary;

    // 임시 더미 데이터 (실제 API 호출 대체)
    await new Promise(resolve => setTimeout(resolve, 300));
    if (date.getDate() % 2 === 0) {
      summaryData.value = [
        { mealType: 'breakfast', calories: 550 },
        { mealType: 'lunch', calories: 720 },
        { mealType: 'dinner', calories: 680 },
      ];
    } else {
      summaryData.value = [
        { mealType: 'lunch', calories: 800 },
        { mealType: 'snack', calories: 200 },
      ];
    }
  } catch (error) {
    console.error('식단 요약 로드 실패:', error);
    summaryData.value = [];
  } finally {
    loading.value = false;
  }
};

// --- Watcher ---
// 선택된 날짜가 변경될 때마다 식단 요약을 다시 불러옵니다.
watch(
  () => props.date,
  newDate => {
    fetchDietSummary(newDate);
  },
  { immediate: true },
);
</script>
