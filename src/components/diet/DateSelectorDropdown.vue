<template>
  <div
    class="flex flex-col max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg"
  >
    <div class="flex items-center justify-center mb-4 rounded-md p-3">
      <h2 class="text-2xl text-center font-bold text-black">
        {{ formattedSelectedMonthDay }}
      </h2>

      <!-- <button
        @click="openCalendarPicker"
        class="text-indigo-600 hover:text-indigo-800 text-sm font-medium border p-1 px-3 rounded-md"
      >
        날짜 선택
      </button> -->
    </div>

    <div class="grid grid-cols-7 text-center gap-1 mb-6">
      <div
        v-for="date in datesInView"
        :key="date.toDateString()"
        @click="selectDate(date)"
        :class="[
          'p-2 cursor-pointer rounded-lg transition-colors duration-150',
          date.toDateString() === selectedDate.toDateString()
            ? 'green-bg-color text-white shadow-md'
            : 'hover:bg-[#f5ffde] text-gray-700',
        ]"
      >
        <span class="block text-xs font-medium">{{
          datesInViewLabels[date.getDay()]
        }}</span>
        <span class="block text-xl font-bold">{{ date.getDate() }}</span>
      </div>
    </div>
    <hr />

    <div class="flex rounded-lg overflow-hidden lightgreen-bg-color my-6">
      <button
        v-for="meal in mealTypes"
        :key="meal.type"
        @click="selectedMealType = meal.type"
        :class="[
          'flex-1 py-3 text-sm font-medium transition-colors duration-150',
          selectedMealType === meal.type
            ? 'green-bg-color text-white shadow-inner'
            : 'text-gray-700 lightgreen-hover',
        ]"
      >
        {{ meal.label }}
      </button>
    </div>

    <div class="min-h-[200px] p-2">
      <h3 class="text-lg font-semibold mb-3 border-b pb-2">
        {{ currentMealLabel }} 식단
      </h3>
      <div v-if="loading" class="text-center text-gray-500 py-8">
        <svg
          class="animate-spin h-5 w-5 text-indigo-500 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        식단 정보를 불러오는 중...
      </div>
      <div
        v-else-if="filteredDietList.length === 0"
        class="text-center text-gray-500 py-8"
      >
        {{ currentMealLabel }}에 등록된 식단이 없습니다.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="diet in filteredDietList"
          :key="diet.id"
          class="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ diet.time }}</span>
            <span
              :class="[
                'text-lg font-bold',
                diet.score > 80 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ diet.score }} 점
            </span>
          </div>
          <p class="text-base mt-1">{{ diet.description }}</p>
          <p class="text-sm text-gray-500 mt-1">
            총 칼로리: {{ diet.calories }} kcal
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// --- 상태 관리 ---
const selectedDate = ref(new Date());
selectedDate.value.setHours(0, 0, 0, 0); // 오늘 날짜로 초기화
const selectedMealType = ref('breakfast');
const loading = ref(false);
const dietList = ref([]);

// --- 상수 ---
const mealTypes = [
  { type: 'breakfast', label: '아침' },
  { type: 'lunch', label: '점심' },
  { type: 'dinner', label: '저녁' },
  { type: 'snack', label: '간식' },
];
const datesInViewLabels = ['일', '월', '화', '수', '목', '금', '토'];

// --- Computed ---

const formattedSelectedMonthDay = computed(() => {
  const month = selectedDate.value.getMonth() + 1;
  const day = selectedDate.value.getDate();
  return `${month}월 ${day}일`;
});

const datesInView = computed(() => {
  const dates = [];
  const startOfWeek = new Date(selectedDate.value);
  // 선택된 날짜의 요일(getDay())만큼 뒤로 이동하여 일요일(0)을 시작점으로 설정
  startOfWeek.setDate(
    selectedDate.value.getDate() - selectedDate.value.getDay(),
  );

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
});

const currentMealLabel = computed(() => {
  return (
    mealTypes.find(m => m.type === selectedMealType.value)?.label || '식단'
  );
});

// 💡 토글 메뉴와 매칭되는 식단 목록만 필터링
const filteredDietList = computed(() => {
  return dietList.value.filter(
    diet => diet.mealType === selectedMealType.value,
  );
});

// --- Methods ---

const openCalendarPicker = () => {
  // 💡 여기에 실제 날짜 선택 모달을 띄우는 로직을 구현해야 합니다.
  alert('실제 캘린더 컴포넌트가 열려 날짜를 선택합니다.');
};

const selectDate = date => {
  selectedDate.value = date;
  // 날짜를 변경하면 watch가 호출되어 데이터가 새로 로드됩니다.
};

// 💡 API: GET /api/diets/day 엔드포인트 사용 가정
const fetchDietDataForDay = async date => {
  loading.value = true;
  const dateString = date.toISOString().split('T')[0];

  try {
    // 실제 API 호출 로직: /api/diets/day?date=YYYY-MM-DD
    // const response = await fetch(`/api/diets/day?date=${dateString}`);
    // const data = await response.json();
    // dietList.value = data.diets;

    // 임시 더미 데이터 (현재 날짜인 12월 15일 월요일 기준)
    await new Promise(resolve => setTimeout(resolve, 500));

    if (date.getDate() === 15) {
      // 월요일
      dietList.value = [
        {
          id: 1,
          mealType: 'breakfast',
          description: '오트밀과 바나나',
          calories: 350,
          score: 95,
          time: '오전 8:00',
        },
        {
          id: 2,
          mealType: 'lunch',
          description: '닭가슴살 샐러드',
          calories: 420,
          score: 88,
          time: '오후 12:30',
        },
        {
          id: 3,
          mealType: 'dinner',
          description: '잡곡밥과 된장찌개',
          calories: 600,
          score: 75,
          time: '오후 7:00',
        },
        {
          id: 4,
          mealType: 'snack',
          description: '프로틴 쉐이크',
          calories: 200,
          score: 99,
          time: '오후 3:00',
        },
      ];
    } else if (date.getDate() === 16) {
      // 화요일
      dietList.value = [
        {
          id: 5,
          mealType: 'breakfast',
          description: '샌드위치',
          calories: 500,
          score: 65,
          time: '오전 9:00',
        },
        {
          id: 6,
          mealType: 'dinner',
          description: '삼겹살',
          calories: 1200,
          score: 40,
          time: '오후 7:30',
        },
      ];
    } else {
      dietList.value = [];
    }
  } catch (error) {
    console.error('일간 식단 로드 실패:', error);
    dietList.value = [];
  } finally {
    loading.value = false;
  }
};

// --- Watchers ---

// 💡 선택된 날짜가 변경될 때마다 해당 날짜의 모든 식단을 불러옴
watch(
  selectedDate,
  newDate => {
    fetchDietDataForDay(newDate);
  },
  { immediate: true },
);
</script>
