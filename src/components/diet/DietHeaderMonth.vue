<template>
  <div class="grid grid-cols-3 items-center mb-6">
    <!-- 왼쪽 (비워두거나 추후 화살표용) -->
    <div></div>

    <!-- 가운데: 월 선택 -->
    <div class="relative flex justify-center">
      <button
        @click="isOpen = !isOpen"
        class="flex flex-row items-center text-2xl font-bold text-black cursor-pointer"
      >
        <span>{{ monthLabel }}</span>
        <span><ChevronDownIcon class="w-5 h-5" /></span>
      </button>

      <div
        v-if="isOpen"
        class="absolute top-full mt-2 bg-white border rounded-lg shadow-lg z-10"
      >
        <button
          v-for="m in 12"
          :key="m"
          @click="selectMonth(m)"
          class="block w-full px-4 py-2 text-left hover:bg-[#f5ffde] rounded-lg"
        >
          {{ m }}월
        </button>
      </div>
    </div>

    <!-- 오른쪽: 주간 | 월간 토글 (기존 그대로) -->
    <div class="flex justify-end">
      <div class="flex rounded-lg overflow-hidden lightorange-bg-color">
        <button
          @click="$emit('changeView', 'week')"
          :class="[
            'px-4 py-2 text-sm font-bold transition',
            viewMode === 'week'
              ? 'orange-bg-color text-white'
              : 'text-gray-700 lightorange-bg-color',
          ]"
        >
          주간
        </button>
        <button
          @click="$emit('changeView', 'month')"
          :class="[
            'px-4 py-2 text-sm font-bold transition',
            viewMode === 'month'
              ? 'orange-bg-color text-white'
              : 'text-gray-700 lightorange-hover',
          ]"
        >
          월간
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  selectedMonth: Date,
  viewMode: String,
});

const emit = defineEmits(['changeMonth', 'changeView']);

const isOpen = ref(false);

const monthLabel = computed(() => {
  if (!(props.selectedMonth instanceof Date)) return '';
  return `${props.selectedMonth.getMonth() + 1}월`;
});

const selectMonth = month => {
  const date = new Date(props.selectedMonth);
  date.setMonth(month - 1);
  emit('changeMonth', date);
  isOpen.value = false;
};
</script>
