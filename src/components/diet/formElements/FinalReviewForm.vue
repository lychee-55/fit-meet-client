<template>
  <div
    class="flex flex-col gap-6 p-4 rounded-lg border border-[#fdf2e7] bg-[#fefcf7]"
  >
    <!-- <h3 class="text-2xl font-bold text-[#8A8F6E] border-b pb-2">
      📝 최종 식단 검토 및 제출
    </h3> -->
    <p class="text-gray-600">
      등록 전, 모든 정보 (날짜, 음식 목록, 영양 성분)를 확인해주세요.
    </p>

    <div class="space-y-4">
      <h4 class="font-bold text-lg text-gray-800 border-b pb-1">기본 정보</h4>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <label class="w-24 shrink-0 font-medium text-gray-700">날짜/시간</label>
        <input type="text" :value="displayDate" readonly class="review-input" />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <label class="w-24 shrink-0 font-medium text-gray-700">식사 종류</label>
        <input
          type="text"
          :value="mealTypeLabel"
          readonly
          class="review-input"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <label class="w-24 shrink-0 font-medium text-gray-700">작성 모드</label>
        <input
          type="text"
          :value="mode === 'manual' ? '직접 입력' : '음식 검색 (API)'"
          readonly
          class="review-input"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <label class="w-24 shrink-0 font-medium text-gray-700">공개 여부</label>
        <input
          type="text"
          :value="formData.isPublic ? '공개' : '비공개'"
          readonly
          class="review-input"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="w-24 shrink-0 font-medium text-gray-700">메모</label>
        <textarea
          :value="formData.description || '없음'"
          readonly
          class="review-textarea"
          rows="3"
        ></textarea>
      </div>
    </div>

    <div class="space-y-4 mt-4">
      <h4 class="font-bold text-lg text-gray-800 border-b pb-1">
        🥘 음식 상세 목록 ({{ formData.foods.length }}개)
      </h4>

      <div v-if="formData.foods.length > 0" class="space-y-3">
        <div
          v-for="(food, index) in formData.foods"
          :key="'review-food-' + index"
          class="p-4 bg-gray-50 border border-gray-100 rounded-lg transition"
        >
          <div class="flex justify-between items-start">
            <div class="flex flex-col grow min-w-0 pr-4">
              <span class="text-base font-bold text-[#8A8F6E] truncate">{{
                food.foodNmKr
              }}</span>
              <span class="text-xs text-gray-500 mt-0.5"
                >출처:
                {{
                  food.sourceType === 'PUBLIC_API' ? '공공데이터' : '수동 입력'
                }}</span
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
            <div class="flex items-center gap-2">
              <label class="w-20 shrink-0 font-medium text-gray-600"
                >섭취량</label
              >
              <input
                type="number"
                :value="food.intakeGram"
                :readonly="isReadonly"
                @input="
                  updateFoodField(index, 'intakeGram', $event.target.value)
                "
                class="review-input-inline"
                :class="{ 'editable-input': !isReadonly }"
              />
              <span v-if="isReadonly" class="text-sm text-gray-600">g</span>
            </div>

            <div class="flex items-center gap-2">
              <label class="w-20 shrink-0 font-medium text-gray-600"
                >칼로리</label
              >
              <input
                type="number"
                :value="food.kcal"
                :readonly="isReadonly"
                @input="updateFoodField(index, 'kcal', $event.target.value)"
                class="review-input-inline"
                :class="{ 'editable-input': !isReadonly }"
              />
              <span v-if="isReadonly" class="text-sm text-gray-600">Kcal</span>
            </div>

            <div class="flex items-center gap-2">
              <label class="w-20 shrink-0 font-medium text-gray-600"
                >탄수화물</label
              >
              <input
                type="number"
                :value="food.carbohydrate"
                :readonly="isReadonly"
                @input="
                  updateFoodField(index, 'carbohydrate', $event.target.value)
                "
                class="review-input-inline"
                :class="{ 'editable-input': !isReadonly }"
              />
              <span v-if="isReadonly" class="text-sm text-gray-600">g</span>
            </div>

            <div class="flex items-center gap-2">
              <label class="w-20 shrink-0 font-medium text-gray-600"
                >단백질</label
              >
              <input
                type="number"
                :value="food.protein"
                :readonly="isReadonly"
                @input="updateFoodField(index, 'protein', $event.target.value)"
                class="review-input-inline"
                :class="{ 'editable-input': !isReadonly }"
              />
              <span v-if="isReadonly" class="text-sm text-gray-600">g</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      v-if="formData.foods.length > 0"
      class="mt-4 p-4 border-2 border-[#8A8F6E] rounded-xl bg-[#f9f9f5]"
    >
      <h4 class="font-bold text-lg text-[#8A8F6E] mb-3">
        ✨ 총 영양 성분 합계
      </h4>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold">
        <div class="text-center p-2 bg-white rounded-lg shadow-sm">
          <p class="text-xl text-red-500">{{ totalNutrition.kcal }}</p>

          <p class="text-gray-600">총 Kcal</p>
        </div>

        <div class="text-center p-2 bg-white rounded-lg shadow-sm">
          <p class="text-xl text-blue-500">
            {{ totalNutrition.carbohydrate }}g
          </p>

          <p class="text-gray-600">탄수화물</p>
        </div>

        <div class="text-center p-2 bg-white rounded-lg shadow-sm">
          <p class="text-xl text-green-500">{{ totalNutrition.protein }}g</p>

          <p class="text-gray-600">단백질</p>
        </div>

        <div class="text-center p-2 bg-white rounded-lg shadow-sm">
          <p class="text-xl text-orange-500">{{ totalNutrition.fat }}g</p>

          <p class="text-gray-600">지방</p>
        </div>
      </div>
    </div> -->
    <div
      v-if="formData.foods.length > 0"
      class="mt-4 p-4 border-2 border-brand rounded-xl bg-[#f9f9f5]"
    >
      <h4 class="font-bold text-lg text-brand mb-4">✨ 총 영양 성분 합계</h4>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <!-- 좌측: 총 칼로리 -->
        <div
          class="md:col-span-1 text-center p-3 bg-white rounded-lg shadow-sm"
        >
          <p class="text-2xl font-bold text-kcal">
            {{ totalNutrition.kcal }}
          </p>
          <p class="text-gray-600 text-sm mt-1">총 Kcal</p>
        </div>

        <!-- 우측 -->
        <div class="md:col-span-3 flex flex-col gap-3">
          <!-- 라벨 -->
          <ul class="flex gap-6 list-disc pl-5 text-sm font-semibold">
            <li class="text-carb">탄수화물</li>
            <li class="text-protein">단백질</li>
            <li class="text-fat">지방</li>
          </ul>

          <!-- 게이지 바 -->
          <div
            class="w-full h-9 bg-gray-200 rounded-full p-1 shadow-inner flex gap-1"
          >
            <div
              :style="{ width: `${macroRatios.carbohydrate}%` }"
              class="bg-carb rounded-2xl flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
            >
              {{ totalNutrition.carbohydrate }}g
            </div>

            <div
              :style="{ width: `${macroRatios.protein}%` }"
              class="bg-protein rounded-2xl flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
            >
              {{ totalNutrition.protein }}g
            </div>

            <div
              :style="{ width: `${macroRatios.fat}%` }"
              class="bg-fat rounded-2xl flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
            >
              {{ totalNutrition.fat }}g
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  formData: Object,
  mode: String, // 'manual' 또는 'public-api'
});
const emit = defineEmits(['update:formData']);
const isReadonly = computed(() => props.mode !== 'manual');
const updateFoodField = (index, field, value) => {
  if (isReadonly.value) return; // public-api 모드에서는 수정 불가

  // 숫자로 변환 (입력된 값이 없으면 0)
  const numericValue = value ? parseFloat(value) : 0;

  // 1. 기존 foods 배열을 복사
  const newFoods = [...props.formData.foods];

  // 2. 수정할 음식을 복사하고 해당 필드 업데이트
  newFoods[index] = {
    ...newFoods[index],
    [field]: numericValue, // 숫자로 저장
  };

  // 3. 부모 컴포넌트에 전체 formData를 업데이트 요청
  emit('update:formData', {
    ...props.formData,
    foods: newFoods,
  });
};

