<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="w-full bg-white rounded-xl overflow-hidden p-0 sm:p-0 h-full">
      <div class="px-0 sm:px-10 flex flex-col h-full">
        <header class="flex flex-col gap-2 mb-3 shrink-0">
          <h2 class="text-2xl font-extrabold text-gray-800 text-center">
            {{ isEditMode ? '식단 수정하기' : '식단 작성하기' }}
          </h2>
          <p class="text-center text-base text-[#8A8F6E] font-semibold">
            Step {{ step }} / {{ components.length }} :
            {{ stepTitles[step - 1] }}
          </p>

          <div class="w-full h-2 bg-gray-200 rounded-full">
            <div
              :style="{ width: progressBarWidth }"
              class="h-2 bg-[#8A8F6E] rounded-full transition-all duration-500"
            ></div>
          </div>
        </header>

        <div class="grow flex items-center justify-center py-4 min-h-[560px]">
          <Transition name="fade-slide" mode="out-in">
            <component
              :is="currentComponent"
              :key="formKey + step"
              :form-data="formData"
              :mode="mode"
              @update:form-data="updateFormData"
              class="w-full"
            />
          </Transition>
        </div>

        <div class="pt-6 border-t border-gray-100 shrink-0">
          <div class="flex justify-between items-center">
            <button
              v-if="step > 1"
              @click="prevStep"
              :disabled="isSubmitting"
              class="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition disabled:opacity-50"
            >
              <ArrowLeftIcon class="h-5 w-5" /> 이전
            </button>
            <div v-else class="w-1/4"></div>

            <div :class="{ 'ml-auto': step === 1 }">
              <button
                v-if="step < components.length"
                @click="nextStep"
                :disabled="!isCurrentStepValid || isSubmitting"
                class="cursor-pointer flex items-center gap-2 px-8 py-3 rounded-full bg-[#8A8F6E] text-white font-semibold hover:bg-[#6e7256] transition shadow-lg disabled:bg-gray-400"
              >
                다음 <ArrowRightIcon class="h-5 w-5" />
              </button>

              <button
                v-if="step === components.length"
                @click="submitDiet"
                :disabled="!isCurrentStepValid || isSubmitting"
                class="cursor-pointer px-8 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow-lg shadow-green-600/40 disabled:bg-gray-400"
              >
                <template v-if="isSubmitting">처리 중...</template>
                <template v-else>{{
                  isEditMode ? '식단 수정 완료' : '식단 등록 완료'
                }}</template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, markRaw, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

import BasicInfoForm from './BasicInfoForm.vue';
import ManualFoodInput from './ManualFoodInput.vue';
import MealFoodLayout from './MealFoodLayout.vue';
import FinalReviewForm from './FinalReviewForm.vue';
import AIImageAnalysisForm from './AIImageAnalysisForm.vue';
import { useDietStore } from '@/stores/Diet';
import { useMealStore } from '@/stores/Meal';

// 3개의 식단 업로드 모드 지정
const MODE_TO_SOURCE_TYPE = {
  manual: 'MANUAL',
  'public-api': 'PUBLIC-API',
  image: 'IMAGE',
};

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  dietId: {
    // 부모(CreateDietFormPage)로부터 전달받은 값
    type: String,
    default: null,
  },
});

const router = useRouter();
const route = useRoute();
const dietStore = useDietStore();
const mealStore = useMealStore();

// URL 파라미터에 dietId가 있으면 수정 모드로 간주 로직
const dietId = computed(() => route.params.id);
const isEditMode = computed(() => !!props.dietId);

const step = ref(1);
const isSubmitting = ref(false);
const formKey = ref(0);

const formData = reactive({
  date: new Date(),
  mealType: 'A',
  description: '',
  imageUrl: '',
  isPublic: false,
  // sourceType: props.mode === 'manual' ? 'MANUAL' : 'PUBLIC-API',
  sourceType: MODE_TO_SOURCE_TYPE[props.mode] || 'MANUAL',
  foods: [],
});

// 수정모드 데이터 로드
onMounted(async () => {
  if (isEditMode.value) {
    try {
      isSubmitting.value = true;
      const detail = await dietStore.fetchDietDetail(props.dietId);
      if (detail) {
        Object.assign(formData, {
          date: new Date(detail.date),
          mealType: detail.mealType,
          description: detail.description,
          imageUrl: detail.imageUrl,
          isPublic: detail.isPublic,
          sourceType: detail.sourceType,
          foods: detail.foods.map(f => ({ ...f })),
        });
      }
    } catch (error) {
      alert('데이터 로드 실패');
    } finally {
      isSubmitting.value = false;
    }
  }
});

