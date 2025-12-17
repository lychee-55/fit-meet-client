// src/components/diet/formElements/HandleSubmitDietForm.vue (최종 버전)
<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="w-full bg-white rounded-xl overflow-hidden p-0 sm:p-0 h-full">
      <div class="px-0 sm:px-10 flex flex-col h-full">
        <header class="flex flex-col gap-2 mb-3 shrink-0">
          <h2 class="text-2xl font-extrabold text-gray-800 text-center">
            식단 작성하기
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
              :key="step"
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
              class="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition disabled:opacity-50"
            >
              <ArrowLeftIcon class="h-5 w-5" />
              이전
            </button>
            <div v-else class="w-1/4"></div>

            <div :class="{ 'ml-auto': step === 1 }">
              <button
                v-if="step < components.length"
                @click="nextStep"
                :disabled="!isCurrentStepValid || isSubmitting"
                class="flex items-center gap-2 px-8 py-3 rounded-full bg-[#8A8F6E] text-white font-semibold hover:bg-[#6e7256] transition shadow-lg disabled:bg-gray-400"
              >
                다음
                <ArrowRightIcon class="h-5 w-5" />
              </button>

              <button
                v-if="step === components.length"
                @click="submitDiet"
                :disabled="!isCurrentStepValid || isSubmitting"
                class="px-8 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow-lg shadow-green-600/40 disabled:bg-gray-400"
              >
                {{ isSubmitting ? '등록 중...' : '식단 등록 완료' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, markRaw, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

// 💡 임포트된 단계별 컴포넌트
import BasicInfoForm from './BasicInfoForm.vue';
import ManualFoodInput from './ManualFoodInput.vue';
// import MealFoodSearch from './MealFoodSearch.vue';
import MealFoodLayout from './MealFoodLayout.vue';
import FinalReviewForm from './FinalReviewForm.vue';
import { useDietStore } from '@/stores/Diet';

// ------------------ Props ------------------
const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: value => ['manual', 'public-api'].includes(value),
  },
});

const router = useRouter();
const dietStore = useDietStore();

// ------------------ 폼 단계 및 상태 ------------------

const step = ref(1);
const isSubmitting = ref(false);

// 💡 폼 데이터 상태 초기화
const formData = reactive({
  date: new Date(), // 현재 시간으로 초기화
  mealType: 'A',
  description: '',
  imageUrl: '',
  isPublic: false,
  sourceType: props.mode === 'manual' ? 'MANUAL' : 'PUBLIC-API', // 모드에 따라 초기 sourceType 설정
  foods: [],
});

// 💡 Sub-component에서 데이터를 업데이트할 때 사용될 함수
const updateFormData = newFormData => {
  Object.assign(formData, newFormData);
};

// ------------------ 동적 컴포넌트 구성 ------------------

// 💡 모드에 따라 폼 구성이 달라짐: Step 2가 MealFoodInput 또는 MealFoodSearch로 결정됨
const components = computed(() => {
  if (props.mode === 'manual') {
    return markRaw([
      BasicInfoForm, // Step 1: 기본 정보
      ManualFoodInput, // Step 2: 수동 입력 전용
      FinalReviewForm, // Step 3: 최종 확인
    ]);
  } else {
    // foodComponent를 MealFoodLayout으로 통일하여 Step 2에서 사용
    const foodComponent = MealFoodLayout;

    // markRaw로 감싸서 반응성 시스템이 내부를 추적하지 않게 하여 성능 최적화
    return markRaw([
      BasicInfoForm, // Step 1: 기본 정보
      foodComponent, // Step 2: 음식 입력/검색 레이아웃
      FinalReviewForm, // Step 3: 최종 확인
    ]);
  }
});

// 단계별 제목
const stepTitles = computed(() => {
  return [
    '식사한 날짜와 시간을 입력해주세요',
    props.mode === 'manual'
      ? '섭취한 음식 내용을 직접 기록해주세요'
      : '섭취한 음식을 검색하여 기록해주세요',
    '최종 확인 및 코멘트를 남겨주세요',
  ];
});

// ------------------ 계산된 속성 (Getter) ------------------

// 💡 현재 보여줄 컴포넌트
const currentComponent = computed(() => components.value[step.value - 1]);

// 💡 진행바 너비 계산
const progressBarWidth = computed(() => {
  const progress = step.value / components.value.length;
  return `${progress * 100}%`;
});

// 💡 현재 단계의 유효성 검사 (실제 유효성 검사 로직으로 대체 필요)
const isCurrentStepValid = computed(() => {
  // 최소한 foods에 항목이 1개 이상 있는지 검사 등 필요
  // if (step.value === 2) {
  //   return formData.foods.length > 0;
  // }
  return true;
});

// ------------------ 최종 제출 로직 (Action) ------------------

// 컴포넌트 (FinalReviewForm을 포함하는 상위 컴포넌트)

async function submitDiet() {
  if (!isCurrentStepValid.value) return;

  isSubmitting.value = true;

  // 💡 백엔드 요청 바디 구조화 (기존 로직 유지)
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

  console.log('Final Request Body:', requestBody);

  try {
    // 💡 1. 수정: requestBody를 인자로 전달합니다.
    const response = await dietStore.insertDiet(requestBody);

    // 💡 2. 추가: 스토어에서 받은 응답의 성공 코드(code: 0)를 확인합니다.
    if (response.code === 0) {
      alert('식단 등록이 완료되었습니다!');
      // 성공 시 라우팅 이동
      router.push({ name: 'DietManagement' });
    } else {
      // 서버에서 code: 0이 아닌 다른 코드를 반환했을 때의 처리
      throw new Error(response.msg || '식단 등록 서버 응답 오류');
    }
  } catch (error) {
    console.error('식단 등록 실패:', error);
    // 에러 메시지 개선
    alert(`식단 등록에 실패했습니다: ${error.message || '네트워크 오류'}`);
  } finally {
    isSubmitting.value = false;
  }
}

// ------------------ 단계 전환 로직 ------------------

function nextStep() {
  if (isCurrentStepValid.value && step.value < components.value.length) {
    step.value++;
  } else if (!isCurrentStepValid.value) {
    alert('현재 단계를 먼저 완성해주세요. (음식 1개 이상 등록 필요)');
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--;
  }
}
</script>

<style scoped>
/* 페이지 전환 애니메이션 */
/* ... (애니메이션 스타일은 동일) ... */
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
