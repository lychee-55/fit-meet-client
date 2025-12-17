<template>
  <section class="flex flex-col gap-8 w-full">
    <div
      class="p-6 border border-gray-200 rounded-xl bg-white shadow-sm transition"
    >
      <h3 class="text-xl font-bold text-[#8A8F6E] mb-4 border-b pb-2">
        음식 입력
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="lg:col-span-3">
          <label for="food-name" class="input-label">음식 이름 (필수)</label>
          <input
            id="food-name"
            v-model.trim="newFood.foodNmKr"
            type="text"
            class="input-style"
            placeholder="예: 닭가슴살 샐러드"
          />
        </div>

        <div>
          <label for="intake-gram" class="input-label">섭취량 (g)</label>
          <input
            id="intake-gram"
            v-model.number="newFood.intakeGram"
            type="number"
            class="input-style"
            placeholder="100"
          />
        </div>

        <div>
          <label for="kcal" class="input-label">칼로리 (Kcal)</label>
          <input
            id="kcal"
            v-model.number="newFood.kcal"
            type="number"
            class="input-style"
            placeholder="350"
          />
        </div>

        <div>
          <label for="carbohydrate" class="input-label">탄수화물 (g)</label>
          <input
            id="carbohydrate"
            v-model.number="newFood.carbohydrate"
            type="number"
            class="input-style"
            placeholder="30"
          />
        </div>

        <div>
          <label for="protein" class="input-label">단백질 (g)</label>
          <input
            id="protein"
            v-model.number="newFood.protein"
            type="number"
            class="input-style"
            placeholder="45"
          />
        </div>

        <div>
          <label for="fat" class="input-label">지방 (g)</label>
          <input
            id="fat"
            v-model.number="newFood.fat"
            type="number"
            class="input-style"
            placeholder="15"
          />
        </div>

        <div>
          <label for="sugar" class="input-label">설탕 (g)</label>
          <input
            id="sugar"
            v-model.number="newFood.sugar"
            type="number"
            class="input-style"
            placeholder="0 (기본값)"
          />
        </div>

        <div>
          <label for="sodium" class="input-label">나트륨 (mg)</label>
          <input
            id="sodium"
            v-model.number="newFood.sodium"
            type="number"
            class="input-style"
            placeholder="0 (기본값)"
          />
        </div>

        <div>
          <label for="dietaryFiber" class="input-label">식이섬유 (g)</label>
          <input
            id="dietaryFiber"
            v-model.number="newFood.dietaryFiber"
            type="number"
            class="input-style"
            placeholder="0 (기본값)"
          />
        </div>
      </div>

      <button
        @click="addFood"
        :disabled="!isNewFoodValid"
        class="w-full mt-6 py-3 px-4 rounded-xl bg-[#8A8F6E] text-white font-semibold hover:bg-[#6e7256] transition disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <PlusIcon class="h-5 w-5" /> 음식 목록에 추가하기
      </button>
      <p v-if="!isNewFoodValid" class="text-sm text-red-500 mt-2 text-center">
        💡 음식 이름, 섭취량, 칼로리, 탄수화물, 단백질, 지방은 필수 항목입니다.
      </p>
    </div>

    <div class="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
      <h3 class="text-xl font-bold text-[#8A8F6E] mb-4 border-b pb-2">
        등록된 음식 목록 ({{ formData.foods.length }}개)
      </h3>

      <div v-if="formData.foods.length > 0" class="space-y-4">
        <div
          v-for="(food, index) in formData.foods"
          :key="index"
          class="p-4 bg-white border border-gray-100 rounded-lg shadow-sm"
        >
          <div class="flex justify-between items-start mb-2">
            <span class="text-lg font-bold text-gray-800">{{
              food.foodNmKr
            }}</span>
            <button
              @click="removeFood(index)"
              class="text-red-500 hover:text-red-700 transition"
              aria-label="음식 삭제"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p>
              <span class="font-medium text-gray-600">섭취량:</span>
              {{ food.intakeGram }}g
            </p>
            <p>
              <span class="font-medium text-gray-600">Kcal:</span>
              {{ food.kcal }} Kcal
            </p>
            <p>
              <span class="font-medium text-gray-600">탄수화물:</span>
              {{ food.carbohydrate }}g
            </p>
            <p>
              <span class="font-medium text-gray-600">단백질:</span>
              {{ food.protein }}g
            </p>
            <p>
              <span class="font-medium text-gray-600">지방:</span>
              {{ food.fat }}g
            </p>
            <p>
              <span class="font-medium text-gray-600">나트륨:</span>
              {{ food.sodium }}mg
            </p>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 text-center py-4">
        입력 폼을 사용하여 식사한 음식을 직접 기록해주세요.
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, defineProps, defineEmits } from 'vue';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['formData']);
const emit = defineEmits(['update:formData']);

