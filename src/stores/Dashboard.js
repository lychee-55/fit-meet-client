import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/dashboard`;

export const useDashboardStore = defineStore('dashboard', () => {
  const todayNutrition = ref(null);
  const loading = ref(false);

  const weekScoreData = ref(null);
  const monthScoreData = ref(null);

  const fetchTodayNutrition = async () => {
    loading.value = true;
    try {
      const response = await axios.get(`${BASE_URL}/today-nutrition`, {
        withCredentials: true,
      });
      if (response.data.code === 0) {
        todayNutrition.value = response.data.data;
      }
    } catch (error) {
      console.error('오늘의 영양소 조회 실패:', error);
    } finally {
      loading.value = false;
    }
  };

  // 주간 점수 조회
  const fetchWeekScore = async (
    endDate = new Date().toISOString().split('T')[0],
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/score-week`, {
        params: { endDate },
        withCredentials: true,
      });
      if (response.data.code === 0) weekScoreData.value = response.data.data;
    } catch (error) {
      console.error('주간 점수 조회 실패:', error);
    }
  };

  // 월간 점수 조회
  const fetchMonthScore = async (
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/score-month`, {
        params: { year, month },
        withCredentials: true,
      });
      if (response.data.code === 0) monthScoreData.value = response.data.data;
    } catch (error) {
      console.error('월간 점수 조회 실패:', error);
    }
  };

  // 영양소 목표량 계산 (API에 없을 경우 탄5:단3:지2 비율 적용)
  const nutrientGoals = computed(() => {
    const totalGoal = todayNutrition.value?.dailyKcal || 2000;
    return {
      kcal: totalGoal,
      carb: Math.round((totalGoal * 0.5) / 4), // 50%
      protein: Math.round((totalGoal * 0.3) / 4), // 30%
      fat: Math.round((totalGoal * 0.2) / 9), // 20%
    };
  });

  return {
    todayNutrition,
    loading,
    weekScoreData,
    monthScoreData,
    fetchTodayNutrition,
    fetchWeekScore,
    fetchMonthScore,
    nutrientGoals,
  };
});
