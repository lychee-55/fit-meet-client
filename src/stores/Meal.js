import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/meals`;
const getAccessToken = () => {
  return;
};

export const useMealStore = defineStore('meal', () => {
  // === STATE (상태) ===
  const searchResults = ref([]);
  const isLoading = ref(false);
  const searched = ref(false);

  // === ACTIONS (함수) ===
  function clearSearch() {
    searchResults.value = [];
    searched.value = false;
    isLoading.value = false;
  }

  /**
   * 음식 검색 (GET /api/meals/search)
   */
  async function searchMeals(keyword) {
    if (!keyword || keyword.trim() === '') {
      searchResults.value = [];
      searched.value = false;
      return;
    }

    isLoading.value = true;
    searched.value = true;
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { keyword: keyword },
        withCredentials: true,
      });
      searchResults.value = response.data.data || [];
    } catch (error) {
      console.error('스토어: 음식 검색 실패:', error);
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 음식 상세 정보 및 영양 성분 조회 (GET /api/meals/{foodCd}/nutrition)
   * 선택된 음식 정보를 가공하여 반환합니다.
   */
  async function fetchSelectedFoodDetails(meal) {
    isLoading.value = true;
    try {
      const nutritionResponse = await axios.get(
        `${BASE_URL}/${meal.foodCd}/nutrition`,
        { withCredentials: true },
      );
      const nutritionData = nutritionResponse.data.data;

      if (!nutritionData) {
        alert('선택한 음식의 영양 성분 정보를 찾을 수 없습니다.');
        return null;
      }

      // DietFoodRequest 형식에 맞춘 데이터 구성 및 반환
      return {
        foodNmKr: meal.foodNmKr,
        foodCode: meal.foodCd,
        sourceType: meal.sourceType,

        // Nutrition 정보
        intakeGram: nutritionData.baseAmountG,
        kcal: nutritionData.kcal,
        carbohydrate: nutritionData.carbohydrate,
        protein: nutritionData.protein,
        fat: nutritionData.fat,
        sugar: nutritionData.sugar,
        sodium: nutritionData.sodium,
        dietaryFiber: nutritionData.dietaryFiber,
        mealId: nutritionData.mealId,
      };
    } catch (error) {
      console.error('스토어: 음식 상세 정보 조회 실패:', error);
      alert('음식 상세 정보 로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 디바운스된 검색 함수를 컴포넌트에 제공합니다.
   */
  function getDebouncedSearch() {
    // searchMeals 함수를 클로저로 캡처하여 디바운스를 적용합니다.
    return debounce(keyword => searchMeals(keyword), 500);
  }

  return {
    searchResults,
    isLoading,
    searched,
    clearSearch,
    searchMeals,
    fetchSelectedFoodDetails,
    getDebouncedSearch,
  };
});
