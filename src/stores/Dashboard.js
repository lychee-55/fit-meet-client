import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiInstance from '@/api/axios';

export const useDashboardStore = defineStore('dashboard', () => {
  const todayNutrition = ref(null);
  const loading = ref(false);

  const weekScoreData = ref(null);
  const monthScoreData = ref(null);

  const aiAnalysisResult = ref(null);

  //오늘의 영양소 조회(/today-nutrition)
  const fetchTodayNutrition = async () => {
    loading.value = true;
    try {
      const response = await apiInstance.get('/api/dashboard/today-nutrition');
      if (response.data.code === 0) {
        todayNutrition.value = response.data.data;
      }
    } catch (error) {
      console.error('오늘의 영양소 조회 실패:', error);
      // throw error;
    } finally {
      loading.value = false;
    }
  };

  // 주간 점수 조회(/score-week)
  const fetchWeekScore = async (
    endDate = new Date().toISOString().split('T')[0],
  ) => {
    console.log(endDate);
    try {
      const response = await apiInstance.get(`/api/dashboard/score-week`, {
        params: { endDate },
      });
      if (response.data.code === 0) weekScoreData.value = response.data.data;
    } catch (error) {
      console.error('주간 점수 조회 실패:', error);
      // throw error;
    }
  };

  // 월간 점수 조회(/score-month)
  const fetchMonthScore = async (
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
  ) => {
    try {
      const response = await apiInstance.get(`/api/dashboard/score-month`, {
        params: { year, month },
      });
      console.log(response);
      if (response.data.code === 0) monthScoreData.value = response.data.data;
    } catch (error) {
      console.error('월간 점수 조회 실패:', error);

      // throw error;
    }
  };

  // 영양소 목표량 계산 (API에 없을 경우 탄5:단3:지2 비율 적용)
  const nutrientGoals = computed(() => {
    const totalGoal = todayNutrition.value?.dailyKcal || 2000;
    return {
      kcal: totalGoal,
      carb: Math.round((totalGoal * 0.5) / 4),
      protein: Math.round((totalGoal * 0.3) / 4),
      fat: Math.round((totalGoal * 0.2) / 9),
    };
  });

  const fetchAiWeeklyAnalysis = async (
    endDate = new Date().toISOString().split('T')[0],
  ) => {
    // [테스트용 캐싱] 이미 결과가 있다면 API 호출 없이 반환 (추후 삭제 가능)
    // if (aiAnalysisResult.value) {
    //   console.log(aiAnalysisResult.value);
    //   return aiAnalysisResult.value;
    // }

    loading.value = true;
    try {
      const response = await apiInstance.post(
        `/api/dashboard/ai-weekly`,
        null,
        {
          params: { endDate },
        },
      );
      if (response.data.code === 0) {
        aiAnalysisResult.value = response.data.data;
        return response.data.data;
      }
    } catch (error) {
      console.error('AI 분석 실패:', error);
      // throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    todayNutrition,
    loading,
    weekScoreData,
    monthScoreData,
    aiAnalysisResult,
    fetchTodayNutrition,
    fetchWeekScore,
    fetchMonthScore,
    nutrientGoals,
    fetchAiWeeklyAnalysis,
  };
});
