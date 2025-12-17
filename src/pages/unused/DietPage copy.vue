<template>
  <div class="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h1 class="text-3xl font-bold text-gray-900">🍽️ 식단 관리</h1>

      <div class="flex border rounded-lg p-1 bg-gray-50">
        <button
          @click="setViewMode('list')"
          :class="[
            'px-4 py-2 text-sm font-medium transition',
            // 💡 viewMode (computed)가 'list'일 때 활성화 클래스 적용
            viewMode === 'list'
              ? 'bg-indigo-600 text-white rounded-md shadow-sm'
              : 'text-gray-600',
          ]"
        >
          리스트 뷰
        </button>
        <button
          @click="setViewMode('calendar')"
          :class="[
            'px-4 py-2 text-sm font-medium transition',
            // 💡 viewMode (computed)가 'calendar'일 때 활성화 클래스 적용
            viewMode === 'calendar'
              ? 'bg-indigo-600 text-white rounded-md shadow-sm'
              : 'text-gray-600',
          ]"
        >
          캘린더 뷰
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-lg">
      <TodayNutritions class="mb-6" />
      <DietListView v-if="viewMode === 'list'" @open-detail="openDetailModal" />
      <FullCalendarView
        v-else-if="viewMode === 'calendar'"
        @select-diet="openDetailModal"
      />
      <div v-else class="text-center p-8 text-gray-500">
        잘못된 뷰 모드입니다.
      </div>
    </div>

    <DietDetailModal
      v-if="isDetailModalOpen"
      :diet-id="selectedDietId"
      @close="isDetailModalOpen = false"
      @edit="openWriteModalForEdit"
    />

    <DietWriteModal
      v-if="isWriteModalOpen"
      :initial-data="writeModalData"
      @close="isWriteModalOpen = false"
      @saved="handleDietSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 💡 Vue Router API 임포트

// 하위 컴포넌트 임포트
import DietListView from '@/components/diet/DietListView.vue';
import DietDetailModal from '@/components/diet/DietDetailModal.vue';
import DietWriteModal from '@/components/diet/DietWriteModal.vue';
import FullCalendarView from '@/components/diet/FullCalendarView.vue';
import TodayNutritions from '@/components/dashboard/nutrition/TodayNutritions.vue';

// 💡 Vue Router 인스턴스 사용
const route = useRoute();
const router = useRouter();

// 💡 viewMode Computed 속성: URL 쿼리 파라미터에서 'view' 값을 읽습니다.
// URL에 'view' 파라미터가 없으면 'list'가 기본값입니다.
const viewMode = computed(() => route.query.view || 'list');

// 💡 setViewMode 함수: URL 쿼리 파라미터를 변경하여 뷰 모드를 전환합니다.
const setViewMode = mode => {
  // 현재 쿼리 파라미터를 유지하면서 'view' 값만 업데이트
  router.push({ query: { ...route.query, view: mode } });
};

// --- 모달 관련 로직은 변경 없음 ---
const isDetailModalOpen = ref(false);
const isWriteModalOpen = ref(false);
const selectedDietId = ref(null);
const writeModalData = ref(null);

const openDetailModal = dietId => {
  selectedDietId.value = dietId;
  isDetailModalOpen.value = true;
};

const openWriteModalForEdit = dietData => {
  writeModalData.value = dietData;
  isDetailModalOpen.value = false;
  isWriteModalOpen.value = true;
};

const handleDietSaved = () => {
  isWriteModalOpen.value = false;
  alert('식단이 성공적으로 저장되었습니다.');
  // 데이터 리로드 또는 뷰 업데이트 로직 추가
};
</script>
