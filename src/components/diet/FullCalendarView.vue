<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">전체 식단 캘린더</h3>
    <div
      class="h-[70vh] bg-gray-50 border rounded-lg flex items-center justify-center text-gray-500"
    >
      FullCalendar 또는 Vue 달력 라이브러리가 여기에 구현됩니다. 날짜/이벤트
      클릭 시, @select-diet 이벤트를 발생시켜 부모에게 알립니다.
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['select-diet']);

// 예시: 캘린더 이벤트 핸들러 (라이브러리 사용 가정)
const handleDayClick = dietId => {
  // API 호출을 통해 해당 날짜 식단 데이터를 가져오거나,
  // 이벤트를 발생시켜 상세 모달을 띄웁니다.
  emit('select-diet', dietId);
};
</script>
