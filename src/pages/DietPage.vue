<template>
  <div class="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
    <DateSelectorDropdown class="flex justify-end" />
    <!-- <DietWriteModal
      v-if="isWriteModalOpen"
      :initial-data="writeModalData"
      @close="isWriteModalOpen = false"
      @saved="handleDietSaved"
    /> -->
    <!-- <WriteDietBoardBtn /> -->
    <button
      @click="isOptionModalVisible = true"
      class="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#8A8F6E] text-white shadow-xl hover:bg-[#6e7256] transition z-40"
    >
      <PlusIcon class="w-8 h-8 mx-auto" />
    </button>
    <CreateDietFormOptionModal
      :is-visible="isOptionModalVisible"
      @update:isVisible="isOptionModalVisible = $event"
      @selectOption="handleSelectOption"
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
import DateSelectorDropdown from '@/components/diet/DateSelectorDropdown.vue';
import CreateDietFormOptionModal from '@/components/diet/CreateDietFormOptionModal.vue';
import { PlusIcon } from '@heroicons/vue/24/outline';

// 💡 Vue Router 인스턴스 사용
const route = useRoute();
const router = useRouter();

const isOptionModalVisible = ref(false);
const handleSelectOption = option => {
  let methodParam;

  if (option === 'manual') {
    // URL: /diet/create-diet/manual
    methodParam = 'manual';
  } else if (option === 'public-api') {
    // URL: /diet/create-diet/public-api
    methodParam = 'public-api';
  } else {
    // 옵션이 유효하지 않으면 종료
    return;
  }
  // 💡 라우팅 실행: name과 params를 사용하여 이동
  router.push({
    name: 'createDiet', // 라우터에 정의한 이름
    params: {
      method: methodParam, // URL에 들어갈 값 (manual 또는 public-api)
    },
  });
};
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
