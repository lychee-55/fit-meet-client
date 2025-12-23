<template>
  <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
    <div class="relative group">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">오늘의 추천 영상</h2>
          <p class="text-sm text-gray-500 mt-1">
            회원님을 위한 맞춤형 운동 루틴입니다.
          </p>
        </div>

        <div
          v-if="store.recommendedVideos && store.recommendedVideos.length > 0"
          class="flex gap-2"
        >
          <button
            @click="prev"
            :disabled="currentIndex === 0"
            class="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <button
            @click="next"
            :disabled="currentIndex >= maxIndex"
            class="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronRightIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-48">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"
        ></div>
      </div>

      <div
        v-else-if="
          store.recommendedVideos && store.recommendedVideos.length > 0
        "
        class="overflow-hidden px-1"
      >
        <div
          :style="{ transform: `translateX(-${currentIndex * 320}px)` }"
          class="transition-transform duration-500 ease-in-out flex"
        >
          <VideoCardList
            :videos="store.recommendedVideos"
            :is-slider="true"
            :show-actions="true"
            class="flex-shrink-0"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl"
      >
        <p>현재 추천 영상이 없습니다.</p>
        <button
          @click="store.fetchRecommendedVideos()"
          class="mt-2 text-xs text-green-600 underline"
        >
          데이터 다시 불러오기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import VideoCardList from './VideoCardList.vue';
import { useTrainingStore } from '@/stores/Training';

const store = useTrainingStore();
const loading = ref(false);
const currentIndex = ref(0);

console.log('리턴값::', store.recommendedVideos);
// 슬라이더 최대 이동 가능 인덱스 계산
const maxIndex = computed(() => {
  const count = store.recommendedVideos?.length || 0;
  return Math.max(0, count - 4); // 한 화면에 4개 보인다고 가정
});

const next = () => {
  if (currentIndex.value < maxIndex.value) currentIndex.value++;
};
const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

onMounted(async () => {
  loading.value = true;
  await store.fetchRecommendedVideos(); // 추천 영상 API 호출
  loading.value = false;
});
</script>
