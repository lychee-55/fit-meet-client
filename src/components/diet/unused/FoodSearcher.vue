<template>
  <div class="space-y-3 p-3 border rounded-lg bg-gray-50">
    <h4 class="font-semibold text-base text-gray-800">음식 검색</h4>

    <div class="flex gap-2">
      <input
        type="text"
        v-model="searchQuery"
        @input="debouncedSearch(searchQuery)"
        placeholder="음식 이름 또는 키워드 입력"
        class="flex-1 rounded-md bg-white border-gray-800 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        type="button"
        @click="mealStore.searchMeals(searchQuery)"
        :disabled="!searchQuery || mealStore.isLoading"
        class="bg-indigo-500 text-white py-2 px-4 rounded-md text-sm hover:bg-indigo-600 disabled:opacity-50 transition"
      >
        검색
      </button>
    </div>

    <div v-if="mealStore.isLoading" class="text-center text-sm text-indigo-600">
      검색 중...
    </div>
    <ul
      v-else-if="mealStore.searchResults.length"
      class="max-h-40 overflow-y-auto space-y-1 p-2 bg-white border rounded-md"
    >
      <li
        v-for="meal in mealStore.searchResults"
        :key="meal.foodCd"
        @click="selectFood(meal)"
        class="p-2 text-sm rounded-md hover:bg-indigo-50 cursor-pointer transition flex justify-between items-center"
      >
        <span class="font-medium text-gray-800">{{ meal.foodNmKr }}</span>
        <span class="text-xs text-gray-500 ml-4">{{
          meal.sourceType === 'PUBLIC_API' ? '공공데이터' : '자체'
        }}</span>
      </li>
    </ul>
    <p
      v-else-if="mealStore.searched && !mealStore.searchResults.length"
      class="text-center text-sm text-gray-500"
    >
      검색 결과가 없습니다.
    </p>
  </div>
</template>

<script setup>
import { ref, defineEmits, onBeforeUnmount } from 'vue';
import { useMealStore } from '@/stores/Meal';

const emit = defineEmits(['food-selected']);
const mealStore = useMealStore(); // meal store 사용

const searchQuery = ref('');
// 스토어에서 디바운스 처리된 검색 함수를 가져와 사용
const debouncedSearch = mealStore.getDebouncedSearch();

/**
 * 음식 선택 핸들러
 * - 스토어 액션을 통해 상세 영양 정보를 조회하고
 * - 상위 컴포넌트로 선택된 음식 데이터를 전달합니다.
 */
const selectFood = async meal => {
  const selectedFood = await mealStore.fetchSelectedFoodDetails(meal);

  if (selectedFood) {
    emit('food-selected', selectedFood);

    // 선택 완료 후 상태 초기화
    mealStore.searchResults = [];
    mealStore.searched = false;
    searchQuery.value = '';
  }
};

// 컴포넌트가 파괴되기 전에 디바운스 타이머를 정리합니다.
onBeforeUnmount(() => {
  if (debouncedSearch.cancel) {
    debouncedSearch.cancel();
  }
});
</script>
