<template>
  <div class="mt-4">
    <h3 class="font-bold mb-2">{{ mealLabel }} 식단</h3>

    <div v-if="!diets || diets.length === 0" class="text-gray-500 py-4">
      등록된 식단이 없습니다.
    </div>

    <div
      v-else
      v-for="diet in diets"
      :key="diet.dietId || diet.id"
      @click="$emit('itemClick', diet)"
      class="p-4 border rounded mb-2 hover:shadow transition bg-white"
    >
      <p class="font-bold">{{ diet.description || '식단 정보' }}</p>
      <p class="text-sm text-gray-500">
        {{ diet.totalKcal || diet.kcal || 0 }} kcal
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  diets: Array,
  mealLabel: String,
});
</script>
