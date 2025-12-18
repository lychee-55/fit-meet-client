<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-[#f9f9f5] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <div class="p-5 border-b bg-white flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-[#8A8F6E]">
            {{ mealLabel }} 상세 정보
          </h2>
          <p class="text-sm text-gray-500">{{ formattedDate }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <XMarkIcon class="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6">
        <div
          v-if="diet.imageUrl"
          class="w-full h-48 rounded-xl overflow-hidden shadow-inner"
        >
          <img
            :src="diet.imageUrl"
            class="w-full h-full object-cover"
            alt="식단 이미지"
          />
        </div>

        <div
          class="p-4 bg-white rounded-xl shadow-sm border border-[#8A8F6E]/20"
        >
          <div class="flex items-end justify-between mb-4">
            <span class="font-bold text-gray-700">📊 영양소 밸런스</span>
            <span class="text-2xl font-black text-red-500"
              >{{ totalNutrition.kcal }}
              <small class="text-sm font-normal text-gray-500"
                >kcal</small
              ></span
            >
          </div>

          <div
            class="w-full h-4 flex rounded-full overflow-hidden bg-gray-100 mb-4"
          >
            <div
              :style="{ width: `${macroRatios.carbohydrate}%` }"
              class="bg-blue-400"
            ></div>
            <div
              :style="{ width: `${macroRatios.protein}%` }"
              class="bg-green-400"
            ></div>
            <div
              :style="{ width: `${macroRatios.fat}%` }"
              class="bg-orange-400"
            ></div>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <div class="p-2 bg-blue-50 rounded-lg">
              <p class="text-blue-600 font-bold">
                {{ totalNutrition.carbohydrate }}g
              </p>
              <p class="text-gray-500">탄수화물</p>
            </div>
            <div class="p-2 bg-green-50 rounded-lg">
              <p class="text-green-600 font-bold">
                {{ totalNutrition.protein }}g
              </p>
              <p class="text-gray-500">단백질</p>
            </div>
            <div class="p-2 bg-orange-50 rounded-lg">
              <p class="text-orange-600 font-bold">{{ totalNutrition.fat }}g</p>
              <p class="text-gray-500">지방</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-gray-700 mb-3 ml-1">🍽 포함된 음식</h3>
          <div class="space-y-2">
            <div
              v-for="food in diet.foods"
              :key="food.id"
              class="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100"
            >
              <div>
                <p class="font-medium text-gray-800">{{ food.foodNmKr }}</p>
                <p class="text-xs text-gray-400">{{ food.intakeGram }}g</p>
              </div>
              <p class="text-sm font-bold text-[#8A8F6E]">
                {{ food.kcal }} kcal
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="diet.description"
          class="p-4 bg-gray-50 rounded-lg italic text-gray-600 text-sm"
        >
          " {{ diet.description }} "
        </div>
      </div>

      <div class="p-4 bg-white border-t flex gap-2">
        <button
          class="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
        >
          삭제
        </button>
        <button
          class="flex-1 py-3 rounded-xl bg-[#8A8F6E] text-white font-bold hover:bg-[#6e7256] transition"
        >
          수정하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isVisible: Boolean,
  diet: Object,
  mealLabel: String,
});

defineEmits(['close']);

// 합산 로직 (받아온 diet 객체 내부의 foods 기준)
const totalNutrition = computed(() => {
  const totals = { kcal: 0, carbohydrate: 0, protein: 0, fat: 0 };
  if (props.diet?.foods) {
    props.diet.foods.forEach(f => {
      totals.kcal += Number(f.kcal || 0);
      totals.carbohydrate += Number(f.carbohydrate || 0);
      totals.protein += Number(f.protein || 0);
      totals.fat += Number(f.fat || 0);
    });
  }
  return totals;
});

// 비율 계산 로직
const macroRatios = computed(() => {
  const { carbohydrate: c, protein: p, fat: f } = totalNutrition.value;
  const total = c * 4 + p * 4 + f * 9;
  if (total === 0) return { carbohydrate: 0, protein: 0, fat: 0 };
  return {
    carbohydrate: ((c * 4) / total) * 100,
    protein: ((p * 4) / total) * 100,
    fat: ((f * 9) / total) * 100,
  };
});

const formattedDate = computed(() => {
  if (!props.diet?.date) return '';
  return new Date(props.diet.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
});
</script>
