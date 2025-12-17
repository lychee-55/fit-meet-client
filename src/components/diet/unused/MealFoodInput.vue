// src/components/diet/formElements/MealFoodInput.vue
<template>
  <div class="flex flex-col gap-6 p-4">
    <!-- <h3 class="text-xl font-semibold text-gray-700">
      식단 상세 (직접 입력 모드)
    </h3> -->
    <p class="text-gray-500">
      음식 이름과 함께 섭취량, 모든 영양소 정보를 직접 입력해주세요.
    </p>

    <div class="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
      **[TODO: MealFoodInput 컴포넌트]** <br />
      1. 음식 추가 버튼 구현 <br />
      2. 음식 하나당 **foodNmKr, intakeGram, kcal, carbohydrate, protein, fat,
      sugar, sodium, dietaryFiber** 입력 필드 구현 <br />
      3. 각 음식은 `foods` 배열에 **sourceType: 'MANUAL'**로 저장됩니다.
    </div>

    <div class="mt-4">
      <h4 class="font-bold">
        현재 저장된 음식 (임시): {{ formData.foods.length }}개
      </h4>
      <div class="text-gray-500">(이곳에 입력된 음식 목록이 표시됩니다)</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['formData']);
const emit = defineEmits(['update:formData']);

const formData = computed(() => props.formData);

// TODO: 음식 추가/수정/삭제 로직 구현
// emit('update:formData', { ...props.formData, foods: updatedFoods });
</script>
