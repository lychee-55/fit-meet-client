<template>
  <div class="flex items-center gap-2 mb-4">
    <!-- 이전 -->
    <button @click="prev" class="cursor-pointer">
      <ChevronDoubleLeftIcon class="w-5 h-5" />
    </button>

    <!-- 날짜 그리드 -->
    <div class="grid grid-cols-7 gap-1 flex-1 text-center">
      <div
        v-for="(item, index) in visibleDates"
        :key="item.date.toDateString()"
        @click="$emit('select', item.date)"
        :class="[
          'p-2 rounded cursor-pointer transition',
          isSelected(item.date)
            ? 'green-bg-color text-white'
            : item.isCurrentMonth
            ? 'hover:bg-[#e9fbd6]'
            : 'opacity-40',
        ]"
      >
        <!-- 요일 -->
        <div
          :class="[
            'text-xs',
            index % 7 === 0
              ? item.isCurrentMonth
                ? 'text-red-500'
                : 'text-red-300'
              : '',
          ]"
        >
          {{ labels[item.date.getDay()] }}
        </div>

        <!-- 날짜 -->
        <div
          :class="[
            'font-bold',
            index % 7 === 0
              ? item.isCurrentMonth
                ? 'text-red-500'
                : 'text-red-300'
              : '',
          ]"
        >
          {{ item.date.getDate() }}
        </div>
      </div>
    </div>

    <!-- 다음 -->
    <button @click="next" class="cursor-pointer">
      <ChevronDoubleRightIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  baseMonth: Date,
  selectedDate: Date,
});

onMounted(() => {
  const today = new Date();

  const todayIndex = allDates.value.findIndex(
    item => item.date.toDateString() === today.toDateString(),
  );

  if (todayIndex !== -1) {
    page.value = Math.floor(todayIndex / 7);
  }
});

const emit = defineEmits(['select']);

const labels = ['일', '월', '화', '수', '목', '금', '토'];
const page = ref(0);

/**
 * 🔹 이전/현재/다음 달 포함한 전체 날짜 배열
 */
const allDates = computed(() => {
  const y = props.baseMonth.getFullYear();
  const m = props.baseMonth.getMonth();

  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const prevLastDate = new Date(y, m, 0).getDate();

  const days = [];

  // 이전 달
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(y, m - 1, prevLastDate - i),
      isCurrentMonth: false,
    });
  }

  // 현재 달
  for (let d = 1; d <= lastDate; d++) {
    days.push({
      date: new Date(y, m, d),
      isCurrentMonth: true,
    });
  }

  // 다음 달
  while (days.length % 7 !== 0) {
    const nextDay = days.length - (firstDay + lastDate) + 1;
    days.push({
      date: new Date(y, m + 1, nextDay),
      isCurrentMonth: false,
    });
  }

  return days;
});

/**
 * 🔹 현재 페이지(7칸)
 */
const visibleDates = computed(() =>
  allDates.value.slice(page.value * 7, page.value * 7 + 7),
);

const prev = () => {
  if (page.value > 0) page.value--;
};

const next = () => {
  if ((page.value + 1) * 7 < allDates.value.length) page.value++;
};

const isSelected = d => d.toDateString() === props.selectedDate.toDateString();
</script>
