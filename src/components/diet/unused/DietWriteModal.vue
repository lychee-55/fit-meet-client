<template>
  <div
    class="fixed inset-0 backdrop-blur-xs bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all"
    >
      <div
        class="p-5 flex justify-between items-center bg-[#FAEDCD] rounded-t-lg"
      >
        <h3 class="text-xl font-bold text-indigo-800">
          {{ isEditing ? ' 식단 수정' : ' 식단 등록' }}
        </h3>
        <button
          @click="close"
          class="text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-3 gap-4 border-b border-gray-300 pb-4">
          <div>
            <label for="diet-date">날짜</label
            ><input
              type="date"
              id="diet-date"
              v-model="form.date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
            />
          </div>
          <div>
            <label for="meal-type">식사 분류</label
            ><select
              id="meal-type"
              v-model="form.mealType"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
            >
              <option value="A">아침</option>
              <option value="B">점심</option>
              <option value="C">저녁</option>
              <option value="D">간식</option>
              <option value="E">야식</option>
            </select>
          </div>
          <div class="flex items-end justify-end">
            <label class="inline-flex items-center"
              ><input
                type="checkbox"
                v-model="form.isPublic"
                class="form-checkbox text-indigo-600 h-4 w-4 rounded"
              /><span class="ml-2 text-sm text-gray-700 font-semibold"
                >커뮤니티 공개</span
              ></label
            >
          </div>
        </div>

        <FoodSearcher @food-selected="addFoodToDiet" />

        <section class="border p-4 rounded-lg bg-yellow-50/50">
          <h4 class="font-bold text-md mb-3 text-gray-800 flex items-center">
            🍚 등록된 음식 목록 (<span class="text-indigo-600 ml-1"
              >{{ totalKcal.toFixed(0) }} kcal</span
            >)
          </h4>

          <ul
            v-if="form.foods.length"
            class="space-y-2 max-h-40 overflow-y-auto pr-2"
          >
            <li
              v-for="(food, index) in form.foods"
              :key="index"
              class="flex items-center justify-between p-2 bg-white rounded-md shadow-sm text-sm"
            >
              <span class="font-medium text-gray-700 w-1/3 truncate">{{
                food.foodNmKr
              }}</span>

              <div class="flex items-center w-1/3">
                <input
                  type="number"
                  v-model.number="food.intakeGram"
                  min="1"
                  class="w-full p-1 border rounded text-right text-xs"
                />
                <span class="ml-1 text-xs text-gray-500">g</span>
              </div>

              <span class="text-xs text-gray-500 w-1/4 text-right">
                {{ calculateKcal(food).toFixed(0) }} kcal
              </span>
              <button
                type="button"
                @click="removeFood(index)"
                class="text-red-500 hover:text-red-700 ml-3"
              >
                &times;
              </button>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic text-center py-2">
            음식을 검색하여 추가해주세요.
          </p>
        </section>

        <div class="space-y-4">
          <div>
            <label for="image-url">이미지 URL</label
            ><input
              type="text"
              id="image-url"
              v-model="form.imageUrl"
              placeholder="식단 사진의 URL"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
            />
          </div>
          <div>
            <label for="description">특이사항 (비고)</label
            ><textarea
              id="description"
              v-model="form.description"
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
            ></textarea>
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3">
          <button
            type="button"
            @click="close"
            class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-400 transition"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700 transition disabled:opacity-50"
          >
            {{ isEditing ? '수정 완료' : '등록하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import { useDietStore } from '@/stores/Diet';
import { useModalStore } from '@/stores/modal';
import FoodSearcher from './FoodSearcher.vue';

const props = defineProps({
  initialData: Object,
});
const emit = defineEmits(['close', 'saved']);

const dietStore = useDietStore();
const modalStore = useModalStore();

const form = ref({
  id: null,
  date: new Date().toISOString().substring(0, 10),
  mealType: 'B',
  description: '',
  imageUrl: '',
  sourceType: 'MANUAL',
  isPublic: true,
  foods: [],
});

// --- Computed ---
const isEditing = computed(() => !!props.initialData?.id);
const isFormValid = computed(() => {
  return form.value.date && form.value.mealType && form.value.foods.length > 0;
});

// 섭취량 기준으로 칼로리를 계산하는 함수 (UI 표시용)
const calculateKcal = food => {
  if (food.intakeGram <= 0 || !food.kcal) return 0;
  const baseAmountG = food.intakeGram;
  return (food.kcal / 100) * food.intakeGram;
};

// 총 칼로리 계산
const totalKcal = computed(() => {
  return form.value.foods.reduce((sum, food) => {
    return sum + calculateKcal(food);
  }, 0);
});

watch(
  () => modalStore.isWriteModalOpen,
  isOpenNow => {
    if (isOpenNow) {
      const newData = modalStore.writeModalInitialData;

      if (newData) {
        // 수정 모드 로직
      } else {
        // 등록 모드 초기화
        form.value = {
          id: null,
          date: new Date().toISOString().substring(0, 10),
          mealType: 'B',
          description: '',
          imageUrl: '',
          sourceType: 'MANUAL',
          isPublic: true,
          foods: [],
        };
      }
    }
  },
  { immediate: true },
);

const close = () => {
  modalStore.closeWriteModal();
};

const addFoodToDiet = selectedFood => {
  form.value.foods.push(selectedFood);
};

const removeFood = index => {
  form.value.foods.splice(index, 1);
};

/**
 * 식단 등록/수정 요청
 */
const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('필수 정보를 입력하고 최소한 하나의 음식을 추가해야 합니다.');
    return;
  }

  const payload = {
    date: new Date(form.value.date + 'T00:00:00').toISOString(),
    mealType: form.value.mealType,
    description: form.value.description,
    imageUrl: form.value.imageUrl,
    sourceType: form.value.sourceType,
    isPublic: form.value.isPublic,
    foods: form.value.foods.map(food => {
      // 섭취량(intakeGram) 기준으로 환산된 최종 영양 성분 값을 계산하여 전송합니다.
      const scalingFactor = food.intakeGram / 100; // 100g 기준 가정

      // null 값 처리를 위해 안전하게 변환
      const scaleNutrition = value =>
        value ? parseFloat((value * scalingFactor).toFixed(3)) : null;

      return {
        mealId: food.mealId,
        foodNmKr: food.foodNmKr,
        foodCode: food.foodCode,
        sourceType: food.sourceType,
        intakeGram: food.intakeGram,

        // 섭취량 기준으로 비율 계산 및 전송
        kcal: scaleNutrition(food.kcal),
        carbohydrate: scaleNutrition(food.carbohydrate),
        protein: scaleNutrition(food.protein),
        fat: scaleNutrition(food.fat),
        sugar: scaleNutrition(food.sugar),
        sodium: scaleNutrition(food.sodium),
        dietaryFiber: scaleNutrition(food.dietaryFiber),
      };
    }),
  };

  try {
    if (isEditing.value) {
      // 수정 로직 호출
      alert('식단 수정 로직 실행 (더미)');
    } else {
      // 등록 로직 호출
      await dietStore.insertDiet(payload);
      alert('식단 등록 완료');
    }

    emit('saved');
    close();
  } catch (error) {
    console.error('식단 저장 실패:', error);
    alert(`식단 저장에 실패했습니다: ${error.message}`);
  }
};
</script>

<style scoped></style>
