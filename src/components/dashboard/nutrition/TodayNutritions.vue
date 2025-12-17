<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4">오늘의 섭취량</h2>

    <div class="hidden md:grid grid-cols-4 gap-4">
      <NutritionField
        title="칼로리"
        consumed="1800"
        goal="2200"
        unit="kcal"
        type="kcal"
        progress-percent="81.8"
        color="blue"
      />

      <NutritionField
        title="탄수화물"
        consumed="200"
        goal="300"
        unit="g"
        type="carb"
        progress-percent="66.7"
        color="orange"
      />

      <NutritionField
        title="단백질"
        consumed="120"
        goal="150"
        unit="g"
        type="protein"
        progress-percent="80"
        color="red"
      />

      <NutritionField
        title="지방"
        consumed="50"
        goal="70"
        unit="g"
        type="fat"
        progress-percent="71.4"
        color="green"
      />
    </div>

    <div
      class="md:hidden flex items-center justify-between p-2 border rounded-lg"
    >
      <div class="text-center">
        <div class="text-sm text-gray-500">오늘의 칼로리</div>
        <div class="text-2xl font-extrabold text-blue-600">
          1800 <span class="text-base font-normal">kcal</span>
        </div>
      </div>

      <div class="text-gray-300 mx-4">|</div>

      <div class="flex flex-col text-sm gap-1">
        <div>탄수화물: <span class="font-semibold">200g</span> / 300g</div>
        <div>단백질: <span class="font-semibold">120g</span> / 150g</div>
        <div>지방: <span class="font-semibold">50g</span> / 70g</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NutritionField from './NutritionField.vue';
</script>
