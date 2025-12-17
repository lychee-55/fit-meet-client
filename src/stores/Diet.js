// src/stores/diet.js (Pinia Setup Store - Composition API Style)

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/diets`;

export const useDietStore = defineStore('diet', () => {
  // === STATE (상태) ===
  const dietList = ref([]); // 전체 식단 리스트
  const dailyDietMap = ref({}); // 일간 식단 데이터. key: 'YYYY-MM-DD', value: [식단 객체 배열]
  const isLoading = ref(false); // 로딩 상태
  const error = ref(null); // 에러 메시지

  // === GETTERS (계산된 상태) ===

  // 특정 날짜의 식단 목록을 가져오는 Getter
  const getDietByDate = computed(() => dateString => {
    return dailyDietMap.value[dateString] || [];
  });

  // 주간 평균 칼로리 등을 계산하는 Getter (로직 더미)
  const getWeeklyAverageCalories = computed(() => {
    // 실제 계산 로직 구현 필요
    return 0;
  });

  // === ACTIONS (함수) ===

  /**
   * 식단 등록 (POST /api/diets)
   */
  async function insertDiet(dietData) {
    isLoading.value = true;
    error.value = null;
    try {
      // Note: import.meta.env.VITE_API_URL은 Vite 환경 변수를 사용하는 방식입니다.
      const response = await axios.post(
        `${BASE_URL}`, // VITE_API_URL이 이미 axios 인스턴스에 설정되었다고 가정
        dietData,
        { withCredentials: true },
      );

      // 등록 성공 후, 해당 날짜의 데이터를 새로고침 (옵션)
      if (response.data.code === 0) {
        // await fetchDietForDay(dietData.date);
        console.log('식단 등록 성공');
      }

      return response.data;
    } catch (err) {
      error.value = '식단 등록에 실패했습니다.';
      console.error('스토어: 식단 등록 실패', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 특정 날짜의 식단 정보를 서버에서 가져와 dailyDietMap에 저장
   */
  async function fetchDietForDay(dateString) {
    // 캐싱 로직
    if (
      dailyDietMap.value[dateString] &&
      dailyDietMap.value[dateString].length > 0
    ) {
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${BASE_URL}/day?date=${dateString}`, {
        withCredentials: true,
      });

      // dailyDietMap 업데이트
      dailyDietMap.value = {
        ...dailyDietMap.value,
        [dateString]: response.data.diets || [],
      };
    } catch (err) {
      error.value = `일간 식단 정보를 가져오는 데 실패했습니다: ${dateString}`;
      dailyDietMap.value[dateString] = [];
      console.error('스토어: 일간 식단 조회 실패', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchDietNutrition(foodDataArray) {
    if (!foodDataArray || foodDataArray.length === 0) {
      console.error('스토어: 전송할 음식 데이터 배열이 비어있습니다.');
      return null;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.post(
        `${BASE_URL}/nutrition`, // 💡 POST 요청 URL
        { foods: foodDataArray }, // 💡 Request Body로 foods 배열 전송
        { withCredentials: true },
      );

      if (response.data.code !== 0 || !response.data.data) {
        alert('영양성분 정보를 재조회하는 데 실패했습니다.');
        return null;
      }

      // 서버 응답 데이터 (foods 배열 및 totals)를 반환합니다.
      // 우리는 여기서 foods[0]을 사용하게 됩니다.
      return response.data.data;
    } catch (err) {
      error.value = '음식 영양성분 재조회에 실패했습니다.';
      console.error('스토어: 음식 영양성분 재조회 실패', err);
      // 오류 발생 시에도 예외를 다시 던져 컴포넌트에서 catch하도록 처리
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // TODO: updateDiet, deleteDiet, fetchDietDetail 등의 CRUD 액션 추가 필요

  // 외부에 노출할 상태, 게터, 액션을 반환
  return {
    // State
    dietList,
    dailyDietMap,
    isLoading,
    error,

    // Getters
    getDietByDate,
    getWeeklyAverageCalories,

    // Actions
    insertDiet,
    fetchDietForDay,
    fetchDietNutrition,
    // TODO: updateDiet, deleteDiet
  };
});
