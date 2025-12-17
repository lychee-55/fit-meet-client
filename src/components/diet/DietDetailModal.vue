<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div class="p-5 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold text-gray-800">
          {{ dietData.date }} {{ dietData.time }} 식단 상세
        </h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      <div class="p-5 space-y-4">
        <div class="flex justify-between border-b pb-2">
          <span class="text-sm font-medium text-gray-600">총 칼로리</span>
          <span class="text-lg font-bold text-red-600"
            >{{ dietData.calories }} kcal</span
          >
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-sm font-medium text-gray-600">식단 점수</span>
          <span class="text-lg font-bold text-blue-600"
            >{{ dietData.score }}점</span
          >
        </div>

        <div>
          <h4 class="font-semibold mb-2">섭취 내역</h4>
          <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
            <li>밥 (200g): 270kcal</li>
            <li>닭가슴살 (100g): 165kcal</li>
            <li>김치 (50g): 15kcal</li>
          </ul>
        </div>

        <p class="text-sm mt-3 text-gray-600">
          비고: {{ dietData.notes || '특이사항 없음' }}
        </p>
      </div>

      <div class="p-5 border-t flex justify-end gap-3">
        <button
          @click="handleEdit"
          class="bg-yellow-500 text-white py-2 px-4 rounded-md text-sm hover:bg-yellow-600 transition"
        >
          수정
        </button>
        <button
          @click="handleDelete"
          class="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 transition"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios'; // API 사용 가정

const props = defineProps({
  dietId: [Number, String],
});
const emit = defineEmits(['close', 'edit', 'deleted']);

const isOpen = computed(() => !!props.dietId);
const dietData = ref({ date: '', time: '', calories: 0, score: 0, notes: '' }); // 임시 데이터 구조

watch(
  () => props.dietId,
  newId => {
    if (newId) {
      fetchDietDetails(newId);
    }
  },
  { immediate: true },
);

// 💡 API: GET /api/diets/{dietId} 사용
const fetchDietDetails = async id => {
  // 실제 API 호출 로직
  // const response = await axios.get(`/api/diets/${id}`);
  // dietData.value = response.data;

  // 임시 데이터 채우기
  dietData.value = {
    id: id,
    date: '2025년 12월 14일',
    time: '저녁',
    calories: 620,
    score: 88,
    notes: '운동 후 단백질 위주로 섭취했음.',
  };
};

const close = () => {
  emit('close');
};

const handleEdit = () => {
  // 식단 등록/수정 모달로 넘기기 위해 현재 데이터를 emit
  emit('edit', dietData.value);
};

// 💡 API: DELETE /api/diets/{dietId} 사용
const handleDelete = async () => {
  if (confirm('정말로 이 식단을 삭제하시겠습니까?')) {
    try {
      // await axios.delete(`/api/diets/${props.dietId}`);
      alert('삭제되었습니다.');
      emit('deleted');
      close();
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  }
};
</script>
