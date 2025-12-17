<template>
  <div
    :class="[
      'p-5 rounded-xl shadow-lg border',
      styles.lightBgClass,
      'border-gray-200',
    ]"
  >
    <div class="flex items-center justify-between mb-3">
      <div
        :class="[
          'flex items-center space-x-2 py-1 px-3 rounded-full text-xs font-bold shadow-sm',
          styles.mainClass,
        ]"
      >
        <component :is="styles.icon" class="w-4 h-4" />
        <span>{{ title }}</span>
      </div>
    </div>

    <div class="text-2xl font-extrabold mt-1 text-gray-800">
      {{ consumed }}
      <span class="text-base font-normal text-gray-500">{{ unit }}</span>
    </div>

    <div class="text-xs text-gray-600 mt-2">
      권장 목표: {{ goal }} {{ unit }}
    </div>

    <div class="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
      <div
        :class="[
          'h-full rounded-full transition-all duration-500',
          styles.mainClass.split(' ')[0],
        ]"
        :style="progressBarWidth"
      >
        <span
          class="text-sm font-semibold"
          :class="[styles.mainClass.split(' ')[0].replace('bg-', 'text-')]"
        >
          {{ Math.round(progressPercent) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

// 💡 Heroicons 임포트 (사용자 환경에 맞게 경로 수정 필요)
import FireIcon from '@heroicons/vue/24/solid/FireIcon'; // Kcal (에너지)
import CubeIcon from '@heroicons/vue/24/solid/CubeIcon'; // 탄수화물 (구조/복합)
import CircleStackIcon from '@heroicons/vue/24/solid/CircleStackIcon'; // 단백질 (구성/빌딩 블록)
import BeakerIcon from '@heroicons/vue/24/solid/BeakerIcon'; // 지방 (화학/저장)

const props = defineProps({
  title: String,
  consumed: [String, Number],
  goal: [String, Number],
  unit: String,
  type: {
    type: String, // 'kcal', 'carb', 'protein', 'fat'
    required: true,
  },
  // 서버에서 받은 RDI 대비 섭취량 퍼센트 (0~100)
  progressPercent: {
    type: Number,
    default: 0,
  },
});

/**
 * 영양소 타입에 따라 아이콘, 메인 색상, 라이트 배경색을 매핑합니다.
 * 사용자 정의 색상 클래스를 사용합니다.
 */
const getStyles = type => {
  switch (type) {
    case 'kcal':
      return {
        icon: FireIcon,
        mainClass: 'bg-kcal text-white',
        lightBgClass: 'bg-kcal-light',
      };
    case 'carb':
      return {
        icon: CubeIcon,
        mainClass: 'bg-carb text-white',
        lightBgClass: 'bg-carb-light',
      };
    case 'protein':
      return {
        icon: CircleStackIcon,
        mainClass: 'bg-protein text-white',
        lightBgClass: 'bg-protein-light',
      };
    case 'fat':
      return {
        icon: BeakerIcon,
        mainClass: 'bg-fat text-white',
        lightBgClass: 'bg-fat-light',
      };
    default:
      return {
        icon: FireIcon,
        mainClass: 'bg-gray-500 text-white',
        lightBgClass: 'bg-gray-100',
      };
  }
};

const styles = computed(() => getStyles(props.type));

// 진행바 너비 계산 (Tailwind의 임의 값 사용)
const progressBarWidth = computed(() => {
  // 100%를 초과해도 100%로 표시
  const percent = Math.min(props.progressPercent, 100);
  return `width: ${percent}%`;
});
</script>