const mealTypes = {
  A: '아침',
  B: '점심',
  C: '저녁',
  D: '간식',
  E: '야식',
};

// --- Computed Properties ---

const displayDate = computed(() => {
  if (!props.formData.date) return '날짜 미정';
  const dt = new Date(props.formData.date);
  return dt.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
});

const mealTypeLabel = computed(
  () => mealTypes[props.formData.mealType] || '선택 안 함',
);

/**
 * @Description: 등록된 음식 목록의 영양 성분 합계를 계산합니다.
 */
const totalNutrition = computed(() => {
  const totals = {
    kcal: 0,
    carbohydrate: 0,
    protein: 0,
    fat: 0,
    // 필요하다면 다른 영양소도 포함
  };

  props.formData.foods.forEach(food => {
    // food 객체의 영양소 필드가 숫자인지 확인하고 더합니다.
    // 안전을 위해 parseInt/parseFloat를 사용하여 문자열을 숫자로 변환합니다.
    totals.kcal += parseFloat(food.kcal || 0);
    totals.carbohydrate += parseFloat(food.carbohydrate || 0);
    totals.protein += parseFloat(food.protein || 0);
    totals.fat += parseFloat(food.fat || 0);
  });

  // 소수점 1자리에서 반올림 처리 (필요에 따라 조정)
  for (const key in totals) {
    totals[key] = Math.round(totals[key] * 10) / 10;
  }

  return totals;
});