// ------------------ 4. 로직 및 함수들 ------------------

function resetForm() {
  step.value = 1;
  formKey.value++;
  Object.assign(formData, {
    date: new Date(),
    mealType: 'A',
    description: '',
    imageUrl: '',
    isPublic: false,
    // sourceType: props.mode === 'manual' ? 'MANUAL' : 'PUBLIC-API',
    sourceType: MODE_TO_SOURCE_TYPE[props.mode] || 'MANUAL',
    foods: [],
  });
}

const updateFormData = newFormData => Object.assign(formData, newFormData);

const components = computed(() => {
  if (props.mode === 'manual') {
    return [
      markRaw(BasicInfoForm),
      markRaw(ManualFoodInput),
      markRaw(FinalReviewForm),
    ];
  } else if (props.mode === 'public-api') {
    return [
      markRaw(BasicInfoForm),
      markRaw(MealFoodLayout),
      markRaw(FinalReviewForm),
    ];
  } else if (props.mode === 'image') {
    return [
      markRaw(BasicInfoForm),
      markRaw(AIImageAnalysisForm),
      markRaw(FinalReviewForm),
    ];
  }
  return [];
});

const stepTitles = computed(() => {
  const modeMessages = {
    manual: '음식 내용을 직접 기록해주세요',
    'public-api': '음식을 검색하여 기록해주세요',
    image: 'AI 이미지 분석으로 기록해주세요',
  };
  return [
    '식사한 날짜와 시간을 입력해주세요',
    modeMessages[props.mode] || '음식 정보를 입력해주세요', // 혹시 모를 예외 처리
    '최종 확인 및 코멘트를 남겨주세요',
  ];
});

const currentComponent = computed(() => components.value[step.value - 1]);
const progressBarWidth = computed(
  () => `${(step.value / components.value.length) * 100}%`,
);
// const isCurrentStepValid = computed(() => {
//   if (step.value === 2) return formData.foods.length > 0;
//   return true;
// });
// const isCurrentStepValid = computed(() => {
//   if (step.value === 2) {
//     const hasFoods = formData.foods.length > 0;

//     if (props.mode === 'image') {
//       return hasFoods && !!formData.imageUrl;
//     }

//     return hasFoods;
//   }
//   return true;
// });
const isCurrentStepValid = computed(() => {
  if (step.value === 1) {
    return !!formData.date && !!formData.mealType;
  }

  if (step.value === 2) {
    const hasFoods = formData.foods.length > 0;

    // 이미지 모드일 때는 이미지도 반드시 있어야 하고, 분석해서 추가된 음식도 있어야 함
    if (props.mode === 'image') {
      return hasFoods && !!formData.imageUrl;
    }

    return hasFoods;
  }
  return true;
});

// 최종 제출 (등록 및 수정 분기함)
async function submitDiet() {
  if (!isCurrentStepValid.value) return;
  isSubmitting.value = true;

  const requestBody = {
    date: formData.date.toISOString(),
    mealType: formData.mealType,
    description: formData.description,
    imageUrl: formData.imageUrl || null,
    sourceType: formData.sourceType,
    isPublic: formData.isPublic,
    foods: formData.foods.map(food => ({
      foodNmKr: food.foodNmKr,
      foodCode: food.foodCode || null,
      sourceType: food.sourceType,
      intakeGram: food.intakeGram,
      kcal: food.kcal || 0,
      carbohydrate: food.carbohydrate || 0,
      protein: food.protein || 0,
      fat: food.fat || 0,
      sugar: food.sugar || 0,
      sodium: food.sodium || 0,
      dietaryFiber: food.dietaryFiber || 0,
    })),
  };

  try {
    let response;

    if (isEditMode.value) {
      // 수정 API 호출
      response = await dietStore.updateDiet(dietId.value, requestBody);
    } else {
      // 생성 API 호출
      response = await dietStore.insertDiet(requestBody);
    }

    if (response.code === 0) {
      alert(
        isEditMode.value
          ? '식단이 수정되었습니다!'
          : '식단 등록이 완료되었습니다!',
      );
      resetForm();
      mealStore.clearSearch();
      router.push({ name: 'DietManagement' });
    } else {
      throw new Error(response.msg || '서버 응답 오류');
    }
  } catch (error) {
    console.error('처리 실패:', error);
    alert(`요청에 실패했습니다: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
}

function nextStep() {
  if (isCurrentStepValid.value && step.value < components.value.length)
    step.value++;
  else {
    alert('현재 단계를 먼저 완성해주세요.');
  }
}

function prevStep() {
  if (step.value > 1) step.value--;
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