// 💡 새 음식 항목을 위한 기본 구조
const initialNewFoodState = () => ({
  foodNmKr: '',
  intakeGram: null, // 섭취량 (g)
  kcal: null, // 칼로리 (Kcal)
  carbohydrate: null, // 탄수화물 (g)
  protein: null, // 단백질 (g)
  fat: null, // 지방 (g)
  // 💡 사용자가 모를 경우 0으로 기본값 설정
  sugar: 0, // 당 (g)
  sodium: 0, // 나트륨 (mg)
  dietaryFiber: 0, // 식이섬유 (g)
  foodCode: null, // 수동 입력이므로 foodCode는 null
  sourceType: 'MANUAL', // 수동 입력임을 명시
});

const newFood = reactive(initialNewFoodState());

// ------------------ 계산된 속성 (Getter) ------------------

// 💡 새 음식 유효성 검사
const isNewFoodValid = computed(() => {
  // 필수 항목: 음식 이름, 섭취량, 칼로리, 탄수화물, 단백질, 지방
  const isNameValid = newFood.foodNmKr && newFood.foodNmKr.trim().length > 0; // 💡 필드들이 null이 아니면서, 0 이상의 유효한 숫자인지 확인
  // 숫자 필드는 0 이상의 값만 확인
  // 2. 필수 영양소 유효성 검사
  const requiredNutritionFields = [
    newFood.intakeGram,
    newFood.kcal,
    newFood.carbohydrate,
    newFood.protein,
    newFood.fat,
  ];

  const isNutritionValid = requiredNutritionFields.every(
    (
      field, // null이 아니어야 하고 (즉, 값이 입력되었어야 하고)
    ) =>
      field !== null && // 0 이상의 숫자여야 함
      field >= 0,
  );

  return isNameValid && isNutritionValid;
});

// ------------------ 액션 (Action) ------------------

// 💡 새 음식 추가
const addFood = () => {
  if (!isNewFoodValid.value) return;

  // 1. 현재 newFood 상태의 유효한 복사본을 생성
  //    (null을 0으로 변환하여, 백엔드 요청 바디 구조에 맞게 준비)
  const foodToAdd = {
    ...newFood,
    intakeGram: parseFloat(newFood.intakeGram || 0),
    kcal: parseFloat(newFood.kcal || 0),
    carbohydrate: parseFloat(newFood.carbohydrate || 0),
    protein: parseFloat(newFood.protein || 0),
    fat: parseFloat(newFood.fat || 0),
    sugar: parseFloat(newFood.sugar || 0),
    sodium: parseFloat(newFood.sodium || 0),
    dietaryFiber: parseFloat(newFood.dietaryFiber || 0),
    // foodCode는 이미 null, sourceType은 MANUAL
  };

  // 2. 부모의 formData 업데이트 (새 음식을 기존 목록에 추가)
  const updatedFoods = [...props.formData.foods, foodToAdd];
  emit('update:formData', { ...props.formData, foods: updatedFoods });

  // 3. 입력 폼 초기화 (새로운 참조를 할당)
  Object.assign(newFood, initialNewFoodState());
};

// 💡 음식 삭제
const removeFood = index => {
  const updatedFoods = props.formData.foods.filter((_, i) => i !== index);
  emit('update:formData', { ...props.formData, foods: updatedFoods });
};
</script>

<style scoped>
/* 💡 input-style은 BasicInfoForm 등에서 사용되는 스타일과 동일하게 가정 */
/* .input-style {
  @apply w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A8F6E] focus:border-[#8A8F6E] transition shadow-sm text-gray-700;
}
.input-label {
  @apply text-base font-medium text-gray-700 block mb-1;
} */
</style>
