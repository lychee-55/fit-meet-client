<template>
  <div
    class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">식단 유지 점수</h2>
      <div class="flex bg-gray-100 p-1 rounded-lg">
        <button
          @click="viewType = 'week'"
          :class="tabClass(viewType === 'week')"
        >
          주간
        </button>
        <button
          @click="viewType = 'month'"
          :class="tabClass(viewType === 'month')"
        >
          월간
        </button>
      </div>
    </div>

    <div class="flex flex-1 gap-6 flex-col lg:flex-row min-h-0 w-full">
      <div class="w-full lg:flex-1 h-64 lg:h-full min-h-[250px] min-w-0">
        <ScoreChart
          :items="
            viewType === 'week'
              ? dashboardStore.weekScoreData?.items
              : dashboardStore.monthScoreData?.weeks
          "
          :type="viewType"
        />
      </div>

      <div
        class="w-full lg:w-46 lg:flex-shrink-0 flex flex-col justify-center items-center bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-inner-sm"
      >
        <span
          class="text-gray-500 text-sm font-semibold tracking-tight uppercase"
        >
          {{ viewType === 'week' ? 'Weekly Avg' : 'Monthly Avg' }}
        </span>

        <div
          class="flex items-baseline mt-1"
          :class="scoreColor(currentAverage)"
        >
          <span class="text-5xl lg:text-6xl font-black italic">{{
            currentAverage
          }}</span>
          <span class="text-xl font-bold ml-1 opacity-70">점</span>
        </div>

        <div
          class="mt-4 text-[11px] text-gray-400 text-center leading-relaxed max-w-[150px] lg:max-w-none"
        >
          {{
            viewType === 'week'
              ? '최근 7일간의 기록입니다.'
              : '이번 달 주차별 평균입니다.'
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useDashboardStore } from '@/stores/DashBoard';
import ScoreChart from './ScoreChart.vue';

const dashboardStore = useDashboardStore();
const viewType = ref('week');

const currentAverage = computed(() => {
  return viewType.value === 'week'
    ? dashboardStore.weekScoreData?.average || 0
    : dashboardStore.monthScoreData?.monthAverage || 0;
});

const tabClass = active => [
  'px-4 py-1.5 text-sm font-bold rounded-md transition-all',
  active
    ? 'bg-white text-[#8A8F6E] shadow-sm'
    : 'text-gray-400 hover:text-gray-600',
];

const scoreColor = score => {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-blue-500';
  return 'text-red-400';
};

onMounted(() => {
  dashboardStore.fetchWeekScore();
  dashboardStore.fetchMonthScore();
});

// 탭 전환 시 데이터 재조회 (필요시)
watch(viewType, newType => {
  if (newType === 'week') dashboardStore.fetchWeekScore();
  else dashboardStore.fetchMonthScore();
});
</script>
<style scoped>
/* 안쪽으로 살짝 들어간 느낌을 주는 커스텀 쉐도우 (선택사항) */
.shadow-inner-sm {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
}
</style>
