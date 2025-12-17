import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  // 💡 모달의 열림/닫힘 상태
  const isWriteModalOpen = ref(false);
  // 💡 수정 시 전달할 초기 데이터 (null이면 등록 모드)
  const writeModalInitialData = ref(null);

  const openWriteModal = (data = null) => {
    writeModalInitialData.value = data;
    isWriteModalOpen.value = true;
  };

  const closeWriteModal = () => {
    isWriteModalOpen.value = false;
    writeModalInitialData.value = null; // 닫을 때 데이터 초기화
  };

  return {
    isWriteModalOpen,
    writeModalInitialData,
    openWriteModal,
    closeWriteModal,
  };
});
