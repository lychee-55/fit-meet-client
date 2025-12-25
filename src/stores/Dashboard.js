import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiInstance from '@/api/axios';

export const useDashboardStore = defineStore('dashboard', () => {
  const todayNutrition = ref(null);
  const loading = ref(false);

  const weekScoreData = ref(null);
  const monthScoreData = ref(null);

  const aiAnalysisResult = ref(null);

  const streakData = ref({ streakCount: 0 });
  const activityDays = ref([]);

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

  // 스트릭 및 활동 조회 함수 (GET "/api/user-activity/diet/streak" && GET "/api/user-activity/diet/activity-range")
  const fetchStreakAndActivity = async () => {
    loading.value = true;
    try {
      const now = new Date(); // 2025-12-23 (화요일)

      // 1. 이번 달의 첫 날 (12월 1일)
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // 2. 달력의 시작일 (12월 1일이 속한 주의 일요일)
      // 2025년 12월 1일은 월요일(1)이므로, 1일 전인 11월 30일(일)이 시작일이 됩니다.
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

      // 3. 이번 달의 마지막 날 (12월 31일)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // 4. 달력의 종료일 (마지막 날이 속한 주의 토요일)
      const endDate = new Date(lastDayOfMonth);
      endDate.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

      // 로컬 타임존을 유지하며 YYYY-MM-DD 형식으로 변환
      const formatDate = date => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      const [streakRes, rangeRes] = await Promise.all([
        apiInstance.get('/api/user-activity/diet/streak'),
        apiInstance.get('/api/user-activity/diet/activity-range', {
          params: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
        }),
      ]);

      if (streakRes.data.code === 0) streakData.value = streakRes.data.data;
      if (rangeRes.data.code === 0)
        activityDays.value = rangeRes.data.data.days;
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
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
    streakData,
    activityDays,
    fetchStreakAndActivity,
  };
});
