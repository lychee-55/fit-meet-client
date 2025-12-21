<template>
  <section class="flex flex-col gap-6 py-20">
    <!-- <h3 class="text-xl font-semibold text-[#8A8F6E] mb-2">식단 기본 정보</h3> -->

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label for="diet-datetime" class="text-base font-medium text-gray-700"
          >식사 날짜 및 시간</label
        >
        <input
          type="datetime-local"
          :value="formatDateTime(formData.date)"
          @change="updateDate($event.target.value)"
          class="input-style"
          required
        />
      </div>

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label class="text-base font-medium text-gray-700">식사 종류</label>
        <div
          class="flex flex-nowrap gap-2 justify-between overflow-x-auto pb-1"
        >
          <button
            v-for="type in mealTypes"
            :key="type.value"
            type="button"
            @click="updateMealType(type.value)"
            :class="mealTypeButtonClasses(type.value)"
            class="flex-1 min-w-0 cursor-pointer"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="diet-memo" class="text-base font-medium text-gray-700"
        >메모 / 특징</label
      >
      <textarea
        id="diet-memo"
        :value="formData.description"
        @input="updateDescription($event.target.value)"
        rows="3"
        class="input-style min-h-[100px] cursor-pointer"
        placeholder="오늘 식사에 대한 간단한 메모를 남겨주세요."
      ></textarea>
    </div>

    <div class="flex items-center pt-2">
      <input
        id="is-public"
        type="checkbox"
        :checked="formData.isPublic"
        @change="updateIsPublic($event.target.checked)"
        class="h-5 w-5 text-[#8A8F6E] border-gray-300 rounded focus:ring-offset-0 focus:ring-2 focus:ring-[#8A8F6E]"
      />
      <label
        for="is-public"
        class="ml-3 block text-base font-medium text-gray-700 cursor-pointer"
        >커뮤니티에 식단 공개</label
      >
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['formData']);
const emit = defineEmits(['update:formData']);

const formData = computed(() => props.formData);

// UI 클래스 색상 정의
const mealTypeButtonClasses = value => {
  const isSelected = formData.value.mealType === value;
  return [
    'px-3 py-2 rounded-xl text-sm font-semibold transition duration-200 whitespace-nowrap', // whitespace-nowrap으로 텍스트 줄바꿈 방지
    isSelected
      ? 'bg-[#8A8F6E] text-white shadow-md'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
  ];
};

// 식사 종류 옵션
const mealTypes = [
  { value: 'A', label: '아침' },
  { value: 'B', label: '점심' },
  { value: 'C', label: '저녁' },
  { value: 'D', label: '간식' },
  { value: 'E', label: '야식' },
];

const formatDateTime = date => {
  if (!date) return '';

  // Date 객체가 아닌 경우, Date 객체로 변환
  const originalDt = date instanceof Date ? date : new Date(date);

  // GMT + 00:00 시간을 기준으로, 현재 로컬 타임존 오프셋만큼 더해줍니다.
  // (datetime-local이 로컬 시간을 표시하기 위함)
  const offset = originalDt.getTimezoneOffset() * 60000; // 밀리초 단위로 변환
  const localTime = new Date(originalDt.getTime() - offset);

  // ISO 문자열로 변환하고 YYYY-MM-DDTHH:MM 형식만 추출
  // (ISO 문자열은 UTC 기준이므로, 위에서 offset을 조정했기 때문에 로컬 시간을 나타냅니다.)
  return localTime.toISOString().slice(0, 16);
};

// 데이터 업데이트 함수
const updateField = (field, value) => {
  emit('update:formData', { ...props.formData, [field]: value });
};

const updateDate = dateTimeStr => {
  // ISO 문자열을 Date 객체로 변환하여 저장
  updateField('date', new Date(dateTimeStr));
};

const updateMealType = value => updateField('mealType', value);
const updateDescription = value => updateField('description', value);
const updateIsPublic = value => updateField('isPublic', value);
</script>

<style scoped></style>
