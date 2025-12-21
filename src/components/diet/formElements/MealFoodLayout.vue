<template>
  <section class="flex flex-col gap-6 p-2 h-full">
    <!-- <h3 class="text-xl font-semibold text-[#8A8F6E] mb-2">
      {{ mode === 'manual' ? '식단 상세 (직접 입력)' : '음식 검색 및 추가' }}
    </h3> -->

    <div class="grow grid gap-6 sm:grid-cols-2 grid-cols-1">
      <div class="flex flex-col gap-4">
        <div
          class="flex items-center gap-2 border border-gray-200 rounded-xl p-2 shadow-sm"
        >
          <input
            type="search"
            v-model="searchQuery"
            placeholder="음식 이름 검색 (예: 닭가슴살)"
            class="input-style flex-1 p-2"
            @keyup.enter="performSearch"
          />
          <button
            @click="performSearch"
            class="cursor-pointer bg-[#8A8F6E] text-white p-3 rounded-xl hover:bg-[#6e7256] transition shrink-0"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>
        </div>
        <div
          class="flex flex-col gap-4 border border-gray-200 rounded-xl p-4 shadow-sm h-full"
        >
          <h4 class="text-lg font-bold text-gray-800">검색 결과</h4>

          <div class="flex-1 overflow-y-auto max-h-[410px] custom-scrollbar">
            <div v-for="food in searchResults" :key="food.foodCd">
              <MealSearchFoodItem :food="food" @food-added="handleFoodAdded" />
            </div>
            <div v-if="searchResults.length === 0">
              <p class="text-gray-500 text-center py-40">
                아직 검색된 음식이 없습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-4 border border-gray-200 rounded-xl p-4 shadow-sm grow"
      >
        <h4 class="text-lg font-bold text-gray-800">
          추가된 음식 목록 ({{ formData.foods.length }})
        </h4>

        <div class="grow overflow-y-auto space-y-3 pr-2">
          <p
            v-if="formData.foods.length === 0"
            class="text-gray-500 text-center py-10"
          >
            아직 추가된 음식이 없습니다.
          </p>

          <div
            v-for="(food, index) in formData.foods"
            :key="'added-' + index"
            class="p-3 bg-gray-50 border border-gray-100 flex justify-between items-center transition rounded-lg"
          >
            <div class="flex flex-col grow min-w-0 pr-4">
              <span class="text-base font-semibold text-gray-700 truncate">{{
                food.foodNmKr
              }}</span>
              <span class="sm:hidden text-xs text-gray-500 mt-0.5">
                섭취량: {{ food.intakeGram || 0 }}g
              </span>
              <span class="hidden sm:block text-xs text-gray-500 mt-0.5">
                Kcal: {{ food.kcal }} | 탄수화물: {{ food.carbohydrate }}g |
                섭취량: {{ food.intakeGram }}g
              </span>
            </div>

            <button
              @click="removeFood(index)"
              class="shrink-0 transition cursor-pointer"
              :class="[
                'sm:bg-red-500 sm:text-white sm:px-3 sm:py-1 sm:rounded-full sm:text-sm sm:font-medium sm:hover:bg-red-600',
                'text-red-500 p-1 rounded-full hover:bg-red-50',
              ]"
            >
              <span class="hidden sm:inline">삭제</span>
              <XMarkIcon class="sm:hidden h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { computed, ref, onMounted, watch } from 'vue';
import { useMealStore } from '@/stores/Meal';
import MealSearchFoodItem from './MealSearchFoodItem.vue';

const props = defineProps({
  formData: Object,
  mode: String,
});
const emit = defineEmits(['update:formData']);
const mealStore = useMealStore();

const searchQuery = ref('');
const searchResults = computed(() => mealStore.searchResults);
const isLoading = computed(() => mealStore.isLoading);

const formData = computed(() => props.formData);

const updateFoods = newFoods => {
  emit('update:formData', { ...props.formData, foods: newFoods });
};
// 디바운스된 검색 함수를 사용합니다. (입력 시 API 호출 빈도 줄임)
const debouncedSearch = mealStore.getDebouncedSearch();

// 검색 실행 로직
const performSearch = () => {
  // 디바운스된 함수를 바로 호출합니다. (searchQuery.value의 변경을 감지하지 않아도 됨)
  // 실제 검색은 `searchMeals` 액션을 직접 호출하는 대신 `debouncedSearch`를 통해 실행합니다.
  mealStore.searchMeals(searchQuery.value);
};
watch(searchQuery, newKeyword => {
  debouncedSearch(newKeyword);
});

const handleFoodAdded = finalFoodData => {
  // finalFoodData는 dietStore.fetchDietNutrition에서 반환된 최종 객체
  if (!finalFoodData) return;

  // 상세 정보를 최종 foods 배열에 추가
  const newFoods = [...formData.value.foods, finalFoodData];
  updateFoods(newFoods);
};

const removeFood = index => {
  const newFoods = formData.value.foods.filter((_, i) => i !== index);
  updateFoods(newFoods);
};
</script>

<style scoped>
.input-style {
  width: 100%;
  padding: 0.75rem;
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: #374151;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-style:focus {
  outline: none;
  border-color: #8a8f6e;
  box-shadow: 0 0 0 2px #8a8f6e, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
