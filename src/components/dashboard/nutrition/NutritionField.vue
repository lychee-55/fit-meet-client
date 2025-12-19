<template>
  <div
    :class="[
      'p-5 rounded-xl shadow-sm border transition-all duration-300',
      // 'cursor-pointer hover:shadow-lg',
      styles.lightBgClass,
      isExceeded ? 'border-red-200' : 'border-gray-200',
    ]"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <div
          :class="[
            'flex items-center space-x-2 py-1 px-3 rounded-full text-xs font-bold shadow-sm',
            styles.mainClass,
          ]"
        >
          <component :is="styles.icon" class="w-4 h-4" />
          <span>{{ title }}</span>
        </div>

        <ExclamationTriangleIcon
          v-if="isExceeded"
          class="w-5 h-5 text-red-500 animate-pulse"
        />
      </div>

      <!-- <span
        class="text-sm font-bold"
        :class="
          isExceeded
            ? 'text-red-600'
            : styles.mainClass.split(' ')[0].replace('bg-', 'text-')
        "
      >
        {{ Math.round(progressPercent) }}%
      </span> -->
    </div>

    <div class="text-2xl font-extrabold mt-1 text-gray-800 flex items-baseline">
      {{ consumed }}
      <span class="text-base font-normal text-gray-500 ml-1">{{ unit }}</span>
    </div>

    <div class="text-xs text-gray-400 mt-2 font-medium">
      권장 목표: {{ goal }}{{ unit }}
    </div>

    <div class="mt-4 h-2 rounded-full bg-white overflow-hidden shadow-inner">
      <div
        :class="[
          'h-full rounded-full transition-all duration-700 ease-out ',
          isExceeded ? 'bg-red-500' : styles.mainClass.split(' ')[0],
        ]"
        :style="progressBarWidth"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid';
import {
  FireIcon,
  CubeIcon,
  CircleStackIcon,
  BeakerIcon,
} from '@heroicons/vue/24/solid';

const props = defineProps({
  title: String,
  consumed: [Number, String],
  goal: [Number, String],
  unit: String,
  type: String,
  progressPercent: { type: Number, default: 0 },
});

// 목표 초과 여부 확인
const isExceeded = computed(() => Number(props.consumed) > Number(props.goal));

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
const progressBarWidth = computed(
  () => `width: ${Math.min(props.progressPercent, 100)}%`,
);
</script>

<style scoped>
.progress-inner-shadow {
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
