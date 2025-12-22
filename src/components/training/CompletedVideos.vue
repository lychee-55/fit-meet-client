<template>
  <div
    class="bg-[#8A8F6E]/5 p-6 rounded-3xl border border-[#8A8F6E]/10 shadow-sm"
  >
    <div class="relative group">
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2 text-[#8A8F6E]">
          <CheckBadgeIcon class="w-8 h-8" />
          <h2 class="text-xl font-bold">오늘 완료한 운동 목록</h2>
        </div>

        <div v-if="store.todayCompletedVideos.length > 0" class="flex gap-2">
          <button
            @click="prev"
            :disabled="currentIndex === 0"
            class="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <button
            @click="next"
            :disabled="currentIndex >= maxIndex"
            class="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRightIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        v-if="store.todayCompletedVideos.length > 0"
        class="overflow-hidden px-1"
      >
        <div
          :style="{ transform: `translateX(-${currentIndex * 320}px)` }"
          class="transition-transform duration-500 ease-in-out flex"
        >
          <VideoCardList
            :videos="
              store.todayCompletedVideos.map((v) => ({ ...v, id: v.videoId }))
            "
            :is-slider="true"
            :show-actions="false"
            class="flex-shrink-0"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-10 text-gray-400 border-2 border-dashed border-[#8A8F6E]/20 rounded-2xl bg-white/50"
      >
        <div class="bg-gray-100 p-4 rounded-full mb-4">
          <VideoCameraIcon class="w-8 h-8 text-gray-300" />
        </div>
        <p class="text-lg font-medium text-gray-500">
          오늘 완료한 운동이 아직 없어요.
        </p>
        <p class="text-sm mt-1">추천 영상을 보고 운동을 시작해볼까요?</p>
        <!-- <RouterLink
          to="/training"
          class="mt-4 px-6 py-2 bg-[#8A8F6E] text-white rounded-full text-sm font-medium hover:bg-[#767a5d] transition"
        > -->
        <!-- </RouterLink> -->
        <button
          @click="scrollToRecommends"
          class="mt-4 px-6 py-2 bg-[#8A8F6E] text-white rounded-full text-sm font-medium hover:bg-[#767a5d] transition"
        >
          운동하러 가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { CheckBadgeIcon } from "@heroicons/vue/24/solid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  VideoCameraIcon,
} from "@heroicons/vue/24/outline";
import { useTrainingStore } from "@/stores/Training";
import VideoCardList from "./VideoCardList.vue";

const store = useTrainingStore();
const currentIndex = ref(0);

// 슬라이더 최대 이동 가능 인덱스 (한 화면에 4개 보인다고 가정)
const maxIndex = computed(() => {
  const count = store.todayCompletedVideos?.length || 0;
  return Math.max(0, count - 4);
});

const next = () => {
  if (currentIndex.value < maxIndex.value) currentIndex.value++;
};
const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

const scrollToRecommends = () => {
  window.scrollTo({
    top: 512,
    behavior: "smooth",
  });
};

onMounted(() => {
  store.fetchTodayCompletedVideos();
});
</script>
