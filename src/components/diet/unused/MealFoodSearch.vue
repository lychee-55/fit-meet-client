// src/components/diet/formElements/MealFoodSearch.vue
<template>
  <div
    class="flex flex-col gap-6 p-4 border border-gray-200 rounded-lg shadow-sm"
  >
    <h3 class="text-xl font-semibold text-gray-700">
      음식 검색 및 추가 (API 모드)
    </h3>
    <p class="text-gray-500">
      공공 데이터를 이용하여 음식을 검색하고 섭취량만 입력해주세요.
    </p>

    <div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
      **[TODO: MealFoodSearch 컴포넌트]** <br />
      1. 음식 검색바 구현 (API 호출) <br />
      2. 검색 결과 목록 나열 <br />
      3. 결과 클릭 시 **foodNmKr, foodCode** 등을 저장하고 **intakeGram** 입력
      필드 제공 <br />
      4. 각 음식은 `foods` 배열에 **sourceType: 'API'**로 저장됩니다. (영양소
      정보는 API에서 가져옴)
    </div>

    <div class="mt-4">
      <h4 class="font-bold">
        현재 저장된 음식 (임시): {{ formData.foods.length }}개
      </h4>
      <div class="text-gray-500">
        (이곳에 검색으로 추가된 음식 목록이 표시됩니다)
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['formData']);
const emit = defineEmits(['update:formData']);

const formData = computed(() => props.formData);
// TODO: 검색 로직 및 foods 업데이트 로직 구현
</script>
