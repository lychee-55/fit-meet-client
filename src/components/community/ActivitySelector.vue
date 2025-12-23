<template>
  <div class="mt-6 space-y-6">
    <div
      v-if="shareDiet"
      class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon class="w-4 h-4 text-[#8A8F6E]" /> 최근 공개 식단
          (일주일)
        </p>
        <span class="text-[10px] text-gray-400"
          >공개 설정된 식단만 표시됩니다</span
        >
      </div>

      <div
        v-if="availableDiets && availableDiets.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <button
          v-for="diet in availableDiets"
          :key="diet.dietId || diet.id"
          type="button"
          @click="toggleDiet(diet.dietId || diet.id)"
          :class="
            (selectedDietIds || []).includes(diet.dietId || diet.id)
              ? 'border-[#8A8F6E] bg-olive-50 ring-1 ring-[#8A8F6E]'
              : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
          "
          class="flex items-center gap-3 p-3 border rounded-xl transition-all text-left relative"
        >
          <div class="relative w-12 h-12 flex-shrink-0">
            <img
              v-if="diet.imageUrl"
              :src="diet.imageUrl"
              class="w-full h-full rounded-lg object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <PhotoIcon class="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-bold text-gray-400">
              {{ diet.date?.split("T")[0] }}
            </p>
            <p class="text-xs font-bold text-gray-700 truncate">
              {{ mealLabelMap[diet.mealType] || diet.mealType }} ·
              {{ diet.totalKcal }}kcal
            </p>
          </div>

          <CheckCircleIcon
            v-if="(selectedDietIds || []).includes(diet.dietId || diet.id)"
            class="w-6 h-6 text-[#8A8F6E] flex-shrink-0"
          />
        </button>
      </div>

      <div
        v-else
        class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
      >
        <p class="text-xs text-gray-400">
          일주일 이내에 공개 설정된 식단이 없습니다.
        </p>
      </div>

      <textarea
        :value="dietNote"
        @input="$emit('update:dietNote', $event.target.value)"
        placeholder="공유할 식단에 대한 설명을 적어주세요."
        class="w-full mt-4 p-4 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-[#8A8F6E] outline-none resize-none min-h-[80px]"
      ></textarea>
    </div>

    <div
      v-if="shareWorkout"
      class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm font-bold text-gray-800 flex items-center gap-2">
          <PlayIcon class="w-4 h-4 text-[#8A8F6E]" /> 오늘 완료한 운동
        </p>
      </div>

      <div
        v-if="todayCompletedVideos && todayCompletedVideos.length > 0"
        class="space-y-2"
      >
        <button
          v-for="video in todayCompletedVideos"
          :key="video.id"
          type="button"
          @click="toggleWorkout(video.id)"
          :class="
            (selectedWorkoutIds || []).includes(video.id)
              ? 'border-[#8A8F6E] bg-olive-50 ring-1 ring-[#8A8F6E]'
              : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
          "
          class="w-full flex items-center gap-3 p-3 border rounded-xl transition-all text-left"
        >
          <div class="relative w-20 h-12 flex-shrink-0">
            <img
              :src="video.thumbnailUrl"
              class="w-full h-full rounded object-cover shadow-sm"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/10 rounded"
            >
              <PlayCircleIcon class="w-6 h-6 text-white opacity-80" />
            </div>
          </div>
          <span class="flex-1 text-xs font-bold text-gray-700 line-clamp-2">
            {{ video.title }}
          </span>
          <CheckCircleIcon
            v-if="(selectedWorkoutIds || []).includes(video.id)"
            class="w-6 h-6 text-[#8A8F6E]"
          />
        </button>
      </div>

      <div
        v-else
        class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
      >
        <p class="text-xs text-gray-400">오늘 완료한 운동 영상이 없습니다.</p>
      </div>

      <textarea
        :value="workoutNote"
        @input="$emit('update:workoutNote', $event.target.value)"
        placeholder="오늘 운동은 어떠셨나요? 소감을 공유해 보세요!"
        class="w-full mt-4 p-4 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-[#8A8F6E] outline-none resize-none min-h-[80px]"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import {
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  PhotoIcon,
  PlayCircleIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  shareDiet: Boolean,
  shareWorkout: Boolean,
  availableDiets: {
    type: Array,
    default: () => [],
  },
  todayCompletedVideos: {
    type: Array,
    default: () => [],
  },
  selectedDietIds: {
    type: Array,
    default: () => [],
  },
  selectedWorkoutIds: {
    type: Array,
    default: () => [],
  },
  dietNote: String,
  workoutNote: String,
});

const emit = defineEmits([
  "update:selectedDietIds",
  "update:selectedWorkoutIds",
  "update:dietNote",
  "update:workoutNote",
]);

const mealLabelMap = { A: "아침", B: "점심", C: "저녁", D: "간식", E: "야식" };

/**
 * 식단 선택/해제 토글
 */
const toggleDiet = (id) => {
  const currentIds = props.selectedDietIds ? [...props.selectedDietIds] : [];
  const idx = currentIds.indexOf(id);
  if (idx > -1) {
    currentIds.splice(idx, 1);
  } else {
    // 최대 5개까지만 선택 제한 (필요시 제거 가능)
    if (currentIds.length >= 5) {
      alert("식단은 최대 5개까지 선택할 수 있습니다.");
      return;
    }
    currentIds.push(id);
  }
  emit("update:selectedDietIds", currentIds);
};

/**
 * 운동 영상 선택/해제 토글
 */
const toggleWorkout = (id) => {
  const currentIds = props.selectedWorkoutIds
    ? [...props.selectedWorkoutIds]
    : [];
  const idx = currentIds.indexOf(id);
  if (idx > -1) {
    currentIds.splice(idx, 1);
  } else {
    currentIds.push(id);
  }
  emit("update:selectedWorkoutIds", currentIds);
};
</script>

<style scoped>
/* 커스텀 스크롤바 혹은 애니메이션 필요시 추가 */
</style>
