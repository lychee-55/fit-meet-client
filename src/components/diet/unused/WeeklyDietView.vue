<template>
  <WeekDateSlider
    :base-month="selectedMonth"
    :selected-date="selectedDate"
    @select="selectedDate = $event"
  />

  <MealTypeTabs v-model="selectedMealType" />

  <DietList :diets="filteredDietList" :meal-label="mealLabel" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import WeekDateSlider from '../WeekDateSlider.vue';
import MealTypeTabs from '../MealTypeTabs.vue';
import DietList from '../DietList.vue';
const props = defineProps({
  selectedMonth: Date,
});

const selectedDate = ref(new Date());
const selectedMealType = ref('breakfast');
const dietList = ref([]);

/* 더미 데이터 */
const dummy = [
  { id: 1, mealType: 'breakfast', description: '오트밀', calories: 300 },
  { id: 2, mealType: 'lunch', description: '샐러드', calories: 450 },
  { id: 3, mealType: 'dinner', description: '닭가슴살', calories: 600 },
];

watch(selectedDate, () => {
  dietList.value = dummy;
});

const filteredDietList = computed(() =>
  dietList.value.filter(d => d.mealType === selectedMealType.value),
);

const mealLabelMap = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
};

const mealLabel = computed(() => mealLabelMap[selectedMealType.value]);
</script>