const macroRatios = computed(() => {
  const { carbohydrate, protein, fat } = totalNutrition.value;

  // 1. 각 영양소별 칼로리 계산
  const carbKcal = carbohydrate * 4;
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;

  // 2. 총 칼로리 계산 (탄단지만의 합)
  const totalMacroKcal = carbKcal + proteinKcal + fatKcal;

  // 3. 비율 계산 (totalMacroKcal이 0이면 나눗셈 오류 방지)
  if (totalMacroKcal === 0) {
    return {
      carbohydrate: 0,
      protein: 0,
      fat: 0,
    };
  }

  // 4. 소수점 이하까지 정확히 계산 (백분율)
  return {
    carbohydrate: (carbKcal / totalMacroKcal) * 100,
    protein: (proteinKcal / totalMacroKcal) * 100,
    fat: (fatKcal / totalMacroKcal) * 100,
  };
});
</script>

<style scoped>
/* 리뷰 페이지 전용 Input 스타일 */
.review-input {
  /* 기본 스타일 */
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: #f3f4f6; /* gray-100 */
  color: #4b5563; /* gray-700 */
  font-weight: 500;
  cursor: default; /* 읽기 전용임을 표시 */
  /* Focus 스타일 제거 */
  outline: none;
}

.review-textarea {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  font-weight: 500;
  cursor: default;
  outline: none;

  resize: vertical;
  height: auto;
  min-height: 50px; /* 최소 높이 지정 (선택 사항) */
}

.review-input-inline {
  /* 음식 목록 내의 작은 input 스타일 */
  flex-grow: 1;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.3rem;
  background-color: #ffffff; /* white */
  color: #4b5563;
  font-size: 0.875rem; /* text-sm */
  font-weight: 600;
  cursor: default;
  text-align: right;
  outline: none;
}

/* 💡 추가: 수동 입력 모드일 때 수정 가능함을 시각적으로 보여주는 스타일 */
.editable-input {
  background-color: #ffffff !important; /* 배경색을 흰색으로 변경 */
  border: 1px solid #8a8f6e !important; /* 강조 색상 테두리 */
  box-shadow: 0 0 0 1px #8a8f6e20; /* 옅은 그림자 */
}
</style>
